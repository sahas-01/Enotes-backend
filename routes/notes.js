const express = require("express")
const router = express.Router()
const fetchUser = require("../middleware/fetchUser")
const Note = require("../models/Notes")
const { body, validationResult } = require('express-validator');
const noteController = require('../controllers/Notes')

//CRUD API- Create, Read, Update and Deletion of a note of a particular user

//Route 1(GET): To get all notes of a particular user
//READ
router.get("/getallnotes", fetchUser, noteController.getAllNotes);


//Route 2(POST): Add a new note
router.post("/addnote", fetchUser, [
    body("title", "Title is required").isLength({ min: 3 }),
    body("description", "Description is required and must be atleast 10 characters").isLength({ min: 10 })
], noteController.addNewNote);


//Route 3(PATCH): Updation of a particular note created by the user
//Update note
router.patch("/updatenote/:id", fetchUser, async (req, res) => {
    try {
        const note = await Note.findById(req.params.id)
        if (!note) {
            return res.status(404).json({ error: "Note not found" })
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).json({ error: "Unauthorized" })
        }
        note.title = req.body.title
        note.description = req.body.description
        note.tag = req.body.tag
        const updatedNote = await note.save()
        res.json(updatedNote)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Internal Server Error" })
    }
})

//Route 4(DELETE): Deletion of a particular note created by the user
//Delete note
router.delete("/deletenote/:id", fetchUser, async (req, res) => {
    try {
        let note = await Note.findById(req.params.id)
        if (!note) {
            return res.status(404).json({ error: "Note not found" })
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).json({ error: "Unauthorized" })
        }
        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ msg: "Note removed successfully" })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Internal Server Error" })
    }
})

module.exports = router;