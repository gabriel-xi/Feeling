USE (nome_database);

-- Creazione della tabella Post
CREATE TABLE IF NOT EXISTS Post (
    id INT AUTO_INCREMENT, -- Id univoco del post
    id_user INT NOT NULL, -- Id dell'utente
    sentimento VARCHAR(255) NOT NULL, -- Prima nota
    note VARCHAR(255), -- Seconda Nota
    reazioni INT DEFAULT 0, -- Reazioni sul post
    commenti VARCHAR(255), -- Commenti sul post
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Data e orario di creazione del post

    PRIMARY KEY(id),
    FOREIGN KEY (id_user) REFERENCES Users(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS FriendRequests (
    id INT AUTO_INCREMENT, -- Numero della richiesta
    sender_id INT NOT NULL, -- Mandante
    receiver_id INT NOT NULL, -- Ricevente
    status ENUM('pending', 'accepted', 'declined') DEFAULT 'pending', -- Stato della richiesta
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Data di inoltro
    
    PRIMARY KEY(id),
    FOREIGN KEY (sender_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- Crea la tabella Friends
CREATE TABLE IF NOT EXISTS Friends (
    user_id INT NOT NULL, -- Id dell'utentete
    friend_id INT NOT NULL, -- Id dell'amico
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id,friend_id),
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (friend_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Notifications (
    id INT AUTO_INCREMENT PRIMARY KEY, -- ID univoco per ciascuna notifica
    user_id INT NOT NULL,              -- ID dell'utente che riceve la notifica
    content VARCHAR(255) NOT NULL,     -- Contenuto del messaggio di notifica
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Data e ora di creazione della notifica
    FOREIGN KEY (user_id) REFERENCES Users(id) -- Assicurati che user_id sia una chiave esterna che riferisce alla tabella degli utenti
);
