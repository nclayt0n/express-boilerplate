require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const app = express()
const morganOptions = (NODE_ENV === 'production') ? 'tiny' : 'dev';
const notesRouter = require('./notes/notes-router')
const foldersRouter = require('./folders/folders-router')

app.use(morgan(morganOptions))
app.use(helmet())
app.use(cors())
app.use('/api/notes', notesRouter)
app.use('/api/folders', foldersRouter)
app.get('/', (req, res) => {
    res.send('Hello, world!')
})
app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'Server Error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})
module.exports = app