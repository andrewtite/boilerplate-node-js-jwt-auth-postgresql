// USER: "db_username",
// PASSWORD: "db_password",
// DB: "test_api1",

const config = {
    HOST: "localhost",
    USER: "role_test_api1",
    PASSWORD: "wsxdr666",
    DB: "test_api1",
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