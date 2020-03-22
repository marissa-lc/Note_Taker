const path = require("path");
const fs = require("fs");
module.exports = app => {
  //Html
  app.get("/", function(reg, res) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });

  app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/notes.html"));
  });
  //Get
  app.get("/api/notes", function(reg, res) {
    res.sendFile(path.join(__dirname, "../db/db.json"));
  });
  //Post
  app.post("/api/notes", function(req, res) {
    let newArray = [];
    const notesDataBase = fs.readFileSync("./db/db.json");
    if (notesDataBase.length > 0) {
      newArray = JSON.parse(notesDataBase);
    }
    const newNote = {
      id: newArray.length + 1,
      title: req.body.title,
      text: req.body.text
    };
    newArray.push(newNote);
    fs.writeFile("./db/db.json", JSON.stringify(newArray), () => {
      console.log("wrote new note to DataBase");
    });
    res.json(newNote);
  });
  //Delete
  app.delete("/api/notes/:id", function(req, res) {
    const deleteNote = req.params.id - 1;
    const newNotes = [];
    let notes = fs.readFileSync("./db/db.json");
    notes = JSON.parse(notes);
    notes.splice(deleteNote, 1);
    for (let i = 0; i < notes.length; i++) {
      notes[i].id = i + 1;
      newNotes.push(notes[i]);
    }
    fs.writeFile("./db/db.json", JSON.stringify(newNotes), () => {
      console.log("Deleted Note");
    });
    res.json(newNotes);
  });
};