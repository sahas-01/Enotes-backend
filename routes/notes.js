const express = require("express")
const router = express.Router()
const fetchUser = require("../middleware/fetchUser")
const Note = require("../models/Notes")
const { body, validationResult } = require('express-validator');


router.get("/getallnotes", fetchUser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: err })
    }

})

router.post("/addnote", fetchUser, [
    body("title", "Title is required").isLength({ min: 3 }),
    body("description", "Description is required and must be atleast 10 characters").isLength({ min: 10 })
], async (req, res) => {
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
})

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