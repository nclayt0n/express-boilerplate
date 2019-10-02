require('dotenv').config()

module.exports = {
    "migrationsDirectory": "migrations",

    "driver": "pg",
    "host": process.env.migration_DB_HOST,
    "port": process.env.migration_PORT,
    "database": process.env.migration_DB_NAME,
    "username": process.env.migration_DB_USER,
    "password": process.env.migration_PASS
}