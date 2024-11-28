const express = require('express');
const db = require('../app'); 

const router = express.Router();


router.post('/request', (req, res) => {
    const { sender_id, recipientUsername } = req.body;

    console.log('Dati ricevuti per richiesta:', req.body);

    if (!sender_id || !recipientUsername) {
        return res.status(400).json({ error: 'I campi sender_id e recipientUsername sono obbligatori.' });
    }

    
    db.query('SELECT id FROM Users WHERE username = ?', [recipientUsername], (err, results) => {
        if (err) {
            console.error('Errore query SELECT:', err);
            return res.status(500).json({ error: 'Errore nel recupero dell\'utente.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Utente destinatario non trovato.' });
        }

        const receiver_id = results[0].id;

        
        db.query(
            `SELECT * FROM FriendRequests 
            WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)`,
            [sender_id, receiver_id, receiver_id, sender_id],
            (err, results) => {
                if (err) {
                    console.error('Errore query SELECT (duplicati):', err);
                    return res.status(500).json({ error: 'Errore nel controllo delle richieste duplicate.' });
                }

                if (results.length > 0) {
                    return res.status(400).json({ error: 'Richiesta già esistente o utenti già amici.' });
                }

                
                db.query(
                    'INSERT INTO FriendRequests (sender_id, receiver_id, status) VALUES (?, ?, "pending")',
                    [sender_id, receiver_id],
                    (err, results) => {
                        if (err) {
                            console.error('Errore query INSERT FriendRequests:', err);
                            return res.status(500).json({ error: 'Errore durante l\'invio della richiesta.' });
                        }

                        
                        db.query(
                            'INSERT INTO Notifications (user_id, content) VALUES (?, ?)',
                            [receiver_id, `Hai ricevuto una richiesta di amicizia da user ${sender_id}`],
                            (err) => {
                                if (err) {
                                    console.error('Errore query INSERT Notifications:', err);
                                    return res.status(500).json({ error: 'Errore durante la creazione della notifica.' });
                                }
                                res.status(201).json({ success: 'Richiesta di amicizia inviata e notifica creata!' });
                            }
                        );
                    }
                );
            }
        );
    });
});


router.get('/requests/:userId', (req, res) => {
    const { userId } = req.params;

    console.log(`Recupero richieste per userId: ${userId}`);

    db.query(
        `SELECT FriendRequests.id, Users.username AS senderUsername, FriendRequests.sent_at 
        FROM FriendRequests
        JOIN Users ON FriendRequests.sender_id = Users.id
        WHERE FriendRequests.receiver_id = ? AND FriendRequests.status = 'pending'`,
        [userId],
        (err, results) => {
            if (err) {
                console.error('Errore query SELECT (richieste):', err);
                return res.status(500).json({ error: 'Errore nel recupero delle richieste.' });
            }
            res.status(200).json(results);
        }
    );
});


router.post('/respond', (req, res) => {
    const { requestId, accept } = req.body;

    if (!requestId || typeof accept !== 'boolean') {
        return res.status(400).json({ error: 'Parametri non validi.' });
    }

    
    const query = `
        SELECT sender_id AS friendId, receiver_id AS userId
        FROM FriendRequests
        WHERE id = ?
    `;

    db.query(query, [requestId], (err, results) => {
        if (err) {
            console.error('Errore query SELECT FriendRequests:', err);
            return res.status(500).json({ error: 'Errore nel recupero della richiesta.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Richiesta non trovata.' });
        }

        const { userId, friendId } = results[0];
        console.log('Valori recuperati:', { userId, friendId });

        
        const status = accept ? 'accepted' : 'declined';
        db.query(
            'UPDATE FriendRequests SET status = ? WHERE id = ?',
            [status, requestId],
            (err) => {
                if (err) {
                    console.error('Errore query UPDATE FriendRequests:', err);
                    return res.status(500).json({ error: 'Errore nell\'aggiornamento della richiesta.' });
                }

                if (accept) {
                    
                    db.query(
                        'INSERT INTO Friends (user_id, friend_id) VALUES (?, ?), (?, ?)',
                        [userId, friendId, friendId, userId],
                        (err) => {
                            if (err) {
                                console.error('Errore query INSERT Friends:', err);
                                return res.status(500).json({ error: 'Errore nell\'aggiunta degli amici.' });
                            }

                            console.log('Amicizia aggiunta con successo.');

                            
                            db.query(
                                'INSERT INTO Notifications (user_id, content) VALUES (?, ?)',
                                [friendId, `La tua richiesta di amicizia è stata accettata!`],
                                (err) => {
                                    if (err) {
                                        console.error('Errore query INSERT Notifications:', err);
                                        return res.status(500).json({ error: 'Errore durante la notifica.' });
                                    }
                                    res.status(200).json({ success: 'Richiesta accettata, amici aggiunti e notifica inviata!' });
                                }
                            );
                        }
                    );
                } else {
                    res.status(200).json({ success: 'Richiesta rifiutata.' });
                }
            }
        );
    });
});

router.get('/list/:userId', (req, res) => {
    const { userId } = req.params;

    console.log(`Recupero lista amici per userId: ${userId}`);

    const query = `
        SELECT u.id, u.username, f.created_at AS friendSince
        FROM Friends f
        JOIN Users u ON f.friend_id = u.id
        WHERE f.user_id = ?
        UNION
        SELECT u.id, u.username, f.created_at AS friendSince
        FROM Friends f
        JOIN Users u ON f.user_id = u.id
        WHERE f.friend_id = ?;
    `;

    db.query(query, [userId, userId], (err, results) => {
        if (err) {
            console.error('Errore query SELECT amici:', err);
            return res.status(500).json({ error: 'Errore nel caricamento degli amici.' });
        }
        res.status(200).json(results);
    });
});
module.exports = router;