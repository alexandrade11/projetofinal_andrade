const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql2');
const port = 3000;

const connection = mysql.createConnection({
host: '127.0.0.1',
user: 'root',
password: '',
database: 'proj_finalt1',
port:3306

})

connection.connect((err) =>{
    if(err){
        console.error('erro a conectar à base de dados', err.message);     
    }else{
        console.log('conectado à base de dados MySQL!')
    }
})

app.use(express.json())

const tab_songs = "songs"

app.get('/api/songs', (req, res) => {
    const myQuery = `SELECT * FROM ${tab_songs}`

    connection.query(myQuery, (err, results) => {
    if (err) {
      return res.status(500).send('Erro ao buscar users: ' + err.message);
    }
    res.json(results);
});
});

app.post('/songs', (req, res) => {
    const title = req.body.title;
    const artist = req.body.artist;
    const genre = req.body.genre;
    const album = req.body.album;
    const duration_seconds = req.body.duration_seconds;
    const release_date = req.body.release_date;
    const likes = req.body.likes;
    const created_at = req.body.created_at;
    

const myQuery = `INSERT INTO ${tab_songs}(title, album, genre, album, duration_seconds, release_date, likes, created_at) VALUES (NULL, 
"${title}", "${artist}", "${genre}", "${album}", "${duration_seconds}", "${release_date}", "${likes}", current_timestamp())`;

connection.query(myQuery, (err, results) => {
    if (err) {
      return res.status(500).send('Erro ao adicionar user: ' + err.message);
    }
    res.status(200).send('User adicionado com sucesso!');
  });
})


app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`)
  })
  