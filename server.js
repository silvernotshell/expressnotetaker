//Express import
const express = require('express');
//File system import
const fs = require('fs');
//Path import
const path = require('path');
//Require uuid for unique id
const { v4: uuidv4 } = require('uuid');

//Create express app
const app = express();

//Port
const PORT = process.env.PORT || 3002;

//Require notes
const allNotes = require('./db/db.json');


//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

//Route to get notes
app.get('/api/notes', (req, res) => {
    res.json(allNotes.slice(1));
});

//Route to index page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

//Route to notes page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

//Route to 404 Error
app.get('*', (req, res) => {
    res.send("404 Error - Page not found");
});

//Function to create new note
function createNewNote(body, notesArray) {
    const newNote = body;
    if (!Array.isArray(notesArray))
        notesArray = [];

    if (notesArray.length === 0)
        notesArray.push(0);

    body.id = notesArray[0];
    notesArray[0]++;

    notesArray.push(newNote);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notesArray, null, 2)
    );
    return newNote;
}
//Route to create new note
app.post('/api/notes', (req, res) => {
    const newNote = createNewNote(req.body, allNotes);
    res.json(newNote);
});

//Function to delete note
function deleteNote(id, notesArray) {
    for (let i = 0; i < notesArray.length; i++) {
        let note = notesArray[i];

        if (note.id == id) {
            notesArray.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(notesArray, null, 2)
            );

            break;
        }
    }
}

//Route to delete note
app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, allNotes);
    res.json(true);
});

//Listen to server
app.listen(PORT, () => {
    console.log(`Server is now up and listening on port ${PORT}!`);
});