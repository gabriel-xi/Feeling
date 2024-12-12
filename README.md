
<img width="1250" alt="Logo+UniCT" src="https://github.com/user-attachments/assets/1543d6ac-f394-406b-a874-2c651273e2dd" />

**Progetto d’Esame di Basi di Dati**

**Anno Accademico: 2024/2025**
**Università degli Studi di Catania - Dipartimento di Matematica e Informatica**



**Descrizione del progetto**

Il progetto consiste nella realizzazione di un Social Network con funzionalità di base. L’obiettivo principale è dimostrare l’integrazione tra le componenti di frontend, backend e database, per fornire un’applicazione che permette agli utenti finali di interagire con i dati attraverso operazioni CRUD (Create, Read, Update, Delete).

**Tecnologie utilizzate**

	•	Frontend:
	•	HTML per la struttura delle pagine web.
	•	CSS per lo stile e il layout visivo.
	•	JavaScript per la gestione dell’interattività lato client.
	•	Backend:
	•	JavaScript (con Node.js) per la gestione del server e l’elaborazione delle richieste utente.
	•	Database:
	•	Utilizzo di un DBMS (Database Management System) progettato in MySQL Workbench.
	•	Comunicazione con il database tramite query SQL integrate nel backend.

 **Funzionalità principali**

	1.	Registrazione e Login degli utenti:
        		Gli utenti possono creare un account o accedere a uno esistente tramite credenziali salvate nel database.
	2.	Creazione, modifica e cancellazione di post:
       			 Gli utenti possono pubblicare contenuti, modificarli o eliminarli.
	3.	Gestione di profili utente:
        		 Ogni utente ha un profilo personalizzabile, con dati memorizzati nel database.
	4.	Interazione tra utenti:
	      		 Possibilità di aggiungere commenti ai post.
	     		 Sistema di notifiche basilare (opzionale).
	5.	Connessione al database:
      			 L’applicazione sfrutta query SQL per:
	     			 • Recuperare dati (lettura).
	     			 • Inserire nuovi record (creazione).
	     			 • Aggiornare dati esistenti (modifica).
	      			 • Rimuovere record (cancellazione).



**Query Utilizzate nel Progetto:**

**1. Registrazione degli Utenti:**

Descrizione:
Questa query viene utilizzata per registrare un nuovo utente nel sistema. I dati inseriti dall’utente (username, nome, cognome, email, password) vengono validati e quindi salvati nel database.

Query:
INSERT INTO Users (username, nome, cognome, email, passw, user_type)
VALUES (?, ?, ?, ?, ?, ?);

Parametri:
	•	username: nome utente scelto dall’utente.
	•	nome e cognome: informazioni personali.
	•	email: indirizzo email univoco per l’utente.
	•	passw: password hashata per la sicurezza.
	•	user_type: tipo di utente (default: “user”).

Ruolo:
Permette di creare nuovi utenti e aggiungerli alla tabella Users.


**2. Login degli Utenti:**

-E-mail
Descrizione:
Verifica le credenziali di accesso (email e password) fornite dall’utente. La query cerca l’utente nel database per confrontare la password inserita con quella salvata.

Query:
SELECT * FROM Users WHERE email = ?;

-Password
La password salvata nel database è hashata. Per confrontare la password inserita dall’utente con quella salvata, si utilizza una funzione di hashing(in javascript)

Parametri:
	•	email: indirizzo email univoco per l’utente.
	•	passw: password hashata per la sicurezza.

Ruolo:
Questa funzionalità autentica gli utenti verificando sia l’esistenza dell’email che la validità della password. La sicurezza è garantita dall’utilizzo di password hashate e dal confronto lato server.

**3. Creazione di Post**

Descrizione:
Gli utenti possono creare post, specificando un sentimento e una nota opzionale. La query salva il contenuto nella tabella Post.

Query:
INSERT INTO Post (id_user, sentimento, note, created_at)
VALUES (?, ?, ?, NOW());

Parametri:
	•	id_user: ID dell’utente che crea il post.
	•	sentimento: contenuto obbligatorio che descrive lo stato emotivo.
	•	note: testo opzionale aggiunto al post.
	•	created_at: timestamp della creazione.

Ruolo:
Permette agli utenti di pubblicare nuovi post nel Social Network.

**4. Visualizzazione dei Post**

Descrizione:
Recupera i post di un utente e quelli dei suoi amici. La query esegue una join tra le tabelle Post, Users, e Friends.

Query:
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
ORDER BY Post.created_at DESC;

Ruolo:
Consente di visualizzare i post pubblicati da un utente e dai suoi amici.

**5. Gestione delle Amicizie**

Descrizione:
Crea una richiesta di amicizia tra due utenti.

Query:
INSERT INTO FriendRequests (sender_id, receiver_id, status)
VALUES (?, ?, 'pending');

Ruolo:
Permette agli utenti di inviare richieste di amicizia.

-Accettazione della Richiesta

Descrizione:
Aggiorna lo stato della richiesta di amicizia e aggiunge la relazione nella tabella Friends.

Query per aggiornare lo stato della richiesta:
UPDATE FriendRequests
SET status = 'accepted'
WHERE id = ?;

Query per creare la relazione di amicizia:
INSERT INTO Friends (user_id, friend_id)
VALUES (?, ?), (?, ?);

Ruolo:
Gestisce l’accettazione e la creazione di una relazione di amicizia.

**6. Eliminazione di un Post**

Descrizione:
Permette a un utente di eliminare un post esistente, verificando che il post appartenga a quell’utente.

Query:
DELETE FROM Post
WHERE id = ? AND id_user = ?;

Ruolo:
Garantisce che solo l’autore di un post possa eliminarlo.

--------------------------------------------------------------------------------

**N.B**

* Macchina utilizzata Macbook Air M1
* Piattaforma utilizzata macOS Sequoia (Versione 15.1) 

* Per eseguire i vari moduli bisogna avere:

* Installato Java sulla propria macchina, link per il download: "https://www.java.com/it/download/manual.jsp";
* Installato Sql sulla propria macchina;
  
* Il file package.json: 
  Comando utilizzato per la creazione nella Directory del progetto: "npm init" o "npm init -y";

* Installare dei pacchetti necessari per il server in Javascrip nella Directory del progettot:
* Comando utilizzato per l'installazione: "npm install express" per lo sviluppo "npm install nodemon --save-dev";

* Un alternativa a "npm" è "yarn"



