const express = require('express');
const sqlite3 = require('sqlite3')
const app = express();
const port = 3000;

const db = new sqlite3.Database('./SandranDatabase.db', (err) => {
  if (err) return console.error(err.message)
  console.log('Connected to SQLite database.')
})

db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE
)`, (err) => {
  if (err) return console.error(err.message)
  console.log('Users table ready.')  
})


app.use(express.json());
// GET endpoint
app.get('/api/sensor', (req, res) => {
    res.json({
        temperature: 22.5,
        humidity: 55,
        status: "OK"
    });
});

// GET endpoint 
app.get('/api/user', (req, res) => {
  console.log("in get");
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
})

// POST endpoint 
app.post('/api/user', (req, res) => {
  console.log("in post");
  const { name, email } = req.body;
  db.run("INSERT INTO users (name, email) VALUES (?, ?)", [name, email], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.status(201).json({ id: this.lastID, name, email });
  })
});



app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});