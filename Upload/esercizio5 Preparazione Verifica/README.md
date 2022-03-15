5. > **LEZIONE 5**
     5. > *<img src="https://developerhowto.com/wp-content/uploads/2018/12/node-express-mocha-chai.png" style="width: 100px"></img>  Express - Ese 5 Preparazione Verifica*

## Obiettivo:
Replicare l'esercizio precedente ma integrandolo con le immagini profilo degli utenti

## Descrizione:
-  Il server, in corrispondenza del **message_notify**, inoltri ai client anche un campo img contenente il nome del file dell’immagine dell’utente che ha scritto il messaggio, 
andando a leggerlo nella tabella images del DBMS. Se non lo trova, il campo img verrà inviato comunque e conterrà stringa vuota.
- Il client, in fase di visualizzazione del messaggio, a fianco del nome dell’utente mittente, 
visualizzerà anche l’immagine di quell’utente.
