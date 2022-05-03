1. > **LEZIONE 1**
     1. > *<img img src="http://jwt.io/img/logo-asset.svg" width="200px"></img>  JWT - Ese 01 JWT Mail*
     
## Descrizione:
Si vuole realizzare un client di posta basato sulla tabella allegata : *mail:{_id, username, password, mail}* dove il campo mail è un vettore enumerativo contenente 
l’elenco di tutte le mail ricevute da quell’utente. Ciascuna mail è rappresentata da un json strutturato nel modo seguente: *{from, subject, body}*. Il sistema è basato 
su un token JWT rilasciato dal server per ogni utente e contenente nel payload le seguenti informazioni: *{_id, username, iat, exp}*. Il campo exp indica il periodo di validità del token (30 secondi)

## All'avvio:
Il client, in corrispondenza del ricevimento della pagina index.html, richiede al server l’**elenco delle mail** memorizzate all’interno della propria casella di posta e
trasmette al server il token eventualmente memorizzato all’interno dei cookie. Il server controlla il token e:
- in caso di token valido, restituisce al client l’elenco delle mail relative all’utente indicato all’interno del token, provvedendo automaticamente ad aggiornare il tempo di scadenza del token. In corrispondenza 
della ricezione dei dati il client provvede a visualizzarli all’interno di una apposita tabella.
- in caso di assenza di token, token corrotto o scaduto, il server restituisce un codice di errore 403 “Token mancante, corrotto o scaduto” in corrispondenza del quale il client visualizza la pagina di login.

## In corrispondenza del login: 
Il server controlla le credenziali inviate dal client:
- In caso di credenziali valide risponde con un messaggio di ok e genera un nuovo token che invia al client in modo trasparente all’interno dei cookies. In corrispondenza
dell’ok il client invia una nuova richiesta relativa all’elenco delle mail.
- In caso di credenziali non valide il server risponde con un apposito codice di errore 401 “Username o password non validi” che il client dovrà in qualche modo 
segnalare all’utente.

## Il pulsante InviaMail:
Consente all’utente di inviare una nuova mail al destinatario indicato. Ricevuta la Mail il server controlla il token e: 
- In caso di token valido, verifica l’esistenza dell’utente destinatario. In caso di utente valido provvede ad accodare la mail nel vettore relativo al destinatario e 
risponde con un messaggio di conferma. 
- In caso di token non valido o destinatario non valido restituisce un apposito codice di errore in corrispondenza del quale il client provvede a visualizzare la sezione
di login.
- Codice / username dell’utente che ha spedito la mail vengono letti dal server all’interno del token.
