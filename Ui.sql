USE Diary;

DROP TABLE IF EXISTS POST;
DROP TABLE IF EXISTS Chats;

-- Creazione della tabella Post
CREATE TABLE IF NOT EXISTS Post(
	id INT AUTO_INCREMENT,
    username VARCHAR(255),
	sentimento VARCHAR(255) NOT NULL,
	note VARCHAR(255),
    reazioni VARCHAR(255),
    commenti VARCHAR(255),
    id_user  INT,
    PRIMARY KEY (id),
    FOREIGN KEY (id_user) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY(username) REFERENCES Username(username) ON DELETE CASCADE
);
-- Creazione della tabella Chats
CREATE TABLE IF NOT EXISTS Chats(
	id INT,
    nome VARCHAR(255),
    #stato INT NOT NULL,
    #id_messages INT AUTO_INCREMENT,
    #messages INT NOT NULL,
    id_user VARCHAR(255),
    PRIMARY KEY(id_user),
    FOREIGN KEY (nome) REFERENCES Users(nome),
    FOREIGN KEY (id_user) REFERENCES Users(id_user)
);

CREATE TABLE IF NOT EXISTS Friends (
    id INT,                 -- id dell'utente che aggiunge l'amico
    amico_id INT,           -- id dell'amico
    nome_amico VARCHAR(255), -- nome dell'amico
    cognome_amico VARCHAR(255), -- cognome dell'amico
    status VARCHAR(50),      -- stato dell'amicizia (opzionale)
    PRIMARY KEY (id, amico_id),  -- La combinazione id/amico_id è univoca
    FOREIGN KEY (id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (amico_id) REFERENCES Users(id) ON DELETE CASCADE
);
