const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db'); 

const router = express.Router();


router.post('/register', async (req, res) => {
    const { username, nome, cognome, email, password, user_type } = req.body;

    try {
        console.log('Received data:', { username, nome, cognome, email, password, user_type });

        
        db.query('SELECT * FROM Users WHERE email = ? OR username = ?', [email, username], async (err, results) => {
            if (err) {
                console.error('Error in SELECT query:', err);
                return res.status(500).json({ error: 'Error during registration (SELECT).', details: err.message });
            }

            if (results.length > 0) {
                
                const emailTaken = results.some(user => user.email === email);
                const usernameTaken = results.some(user => user.username === username);

                let errorMessage = 'The following errors occurred:';
                if (emailTaken) errorMessage += ' Email già registrata.';
                if (usernameTaken) errorMessage += ' Username già in uso.';

                return res.status(400).json({ error: errorMessage });
            }

            console.log('Email and username not registered, proceeding with registration.');

            const hashedPassword = await bcrypt.hash(password, 10);
            console.log('Password hashed.');

            
            const userType = user_type || 1;

            db.query(
                'INSERT INTO Users (username, nome, cognome, email, passw, user_type) VALUES (?, ?, ?, ?, ?, ?)',
                [username, nome, cognome, email, hashedPassword, userType],
                (err, results) => {
                    if (err) {
                        console.error('Error in INSERT query:', err);
                        return res.status(500).json({ error: 'Error during registration (INSERT).', details: err.message });
                    }
                    console.log('User registered successfully.');
                    res.status(201).json({ success: 'Utente creato!' });
                }
            );
        });
    } catch (error) {
        console.error('General error:', error);
        res.status(500).json({ error: 'Errore durante la registrazione.', details: error.message });
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        db.query('SELECT * FROM Users WHERE email = ?', [email], async (err, results) => {
            if (err) {
                console.error('Error in SELECT query:', err);
                return res.status(500).json({ error: 'Errore durante il login.', details: err.message });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'User non trovato!' });
            }

            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.passw);
            if (!isMatch) {
                return res.status(400).json({ error: 'Password Errata!' });
            }

            
            res.status(200).json({
                success: 'Login successful!',
                user: { id: user.id, username: user.username, email: user.email, nome: user.nome }
            });
        });
    } catch (error) {
        console.error('General error:', error);
        res.status(500).json({ error: 'Errore durante login.', details: error.message });
    }
});

module.exports = router;