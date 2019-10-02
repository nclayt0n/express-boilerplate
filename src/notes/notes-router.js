const express = require('express')
const xss = require('xss')
const NotesService = require('./notes-service')
const app = '../app'
const path = require('path')
const notesRouter = express.Router()
const jsonParser = express.json()
const serializeNote = note =>
    ({
        id: note.id,
        content: xss(note.content),
        folder_id: note.folder_id,
        note_name: xss(note.note_name),
        date_published: note.date_published,
    })
notesRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        NotesService.getAllNotes(knexInstance)
            .then(notes => {
                res.json(notes.map(serializeNote))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {

        const { content, folder_id, note_name, date_published } = req.body
        const newNote = { content, folder_id, note_name, date_published }
        console.log(newNote)
        let x = Object.entries(newNote);
        console.log(x)
        for (const [key, value] of Object.enteries(newNote))
            console.log(x)
        if (value == null)
            return res.status(400).json({
                error: { message: `Missing '${key}' in request body` }
            });
        NotesService.insertNote(req.app.get('db'), newNote)
            .then(note => {
                res.status(201)
                    .location(path.posix.join(req.originalUrl, `/${note.id}`))
                    .json(serializeNote(note))
            })
            .catch(next)
    })

notesRouter
    .route('/:note_id')
    .all((req, res, next) => {
        NotesService.getbyId(
                req.app.get('db'),
                req.params.note_id
            )
            .then(note => {
                if (!note) {
                    return res.status(404).json({
                        error: { message: `Note doesn't exist` }
                    })
                }
                res.note = note
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeNote(res.note))
    })
    .delete((req, res, next) => {
        NotesService.deleteNote(req.app.get('db'), req.params.note_id)
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const { content, folder_id, note_name, date_published } = req.body
        const noteToUpdate = { content, folder_id, note_name, date_published }
        const numberOfValues = Object.values(noteToUpdate).filter(Boolean).length
        if (numberOfValues === 0) {
            return res.status(400).json({ error: { message: `Request body must contain content, note_name, or folder` } })
        }
        NotesService.updateNote(req.app.get('db'), req.params.note_id, noteToUpdate)
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })
module.exports = notesRouter