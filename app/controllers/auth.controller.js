const db = require("../models");
const config = require("../config/auth.config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Op = require('sequelize').Op

const {user: User, role: Role, refreshToken: RefreshToken} = db;

exports.signup = (req, res) => {
    // save user to database
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    }).then(user => {
        if (req.body.roles) {
            Role.findAll({
                where: {
                    name: {
                        [Op.or]: req.body.roles
                    }
                }
            }).then(roles => {
                user.setRoles(roles).then(() => {
                    res.status(201).send({message: "User was registered successfully!"})
                });
            });
        } else {
            // user role = 1
            user.setRoles([1]).then(() => {
                res.send({message: "User was registered successfully!"})
            });
        }
    })
        .catch(err => {
            res.status(500).send({message: err.message});
        });
};

exports.signin = (req, res) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    }).then(async user => {
        if (!user) {
            res.status(404).send({message: "User not found!"});
        }

        const passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );
        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password!"
            });
        }

        const token = jwt.sign({id: user.id}, config.secret, {
            expiresIn: config.jwtExpiration
        });
        const refreshToken = await RefreshToken.createToken(user);

        let authorities = [];

        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                authorities.push("ROLE_" + roles[i].name.toUpperCase());
            }
            res.status(200).send({
                id: user.id,
                username: user.username,
                email: user.email,
                roles: authorities,
                accessToken: token,
                refreshToken
            });
        })
            .catch(err => {
                res.status(500).send({message: err.message})
            });
    });
};

exports.refreshToken = async (req, res) => {
    const {refreshToken: requestToken} = req.body;
    if (requestToken == null) {
        return res.status(403).json({message: "Refresh Token is required!"});
    }

    try {
        const refreshToken = await RefreshToken.findOne({
            where: {
                token: requestToken
            }
        });
        console.log('refreshToken', refreshToken);

        if (!refreshToken) {
            res.status(403).json({message: "Refresh Token is not in database!"});
        }

        if (RefreshToken.verifyExpiration(refreshToken)) {
            RefreshToken.destroy({where: {id: refreshToken.id}});

            res.status(403).json({
                message: "Refresh Token is expired. Please make a new sign-in request."
            });
            return;
        }

        const user = await refreshToken.getUser();
        const newAccessToken = jwt.sign({id: user.id}, config.secret, {
            expiresIn: config.jwtExpiration
        });

        return res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: refreshToken.token
        });
    } catch (err) {
        return res.status(500).send({message: err});
    }
};