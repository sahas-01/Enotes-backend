const Note = require("../models/Notes")
const { body, validationResult } = require('express-validator');



const getAllNotes = async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: err })
    }
}


const addNewNote = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        // console.log(errors.array()[0].msg)
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const note = new Note({
            title: req.body.title,
            description: req.body.description,
            tag: req.body.tag,
            user: req.user.id
        })

        const savedNote = await note.save()

        res.json(savedNote)

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

module.exports = { getAllNotes , addNewNote }