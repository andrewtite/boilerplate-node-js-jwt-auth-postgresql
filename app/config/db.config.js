const config = {
    HOST: "localhost",
    USER: "db_username",
    PASSWORD: "db_password",
    DB: "db_name",
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    listPerPage: 10
};

module.exports = config;