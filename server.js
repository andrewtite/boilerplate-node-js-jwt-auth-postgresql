const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./app/models");
const app = express();
const corsOptions = {
    origin: "*"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

const Role = db.role;

// START PRODUCTION ONLY 
// in production, just sync. comment out for development
// db.sequelize.sync();
// END PRODUCTION ONLY 

// START DEVELOPMENT ONLY
// in development, you may need to drop and re-sync. comment out for production.
// if you use the follow dev sync code, the database will be rebuilt
// and you will lose your data! Make sure you comment out for production!
db.sequelize.sync({force: true}).then(() => {
    console.log('Drop and Re-sync db.');
    initial();
})

const initial = () => {
    Role.create({
        id: 1,
        name: "user"
    });

    Role.create({
        id: 2,
        name: "moderator"
    });

    Role.create({
        id: 3,
        name: "admin"
    });
}
// END DEVELOPMENT ONLY

// simple route
// app.get("/", (req, res) => {
//     res.json({message: "Welcome to the application!"});
// });
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
