const db = require('./db');

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');

// Carica le variabili d'ambiente
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // Consenti richieste da tutte le origini (modifica per sicurezza in produzione)
    },
});

// Esporta il database per le altre rotte
module.exports = db;

// Connessione al database
db.connect((err) => {
    if (err) {
        console.error('Errore connessione al database:', err);
        process.exit(1); // Termina il processo in caso di errore
    }
    console.log('Connesso al database MySQL');
});

// Middleware
app.use(express.json()); // Per parsing JSON
app.use(cors()); // Abilita il CORS per tutte le origini

// Configura Express per servire file statici dalla directory "public"
app.use(express.static(path.join(__dirname, './public')));

// Route per la radice
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Social/public/login.html'));
});

// Rotte API
app.use('/auth', require('./routes/auth')); // Rotte per autenticazione
app.use('/posts', require('./routes/posts')); // Rotte per i post
app.use('/friends', require('./routes/friends')); // Rotte per la gestione amici
app.use('/profile', require('./routes/profile')); // Rotte per la gestione amici

// Inizializza le rotte delle chat con Socket.IO
//const chatRoutes = require('./routes/chats');
//chatRoutes(io); // Passa l'istanza di Socket.IO

// Socket.IO per messaggi in tempo reale
io.on('connection', (socket) => {
    console.log(`Utente connesso: ${socket.id}`);

    socket.on('sendMessage', (data) => {
        console.log('Messaggio ricevuto:', data);
        io.emit('receiveMessage', data); // Trasmette il messaggio a tutti
    });

    socket.on('disconnect', () => {
        console.log(`Utente disconnesso: ${socket.id}`);
    });
});

// Porta su cui avviare il server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server in esecuzione sulla porta ${PORT}`));

// Esporta il database per l'utilizzo nelle rotte
module.exports = db;