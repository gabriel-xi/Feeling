USE Diary;

-- Creazione della tabella Users_type
CREATE TABLE IF NOT EXISTS Users_type (
    id INT, -- Tipo di utenza
    tipologia VARCHAR(255), -- Tipologia dell'utente, associata all'id statico
    PRIMARY KEY (id)
);

-- Creazione della tabella Users
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT, -- Id univoco utente
    username VARCHAR(255) NOT NULL, -- Username utente
    nome VARCHAR(255) NOT NULL, -- nome dell'utente
    cognome VARCHAR(255) NOT NULL, -- cognome dell'utente
    email VARCHAR(255) NOT NULL, -- email dell'utente
    passw VARCHAR(255) NOT NULL, -- password dell'utente
    user_type INT, -- Tipo di utente, riferito alla tabella Users_type
    PRIMARY KEY (id),
    FOREIGN KEY (user_type) REFERENCES Users_type(id)
);

CREATE TABLE IF NOT EXISTS Profiles(
    id_users INT, -- Id univoco utente
    users VARCHAR(255), -- Username utente
    name VARCHAR(255), -- nome dell'utente
    surname VARCHAR(255), -- cognome dell'utente
    bio Text,
    
    PRIMARY KEY (id_users),
    FOREIGN KEY (id_users) REFERENCES Users(id),
    FOREIGN KEY (users) REFERENCES Users(username),
    FOREIGN KEY (name) REFERENCES Users(nome),
    FOREIGN KEY (surname) REFERENCES Users(cognome)
);

-- Inserimento dati nella tabella Users_type
INSERT INTO Users_type (id, Tipologia) VALUES
(0, 'Amministratore'),
(1, 'Utente'),
(2, 'Utente di sola lettura');


