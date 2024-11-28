const express = require('express');
const db = require('../app'); 

const router = express.Router();


router.post('/', (req, res) => {
    const { id_user, sentimento, note } = req.body;

    if (!id_user || !sentimento) {
        return res.status(400).json({ error: 'I campi id_user e sentimento sono obbligatori.' });
    }

    db.query(
        'INSERT INTO Post (id_user, sentimento, note, created_at) VALUES (?, ?, ?, NOW())',
        [id_user, sentimento, note || null],
        (err, results) => {
            if (err) {
                console.error('Errore query INSERT:', err);
                return res.status(500).json({ error: 'Errore nella creazione del post.' });
            }
            res.status(201).json({ success: true, postId: results.insertId });
        }
    );
});


router.get('/', (req, res) => {
    const userId = req.query.userId;

    if (!userId) {
        return res.status(400).json({ error: 'userId è obbligatorio.' });
    }

    const query = `
        SELECT 
            Post.id, 
            Post.id_user,
            Post.sentimento, 
            Post.note, 
            Post.reazioni,
            Users.username, 
            DATE_FORMAT(Post.created_at, '%Y-%m-%d %H:%i:%s') AS created_at   
        FROM Post
        JOIN Users ON Post.id_user = Users.id
        WHERE Post.id_user = ? OR Post.id_user IN (
            SELECT friend_id FROM Friends WHERE user_id = ?
        )
        ORDER BY Post.created_at DESC
    `;

    db.query(query, [userId, userId], (err, results) => {
        if (err) {
            console.error('Errore query SELECT:', err);
            return res.status(500).json({ error: 'Errore nel recupero dei post.' });
        }

        
        const posts = results.map(post => ({
            ...post,
            is_owner: post.id_user === parseInt(userId, 10), 
        }));

        
        res.status(200).json(posts);
    });
});

router.delete('/:id', (req, res) => {
    const postId = req.params.id;
    const userId = req.query.userId;

    if (!userId) {
        return res.status(400).json({ error: 'userId è obbligatorio.' });
    }

    
    db.query('DELETE FROM Post WHERE id = ? AND id_user = ?', [postId, userId], (err, result) => {
        if (err) {
            if (err.code === 'ER_ROW_IS_REFERENCED') {
                return res.status(400).json({ error: 'Impossibile eliminare il post perché è collegato ad altri dati.' });
            }
            console.error('Errore nella cancellazione del post:', err);
            return res.status(500).json({ error: 'Errore interno del server.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Post non trovato o non autorizzato.' });
        }

        res.status(200).json({ success: true });
    });
});




router.post('/:id/reazioni', (req, res) => {
    const postId = req.params.id;
    const action = req.body.action;

    db.query('SELECT reazioni FROM Post WHERE id = ?', [postId], (err, results) => {
        if (err) {
            console.error('Errore nel recupero delle reazioni:', err);
            return res.status(500).json({ error: 'Errore nel recupero delle reazioni.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Post non trovato.' });
        }

        const currentReactions = results[0].reazioni || 0;
        const newReactions = action === 'like' ? currentReactions + 1 : Math.max(currentReactions - 1, 0);

        db.query('UPDATE Post SET reazioni = ? WHERE id = ?', [newReactions, postId], (err) => {
            if (err) {
                console.error('Errore nell\'aggiornamento delle reazioni:', err);
                return res.status(500).json({ error: 'Errore nell\'aggiornamento delle reazioni.' });
            }

            res.status(200).json({ success: true, reazioni: newReactions });
        });
    });
});

module.exports = router;