const NotesService = {
    getAllNotes(knex) {
        return knex.select('id', 'content', 'date_published', 'folder_id', 'note_name').from('notes')
    },
    insertNote(knex, newNote) {
        return knex.insert(newNote)
            .into('notes')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getbyId(knex, id) {
        return knex.from('notes').select('*').where('id', id).first()
    },
    deleteNote(knex, id) {
        return knex('notes').where({ id }).delete()
    },
    updateNote(knex, id, newNoteField) {
        return knex('notes').where({ id }).update(newNoteField)
    },
};
module.exports = NotesService