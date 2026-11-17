# Immobiliare lead bridge

Servizio Node.js che controlla una casella Gmail tramite Gmail API e inoltra a una chat Telegram amministrativa le email provenienti da Immobiliare.it. Estrae anche un possibile numero telefonico dal testo.

## Requisiti

- Node.js 20 o successivo
- Progetto Google Cloud con Gmail API abilitata e credenziali OAuth 2.0 di tipo Desktop
- Bot Telegram creato con BotFather e chat amministrativa che abbia prima aperto il bot e inviato `/start`

## Configurazione Gmail API

1. In Google Cloud crea/seleziona un progetto e abilita **Gmail API**.
2. Configura la schermata di consenso OAuth; durante lo sviluppo aggiungi l'account Gmail come utente di test.
3. Crea un OAuth Client ID di tipo **Desktop app**, scarica il JSON e salvalo nella cartella principale del progetto come `credentials.json`.
4. Esegui `npm install` e poi `npm run authorize:gmail`. Accedi con `professionecasabot@gmail.com` e consenti la lettura e gestione dei messaggi. Il token OAuth viene salvato in `token.json`.
5. Compila `.env` con le variabili Telegram. Non servono più password IMAP.
6. Avvia il servizio con `npm start`.

`credentials.json` e `token.json` sono credenziali private e sono esclusi da Git. In modalità di test Google può far scadere il refresh token dopo sette giorni; in quel caso ripeti `npm run authorize:gmail`.

## Configurazione

Vedi `.env.example`. Il servizio controlla i messaggi non letti nella Posta in arrivo ogni 30 secondi. Dopo aver elaborato ciascun messaggio lo segna come letto; le email che non corrispondono al filtro Immobiliare.it vengono semplicemente segnate come lette.

## Limite Telegram

Un bot Telegram non può iniziare una conversazione con un numero di telefono: la persona deve prima aprire il bot e avviare la chat. Il servizio segnala quindi la richiesta all'amministratore. Prima di automatizzare il contatto, verifica che il trattamento e il canale siano coerenti con le informative/consensi applicabili.
