2. > **LEZIONE 2**
     2. > *<img src="https://developerhowto.com/wp-content/uploads/2018/12/node-express-mocha-chai.png" style="width: 100px"></img>  Express - Ese 2 Crud Server*
     
## Obiettivo:
Un **CRUD serve**r è un server che, **indipendentemente dalla collezione richiesta dal client**, esegue una azione diversa a seconda del tipo di chiamata sulla base del seguente
schema in cui, in tutte le chiamate, id viene passato al server sempre come parte della risorsa:
- GET / restituisce l’elenco completo dei record. Indipendentemente dalla tabella richiesta, i campi 
restituiti sono sempre _id, name, gender, hair
- GET /id restituisce il record avente l’id indicato
- POST inserisce nella collezione il record ricevuto come parametro
- DELETE /id elimina il record avente l’id indicato
- PATCH /id aggiorna il record avente l’id indicato sulla base del json ricevuto come parametro
- PUT /id sostituisce il record avente l’id indicato con il json ricevuto come parametro

## All’avvio:
Il client richiede al server l’elenco delle collezioni contenute all’interno del database di lavoro e le visualizza tramite gli appositi Option Button contenuti nel frame di 
sinistra.

## In corrispondenza del click su una collezione, l’applicazione deve:
- Aggiornare le due label superiori con il nome della collezione corrente ed il numero di documenti 
contenuti
- Visualizzare all’interno della tabella centrale l’elenco di tutti i record e tutti i campi restituiti dal 
server. In corrispondenza di questa richiesta il server invia i campi _id, name, gender e hair
- Se la collezione richiesta è unicorns, visualizzare la sezione relativa ai filtri (inizialmente nascosta)
- 
## In corrispondenza del click su una voce dell’elenco:
L’applicazione deve visualizzare nel riquadro di destra tutti i dettagli relativi alla voce selezionata, riportando le chiavi in neretto.

## In corrispondenza del click sul pulsante ADD:
L’applicazione aggiunge nel riquadro di destra una textarea con in coda un pulsante INVIA. In corrispondenza del click sul pulsante INVIA l’applicazione 
controlla la validità del json inserito e, in caso affermativo, invia la richiesta di inserimento al server.
In corrispondenza dell’OK aggiorna la tabella centrale.

## In corrispondenza del click sul pulsante Elimina:
Dopo apposita richiesta di conferma, l’applicazione invia al server la richiesta di eliminazione del record selezionato.

## In corrispondenza del click sul pulsante Aggiorna:
L’applicazione aggiunge nel riquadro di destra una textarea con in coda un pulsante INVIA. Inoltre ricopia all’interno della textArea tutti i dettagli del record 
corrente in modo che l’utente li possa modificare (escluso l’ID).

## In corrispondenza del click sul pulsante INVIA:
L’applicazione controlla la validità del json inserito e, in caso affermativo, invia la richiesta di inserimento al server. In corrispondenza dell’OK aggiorna la 
tabella centrale.

## In corrispondenza del click sul pulsante Sostituisci:
Vengono eseguite le stesse azioni del punto precedente. La differenza consiste soltanto nel fatto che eventuali campi cancellati in fase di editing:
- Nel caso dell’update mantengono il loro vecchio valore
- Nel caso del replace vengono rimossi
- 
## Nel solo caso della tabella unicorns, in corrispondenza del click sul pulsante FIND:
Inviare una richiesta per il servizio /unicorns passando come parametro GET il seguente JSON: **{“hair”:”blonde”, “gender”:”m”}**, questo json verrà passato direttamente al 
metodo find della query. In caso di assenza del parametro la query restituirà l’intero recordset.
