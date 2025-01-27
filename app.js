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

var priceperlike = 0.1;

app.get('/api/songs', (req, res) => {
    const myQuery = `SELECT * FROM songs`

    connection.query(myQuery, (err, results) => {
    if (err) {
      return res.status(500).send('Erro ao buscar musicas: ' + err.message);
    }
    res.json(results);
});
});

app.post('/api/songs', (req, res) => {
    const title = req.body.title;
    const artist = req.body.artist;
    const genre = req.body.genre;
    const album = req.body.album;
    const duration_seconds = req.body.duration_seconds;
    const release_date = req.body.release_date;
    const likes = req.body.likes;
    const created_at = req.body.created_at;
    

const myQuery = `INSERT INTO songs(title, album, genre, album, duration_seconds, release_date, likes, created_at) VALUES (NULL, 
"${title}", "${artist}", "${genre}", "${album}", "${duration_seconds}", "${release_date}", "${likes}", current_timestamp())`;

connection.query(myQuery, (err, results) => {
    if (err) {
      return res.status(500).send('Erro ao adicionar musica: ' + err.message);
    }
    res.status(200).send('User adicionado com sucesso!');
  });
})

app.put('/api/songs/:id', (req, res) =>{
    const id = req.body.id;
    const title = req.body.title;
    const artist = req.body.artist;
    const genre = req.body.genre;
    const album = req.body.album;
    const duration_seconds = req.body.duration_seconds;
    const release_date = req.body.release_date;
    const likes = req.body.likes;

    const myQuery = `UPDATE songs SET title = "${title}", artist = "${artist}", genre = "${genre}", album = "${album}",
    duration_seconds = "${duration_seconds}",release_date = "${release_date}",likes = "${likes}" WHERE id = "${id}"`;

    connection.query(myQuery, (err, results) => {
      if (err) {
        return res.status(500).send('Erro ao atualizar musica: ' + err.message);
      }
      res.status(200).send('User atualizado com sucesso!');
    });
})

app.delete('/api/songs/:id', (req, res) =>{
  const id = req.params.id;

  const myQuery = `DELETE FROM songs WHERE id = ${id}`;

  connection.query(myQuery, (err, results) => {
    if (err) {
      return res.status(500).send('Erro ao deletar musica: ' + err.message);
    }
    res.status(200).send('user removido com sucesso!');
  });
})

app.get('/api/songs/:id', (req, res) =>{
  const id = req.params.id;

  const myQuery = `SELECT * FROM songs WHERE id = ${id} `

  connection.query(myQuery, (err, results) => {
    if (err) {
      return res.status(500).send('Erro ao buscar a musica: ' + err.message);
    }
    res.json(results);
});
})

app.get('/api/price', (req, res) =>{
  const price = {"price": priceperlike};
  res.json(price);
});

app.put('/api/price', (req, res)=>{
       priceperlike = req.body.price
       const price = {"price": priceperlike};
       res.json(price);
})

app.get('/api/songs/:id/revenue', (req, res) =>{
  const id = req.params.id;

  const myQuery = `SELECT likes FROM songs where id = ${id}`
  connection.query(myQuery, (err, results) => {
    if (err) {
      return res.status(500).send('Erro ao buscar : ' + err.message);
    }
    const revenue = results[0].likes * priceperlike;
    res.json(revenue);
});
});

const bands=[
    {
        "artist": "INOHA",
        "band_members":["Chris Young", "Gavin Gonzalez", "Keanu Bicol", "Ricky Juarez"],
    },

    {
      "artist": "Coldplay",
      "band_members":["Chris Martin","Jonny Buckland","Guy Berryman","Will Champion","Phil Harvey"],
    }
]

app.get("/api/songs/:id/band",(req, res) =>{
  const id = req.params.id;

  const myQuery = `SELECT artist FROM songs where id = ${id}`
  connection.query(myQuery, (err, results) => {
    if (err) {
      return res.status(404).send('Erro ao buscar a banda: ' + err.message);
    }
    for(let i=0; i<bands.length; i++){
      if(results[0].artist == bands[i].artist){
        res.json(bands[i])
      }
    }
});
});

app.post("/api/songs/:id/band",(req, res) =>{
  const id = req.params.id;
  const band_members = req.body.band_members;
 
  const myQuery = `SELECT artist FROM songs where id=${id}`
  connection.query(myQuery, (err, results) => {
    if (err) {
      return res.status(500).send('Erro ao buscar songs: ' + err.message);
    }
 
  const band = {
      "artist": results[0].artist,
      "band_members": band_members
  }
  bands.push(band);
  res.sendStatus(200);
  console.log(bands)
})
})

app.put('/api/songs/:id/band', (req, res) =>{;
  const id = req.params.id;

  const myQuery = `SELECT artist FROM songs where id=${id}`

  connection.query(myQuery, (err, results) => {
    if (err) {
      return res.status(500).send('Erro ao buscar songs: ' + err.message);
    }
    for(let i=0; i<bands.length; i++){
      if(results[0].artist == bands[i].artist){
       bands[i].band_members = req.body.band_members;
       return res.status(200).send("membros atualizados com sucesso");
      }
    }
      res.status(404).send("falha ao atualizar membros");
});
});

app.delete('/api/songs/:id/band', (req, res) =>{;
  const id = req.params.id;

  const myQuery = `SELECT artist FROM songs where id=${id}`

  connection.query(myQuery, (err, results) => {
    if (err) {
      return res.status(500).send('Erro ao buscar songs: ' + err.message);
    }
    for(let i=0; i<bands.length; i++){
      if(results[0].artist == bands[i].artist){
        bands[i]={};
        return res.status(200).send("membros apagados com sucesso")
        
      }
      
    }
    return res.status(404).send("membros não foram apagados")
});
});

app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`)
  })
  