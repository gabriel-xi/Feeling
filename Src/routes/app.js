
const db = require('./db');

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');


dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', 
    },
});


module.exports = db;


db.connect((err) => {
    if (err) {
        console.error('Errore connessione al database:', err);
        process.exit(1); 
    }
    console.log('Connesso al database MySQL');
});


app.use(express.json()); 
app.use(cors()); 


app.use(express.static(path.join(__dirname, '../public')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});


app.use('/auth', require('./routes/auth')); 
app.use('/posts', require('./routes/posts')); 
app.use('/friends', require('./routes/friends')); 


const chatRoutes = require('./routes/chats');
chatRoutes(io); 


io.on('connection', (socket) => {
    console.log(`Utente connesso: ${socket.id}`);

    socket.on('sendMessage', (data) => {
        console.log('Messaggio ricevuto:', data);
        io.emit('receiveMessage', data); 
    });

    socket.on('disconnect', () => {
        console.log(`Utente disconnesso: ${socket.id}`);
    });
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server in esecuzione sulla porta ${PORT}`));


module.exports = db;