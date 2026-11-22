# CS Studio

## Checkout Sandbox per Quiz Patente C/CE Premium

GitHub Pages serve la pagina statica `/checkout/`. In `checkout/checkout.js` inserire soltanto il client-side token Sandbox `test_…` e l’ID prezzo completo `pri_…`. Il pulsante resta disabilitato finché entrambi mancano o hanno un formato incompatibile. La pagina imposta sempre l’ambiente Sandbox.

### Configurazione e test

1. In **Paddle Sandbox → Catalog → Products**, aprire **Quiz Patente C/CE – Premium** e copiare l’ID del prezzo attivo **8,19 EUR**, **One-time**, **Excludes tax**. Verificare eventuali prezzi per paese e limitare la quantità a 1 se il catalogo consente quantità superiori.
2. In **Paddle Sandbox → My account → Settings → Authentication**, recuperare il client-side token. Inserire nel checkout i due valori pubblici e pubblicare il ramo tramite la sorgente GitHub Pages del sito.
3. In **Paddle Sandbox → Checkout → Checkout settings**, salvare `https://ceazy-cds.github.io/checkout/` come **Default payment link**. Nella chat precedente il dominio risultava approvato in Sandbox.
4. Aprire la pagina pubblicata e fare clic su **Apri il checkout di prova**. Verificare la dicitura **Test Mode**, il prodotto, la quantità 1, il prezzo base di 8,19 EUR e la voce imposte con il totale calcolato da Paddle. Usare il numero di prova `4242 4242 4242 4242`, una scadenza futura e un CVC qualsiasi di tre cifre. Controllare la transazione in **Transactions** su Sandbox e il messaggio sulla pagina.
5. Su una nuova visita, chiudere l’overlay e verificare che si possa riaprire. Se si crea una transazione da Paddle con un link `?_ptxn=…`, verificare che Paddle.js apra quella transazione.

[Riferimento Sandbox e carte di prova](https://developer.paddle.com/sdks/sandbox/) · [Default payment link](https://developer.paddle.com/build/transactions/default-payment-link/)

### Backend webhook e licenze

CS Licensing è una fase separata. Ospitare il webhook su un servizio HTTPS server-side con un database dedicato a Sandbox. Conservare il segreto della destinazione webhook e le eventuali API key nel gestore dei segreti del servizio.

Per abilitare Premium, verificare `Paddle-Signature` sul corpo HTTP originale prima di elaborare `transaction.completed`. Controllare stato, prezzo e prodotto attesi, valuta e quantità. Collegare la transazione all’identità autenticata tramite un’associazione conservata dal server. In una transazione del database registrare l’evento con unicità su `event_id` e l’abilitazione con unicità sull’ID transazione Paddle. Restituire 2xx dopo la registrazione durevole e testare firma errata, duplicati e prezzi inattesi. L’app dovrà consultare il servizio autenticato per conoscere lo stato della licenza.

L’evento browser `checkout.completed` serve al messaggio sulla pagina. Lo sblocco nell’app dipende dal backend.

[Verifica firma webhook](https://developer.paddle.com/webhooks/signature-verification/)
