import type { DocContent } from './en'

export const it: DocContent = {
  common: {
    onThisPage: 'In questa pagina',
    backToDocs: 'Torna alla documentazione',
    docsHome: 'Documentazione',
  },
  home: {
    meta: {
      title: 'StayUp — Documentazione',
      description:
        'Cos’è StayUp, come si incastrano i pezzi, e dove andare dopo: gestire la propria istanza, gestirla, o scrivere un provider.',
    },
    eyebrow: 'Documentazione',
    title: 'Come funziona StayUp',
    lede: 'StayUp trasforma molti tipi di sorgente esterna — note di rilascio, video, feed, pagine scrapate, tutto ciò che un programma sa leggere — in un feed per persona. Questa pagina è il modello mentale e il vocabolario; poi scegli il percorso che ti serve.',
    concept: {
      heading: 'L’idea, in quattro frasi',
      points: [
        'StayUp ti mostra contenuto nuovo dalle sorgenti che segui. Cosa conta come sorgente non è fissato: è ciò che un provider sa andare a prendere.',
        'Un provider è un piccolo programma che va a prendere un tipo di sorgente e invia ciò che trova all’API dell’istanza via HTTP — non tocca mai il database. Coprire un nuovo tipo di sorgente significa scrivere un provider; nient’altro cambia in StayUp.',
        'L’API di StayUp possiede il database e lo serve alle app. Non fissa alcun tipo di sorgente: un provider esiste non appena si è registrato o ha inviato contenuto, e l’API restituisce il manifesto di visualizzazione di ciascuno così com’è.',
        'Le app — web, desktop, mobile — leggono l’API. Ognuna si può puntare su qualsiasi istanza, quindi su qualsiasi database, e ognuna sa mostrare un provider di cui non ha mai sentito parlare.',
      ],
      note: 'L’insieme delle sorgenti è aperto per costruzione. Un’istanza mostra esattamente i provider che girano contro il suo database — nessun elenco integrato, niente da registrare presso un’autorità centrale.',
      diagram: {
        title: 'Da una sorgente al tuo schermo',
        sources: 'Sorgenti esterne',
        sourcesItems:
          'un feed di podcast · un thread di forum · una pagina di stato · tutto ciò che un programma sa leggere',
        providers: 'Provider',
        providersSub: 'un piccolo programma per tipo di sorgente, su pianificazione, via HTTP',
        database: 'Il database',
        databaseSub:
          'PostgreSQL, MySQL, SQLite o MongoDB — tutto ciò che l’API memorizza, in un solo posto',
        api: 'API di StayUp',
        apiSub: 'riceve ciò che i provider inviano, serve le app, non fissa nulla',
        apps: 'Web · Desktop · Mobile · Admin',
        appsSub: 'ognuna configurabile verso un’altra istanza',
      },
    },
    vocabulary: {
      heading: 'Le parole, fissate una volta per tutte',
      intro:
        'Questi termini spuntano ovunque e si confondono facilmente. Ecco cosa significa ciascuno in StayUp.',
      columnTerm: 'Termine',
      columnMeaning: 'Cosa significa',
      terms: [
        {
          term: 'Istanza',
          meaning:
            'Un database + un’API davanti + i provider che la alimentano. L’istanza pubblica è una; la tua sarebbe un’altra. Le istanze non si parlano mai.',
        },
        {
          term: 'Provider (alias connettore)',
          meaning:
            'Un programma autonomo che va a prendere un tipo di sorgente e invia righe all’API, autenticato con una chiave di connettore. «Connettore» e «provider» sono la stessa cosa; i repo si chiamano stayup-cmd-*.',
        },
        {
          term: 'Sorgente (alias flux) — una riga repository',
          meaning:
            'Una cosa seguita: un URL di feed preciso, un canale, una pagina. Salvata come riga della tabella condivisa repository, con type uguale al nome del provider.',
        },
        {
          term: 'Iscrizione',
          meaning:
            'Un legame tra un utente e una sorgente: «questa persona segue questo flux». Aggiungere un flux in un’app crea un’iscrizione (e la sorgente stessa, se non esisteva).',
        },
        {
          term: 'Template di visualizzazione',
          meaning:
            'Un manifesto JSON opzionale che il provider registra presso l’API (memorizzato in provider_registry.template). Dice alle app come rendere le sue righe. Nessun template → una semplice scheda generica.',
        },
        {
          term: 'Admin',
          meaning:
            'Un operatore di un’istanza. Il primo (un super admin) si crea da riga di comando; il resto si gestisce dall’interfaccia web di amministrazione. Separato dagli account utente.',
        },
      ],
    },
    paths: {
      heading: 'Di quale percorso hai bisogno?',
      installTitle: 'Gestire la propria istanza',
      installBody:
        'La tua API e il tuo database, così i tuoi dati restano tuoi e scegli cosa gira contro di essi. Include una guida locale completa.',
      installCta: 'Guida all’installazione',
      generateTitle: 'Generare uno script di installazione',
      generateBody:
        'Il percorso guidato: scegli un database e i connettori che vuoi, e ottieni un unico script bash che avvia l’intero stack.',
      generateCta: 'Generatore di installazione',
      adminTitle: 'Gestire la tua istanza',
      adminBody:
        'L’interfaccia web di amministrazione: gestire gli admin, decidere quali provider accettano liberamente nuovi flux, lavorare la coda di approvazione, curare utenti e flux.',
      adminCta: 'Guida all’amministrazione',
      providersTitle: 'Collegare una nuova sorgente',
      providersBody:
        'Scrivere un provider — un programma che va a prendere una sorgente che StayUp non copre ancora e salva ciò che trova. Include i template di visualizzazione.',
      providersCta: 'Guida ai provider',
      relation:
        'Gestire un’istanza e scrivere un provider sono cose collegate ma distinte. Scriverne uno non richiede nulla dalla guida all’installazione — è solo un programma che chiama l’API. Farlo girare è un’altra faccenda: gli serve una chiave di connettore sull’istanza che alimenta, e sull’istanza pubblica non ce l’hai. In pratica, il tuo provider va di pari passo con la tua istanza.',
    },
  },
  install: {
    meta: {
      title: 'StayUp — Installazione',
      description:
        'Avviare la propria istanza di StayUp: i pezzi, una guida locale completa, i quattro database, la configurazione, e come puntare le app su di essa.',
    },
    eyebrow: 'Installazione',
    title: 'Gestire la propria istanza',
    lede: 'Un’istanza è un database, l’API davanti, i provider che scegli per alimentarla e — se vuoi gestirla da un browser — l’interfaccia web di amministrazione. Questa pagina percorre tutto, in locale, dall’inizio alla fine.',
    why: {
      heading: 'Perché prendersi il disturbo',
      intro: 'L’istanza pubblica ha i suoi provider e i suoi dati. Gestire la tua ti permette di:',
      items: [
        'tenere tutto in un database che controlli;',
        'scegliere quali provider girano, e con che frequenza;',
        'seguire sorgenti che l’istanza pubblica non copre;',
        'decidere chi può aggiungere cosa, tramite l’approvazione per provider;',
        'puntare le app web, desktop e mobile su di essa — un’impostazione, nessuna modifica di codice.',
      ],
      note: 'Le istanze non si parlano. Parti con un database vuoto e nessun provider, finché non ne fai girare uno contro di esso.',
    },
    pieces: {
      heading: 'I quattro pezzi',
      database: 'Un database',
      databaseBody:
        'Contiene tutto: le sorgenti seguite, il contenuto raccolto, gli account, gli admin. PostgreSQL, MySQL/MariaDB, SQLite o MongoDB — l’API si adatta a quello che le indichi.',
      api: 'API di StayUp',
      apiBody:
        'Uno strato sottile e senza stato sopra quel database. Non fissa alcun nome di provider — a ogni richiesta chiede al database cosa c’è. Gira su Node, in Docker, o su Cloudflare Workers.',
      providers: 'Provider',
      providersBody:
        'I programmi che riempiono davvero l’istanza. Repo autonomi, avviati su pianificazione, che parlano solo con l’API — con una chiave di connettore che un admin gli rilascia. Senza almeno uno, la tua istanza funziona ma non mostra nulla.',
      adminUi: 'L’interfaccia web di amministrazione (opzionale)',
      adminUiBody:
        'Un deploy dell’app web aperto su /admin. Permette di gestire gli admin, impostare il modo di approvazione di ogni provider, lavorare la coda delle richieste di flux, e curare utenti e flux. Rinunciaci e l’API funziona comunque — perdi solo la console del browser.',
    },
    fastPath: {
      heading: 'La via rapida',
      body: 'Se vuoi solo che giri, il generatore di installazione fa qualche domanda e ti consegna un unico stayup-setup.sh che fa tutto quello che segue al posto tuo — clone, compose, schema, super admin, prima esecuzione dei connettori, scheduler.',
      cta: 'Apri il generatore di installazione',
    },
    walkthrough: {
      heading: 'Guida locale completa',
      intro:
        'A mano, per vedere ogni ingranaggio. Qui PostgreSQL e Docker; gli stessi passi funzionano con qualsiasi motore supportato.',
      steps: [
        'Clonare l’API: git clone https://github.com/stayup-app/stayup-api.git && cd stayup-api',
        'Copiare .env.example in .env e impostare DATABASE_URL e JWT_SECRET (openssl rand -hex 32). Non c’è nessun nome utente né password admin da impostare — gli admin vivono nel database.',
        'Avviare il database e l’API: docker compose up -d db api. Il file compose semina lo schema in Postgres alla prima init; l’API ascolta sulla porta 3000.',
        'Se non hai contato su quell’auto-init, applica lo schema una volta: psql "$DATABASE_URL" -f src/db/schema.sql. Aggiunge soltanto, quindi è rieseguibile senza rischi.',
        'Creare il primo super admin: npm run create-admin -- root@example.com "Root" \'una-password-robusta\'. È l’account che gestisce l’interfaccia web di amministrazione.',
        'Emettere una chiave di connettore. Nell’interfaccia web di amministrazione, Chiavi connettore → Nuova chiave, provider rss — o POST /ui/connector-keys. Il segreto (stayup_conn_…) è mostrato una sola volta; copialo.',
        'Aggiungere un provider. Clonarne uno — git clone https://github.com/stayup-app/stayup-cmd-rss.git — impostare STAYUP_API_URL su http://localhost:3000 e STAYUP_API_KEY sulla chiave qui sopra, installare le dipendenze, poi: python fetch_rss.py --add https://blog.example.com/feed.xml e python fetch_rss.py. La prima esecuzione vera registra il provider presso l’API, poi raccoglie.',
        'Verificare che l’API lo veda: curl localhost:3000/connectors/providers ora dovrebbe elencare rss con il suo manifesto di visualizzazione.',
        'Aprire l’app desktop, andare in Profilo → URL dell’API, incollare http://localhost:3000, salvare. Creare un account, poi aggiungere un flux — la voce rss appare una volta eseguito il connettore.',
        'Pianificare il connettore perché continui a girare: una voce di cron, un timer systemd, una pianificazione GitHub Actions, o il container Ofelia che il generatore predispone.',
      ],
      note: 'L’API non avvia mai i connettori. Sono programmi separati, con la loro pianificazione; tutto ciò che serve loro dall’API è il suo URL e una chiave di connettore.',
    },
    requirements: {
      heading: 'Cosa ti serve',
      items: [
        'Un database dell’elenco qui sotto, raggiungibile da dove gira l’API.',
        'Docker, o Node.js 22 o successivo se vai senza container.',
        'Facoltativamente un account Cloudflare, per fare deploy su Workers come l’istanza di riferimento.',
      ],
    },
    databases: {
      heading: 'Quale database',
      intro:
        'L’API non parla SQL direttamente. Chiama un contratto di archiviazione che un adattatore per motore soddisfa, e lo schema della tua DATABASE_URL sceglie l’adattatore. Sono inclusi quattro motori:',
      columnEngine: 'Motore',
      columnScheme: 'Schema URL',
      columnDriver: 'Driver da installare',
      note: 'Ogni motore supera la stessa suite di conformità — gli stessi comportamenti, verificati in CI contro un PostgreSQL, un MySQL, un SQLite e un MongoDB reali. È questo che rende la scelta reversibile: le tabelle, le collection e le colonne portano gli stessi nomi ovunque, così un provider si descrive una volta e cambia solo il suo dialetto.',
      workersNote:
        'Un’eccezione, e non è colpa nostra: Cloudflare Workers apre solo il tipo di connessione che usa PostgreSQL. I driver di MySQL, SQLite e MongoDB hanno bisogno di Node — Docker o Node.js nudo, non Workers.',
    },
    env: {
      heading: 'Configurazione',
      columnVariable: 'Variabile',
      columnRequired: 'Obbligatoria',
      columnDescription: 'Descrizione',
      yes: 'sì',
      no: 'no',
      descriptions: [
        'Lo schema sceglie il motore: postgres://, mysql://, sqlite:// o mongodb://. I build Node e Docker accettano anche DB_HOST, DB_PORT, DB_NAME, DB_USER e DB_PASSWORD separatamente, per PostgreSQL.',
        'Segreto casuale che firma i token di autenticazione. Generane uno con openssl rand -hex 32. Deve restare lo stesso per tutta la vita dell’istanza — cambialo e ogni token esistente smette di funzionare.',
        'URL pubblico del tuo deploy web. Usato solo come destinazione di redirect OAuth; lascialo perdere se non abiliti il login con Google o GitHub.',
        'Abilita «Accedi con Google». Lascia vuoto per disabilitarlo.',
        'Abilita «Accedi con GitHub». Lascia vuoto per disabilitarlo.',
      ],
      note: 'Non c’è nessuna variabile per nome utente o password admin. La vecchia coppia API_USERNAME / API_PASSWORD non esiste più: gli admin sono righe nel database, e il primo si crea con npm run create-admin. Il login con e-mail e password per gli utenti normali funziona sempre, qualsiasi cosa tu faccia con le variabili OAuth.',
    },
    deploy: {
      heading: 'Fare il deploy dell’API',
      tabs: ['Docker Compose', 'Cloudflare Workers', 'Node.js nudo'],
      dockerIntro: 'La via più breve: clonare, riempire .env, avviare.',
      dockerNote:
        'Il file compose monta lo schema nella directory di init di Postgres, così le tabelle del nucleo sono create la prima volta che il volume viene inizializzato. L’API ascolta poi sulla porta 3000. Poi crea il super admin — vedi sotto.',
      workersIntro: 'Ciò che gira l’istanza di riferimento.',
      workersNote:
        'Il tuo database deve essere raggiungibile dalla rete di Cloudflare — un provider gestito con una stringa di connessione pubblica in pool è la risposta abituale. Workers non può raggiungere un database sulla tua rete domestica, né eseguire lo script create-admin: crea il super admin contro il database dalla tua macchina.',
      nodeIntro: 'Nessuna orchestrazione, solo il server compilato.',
      nodeNote:
        'Oppure costruisci tu stesso il Dockerfile fornito, se preferisci far girare un container senza Compose. L’immagine compilata porta anche lo script create-admin.',
    },
    schema: {
      heading: 'Creare le tabelle, e il primo admin',
      applyIntro:
        'Se non conti sull’auto-init di Compose, applica lo schema una volta tu stesso. Un file per motore, stessi nomi di tabelle e colonne in tutti:',
      applyNote:
        'I file SQL aggiungono soltanto — CREATE TABLE IF NOT EXISTS, ADD COLUMN IF NOT EXISTS — quindi rieseguibili in qualsiasi momento, anche contro un database che contiene già dati.',
      engineNotes: [
        'Lo schema di riferimento. Versione 14 o successiva.',
        'MySQL 8 o MariaDB 10.2 e successivi: l’API ordina il contenuto con una funzione finestra.',
        'Niente da ospitare — un file accanto all’API. Va bene per un’istanza personale, non per una che le app colpiscono da più punti contemporaneamente.',
        'Nessuno schema da applicare: MongoDB crea una collection alla prima scrittura. Contano solo gli indici, e l’API li crea da sola quando si connette — il comando qui sopra lo fa solo in anticipo.',
      ],
      adminIntro:
        'Gli admin sono righe della tabella admin; non c’è nessun account predefinito. Crea il primo — sempre un super admin — da riga di comando. Applica prima lo schema, poi inserisce la riga:',
      userIntro:
        'Gli account utente normali si creano dal modulo di registrazione delle app. Per farne uno senza modulo, per test:',
      verifyIntro: 'Poi verifica che l’API risponda:',
      verifyNote:
        'Un elenco di provider vuoto è la risposta attesa qui: niente ha ancora raccolto nulla. È la guida ai provider.',
    },
    auth: {
      heading: 'Utenti e autenticazione',
      intro:
        'Come le persone ottengono un account sulla tua istanza, e come attivare l’accesso con Google o GitHub.',
      registration: {
        heading: 'Modalità di registrazione',
        body: 'REGISTRATION_MODE decide cosa fa una registrazione pubblica. open (predefinito): l’account viene creato e la persona accede subito — il comportamento attuale. approval: la registrazione viene messa in attesa. POST /auth/register risponde 202 senza token, una registrazione OAuth torna con ?error=pending_approval, e un tentativo di accesso per un’e-mail in attesa risponde 403. Un admin lavora poi la coda in /admin/users → «Comptes en attente». Gli account creati da un admin sono sempre attivi, qualunque sia la modalità; così pure una registrazione OAuth la cui e-mail verificata corrisponde già a un account attivo.',
      },
      pointing: {
        heading: 'Dove le app accedono',
        body: 'Le app desktop e mobile, e le pagine web di accesso e registrazione, portano tutte una riga «Server» sulla schermata di accesso. Mostra l’host dell’API e si espande in un campo per cambiarlo o ripristinarlo — prima che esista un account, così nessuno deve accedere prima all’API predefinita. Ogni schermata legge GET /auth/config dell’istanza impostata e mostra solo i metodi di accesso che offre. L’app web ospitata rifiuta ancora un host privato (localhost, 10.x, 192.168.x…) come misura anti-SSRF: per puntare una UI web su un’API locale, esegui la tua copia di stayup-ui con STAYUP_API_URL impostato al deploy.',
      },
      oauth: {
        heading: 'Accesso con Google e GitHub',
        intro:
          'Facoltativo. Ogni provider richiede un’app OAuth di tua proprietà e quattro variabili d’ambiente sull’API:',
        steps: [
          'Crea un’app OAuth — Google su console.cloud.google.com/apis/credentials, GitHub su github.com/settings/developers.',
          'Imposta la sua URL di callback (o di redirect) su https://<origine-della-tua-api>/auth/oauth/<provider>/callback. Entrambi i provider consentono http://localhost per lo sviluppo.',
          'Metti il client ID e il secret in GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET (o la coppia GITHUB_) sull’API.',
          'Imposta UI_URL sull’origine del tuo deploy web — dopo un OAuth da browser l’API reindirizza a UI_URL/api/auth/callback. L’app desktop intercetta quel percorso da sé, quindi le basta qualsiasi UI_URL non vuoto; l’app mobile usa il proprio deep link stayup://, già in allow-list.',
        ],
        note: 'Un’app OAuth GitHub ammette esattamente una URL di callback, quindi serve un’app GitHub per ogni origine di API. Il generatore di script chiede queste credenziali all’esecuzione e le scrive direttamente in docker-compose.yml, mai nello script.',
      },
    },

    pointing: {
      heading: 'Puntare un’app sulla tua istanza',
      items: [
        'Web: imposta STAYUP_API_URL sul tuo deploy — oppure lasciala e lascia che ogni visitatore la sovrascriva dal proprio profilo, dove è salvata per browser.',
        'Tutte e tre le app: la riga «Server» sulla schermata di accesso, o Profilo → «Server» una volta dentro, dove imposti, rinomini e ripristini ciascuno.',
        'L’interfaccia web di amministrazione è la stessa app web: punta il suo STAYUP_API_URL sulla tua API e apri /admin.',
        'Un’app, più istanze: da Profilo → «Server» puoi aggiungere istanze API secondarie; il feed unisce allora tutte le istanze, con ogni riga contrassegnata dal server di origine. Aggiungere o rimuovere un flusso viene instradato al server scelto. Nell’app web un server secondario si aggiunge con email e password; le app desktop e mobile accettano anche l’OAuth per i server secondari.',
      ],
      note: 'Nient’altro cambia. L’elenco dei provider, i dati e il rendering seguono tutti l’istanza configurata — incluso il ripiego semplice per i provider che l’app non conosce per nome.',
    },
    troubleshooting: {
      heading: 'Quando qualcosa non va',
      items: [
        {
          symptom: 'L’elenco dei provider torna vuoto.',
          cause:
            'Atteso su un database appena creato: nessun provider ci ha ancora girato contro. Fanne girare uno e ricontrolla.',
        },
        {
          symptom: 'Le app non mostrano contenuto, ma l’elenco dei provider è popolato.',
          cause:
            'I provider girano ma nessuno segue ancora nulla, o le sorgenti che seguono non portano contenuto nuovo. Aggiungi una sorgente dall’app.',
        },
        {
          symptom: 'Un provider appare come scheda di testo, a volte JSON grezzo.',
          cause:
            'Nessun template di visualizzazione utilizzabile. Il provider non ne ha registrato uno presso l’API, o il suo content è una stringa JSON senza template per interpretarlo. Vedi la guida ai provider.',
        },
        {
          symptom: 'Aggiungere un flux dice «richiesta inviata» invece di iscrivere.',
          cause:
            'Quel provider è in modo di approvazione manuale. Un admin lo approva o lo rifiuta da /admin/flux-requests. Cambia il modo su /admin/providers se non è ciò che vuoi.',
        },
        {
          symptom: 'create-admin dice che l’e-mail è già in uso.',
          cause:
            'Un super admin esiste già. Gli admin successivi si creano dall’interfaccia web di amministrazione, non da riga di comando.',
        },
        {
          symptom: 'Il login funziona ma ogni altra chiamata è rifiutata.',
          cause:
            'Il segreto di firma differisce tra l’istanza che ha emesso il tuo token e quella che risponde. I token non passano da un’istanza all’altra.',
        },
      ],
    },
  },
  admin: {
    meta: {
      title: 'StayUp — Amministrazione',
      description:
        'Gestire un’istanza di StayUp dal browser: admin, approvazione di flux per provider, la coda delle richieste, utenti e flux.',
    },
    eyebrow: 'Amministrazione',
    title: 'Gestire la tua istanza',
    lede: 'Una volta l’API avviata, l’interfaccia web di amministrazione è il posto da cui gestisci l’istanza in un browser: chi può aggiungere cosa, quali richieste sono in attesa, quali utenti seguono quali flux.',
    webUi: {
      heading: 'L’interfaccia web di amministrazione',
      body: 'È la stessa app web del sito pubblico, aperta su /admin, puntata sulla tua API. È opzionale — tutto ciò che fa ha una rotta API dietro — ma è il modo pratico di gestire un’istanza. Fanne il deploy come qualsiasi altra copia dell’app web, imposta STAYUP_API_URL sulla tua API, e accedi su /admin/login.',
      note: 'La sessione admin è un cookie separato da una sessione utente. Lo stesso browser può tenerle entrambe insieme senza che una disconnetta l’altra.',
    },
    roles: {
      heading: 'Super admin e admin',
      intro:
        'Due livelli. Il primo admin è sempre un super admin, creato da riga di comando (npm run create-admin). Ogni admin successivo si crea dalla UI ed è un admin normale.',
      columnRole: 'Ruolo',
      columnCan: 'Può fare',
      rows: [
        {
          role: 'Super admin',
          can: 'Tutto ciò che può un admin normale, più: creare, modificare ed eliminare altri admin. Non può essere eliminato dalla UI, né eliminare sé stesso.',
        },
        {
          role: 'Admin',
          can: 'Lavoro operativo: utenti, flux, modi di approvazione dei provider, la coda delle richieste. Non vede né tocca l’elenco degli admin. Può cambiare la propria password.',
        },
      ],
      note: 'Gli admin non sono account utente. Hanno la loro tabella, il loro login, e nessun feed proprio.',
    },
    managingAdmins: {
      heading: 'Gestire gli admin',
      body: 'Solo super admin, su /admin/admins:',
      steps: [
        'Creare un admin con un’e-mail, un nome e una password. È un admin normale — non può gestire altri admin.',
        'Modificare il nome, l’e-mail o la password di un admin.',
        'Eliminare un admin. Le righe super admin e la tua riga sono bloccate.',
      ],
      note: 'Un admin normale che deve cambiare la propria password lo fa da /admin/settings, con la sua password attuale.',
    },
    fluxApproval: {
      heading: 'Approvazione di flux per provider',
      intro:
        'Quando un utente aggiunge un flux che non esiste ancora, ciò che accade dipende dal modo di approvazione del provider. Impostalo per provider su /admin/providers.',
      autoBody:
        'auto — il predefinito. La sorgente è creata e l’utente iscritto subito. Buono per i provider dove qualsiasi URL va bene (RSS, un changelog).',
      manualBody:
        'manual — aggiungere un flux sconosciuto crea invece una richiesta (l’app mostra «richiesta inviata»). Non si crea nulla finché un admin non approva. Buono per i provider dove far girare una sorgente costa qualcosa, come lo scraping.',
      note: 'Iscriversi a un flux che esiste già non passa mai per l’approvazione — l’approvazione riguarda solo il portare una sorgente nuova nell’istanza.',
    },
    usersAndFluxes: {
      heading: 'Utenti e flux',
      body: 'Il resto della console è sfogliare e curare:',
      items: [
        '/admin/users — ogni account, con i flux che segue. Aggiungi o togli un’iscrizione per conto di qualcuno.',
        '/admin/repositories — ogni sorgente di tutti i provider, con la sua config. Creane una direttamente (utile per seminare un provider manuale), o ritirane una.',
        '/admin/flux-requests — la coda in attesa. Approva crea o riusa la sorgente e iscrive il richiedente; rifiuta la segna rifiutata. Entrambe sono definitive.',
      ],
    },
    dataSources: {
      heading: 'Database secondari',
      intro:
        'Il database principale regge l’istanza stessa — admin, utenti, iscrizioni, il registro dei provider. Oltre a questo, puoi puntare l’istanza su database secondari in sola lettura che portano solo dati dei connettori, e lasciare che gli utenti seguano i flux che vivono lì. Si gestiscono su /admin/data-sources.',
      steps: [
        'Il database principale sta in cima alla pagina, solo a titolo informativo: il suo motore e il suo host, niente da modificare.',
        'Aggiungere un secondario con un nome e una stringa di connessione. Sono supportati gli stessi quattro motori del principale.',
        'Testare la connessione. L’istanza verifica di potersi connettere e che sia presente almeno una tabella di connettore, ed elenca i provider trovati.',
        'Confermare. La stringa di connessione è memorizzata cifrata a riposo e la fonte entra nell’elenco. Rimuovila quando vuoi — le iscrizioni che puntavano ad essa se ne vanno con lei.',
      ],
      note: 'I provider con lo stesso nome sono uniti nelle app: un utente vede una sola scheda «RSS» la cui lista di flux raccoglie i flux di ogni database, e una riga arrivata da un secondario porta un piccolo badge con il nome del database. Non si scrive mai verso un secondario — è un’alimentazione di dati, non una seconda casa.',
    },

    addingFlux: {
      heading: 'Come un utente aggiunge un flux, da qualsiasi app',
      intro:
        'Lo stesso flusso per ogni provider — nelle app non c’è più alcun caso speciale per provider:',
      steps: [
        'Scegliere un provider.',
        'L’app mostra i flux che quel provider segue già e che tu non segui ancora. Un tocco iscrive — mai un’approvazione.',
        'Oppure passare a «aggiungine uno nuovo». Il campo è guidato dal descrittore form del provider: la sua etichetta, il suo segnaposto e la forma che si aspetta.',
        'Invia. Se il provider è auto, sei iscritto. Se è manual, l’app mostra «richiesta inviata» e un admin prende il testimone.',
      ],
      note: 'Per questo un provider dovrebbe portare un descrittore form nel suo template — è ciò che trasforma un campo di testo nudo in «incolla un handle YouTube» o «incolla un URL di feed».',
    },
  },
  generate: {
    meta: {
      title: 'StayUp — Genera un’installazione self-hosted',
      description:
        'Scegli un database e i connettori che vuoi e scarica un unico script bash che avvia la tua istanza di StayUp.',
    },
    eyebrow: 'Installazione',
    title: 'Genera il tuo script di installazione',
    lede: 'Scegli un database e i connettori che vuoi. Ottieni un unico script bash che clona i repo, scrive la configurazione Docker, crea il tuo super amministratore e avvia tutto.',
    how: {
      heading: 'Cosa fa lo script',
      items: [
        'Clona l’API, i connettori scelti e — se lo tieni — l’interfaccia web di amministrazione.',
        'Scrive un docker-compose.yml con PostgreSQL, l’API, un container per connettore e uno scheduler Ofelia.',
        'Ti chiede l’account super amministratore e la frequenza di ogni connettore.',
        'Applica lo schema, crea il super amministratore, emette una chiave di connettore per provider e poi esegue ogni connettore una volta perché si registri.',
        'Avvia l’API, l’interfaccia e lo scheduler.',
      ],
      note: 'Tutto gira sulla tua macchina in Docker. Non viene inviato nulla da nessuna parte — la pagina costruisce lo script nel tuo browser.',
    },
    requirements: {
      heading: 'Prima di eseguirlo',
      items: [
        'Docker e Docker Compose v2 (`docker compose`).',
        'git.',
        'Linux o macOS. Su Windows, esegui lo script dentro WSL.',
      ],
    },
    form: {
      database: 'Database',
      comingSoon: 'presto',
      connectors: 'Connettori ufficiali',
      customConnectors: 'I tuoi connettori',
      customHint:
        'Qualsiasi repo git con un Dockerfile nella radice il cui ENTRYPOINT esegue il collettore una volta e legge STAYUP_API_URL / STAYUP_API_KEY. La chiave emessa dallo script è limitata al nome del servizio, quindi il nome del provider del connettore deve corrispondere. Vedi la guida ai provider.',
      customConnectorAdd: 'Aggiungi un connettore',
      customUrlPlaceholder: 'https://github.com/tu/tuo-connettore.git',
      customNamePlaceholder: 'nome (opzionale)',
      remove: 'Rimuovi',
      adminUi: 'Includi l’interfaccia web di amministrazione',
      adminUiHint: 'Gestire i provider, approvare le richieste di flux, aggiungere amministratori.',
      registration: 'Registrazione',
      registrationOpen: 'Aperta',
      registrationOpenHint: 'Chiunque raggiunga l’API può creare subito un account.',
      registrationApproval: 'Su approvazione',
      registrationApprovalHint: 'I nuovi account restano in coda finché un admin non li attiva.',
      signInMethods: 'Metodi di accesso',
      emailPassword: 'E-mail + password',
      oauthHint:
        'Lo script chiederà client ID e secret OAuth all’esecuzione — non finiscono mai nello script.',
      advanced: 'Avanzate',
      projectDir: 'Cartella del progetto',
      apiPort: 'Porta API',
      uiPort: 'Porta UI',
      dbPort: 'Porta database',
      preview: 'stayup-setup.sh',
      download: 'Scarica',
      copy: 'Copia',
      copied: 'Copiato',
      invalid: 'Impossibile generare',
    },
    run: {
      heading: 'Eseguilo',
      intro: 'Salva il file, poi:',
      note: 'La prima esecuzione costruisce ogni immagine e può richiedere qualche minuto.',
    },
    after: {
      heading: 'Dopo l’installazione',
      items: [
        'Doc API: http://localhost:3000/docs — Interfaccia di amministrazione: http://localhost:3001/admin.',
        'Nell’app desktop o mobile, imposta l’URL dell’API su http://localhost:3000 e crea un account.',
        'Aggiungi i feed dall’app — ogni provider offre un elenco di flux esistenti e un modulo per uno nuovo.',
        'Rimuovi tutto con: docker compose --profile connectors down -v (elimina il database).',
      ],
      note: 'Lo scheduler monta il socket Docker per avviare i connettori secondo il calendario — equivalente a root sull’host, va bene per un’istanza di sviluppo locale.',
    },
    production: {
      heading: 'Andare in produzione',
      intro:
        'Il generatore qui sopra mette in piedi tutto sulla tua macchina. Ecco un modo per far girare la stessa istanza in hosting, a costo quasi nullo: Neon per PostgreSQL, Cloudflare Workers per l’API e GitHub Actions come scheduler dei connettori. Ogni comando qui sotto è da copiare e incollare.',
      dbHeading: 'Il database — Neon',
      dbSteps: [
        'Crea un account Neon, poi un progetto. Scegli la regione più vicina a dove girerà l’API.',
        'Nel progetto, attiva il connection pooling e copia la stringa di connessione «pooled» — il suo host contiene «-pooler». Workers apre una nuova connessione per ogni richiesta; l’endpoint pooled è ciò che evita di esaurire PostgreSQL. Questa stringa è solo per l’API — i connettori non la vedono mai.',
        'Dalla tua macchina, applica lo schema e crea il primo super admin con un solo comando. È l’unico passo che deve girare da Node — Workers non applica mai lo schema da sé:',
        'Quel comando ha eseguito src/db/schema.sql e inserito l’admin. Nessun provider è ancora registrato — lo fa la prima esecuzione di un connettore (passo 3).',
      ],
      dbNote:
        'Il piano gratuito di Neon sospende il database quando è inattivo; la prima richiesta dopo una pausa impiega circa un secondo per risvegliarlo. Va bene per un’istanza personale.',
      apiHeading: 'L’API — Cloudflare Workers',
      apiSteps: [
        'Fai il fork di stayup-app/stayup-api su GitHub — fork, non solo clone, se in seguito vuoi il deploy al push.',
        'Installa Wrangler e accedi con il tuo account Cloudflare, poi carica i secret. Li conserva Cloudflare, non finiscono mai nel repo:',
        'Le impostazioni non segrete — UI_URL, INSTANCE_NAME, REGISTRATION_MODE — vanno in wrangler.toml sotto [vars]:',
        'Fai il deploy. Wrangler stampa l’URL:',
        'Per il deploy al push: in Settings → Secrets and variables → Actions del fork, aggiungi CLOUDFLARE_API_TOKEN (dashboard Cloudflare → My Profile → API Tokens → modello «Edit Cloudflare Workers»). Il ci.yml già presente nel repo testa e ridistribuisce a ogni push su main.',
      ],
      apiNote:
        'Per Workers è incluso solo il driver PostgreSQL — il runtime non può aprire socket MySQL o MongoDB. Su Workers, il database è PostgreSQL.',
      connHeading: 'I connettori — GitHub Actions',
      connIntro:
        'Un connettore è uno script Python che legge STAYUP_API_URL e STAYUP_API_KEY, fa un giro contro l’API ed esce. Serve qualcosa che lo esegua a intervalli; GitHub Actions lo fa gratis con schedule: e workflow_dispatch:. Ogni repo stayup-cmd-* include già .github/workflows/daily.yml.',
      connSteps: [
        'Nell’UI admin (o POST /ui/connector-keys), emetti una chiave di connettore per ogni provider che eseguirai — rss, youtube, ecc. Ogni segreto è mostrato una sola volta.',
        'Fai il fork di ogni connettore che vuoi: stayup-cmd-rss, stayup-cmd-youtube, stayup-cmd-changelog, stayup-cmd-github-trending, stayup-cmd-scrap.',
        'In ogni fork: Settings → Secrets and variables → Actions → New repository secret. Aggiungi STAYUP_API_URL (il tuo URL Workers) e STAYUP_API_KEY (la chiave di quel provider).',
        'Il workflow è già lì — è tutto qui:',
        'Imposta la cadenza con la riga cron: (in UTC). Sfalsa i connettori così non colpiscono l’API nello stesso minuto:',
        'Avvialo: scheda Actions → il workflow → Run workflow. La prima esecuzione registra il provider presso l’API; dopo, il provider compare nelle app e in GET /connectors/providers.',
        'GitHub mette in pausa i workflow pianificati di un repo senza attività per 60 giorni. Un commit o un’esecuzione manuale li riarma.',
      ],
      connNote:
        'Le esecuzioni pianificate vengono accodate, non sono esatte — sotto carico GitHub può ritardare un cron di diversi minuti. Per un lettore di feed va benissimo.',
      checkHeading: 'Verificare l’intera catena',
      checkSteps: [
        'curl https://<api>/ restituisce {"status":"ok"} — l’API raggiunge Neon.',
        'curl https://<api>/connectors/providers con un bearer token admin elenca ogni connettore eseguito almeno una volta.',
        'In un’app StayUp, imposta il server sul tuo URL Workers, crea un account, aggiungi un feed. L’abbonamento arriva nel database; la successiva esecuzione del connettore lo raccoglie.',
        'Per la UI di admin, distribuisci stayup-ui ovunque (Vercel con un clic), imposta STAYUP_API_URL sul tuo URL Workers e apri /admin.',
      ],
      checkNote:
        'A riposo non costa nulla: piano gratuito Neon, piano gratuito Workers (100k richieste/giorno) e GitHub Actions è gratis per i repo pubblici.',
    },
  },
  providers: {
    meta: {
      title: 'StayUp — Provider',
      description:
        'Scrivere un programma che trasforma qualsiasi sorgente esterna in contenuto StayUp.',
    },
    eyebrow: 'Provider',
    title: 'Collegare una nuova sorgente',
    lede: 'Un provider è un programma che va a prendere un tipo di sorgente e salva ciò che trova. È l’unica cosa che scrivi per estendere StayUp — l’API e le tre app lo raccolgono da sole.',
    what: {
      heading: 'Cos’è davvero un provider',
      body: 'Non un plugin, non un modulo da registrare: un programma ordinario, in qualsiasi linguaggio, avviato su pianificazione. Chiede all’API le sorgenti a lui destinate, va a prendere ciascuna, tiene ciò che è nuovo, e lo rimanda all’API. L’API lo raccoglie da sola, e le tre app lo mostrano — senza che una riga di codice cambi da nessuna parte.',
      note: 'Un provider parla solo con l’API di StayUp, via HTTP, con una chiave di connettore. Non tocca mai il database.',
      diagram: {
        title: 'Un provider, passo per passo',
        sources: 'Le sue sorgenti, prese dall’API',
        sourcesItems: 'i feed di podcast che questo provider ha ricevuto l’ordine di seguire',
        fetch: 'Andare a prendere ogni feed',
        compare: 'Tenere solo ciò che non c’era prima',
        store: 'Rimandarlo all’API',
        exposed: 'L’API lo espone, le app lo mostrano',
      },
      steps: {
        heading: 'A ogni esecuzione',
        items: [
          'Registrare il tuo nome visualizzato e il tuo template presso l’API.',
          'Chiedere all’API le sorgenti a te destinate.',
          'Andare a prendere ciascuna nel mondo esterno.',
          'Chiedere all’API dove ti sei fermato, e tenere solo il nuovo.',
          'Rimandare i nuovi elementi all’API, in un lotto.',
          'Chiedere all’API di togliere ciò che è troppo vecchio, e segnalare un errore invece di schiantarti su di esso.',
        ],
      },
    },
    access: {
      heading: 'Prima di iniziare: cosa ti serve?',
      body: 'Un provider ha bisogno dell’URL dell’istanza che alimenta e di una chiave di connettore per il suo nome, emessa da un admin di quell’istanza. Sull’istanza pubblica non ce l’hai, quindi in pratica un provider tuo va di pari passo con un’istanza tua. Scriverne uno non richiede nulla dalla guida all’installazione; farne girare uno richiede una chiave sull’istanza che alimenti.',
      cta: 'Guida all’installazione',
    },
    existing: {
      heading: 'Esempi concreti da leggere',
      body: 'Il tutorial passo passo costruisce un connettore intero per Hacker News da una cartella vuota — la via più rapida. Poi leggi quelli veri — changelog, youtube, rss, scrap, github-trending — che è ciò che l’istanza di riferimento si trova a far girare, non una definizione di ciò che StayUp copre. Il rss è l’esempio reale più corto del contratto qui sotto; github-trending è il riferimento per un template di visualizzazione ricco.',
      cta: 'Segui il tutorial',
    },
    creating: {
      heading: 'Scrivere il tuo',
      naming: {
        heading: 'Scegliere un nome',
        intro:
          'Qualcosa di corto e minuscolo, usabile come identificatore — podcast, hackernews, reddit_thread. Quell’unica stringa è usata così com’è in più punti:',
        columnWhere: 'Dove',
        columnExample: 'Per «podcast»',
        rows: [
          'Il percorso API che il tuo script chiama',
          'Le sorgenti che ti appartengono',
          'La tua riga nel registro',
          'Il campo provider che le app inviano all’aggiunta di un flux',
        ],
        note: 'Niente da riservare in anticipo: il nome è semplicemente quello a cui è legata la tua chiave di connettore e quello che registri. Due provider collidono solo scegliendo lo stesso.',
      },
      shape: {
        heading: 'Cosa salvi',
        body: 'Una riga per elemento trovato. Il contenuto stesso può essere testo semplice o JSON — decidi tu; l’API non lo analizza mai. Senza template di visualizzazione le app mostrano una scheda semplice: l’inizio del contenuto, la data, il tuo nome visualizzato. Funziona, è solo visivamente sobrio, e mostra JSON grezzo se è ciò che contiene il tuo contenuto. Un template lo sistema, ed è la sezione successiva.',
      },
      schedule: {
        heading: 'Farlo girare su pianificazione',
        body: 'Copia un qualsiasi collettore esistente: un Dockerfile alla radice il cui ENTRYPOINT esegue lo script una volta, e un job che lo lancia con STAYUP_API_URL e STAYUP_API_KEY nell’ambiente. Nulla impone una CI particolare — un timer systemd, un cron nudo, o il container Ofelia del generatore fanno lo stesso.',
      },
    },
    templates: {
      heading: 'Template di visualizzazione',
      body: 'Un template è un manifesto JSON che il tuo provider invia nel campo template della sua chiamata register. L’API lo memorizza in provider_registry.template e lo trasmette così com’è tramite GET /connectors/providers; ogni app ha un motore che lo legge e rende le tue righe — una disposizione a elenco, e un riquadro di lettura in uno di sette modi: testo, html, media, audio, galleria, tabella, elenco di link. Nessun codice delle app conosce il nome del tuo provider.',
      fallbackNote:
        'Un provider senza template (mai inviato, JSON illeggibile, o una version non riconosciuta) funziona lo stesso — le app ripiegano sulla scheda semplice. Un template è vivamente consigliato non appena il tuo contenuto è qualcosa di più di una breve riga di testo.',
      cta: 'Riferimento completo dei template',
    },
    form: {
      heading: 'Il descrittore form',
      body: 'Nel template, un piccolo blocco form dice alle app che aspetto deve avere il campo «aggiungi un nuovo flux» per il tuo provider. Senza di esso, l’utente ha un campo di testo nudo; con esso, un campo etichettato che convalida e costruisce l’URL della sorgente al posto suo.',
      fields: [
        {
          field: 'label · placeholder',
          meaning: 'cosa dice il campo e cosa mostra come suggerimento.',
        },
        {
          field: 'urlTemplate',
          meaning:
            'es. https://www.youtube.com/@{value} — {value} è ciò che l’utente ha digitato. Ignorato se il valore è già un URL http(s).',
        },
        {
          field: 'pattern',
          meaning:
            'una regex che l’input trasformato deve soddisfare, verificata lato client prima dell’invio.',
        },
        {
          field: 'transform',
          meaning:
            'trim, rimuovere un prefisso/suffisso noto, o estrarre un gruppo di cattura — perché un URL completo incollato e un handle nudo finiscano uguali.',
        },
      ],
      note: 'Le app salvano l’URL costruito come sorgente; il tuo collettore lo riceve nel suo elenco di sorgenti come qualsiasi altro.',
    },
    fluxApproval: {
      heading: 'Modo di approvazione',
      body: 'Ogni provider ha un modo flux_approval nel registro: auto (predefinito) o manual. auto iscrive l’utente subito quando aggiunge un nuovo flux; manual ne fa una richiesta che un admin deve approvare. È un’impostazione dell’operatore — un connettore non può impostarla da sé; un admin la imposta per istanza da /admin/providers. Lo scraping è preimpostato su manual per un motivo — far girare una sorgente lì costa qualcosa.',
      note: 'Questo riguarda solo il portare una sorgente nuova. Iscriversi a una sorgente che esiste già non passa mai per l’approvazione.',
    },
    contract: {
      heading: 'Contratto tecnico',
      lede: 'Materiale di riferimento. Ti serve per scrivere un provider, non per capire StayUp.',
      diagramTitle: 'Cosa chiama il tuo script',
      yourScript: 'Il tuo provider',
      announce: 'Annunciarsi',
      read: 'Leggere',
      write: 'Scrivere',
      seed: 'Seminare',
      announceDesc: 'registrare il tuo nome visualizzato + template, a ogni esecuzione',
      readDesc: 'le sorgenti da raccogliere, e dove ti sei fermato',
      writeDesc: 'righe nuove, un merge di config, errori',
      seedDesc: 'seguire un nuovo URL — il flag --add',
      warning:
        'Il connettore non detiene credenziali di database e non conosce alcun nome di tabella. La sua chiave funziona solo sotto /connector-api/<il proprio nome>/*: non può scrivere per un altro provider, né raggiungere utenti, admin o abbonamenti.',
      authHeading: 'Autenticazione',
      authBody:
        'Un admin emette una chiave di connettore per il nome del tuo provider (UI admin → Chiavi connettore, o POST /ui/connector-keys). Il segreto, stayup_conn_…, è mostrato una sola volta. Il tuo script lo invia come Authorization: Bearer <chiave> a ogni chiamata, e lo legge — con l’URL dell’istanza — da STAYUP_API_KEY e STAYUP_API_URL.',
      endpointsHeading: 'Gli endpoint',
      retentionNote:
        'La retention non è in questo elenco di proposito. Un connettore non elimina mai: un admin imposta quanto vivono i contenuti (globale o per provider) nell’interfaccia web in Manutenzione, e un job pianificato sull’API esegue la purga.',
      endpointsIntro:
        'Tutti sotto /connector-api/<name>/, tutti richiedono la chiave. Più o meno nell’ordine in cui un’esecuzione li usa.',
      columnCall: 'Chiamata',
      columnPurpose: 'Cosa fa',
      endpointPurposes: [
        'Annunciarti: nome visualizzato, ordine, template opzionale. Idempotente — chiamalo a ogni esecuzione. sortOrder non viene sovrascritto una volta impostato; template viene sostituito solo se il campo è presente.',
        'Seguire un nuovo URL. Idempotente sull’URL: 201 se creato, 200 se esisteva già, 409 se un altro provider lo possiede.',
        'Il tuo elenco di sorgenti da raccogliere in questa esecuzione — ciascuna con id, url e config.',
        'L’ultima versione salvata per quella sorgente, o null alla prima esecuzione — da dove riprendere.',
        'Ogni versione già salvata per quella sorgente — per un connettore che colma i buchi invece di riprendere solo dopo la più recente.',
        'Fonde (shallow merge) chiavi nella config di quella sorgente (es. salvare il titolo del canale per l’etichetta). Mai una sostituzione completa.',
        'Scrive un lotto di righe raccolte. content è una stringa opaca che l’API non analizza mai.',
        'Registra un errore di raccolta. Finisce nel registro errori dell’API.',
      ],
      itemHeading: 'La forma di un item',
      itemIntro: 'Ogni riga nel lotto POST /connector-api/<name>/items:',
      required: 'obbligatorio',
      optional: 'opzionale',
      itemFieldDescriptions: [
        'l’id della sorgente, dal tuo elenco di sorgenti.',
        'una stringa opaca — testo semplice o una stringa JSON, a tua scelta.',
        'timestamp ISO di questa esecuzione.',
        'se il recupero di quella sorgente è riuscito.',
        'la chiave di deduplica; mostrata anche accanto ai render ricchi (un tag di versione, un id di video).',
        'il timestamp proprio del contenuto, preferito a executedAt quando si ordina per «il più recente».',
        'JSON libero; oggi lo usa solo il provider di scraping.',
      ],
      addingSources: {
        heading: 'Far entrare le sorgenti',
        body: 'Due modi. Un flag --add che chiama POST /connector-api/<name>/sources ed esce — comodo per seminare da riga di comando. L’altro, quello che gli utenti finali prendono davvero, è aggiungere una sorgente da un’app, che fa POST a /ui/users/<userId>/repositories; il campo provider deve essere uguale al tuo nome, e passa per il flusso di approvazione auto/manuale.',
      },
      checklist: {
        heading: 'Prima di dirlo finito',
        items: [
          'chiamato a ogni esecuzione, con il tuo nome visualizzato e (consigliato) il tuo template.',
          'ti dà le sorgenti da raccogliere in questa esecuzione.',
          'invia righe nuove in un lotto, deduplicate rispetto alla versione salvata.',
          'ti dice dove ti sei fermato per ogni sorgente.',
          'errori per sorgente segnalati invece di far cadere l’esecuzione.',
          'elenca il tuo provider dopo un’esecuzione.',
        ],
      },
    },
  },

  tutorial: {
    meta: {
      title: 'StayUp — Scrivere un connettore',
      description:
        'Un connettore StayUp completo e funzionante per Hacker News, costruito da una cartella vuota — copia ogni passo.',
    },
    eyebrow: 'Providers',
    title: 'Scrivere un connettore, passo passo',
    lede: 'Un file, circa 90 righe, senza una chiave API propria. Segue liste di Hacker News (top, best, new…), tiene le storie che non ha visto, e le consegna a stayup-api. Copia ogni blocco nell’ordine; il file intero è alla fine.',

    intro: {
      heading: 'Cosa stai costruendo',
      body: 'Un connettore chiamato hackernews. Ogni sorgente seguita è un endpoint di lista di Hacker News — https://hacker-news.firebaseio.com/v0/topstories.json e simili. A ogni esecuzione lo script legge la lista, recupera le storie più recenti non ancora salvate, e le invia. Parla solo con stayup-api via HTTP; non tocca mai il database.',
      note: 'L’API Firebase di Hacker News non richiede né chiave né User-Agent e non ha limiti di richieste — per questo è un buon primo bersaglio.',
    },

    prereqs: {
      heading: 'Prima di iniziare',
      items: [
        'Python 3.11+ e pip.',
        'Un’istanza stayup-api raggiungibile (quella pubblica o la tua).',
        'Una chiave di connettore per il provider hackernews, creata dall’admin di quell’istanza: Chiavi connettore → Nuova chiave, provider hackernews. Il segreto è mostrato una sola volta.',
      ],
    },

    steps: {
      heading: 'I passi',
      setup:
        'Prepara la cartella e punta due variabili d’ambiente sulla tua istanza e la sua chiave.',
      helper:
        'Un solo file, check_hn.py. Comincia dagli import e da un unico helper api() — ogni chiamata a stayup-api passa da lì, con la chiave Bearer.',
      template:
        'A ogni esecuzione il connettore si dichiara: il suo nome visualizzato e un template di visualizzazione — il JSON da cui le app rendono le sue righe, senza codice per app. stayup-api lo memorizza e lo ritrasmette così com’è.',
      fetch:
        'L’unica parte specifica di Hacker News: leggere un endpoint di lista, recuperare ogni storia e formare una riga. version è la chiave di deduplica — l’id della storia come stringa. content è una stringa JSON opaca; il template sopra dice alle app come leggerla.',
      collect:
        'Per ogni sorgente seguita: chiedere all’API quali versioni ha già, tenere solo le storie nuove, e inviarle in un lotto. Un errore su una sorgente viene segnalato all’API, non sollevato.',
      main: 'Il punto d’ingresso: register, poi o --add un endpoint di lista o una passata di raccolta.',
    },

    run: {
      heading: 'Eseguirlo',
      body: 'Segui una o due liste, poi fai un’esecuzione vera. Il provider ora esiste — compare in GET /connectors/providers e nelle app, e un utente può abbonarsi.',
      note: 'Questo connettore tiene al massimo STORIES_PER_RUN righe per esecuzione e non cancella mai; potare il contenuto vecchio è una questione a parte — vedi il contratto del provider.',
    },

    schedule: {
      heading: 'Metterlo su pianificazione',
      body: 'Aggiungi un Dockerfile se vuoi containerizzarlo, e un workflow GitHub Actions pianificato — o un cron qualsiasi. Metti STAYUP_API_URL e STAYUP_API_KEY come segreti del repository.',
    },

    full: {
      heading: 'Il file intero',
      body: 'check_hn.py in un pezzo solo — i sei blocchi sopra, nell’ordine.',
    },

    next: {
      heading: 'Da qui',
      body: 'Sostituisci fetch_stories con la tua sorgente e adatta il template — è tutto il lavoro. I 5 collettori che l’istanza di riferimento fa girare (changelog, youtube, rss, scrap, github-trending) sono esempi più completi; rss è il più corto. Il contratto che ogni connettore segue è nella pagina provider.',
      cta: 'Il contratto del provider',
    },
  },
}
