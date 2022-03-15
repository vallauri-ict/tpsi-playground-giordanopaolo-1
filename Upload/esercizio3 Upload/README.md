3. > **LEZIONE 3**
     3. > *<img src="https://developerhowto.com/wp-content/uploads/2018/12/node-express-mocha-chai.png" style="width: 100px"></img>  Express - Ese 3 Upload*
     
## Obiettivo:
Caricare sia in formato **binario** che in formato **base64** delle immagini caricate dagli utenti.

## All’avvio:
L'applicazione presenta una tabella con l'elenco degli utenti e le loro rispettive immagini di profilo. Sono presenti un textbox per un nuovo utente e un input file per caricare un
nuovo file.

## Al click dei pulsanti:
- Viene controllato che entrambi i campi editabili siano valorizzati
- Il primo gestisce il caricamento binario e inserisce la foto *nel db e nella cartella /img del progetto*
- Il secondo gestisce il caricamento base64 direttamente nel DB
- Il terzo e il quarto caricano la stringa o il nome della foto di **cloudinary** sul DB e poi le caricano anche sulla sottocartella corrispondente in cloudinary (cambia solo tra
binary e base64)
