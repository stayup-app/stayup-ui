import type { DocContent } from './en'

export const pt: DocContent = {
  common: {
    onThisPage: 'Nesta página',
    backToDocs: 'Voltar à documentação',
    docsHome: 'Documentação',
  },
  home: {
    meta: {
      title: 'StayUp — Documentação',
      description:
        'O que é o StayUp, como as peças se encaixam, e para onde ir depois: rodar sua instância, operá-la, ou escrever um provedor.',
    },
    eyebrow: 'Documentação',
    title: 'Como o StayUp funciona',
    lede: 'O StayUp transforma vários tipos de fonte externa — notas de versão, vídeos, feeds, páginas raspadas, tudo o que um programa saiba ler — em um feed por pessoa. Esta página é o modelo mental e o vocabulário; depois escolha o caminho de que precisa.',
    concept: {
      heading: 'A ideia, em quatro frases',
      points: [
        'O StayUp mostra conteúdo novo das fontes que você segue. O que conta como fonte não é fixo: é o que algum provedor souber ir buscar.',
        'Um provedor é um pequeno programa que vai buscar um tipo de fonte e envia o que encontra à API da instância por HTTP — nunca toca no banco de dados. Cobrir um novo tipo de fonte é escrever um provedor; nada mais muda no StayUp.',
        'A API do StayUp é dona do banco e o serve às apps. Ela não fixa nenhum tipo de fonte: um provedor existe assim que se registrou ou enviou qualquer conteúdo, e a API devolve o manifesto de exibição de cada um como está.',
        'As apps — web, desktop, mobile — leem a API. Cada uma pode apontar para qualquer instância, ou seja, para qualquer banco, e cada uma sabe exibir um provedor de que nunca ouviu falar.',
      ],
      note: 'O conjunto de fontes é aberto por construção. Uma instância mostra exatamente os provedores que rodam contra o seu banco — sem lista embutida, nada a registrar junto a uma autoridade central.',
      diagram: {
        title: 'De uma fonte até a sua tela',
        sources: 'Fontes externas',
        sourcesItems:
          'um feed de podcast · um tópico de fórum · uma página de status · tudo o que um programa saiba ler',
        providers: 'Provedores',
        providersSub: 'um pequeno programa por tipo de fonte, com agendamento, por HTTP',
        database: 'O banco de dados',
        databaseSub: 'PostgreSQL, MySQL, SQLite ou MongoDB — tudo o que a API guarda, num só lugar',
        api: 'API do StayUp',
        apiSub: 'recebe o que os provedores enviam, serve as apps, não fixa nada',
        apps: 'Web · Desktop · Mobile · Admin',
        appsSub: 'cada uma configurável para outra instância',
      },
    },
    vocabulary: {
      heading: 'As palavras, definidas de uma vez',
      intro:
        'Estes termos aparecem em toda parte e se confundem com facilidade. Eis o que cada um significa no StayUp.',
      columnTerm: 'Termo',
      columnMeaning: 'O que significa',
      terms: [
        {
          term: 'Instância',
          meaning:
            'Um banco de dados + uma API à frente + os provedores que a alimentam. A instância pública é uma; a sua seria outra. Instâncias nunca conversam entre si.',
        },
        {
          term: 'Provedor (também: conector)',
          meaning:
            'Um programa autônomo que vai buscar um tipo de fonte e envia linhas à API, autenticado com uma chave de conector. «Conector» e «provedor» são a mesma coisa; os repositórios se chamam stayup-cmd-*.',
        },
        {
          term: 'Fonte (também: flux) — uma linha repository',
          meaning:
            'Uma coisa acompanhada: uma URL de feed específica, um canal, uma página. Guardada como linha da tabela compartilhada repository, com type igual ao nome do provedor.',
        },
        {
          term: 'Assinatura',
          meaning:
            'Um vínculo entre um usuário e uma fonte: «esta pessoa segue este flux». Adicionar um flux numa app cria uma assinatura (e a própria fonte, se não existia).',
        },
        {
          term: 'Template de exibição',
          meaning:
            'Um manifesto JSON opcional que o provedor registra na API (guardado em provider_registry.template). Diz às apps como renderizar as linhas dele. Sem template → um cartão genérico simples.',
        },
        {
          term: 'Admin',
          meaning:
            'Um operador de uma instância. O primeiro (um super admin) é criado por linha de comando; o restante é gerido pela interface web de administração. Separado das contas de usuário.',
        },
      ],
    },
    paths: {
      heading: 'De que caminho você precisa?',
      installTitle: 'Rodar sua própria instância',
      installBody:
        'Sua própria API e seu próprio banco, para que seus dados continuem seus e você escolha o que roda contra eles. Inclui um passo a passo local completo.',
      installCta: 'Guia de instalação',
      generateTitle: 'Gerar um script de instalação',
      generateBody:
        'O caminho guiado: escolha um banco e os conectores que quiser, e obtenha um único script bash que sobe toda a stack.',
      generateCta: 'Gerador de instalação',
      adminTitle: 'Operar sua instância',
      adminBody:
        'A interface web de administração: gerenciar admins, decidir quais provedores aceitam novos flux livremente, trabalhar a fila de aprovação, curar usuários e flux.',
      adminCta: 'Guia de administração',
      providersTitle: 'Conectar uma fonte nova',
      providersBody:
        'Escrever um provedor — um programa que vai buscar uma fonte que o StayUp ainda não cobre e guarda o que encontra. Inclui os templates de exibição.',
      providersCta: 'Guia de provedores',
      relation:
        'Operar uma instância e escrever um provedor são coisas relacionadas, mas distintas. Escrever um não exige nada do guia de instalação — é só um programa que chama a API. Rodá-lo é outra história: ele precisa de uma chave de conector na instância que alimenta, e na instância pública você não tem isso. Na prática, o seu provedor anda junto com a sua própria instância.',
    },
  },
  install: {
    meta: {
      title: 'StayUp — Instalação',
      description:
        'Subir a sua própria instância do StayUp: as peças, um passo a passo local completo, os quatro bancos de dados, a configuração, e como apontar as apps para ela.',
    },
    eyebrow: 'Instalação',
    title: 'Rodar sua própria instância',
    lede: 'Uma instância é um banco de dados, a API à frente, os provedores que você escolhe para alimentá-la e — se quiser operá-la de um navegador — a interface web de administração. Esta página percorre tudo, localmente, de ponta a ponta.',
    why: {
      heading: 'Por que se dar ao trabalho',
      intro:
        'A instância pública tem seus próprios provedores e seus próprios dados. Rodar a sua permite:',
      items: [
        'manter tudo num banco que você controla;',
        'escolher quais provedores rodam, e com que frequência;',
        'seguir fontes que a instância pública não cobre;',
        'decidir quem pode adicionar o quê, via aprovação por provedor;',
        'apontar as apps web, desktop e mobile para ela — um ajuste, sem mudança de código.',
      ],
      note: 'Instâncias não conversam entre si. Você começa com um banco vazio e nenhum provedor, até rodar um contra ele.',
    },
    pieces: {
      heading: 'As quatro peças',
      database: 'Um banco de dados',
      databaseBody:
        'Contém tudo: as fontes acompanhadas, o conteúdo coletado, as contas, os admins. PostgreSQL, MySQL/MariaDB, SQLite ou MongoDB — a API se adapta ao que você indicar.',
      api: 'API do StayUp',
      apiBody:
        'Uma camada fina e sem estado sobre esse banco. Ela não fixa nenhum nome de provedor — a cada requisição pergunta ao banco o que há. Roda em Node, em Docker, ou em Cloudflare Workers.',
      providers: 'Provedores',
      providersBody:
        'Os programas que realmente enchem a instância. Repositórios autônomos, iniciados por agendamento, que só falam com a API — com uma chave de conector que um admin lhes emite. Sem pelo menos um, a sua instância funciona mas não mostra nada.',
      adminUi: 'A interface web de administração (opcional)',
      adminUiBody:
        'Uma implantação da app web aberta em /admin. Permite gerenciar admins, definir o modo de aprovação de cada provedor, trabalhar a fila de pedidos de flux, e curar usuários e flux. Dispense-a e a API continua funcionando — você só perde o console do navegador.',
    },
    fastPath: {
      heading: 'O caminho rápido',
      body: 'Se você só quer que rode, o gerador de instalação faz algumas perguntas e entrega um único stayup-setup.sh que faz tudo abaixo por você — clonar, compose, esquema, super admin, primeira execução dos conectores, agendador.',
      cta: 'Abrir o gerador de instalação',
    },
    walkthrough: {
      heading: 'Passo a passo local completo',
      intro:
        'À mão, para você ver cada engrenagem. Aqui PostgreSQL e Docker; os mesmos passos funcionam com qualquer motor suportado.',
      steps: [
        'Clonar a API: git clone https://github.com/stayup-app/stayup-api.git && cd stayup-api',
        'Copiar .env.example para .env e definir DATABASE_URL e JWT_SECRET (openssl rand -hex 32). Não há usuário nem senha de admin a definir — os admins vivem no banco.',
        'Subir o banco e a API: docker compose up -d db api. O arquivo compose semeia o esquema no Postgres na primeira init; a API escuta na porta 3000.',
        'Se você não contou com essa auto-init, aplique o esquema uma vez: psql "$DATABASE_URL" -f src/db/schema.sql. Ele só adiciona, então dá para reexecutar sem risco.',
        'Criar o primeiro super admin: npm run create-admin -- root@example.com "Root" \'uma-senha-forte\'. É a conta que gerencia a interface web de administração.',
        'Emitir uma chave de conector. Na interface web de administração, Chaves de conector → Nova chave, provedor rss — ou POST /ui/connector-keys. O segredo (stayup_conn_…) é mostrado uma única vez; copie-o.',
        'Adicionar um provedor. Clonar um — git clone https://github.com/stayup-app/stayup-cmd-rss.git — definir STAYUP_API_URL como http://localhost:3000 e STAYUP_API_KEY como a chave acima, instalar as dependências, e então: python fetch_rss.py --add https://blog.example.com/feed.xml e python fetch_rss.py. A primeira execução de verdade registra o provedor na API e depois coleta.',
        'Verificar que a API o vê: curl localhost:3000/connectors/providers deve agora listar rss com o manifesto de exibição dele.',
        'Abrir a app desktop, ir em Perfil → URL da API, colar http://localhost:3000, salvar. Criar uma conta, e então adicionar um flux — a entrada rss aparece assim que o conector rodar.',
        'Agendar o conector para que continue rodando: uma entrada de cron, um timer do systemd, um agendamento do GitHub Actions, ou o contêiner Ofelia que o gerador monta.',
      ],
      note: 'A API nunca inicia os conectores. São programas à parte, com o próprio agendamento; tudo o que precisam da API é sua URL e uma chave de conector.',
    },
    requirements: {
      heading: 'Do que você precisa',
      items: [
        'Um banco de dados da lista abaixo, alcançável de onde a API roda.',
        'Docker, ou Node.js 22 ou mais recente se for sem contêineres.',
        'Opcionalmente uma conta Cloudflare, para implantar em Workers como a instância de referência.',
      ],
    },
    databases: {
      heading: 'Qual banco de dados',
      intro:
        'A API não fala SQL diretamente. Ela chama um contrato de armazenamento que um adaptador por motor cumpre, e o esquema da sua DATABASE_URL escolhe o adaptador. Quatro motores vêm junto:',
      columnEngine: 'Motor',
      columnScheme: 'Esquema de URL',
      columnDriver: 'Driver a instalar',
      note: 'Cada motor passa na mesma suíte de conformidade — os mesmos comportamentos, verificados em CI contra um PostgreSQL, um MySQL, um SQLite e um MongoDB reais. É isso que torna a escolha reversível: as tabelas, as coleções e as colunas têm os mesmos nomes em toda parte, então um provedor se descreve uma vez e só o dialeto muda.',
      workersNote:
        'Uma exceção, e não é coisa nossa: o Cloudflare Workers só abre o tipo de conexão que o PostgreSQL usa. Os drivers de MySQL, SQLite e MongoDB precisam de Node — Docker ou Node.js puro, não Workers.',
    },
    env: {
      heading: 'Configuração',
      columnVariable: 'Variável',
      columnRequired: 'Obrigatória',
      columnDescription: 'Descrição',
      yes: 'sim',
      no: 'não',
      descriptions: [
        'O esquema escolhe o motor: postgres://, mysql://, sqlite:// ou mongodb://. Os builds de Node e Docker também aceitam DB_HOST, DB_PORT, DB_NAME, DB_USER e DB_PASSWORD separadamente, para PostgreSQL.',
        'Segredo aleatório que assina os tokens de autenticação. Gere um com openssl rand -hex 32. Deve continuar o mesmo durante toda a vida da instância — troque-o e todos os tokens existentes param de funcionar.',
        'URL pública da sua implantação web. Usada apenas como destino de redirecionamento OAuth; deixe de fora se não ativar login com Google ou GitHub.',
        'Ativa «Entrar com o Google». Deixe vazio para desativar.',
        'Ativa «Entrar com o GitHub». Deixe vazio para desativar.',
      ],
      note: 'Não há variável de usuário nem senha de admin. O antigo par API_USERNAME / API_PASSWORD acabou: os admins são linhas no banco, e o primeiro é criado com npm run create-admin. O login com e-mail e senha para usuários normais sempre funciona, faça o que fizer com as variáveis OAuth.',
    },
    deploy: {
      heading: 'Implantar a API',
      tabs: ['Docker Compose', 'Cloudflare Workers', 'Node.js puro'],
      dockerIntro: 'O caminho mais curto: clonar, preencher .env, rodar.',
      dockerNote:
        'O arquivo compose monta o esquema no diretório de init do Postgres, então as tabelas do núcleo são criadas na primeira vez que o volume é inicializado. A API então escuta na porta 3000. Em seguida crie o super admin — veja abaixo.',
      workersIntro: 'O que a instância de referência roda.',
      workersNote:
        'O seu banco precisa ser alcançável a partir da rede da Cloudflare — um provedor gerenciado com uma string de conexão pública com pool é a resposta habitual. O Workers não consegue alcançar um banco na sua rede doméstica, nem executar o script create-admin: crie o super admin contra o banco a partir da sua máquina.',
      nodeIntro: 'Sem orquestração, só o servidor compilado.',
      nodeNote:
        'Ou construa você mesmo o Dockerfile fornecido, se preferir rodar um contêiner sem Compose. A imagem compilada traz também o script create-admin.',
    },
    schema: {
      heading: 'Criar as tabelas, e o primeiro admin',
      applyIntro:
        'Se você não conta com a auto-init do Compose, aplique o esquema uma vez você mesmo. Um arquivo por motor, os mesmos nomes de tabelas e colunas em todos:',
      applyNote:
        'Os arquivos SQL só adicionam — CREATE TABLE IF NOT EXISTS, ADD COLUMN IF NOT EXISTS — então dá para reexecutar a qualquer momento, inclusive contra um banco que já tem dados.',
      engineNotes: [
        'O esquema de referência. Versão 14 ou mais recente.',
        'MySQL 8 ou MariaDB 10.2 e mais recentes: a API ordena o conteúdo com uma função de janela.',
        'Nada a hospedar — um arquivo ao lado da API. Bom para uma instância pessoal, não para uma que as apps acessam de vários lugares ao mesmo tempo.',
        'Nenhum esquema a aplicar: o MongoDB cria uma coleção na primeira escrita. Só os índices importam, e a API os cria sozinha ao conectar — o comando acima só faz isso antecipadamente.',
      ],
      adminIntro:
        'Os admins são linhas da tabela admin; não há conta padrão. Crie o primeiro — sempre um super admin — por linha de comando. Ele aplica o esquema primeiro, depois insere a linha:',
      userIntro:
        'As contas de usuário normais são criadas pelo formulário de cadastro das apps. Para fazer uma sem formulário, para testes:',
      verifyIntro: 'Depois verifique que a API responde:',
      verifyNote:
        'Uma lista de provedores vazia é a resposta esperada aqui: nada coletou nada ainda. Isso é o guia de provedores.',
    },
    auth: {
      heading: 'Usuários e autenticação',
      intro:
        'Como as pessoas obtêm uma conta na sua instância, e como ativar o login com Google ou GitHub.',
      registration: {
        heading: 'Modos de cadastro',
        body: 'REGISTRATION_MODE decide o que um cadastro público faz. open (padrão): a conta é criada e a pessoa entra na hora — o comportamento atual. approval: o cadastro fica em espera. POST /auth/register responde 202 sem token, um cadastro por OAuth volta com ?error=pending_approval, e uma tentativa de login para um e-mail em espera responde 403. Um admin então trabalha a fila em /admin/users → «Comptes en attente». Contas criadas por um admin estão sempre ativas, seja qual for o modo; o mesmo vale para um cadastro por OAuth cujo e-mail verificado já corresponde a uma conta ativa.',
      },
      pointing: {
        heading: 'Onde os apps fazem login',
        body: 'Os apps de desktop e mobile, e as páginas web de login e cadastro, todos têm uma linha «Servidor» na tela de entrada. Ela mostra o host da API e se expande num campo para trocá-lo ou redefini-lo — antes de qualquer conta existir, então ninguém precisa entrar primeiro na API padrão. Cada tela lê GET /auth/config da instância configurada e mostra só os métodos de login que ela oferece. O app web hospedado ainda recusa um host privado (localhost, 10.x, 192.168.x…) como medida anti-SSRF: para apontar uma UI web para uma API local, rode sua própria cópia do stayup-ui com STAYUP_API_URL definido no deploy.',
      },
      oauth: {
        heading: 'Login com Google e GitHub',
        intro:
          'Opcional. Cada provedor precisa de um app OAuth seu e quatro variáveis de ambiente na API:',
        steps: [
          'Crie um app OAuth — Google em console.cloud.google.com/apis/credentials, GitHub em github.com/settings/developers.',
          'Defina a URL de callback (ou de redirecionamento) dele como https://<origem-da-sua-api>/auth/oauth/<provider>/callback. Ambos os provedores permitem http://localhost para desenvolvimento.',
          'Coloque o client ID e o secret em GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET (ou o par GITHUB_) na API.',
          'Defina UI_URL como a origem do seu deploy web — depois de um OAuth de navegador a API redireciona para UI_URL/api/auth/callback. O app de desktop intercepta esse caminho sozinho, então qualquer UI_URL não vazio serve; o app mobile usa o próprio deep link stayup://, já na allow-list.',
        ],
        note: 'Um app OAuth do GitHub aceita exatamente uma URL de callback, então você precisa de um app GitHub por origem de API. O gerador de script pede essas credenciais na execução e as escreve direto no docker-compose.yml, nunca no script.',
      },
    },

    pointing: {
      heading: 'Apontar uma app para a sua instância',
      items: [
        'Web: defina STAYUP_API_URL na sua implantação — ou deixe-a e deixe cada visitante sobrescrevê-la no perfil, onde é guardada por navegador.',
        'As três apps: a linha «Servidor» na tela de entrada, ou Perfil → «Servidores» depois de entrar, onde você define, renomeia e redefine cada um.',
        'A interface web de administração é a mesma app web: aponte o STAYUP_API_URL dela para a sua API e abra /admin.',
        'Uma app, várias instâncias: em Perfil → «Servidores» você pode adicionar instâncias de API secundárias; o feed então combina todas as instâncias, com cada linha marcada com o servidor de origem. Adicionar ou remover um fluxo é roteado para o servidor escolhido. Na app web um servidor secundário é adicionado com e-mail e senha; as apps de desktop e celular também aceitam OAuth para servidores secundários.',
      ],
      note: 'Nada mais muda. A lista de provedores, os dados e a renderização seguem todos a instância configurada — inclusive o recurso simples para provedores que a app não conhece pelo nome.',
    },
    troubleshooting: {
      heading: 'Quando algo está errado',
      items: [
        {
          symptom: 'A lista de provedores volta vazia.',
          cause:
            'Esperado num banco recém-criado: nenhum provedor rodou contra ele ainda. Rode um e verifique de novo.',
        },
        {
          symptom: 'As apps não mostram conteúdo, mas a lista de provedores está populada.',
          cause:
            'Os provedores rodam mas ninguém segue nada ainda, ou as fontes que eles acompanham não trazem conteúdo novo. Adicione uma fonte pela app.',
        },
        {
          symptom: 'Um provedor aparece como cartão de texto, às vezes JSON cru.',
          cause:
            'Nenhum template de exibição utilizável. O provedor não registrou nenhum na API, ou o content dele é uma string JSON sem template para interpretá-la. Veja o guia de provedores.',
        },
        {
          symptom: 'Adicionar um flux diz «pedido enviado» em vez de assinar.',
          cause:
            'Esse provedor está em modo de aprovação manual. Um admin aprova ou rejeita em /admin/flux-requests. Mude o modo em /admin/providers se não for o que você quer.',
        },
        {
          symptom: 'create-admin diz que o e-mail já está em uso.',
          cause:
            'Já existe um super admin. Os admins seguintes são criados pela interface web de administração, não por linha de comando.',
        },
        {
          symptom: 'O login funciona mas toda outra chamada é rejeitada.',
          cause:
            'O segredo de assinatura difere entre a instância que emitiu o seu token e a que responde. Tokens não passam de uma instância para outra.',
        },
      ],
    },
  },
  admin: {
    meta: {
      title: 'StayUp — Administração',
      description:
        'Operar uma instância do StayUp pelo navegador: admins, aprovação de flux por provedor, a fila de pedidos, usuários e flux.',
    },
    eyebrow: 'Administração',
    title: 'Operar sua instância',
    lede: 'Com a API no ar, a interface web de administração é de onde você opera a instância num navegador: quem pode adicionar o quê, quais pedidos estão pendentes, quais usuários seguem quais flux.',
    webUi: {
      heading: 'A interface web de administração',
      body: 'É a mesma app web do site público, aberta em /admin, apontada para a sua API. É opcional — tudo o que ela faz tem uma rota de API por trás — mas é o jeito prático de operar uma instância. Implante-a como qualquer outra cópia da app web, defina STAYUP_API_URL para a sua API, e entre em /admin/login.',
      note: 'A sessão de admin é um cookie separado de uma sessão de usuário. O mesmo navegador pode ter as duas ao mesmo tempo sem uma deslogar a outra.',
    },
    roles: {
      heading: 'Super admin e admin',
      intro:
        'Dois níveis. O primeiro admin é sempre um super admin, criado por linha de comando (npm run create-admin). Todo admin depois disso é criado pela UI e é um admin comum.',
      columnRole: 'Papel',
      columnCan: 'Pode fazer',
      rows: [
        {
          role: 'Super admin',
          can: 'Tudo o que um admin comum pode, mais: criar, editar e apagar outros admins. Não pode ser apagado pela UI, nem apagar a si mesmo.',
        },
        {
          role: 'Admin',
          can: 'Trabalho operacional: usuários, flux, modos de aprovação dos provedores, a fila de pedidos. Não vê nem toca na lista de admins. Pode trocar a própria senha.',
        },
      ],
      note: 'Admins não são contas de usuário. Têm a própria tabela, o próprio login, e nenhum feed próprio.',
    },
    managingAdmins: {
      heading: 'Gerenciar admins',
      body: 'Só super admin, em /admin/admins:',
      steps: [
        'Criar um admin com um e-mail, um nome e uma senha. É um admin comum — não pode gerenciar outros admins.',
        'Editar o nome, o e-mail ou a senha de um admin.',
        'Apagar um admin. As linhas de super admin e a sua própria linha ficam travadas.',
      ],
      note: 'Um admin comum que precisa trocar a própria senha faz isso em /admin/settings, com a senha atual.',
    },
    fluxApproval: {
      heading: 'Aprovação de flux por provedor',
      intro:
        'Quando um usuário adiciona um flux que ainda não existe, o que acontece depende do modo de aprovação do provedor. Defina-o por provedor em /admin/providers.',
      autoBody:
        'auto — o padrão. A fonte é criada e o usuário assina na hora. Bom para provedores onde qualquer URL serve (RSS, um changelog).',
      manualBody:
        'manual — adicionar um flux desconhecido cria um pedido em vez disso (a app mostra «pedido enviado»). Nada é criado até um admin aprovar. Bom para provedores onde rodar uma fonte custa algo, como o scraping.',
      note: 'Assinar um flux que já existe nunca passa por aprovação — a aprovação só diz respeito a trazer uma fonte nova para a instância.',
    },
    usersAndFluxes: {
      heading: 'Usuários e flux',
      body: 'O resto do console é navegar e curar:',
      items: [
        '/admin/users — cada conta, com os flux que segue. Adicione ou remova uma assinatura em nome de alguém.',
        '/admin/repositories — cada fonte de todos os provedores, com a config dela. Crie uma diretamente (útil para semear um provedor manual), ou aposente uma.',
        '/admin/flux-requests — a fila pendente. Aprovar cria ou reutiliza a fonte e assina o solicitante; rejeitar a marca rejeitada. Ambos são definitivos.',
      ],
    },
    dataSources: {
      heading: 'Bancos de dados secundários',
      intro:
        'O banco de dados principal sustenta a própria instância — admins, usuários, assinaturas, o registro de provedores. Além dele, você pode apontar a instância para bancos de dados secundários somente leitura que carregam apenas dados de conectores, e deixar os usuários seguirem os flux que vivem lá. Eles são geridos em /admin/data-sources.',
      steps: [
        'O banco de dados principal fica no topo da página, apenas a título informativo: seu motor e seu host, nada a mudar.',
        'Adicionar um secundário com um nome e uma string de conexão. São suportados os mesmos quatro motores que para o principal.',
        'Testar a conexão. A instância verifica que consegue se conectar e que há pelo menos uma tabela de conector presente, e lista os provedores que encontrou.',
        'Confirmar. A string de conexão é armazenada cifrada em repouso e a fonte entra na lista. Remova-a quando quiser — as assinaturas que apontavam para ela vão embora com ela.',
      ],
      note: 'Provedores de mesmo nome são fundidos nas apps: um usuário vê um único bloco «RSS» cuja lista de flux reúne os flux de cada banco de dados, e uma linha vinda de um secundário carrega um pequeno selo com o nome do banco de dados. Nunca se escreve de volta em um secundário — é uma alimentação de dados, não uma segunda casa.',
    },

    addingFlux: {
      heading: 'Como um usuário adiciona um flux, de qualquer app',
      intro: 'O mesmo fluxo para todo provedor — não há mais caso especial por provedor nas apps:',
      steps: [
        'Escolher um provedor.',
        'A app mostra os flux que esse provedor já acompanha e que você ainda não segue. Um toque assina — nunca aprovação.',
        'Ou mudar para «adicionar um novo». O campo é guiado pelo descritor form do provedor: o rótulo, o placeholder e o formato que ele espera.',
        'Enviar. Se o provedor é auto, você fica assinado. Se é manual, a app mostra «pedido enviado» e um admin assume.',
      ],
      note: 'Por isso um provedor deveria trazer um descritor form no template dele — é o que transforma uma caixa de texto vazia em «cole um handle do YouTube» ou «cole uma URL de feed».',
    },
  },
  generate: {
    meta: {
      title: 'StayUp — Gerar uma instalação self-hosted',
      description:
        'Escolha um banco de dados e os conectores que quiser e baixe um único script bash que sobe a sua instância do StayUp.',
    },
    eyebrow: 'Instalação',
    title: 'Gere o seu script de instalação',
    lede: 'Escolha um banco de dados e os conectores que quiser. Você recebe um único script bash que clona os repositórios, escreve a configuração do Docker, cria o seu superadministrador e inicia tudo.',
    how: {
      heading: 'O que o script faz',
      items: [
        'Clona a API, os conectores escolhidos e — se você mantiver — a interface web de administração.',
        'Escreve um docker-compose.yml com PostgreSQL, a API, um contêiner por conector e um agendador Ofelia.',
        'Pergunta a conta de superadministrador e a frequência de cada conector.',
        'Aplica o esquema, cria o superadministrador, emite uma chave de conector por provedor e então executa cada conector uma vez para que ele se registre.',
        'Inicia a API, a interface e o agendador.',
      ],
      note: 'Tudo roda na sua máquina no Docker. Nada é enviado a lugar nenhum — a página monta o script no seu navegador.',
    },
    requirements: {
      heading: 'Antes de executar',
      items: [
        'Docker e Docker Compose v2 (`docker compose`).',
        'git.',
        'Linux ou macOS. No Windows, execute o script dentro do WSL.',
      ],
    },
    form: {
      database: 'Banco de dados',
      comingSoon: 'em breve',
      connectors: 'Conectores oficiais',
      customConnectors: 'Seus conectores',
      customHint:
        'Qualquer repositório git com um Dockerfile na raiz cujo ENTRYPOINT executa o coletor uma vez e lê STAYUP_API_URL / STAYUP_API_KEY. A chave que o script emite fica restrita ao nome do serviço, então o nome de provedor do conector precisa coincidir. Veja o guia de provedores.',
      customConnectorAdd: 'Adicionar um conector',
      customUrlPlaceholder: 'https://github.com/voce/seu-conector.git',
      customNamePlaceholder: 'nome (opcional)',
      remove: 'Remover',
      adminUi: 'Incluir a interface web de administração',
      adminUiHint: 'Gerenciar provedores, aprovar pedidos de flux, adicionar administradores.',
      registration: 'Cadastro',
      registrationOpen: 'Aberto',
      registrationOpenHint: 'Qualquer um que alcance a API pode criar uma conta na hora.',
      registrationApproval: 'Sob aprovação',
      registrationApprovalHint: 'Contas novas ficam numa fila até um admin ativá-las.',
      signInMethods: 'Métodos de login',
      emailPassword: 'E-mail + senha',
      oauthHint:
        'O script vai pedir o client ID e o secret do OAuth ao rodar — eles nunca ficam no script.',
      advanced: 'Avançado',
      projectDir: 'Pasta do projeto',
      apiPort: 'Porta da API',
      uiPort: 'Porta da UI',
      dbPort: 'Porta do banco',
      preview: 'stayup-setup.sh',
      download: 'Baixar',
      copy: 'Copiar',
      copied: 'Copiado',
      invalid: 'Não é possível gerar',
    },
    run: {
      heading: 'Execute',
      intro: 'Salve o arquivo e então:',
      note: 'A primeira execução constrói cada imagem e pode levar alguns minutos.',
    },
    after: {
      heading: 'Depois da instalação',
      items: [
        'Docs da API: http://localhost:3000/docs — Interface de administração: http://localhost:3001/admin.',
        'No app desktop ou mobile, defina a URL da API como http://localhost:3000 e crie uma conta.',
        'Adicione feeds pelo app — cada provedor oferece uma lista de flux existentes e um formulário para um novo.',
        'Remova tudo com: docker compose --profile connectors down -v (apaga o banco de dados).',
      ],
      note: 'O agendador monta o socket do Docker para iniciar os conectores no horário — equivalente a root no host, aceitável para uma instância local de desenvolvimento.',
    },
    production: {
      heading: 'Ir para produção',
      intro:
        'O gerador acima põe tudo de pé na tua máquina. Aqui está uma forma de correr a mesma instância alojada, a um custo quase nulo: Neon para PostgreSQL, Cloudflare Workers para a API e GitHub Actions como agendador dos conectores. Cada comando abaixo é para copiar e colar.',
      dbHeading: 'A base de dados — Neon',
      dbSteps: [
        'Cria uma conta Neon e depois um projeto. Escolhe a região mais próxima de onde a API vai correr.',
        'No projeto, ativa o connection pooling e copia a string de ligação «pooled» — o host tem «-pooler». O Workers abre uma nova ligação por pedido; é o endpoint pooled que evita esgotar o PostgreSQL. Esta string é só para a API — os conectores nunca a veem.',
        'A partir da tua máquina, aplica o esquema e cria o primeiro super admin num só comando. É o único passo que tem de correr a partir do Node — o Workers nunca aplica o esquema sozinho:',
        'Esse comando executou src/db/schema.sql e inseriu o admin. Nenhum provedor está registado ainda — é a primeira execução de um conector que o faz (passo 3).',
      ],
      dbNote:
        'O plano gratuito da Neon suspende a base de dados quando está inativa; o primeiro pedido após uma pausa demora cerca de um segundo a acordá-la. Sem problema para uma instância pessoal.',
      apiHeading: 'A API — Cloudflare Workers',
      apiSteps: [
        'Faz fork de stayup-app/stayup-api no GitHub — fork, não só clone, se quiseres deploy no push mais tarde.',
        'Instala o Wrangler e inicia sessão com a tua conta Cloudflare, depois envia os secrets. São guardados pela Cloudflare, nunca escritos no repo:',
        'As definições não secretas — UI_URL, INSTANCE_NAME, REGISTRATION_MODE — vão no wrangler.toml em [vars]:',
        'Faz deploy. O Wrangler imprime o URL:',
        'Para deploy no push: em Settings → Secrets and variables → Actions do fork, adiciona CLOUDFLARE_API_TOKEN (dashboard Cloudflare → My Profile → API Tokens → modelo «Edit Cloudflare Workers»). O ci.yml já presente no repo testa e volta a fazer deploy a cada push para main.',
      ],
      apiNote:
        'Só o driver PostgreSQL vem incluído para Workers — o runtime não consegue abrir sockets MySQL ou MongoDB. No Workers, a base de dados é PostgreSQL.',
      connHeading: 'Os conectores — GitHub Actions',
      connIntro:
        'Um conector é um script Python que lê STAYUP_API_URL e STAYUP_API_KEY, faz uma ronda contra a API e termina. Precisa de algo que o execute de forma agendada; o GitHub Actions faz isso de graça com schedule: e workflow_dispatch:. Cada repo stayup-cmd-* já traz .github/workflows/daily.yml.',
      connSteps: [
        'Na UI de admin (ou POST /ui/connector-keys), emite uma chave de conector por cada provedor que vais executar — rss, youtube, etc. Cada segredo é mostrado uma única vez.',
        'Faz fork de cada conector que queres: stayup-cmd-rss, stayup-cmd-youtube, stayup-cmd-changelog, stayup-cmd-github-trending, stayup-cmd-scrap.',
        'Em cada fork: Settings → Secrets and variables → Actions → New repository secret. Adiciona STAYUP_API_URL (o teu URL do Workers) e STAYUP_API_KEY (a chave desse provedor).',
        'O workflow já lá está — é só isto:',
        'Define a cadência com a linha cron: (em UTC). Escalona os conectores para não baterem na API no mesmo minuto:',
        'Arranca-o: separador Actions → o workflow → Run workflow. A primeira execução regista o provedor na API; depois, o provedor aparece nas apps e em GET /connectors/providers.',
        'O GitHub pausa os workflows agendados de um repo sem atividade durante 60 dias. Um commit ou uma execução manual rearma-os.',
      ],
      connNote:
        'As execuções agendadas são postas em fila, não são exatas — sob carga o GitHub pode atrasar um cron vários minutos. Para um leitor de feeds não faz diferença.',
      checkHeading: 'Verificar toda a cadeia',
      checkSteps: [
        'curl https://<api>/ devolve {"status":"ok"} — a API chega à Neon.',
        'curl https://<api>/connectors/providers com um bearer token de admin lista cada conector que correu pelo menos uma vez.',
        'Numa app StayUp, define o servidor para o teu URL do Workers, cria uma conta, adiciona um feed. A subscrição chega à base de dados; a execução seguinte do conector recolhe-a.',
        'Para a UI de admin, faz deploy do stayup-ui em qualquer lado (Vercel num clique), define STAYUP_API_URL para o teu URL do Workers e abre /admin.',
      ],
      checkNote:
        'Em repouso não custa nada: plano gratuito da Neon, plano gratuito do Workers (100k pedidos/dia) e o GitHub Actions é gratuito para repos públicos.',
    },
  },
  providers: {
    meta: {
      title: 'StayUp — Provedores',
      description:
        'Escrever um programa que transforma qualquer fonte externa em conteúdo do StayUp.',
    },
    eyebrow: 'Provedores',
    title: 'Conectar uma fonte nova',
    lede: 'Um provedor é um programa que vai buscar um tipo de fonte e guarda o que encontra. É a única coisa que você escreve para estender o StayUp — a API e as três apps o pegam sozinhas.',
    what: {
      heading: 'O que um provedor realmente é',
      body: 'Não um plugin, não um módulo a registrar: um programa comum, em qualquer linguagem, iniciado por agendamento. Ele pede à API as fontes destinadas a ele, vai buscar cada uma, guarda o que é novo, e devolve à API. A API o pega sozinha, e as três apps o exibem — sem uma linha de código mudar em lugar nenhum.',
      note: 'Um provedor só fala com a API do StayUp, por HTTP, com uma chave de conector. Nunca toca no banco de dados.',
      diagram: {
        title: 'Um provedor, passo a passo',
        sources: 'As fontes dele, obtidas da API',
        sourcesItems: 'os feeds de podcast que este provedor recebeu ordem de acompanhar',
        fetch: 'Ir buscar cada feed',
        compare: 'Guardar só o que não estava antes',
        store: 'Devolver à API',
        exposed: 'A API o expõe, as apps o exibem',
      },
      steps: {
        heading: 'A cada execução',
        items: [
          'Registrar seu nome de exibição e seu template na API.',
          'Pedir à API as fontes destinadas a você.',
          'Ir buscar cada uma no mundo externo.',
          'Perguntar à API onde você parou, e guardar só o novo.',
          'Devolver os itens novos à API, em um lote.',
          'Pedir à API para remover o que envelheceu, e reportar uma falha em vez de quebrar nela.',
        ],
      },
    },
    access: {
      heading: 'Antes de começar: do que você precisa?',
      body: 'Um provedor precisa da URL da instância que alimenta e de uma chave de conector para o seu nome, emitida por um admin dessa instância. Na instância pública você não tem isso, então na prática um provedor seu anda junto com uma instância sua. Escrever um não exige nada do guia de instalação; rodar um exige uma chave na instância que você alimenta.',
      cta: 'Guia de instalação',
    },
    existing: {
      heading: 'Exemplos concretos para ler',
      body: 'O tutorial passo a passo constrói um conector inteiro para o Hacker News a partir de uma pasta vazia — o caminho mais rápido. Depois leia os reais — changelog, youtube, rss, scrap, github-trending — que é o que a instância de referência por acaso roda, não uma definição do que o StayUp cobre. O rss é o exemplo real mais curto do contrato abaixo; github-trending é a referência para um template de exibição rico.',
      cta: 'Seguir o tutorial',
    },
    creating: {
      heading: 'Escrever o seu',
      naming: {
        heading: 'Escolher um nome',
        intro:
          'Algo curto e minúsculo, usável como identificador — podcast, hackernews, reddit_thread. Essa única string é usada como está em vários lugares:',
        columnWhere: 'Onde',
        columnExample: 'Para «podcast»',
        rows: [
          'O caminho de API que o seu script chama',
          'As fontes que são suas',
          'Sua linha no registro',
          'O campo provider que as apps enviam ao adicionar um flux',
        ],
        note: 'Nada a reservar de antemão: o nome é simplesmente aquele ao qual a sua chave de conector está vinculada e o que você registra. Dois provedores só colidem escolhendo o mesmo.',
      },
      shape: {
        heading: 'O que você guarda',
        body: 'Uma linha por item encontrado. O conteúdo em si pode ser texto puro ou JSON — você decide; a API nunca o analisa. Sem template de exibição as apps mostram um cartão simples: o começo do conteúdo, a data, seu nome de exibição. Funciona, só é visualmente sóbrio, e mostra JSON cru se for isso que o seu conteúdo contém. Um template resolve isso, e é a próxima seção.',
      },
      schedule: {
        heading: 'Rodá-lo por agendamento',
        body: 'Copie qualquer coletor existente: um Dockerfile na raiz cujo ENTRYPOINT executa o script uma vez, e um job que o inicia com STAYUP_API_URL e STAYUP_API_KEY no ambiente. Nada impõe uma CI específica — um timer do systemd, um cron puro, ou o contêiner Ofelia do gerador fazem o mesmo.',
      },
    },
    templates: {
      heading: 'Templates de exibição',
      body: 'Um template é um manifesto JSON que o seu provedor envia no campo template da sua chamada register. A API o guarda em provider_registry.template e o repassa como está via GET /connectors/providers; cada app tem um motor que o lê e renderiza as suas linhas — um layout em lista, e um painel de leitura em um de sete modos: texto, html, mídia, áudio, galeria, tabela, lista de links. Nenhum código das apps conhece o nome do seu provedor.',
      fallbackNote:
        'Um provedor sem template (nunca enviado, JSON ilegível, ou uma version não reconhecida) funciona mesmo assim — as apps recorrem ao cartão simples. Um template é muito recomendável assim que o seu conteúdo é algo além de uma linha curta de texto.',
      cta: 'Referência completa de templates',
    },
    form: {
      heading: 'O descritor form',
      body: 'Dentro do template, um pequeno bloco form diz às apps como o campo «adicionar um novo flux» deve parecer para o seu provedor. Sem ele, o usuário tem uma caixa de texto vazia; com ele, um campo rotulado que valida e constrói a URL da fonte por ele.',
      fields: [
        {
          field: 'label · placeholder',
          meaning: 'o que o campo diz e o que mostra como dica.',
        },
        {
          field: 'urlTemplate',
          meaning:
            'ex.: https://www.youtube.com/@{value} — {value} é o que o usuário digitou. Ignorado se o valor já for uma URL http(s).',
        },
        {
          field: 'pattern',
          meaning:
            'uma regex que a entrada transformada deve satisfazer, verificada no cliente antes de enviar.',
        },
        {
          field: 'transform',
          meaning:
            'trim, remover um prefixo/sufixo conhecido, ou extrair um grupo de captura — para que uma URL completa colada e um handle puro terminem iguais.',
        },
      ],
      note: 'As apps guardam a URL construída como fonte; o seu coletor a recebe na sua lista de fontes como qualquer outra.',
    },
    fluxApproval: {
      heading: 'Modo de aprovação',
      body: 'Todo provedor tem um modo flux_approval no registro: auto (padrão) ou manual. auto assina o usuário na hora quando ele adiciona um flux novo; manual transforma isso num pedido que um admin deve aprovar. É um ajuste de operador — um conector não pode defini-lo por si; um admin o define por instância em /admin/providers. O scraping vem semeado em manual por um motivo — rodar uma fonte ali custa algo.',
      note: 'Isso só controla trazer uma fonte nova. Assinar uma fonte que já existe nunca passa por aprovação.',
    },
    contract: {
      heading: 'Contrato técnico',
      lede: 'Material de referência. Você precisa disto para escrever um provedor, não para entender o StayUp.',
      diagramTitle: 'O que o seu script chama',
      yourScript: 'Seu provedor',
      announce: 'Anunciar-se',
      read: 'Ler',
      write: 'Escrever',
      seed: 'Semear',
      announceDesc: 'registrar o seu nome de exibição + template, a cada execução',
      readDesc: 'as fontes a coletar, e onde você parou',
      writeDesc: 'linhas novas, um merge de config, retenção, erros',
      seedDesc: 'acompanhar uma URL nova — a flag --add',
      warning:
        'O conector não guarda credenciais de banco de dados e não conhece nenhum nome de tabela. Sua chave só funciona sob /connector-api/<o próprio nome>/*: não pode escrever por outro provedor, nem alcançar os usuários, admins ou assinaturas.',
      authHeading: 'Autenticação',
      authBody:
        'Um admin emite uma chave de conector para o nome do seu provedor (UI de admin → Chaves de conector, ou POST /ui/connector-keys). O segredo, stayup_conn_…, é mostrado uma única vez. Seu script o envia como Authorization: Bearer <chave> em toda chamada, e o lê — junto com a URL da instância — de STAYUP_API_KEY e STAYUP_API_URL.',
      endpointsHeading: 'Os endpoints',
      endpointsIntro:
        'Todos sob /connector-api/<name>/, todos exigem a chave. Mais ou menos na ordem em que uma execução os usa.',
      columnCall: 'Chamada',
      columnPurpose: 'O que faz',
      endpointPurposes: [
        'Anunciar-se: nome de exibição, ordem, template opcional. Idempotente — chame a cada execução. sortOrder não é sobrescrito depois de definido; template só é substituído se o campo estiver presente.',
        'Acompanhar uma URL nova. Idempotente na URL: 201 se criada, 200 se já existia, 409 se outro provedor a possui.',
        'Sua lista de fontes a coletar nesta execução — cada uma com id, url e config.',
        'A última versão guardada para essa fonte, ou null na primeira execução — onde retomar.',
        'Toda versão já guardada para essa fonte — para um conector que preenche lacunas em vez de só retomar após a mais recente.',
        'Funde (shallow merge) chaves na config dessa fonte (p. ex. guardar o título do canal para o rótulo). Nunca uma substituição completa.',
        'Escreve um lote de linhas coletadas. content é uma string opaca que a API nunca analisa.',
        'Poda as linhas mais antigas que retentionDays para essa fonte.',
        'Registra uma falha de coleta. Vai parar no registro de erros da API.',
      ],
      itemHeading: 'A forma de um item',
      itemIntro: 'Cada linha no lote POST /connector-api/<name>/items:',
      required: 'obrigatório',
      optional: 'opcional',
      itemFieldDescriptions: [
        'o id da fonte, da sua lista de fontes.',
        'uma string opaca — texto puro ou uma string JSON, você escolhe.',
        'timestamp ISO desta execução.',
        'se a obtenção dessa fonte teve sucesso.',
        'a chave de deduplicação; também mostrada ao lado dos renders ricos (uma tag de versão, um id de vídeo).',
        'o timestamp próprio do conteúdo, preferido a executedAt ao ordenar por «o mais recente».',
        'JSON livre; hoje só o provedor de scraping o usa.',
      ],
      addingSources: {
        heading: 'Trazer fontes',
        body: 'Duas maneiras. Uma flag --add que chama POST /connector-api/<name>/sources e sai — prática para semear pela linha de comando. A outra, a que os usuários finais realmente tomam, é adicionar uma fonte por uma app, que faz POST em /ui/users/<userId>/repositories; o campo provider deve ser igual ao seu nome, e passa pelo fluxo de aprovação auto/manual.',
      },
      checklist: {
        heading: 'Antes de dar por pronto',
        items: [
          'chamado a cada execução, com o seu nome de exibição e (recomendado) o seu template.',
          'dá a você as fontes a coletar nesta execução.',
          'envia linhas novas em um lote, deduplicadas contra a versão guardada.',
          'diz onde você parou para cada fonte.',
          'poda entradas antigas — ou a ausência de retenção está documentada.',
          'falhas por fonte reportadas em vez de derrubar a execução.',
          'lista o seu provedor após uma execução.',
        ],
      },
    },
  },

  tutorial: {
    meta: {
      title: 'StayUp — Escrever um conector',
      description:
        'Um conector StayUp completo e funcional para o Hacker News, construído a partir de uma pasta vazia — copie cada passo.',
    },
    eyebrow: 'Providers',
    title: 'Escrever um conector, passo a passo',
    lede: 'Um arquivo, cerca de 90 linhas, sem chave de API própria. Ele segue listas do Hacker News (top, best, new…), guarda as histórias que ainda não viu, e as entrega ao stayup-api. Copie cada bloco em ordem; o arquivo inteiro está no fim.',

    intro: {
      heading: 'O que você está construindo',
      body: 'Um conector chamado hackernews. Cada fonte seguida é um endpoint de lista do Hacker News — https://hacker-news.firebaseio.com/v0/topstories.json e afins. A cada execução o script lê a lista, obtém as histórias mais recentes que ainda não guardou, e as envia. Ele só fala com o stayup-api por HTTP; nunca toca no banco de dados.',
      note: 'A API Firebase do Hacker News não precisa de chave nem de User-Agent e não tem limite de requisições — por isso é um bom primeiro alvo.',
    },

    prereqs: {
      heading: 'Antes de começar',
      items: [
        'Python 3.11+ e pip.',
        'Uma instância stayup-api acessível (a pública ou a sua).',
        'Uma chave de conector para o provedor hackernews, criada na administração dessa instância: Chaves de conector → Nova chave, provedor hackernews. O segredo é mostrado uma única vez.',
      ],
    },

    steps: {
      heading: 'Os passos',
      setup:
        'Prepare a pasta e aponte duas variáveis de ambiente para a sua instância e a chave dela.',
      helper:
        'Um único arquivo, check_hn.py. Comece pelos imports e um único helper api() — toda chamada ao stayup-api passa por ele, com a chave Bearer.',
      template:
        'A cada execução o conector se anuncia: seu nome de exibição e um template de exibição — o JSON a partir do qual as apps renderizam suas linhas, sem código por app. O stayup-api o guarda e o repassa como está.',
      fetch:
        'A única parte específica do Hacker News: ler um endpoint de lista, obter cada história e montar uma linha. version é a chave de deduplicação — o id da história como string. content é uma string JSON opaca; o template acima diz às apps como lê-la.',
      collect:
        'Para cada fonte seguida: perguntar à API quais versões ela já tem, ficar só com as histórias novas, e enviá-las em um lote. Uma falha em uma fonte é reportada à API, não levantada.',
      main: 'O ponto de entrada: register, e então ou --add um endpoint de lista ou uma passagem de coleta.',
    },

    run: {
      heading: 'Executar',
      body: 'Siga uma ou duas listas, e então faça uma execução real. O provedor agora existe — aparece em GET /connectors/providers e nas apps, e um usuário pode assinar.',
      note: 'Este conector guarda no máximo STORIES_PER_RUN linhas por execução e nunca apaga; podar o conteúdo antigo é um assunto à parte — veja o contrato do provedor.',
    },

    schedule: {
      heading: 'Colocar num agendador',
      body: 'Adicione um Dockerfile se quiser conteinerizá-lo, e um workflow do GitHub Actions agendado — ou qualquer cron. Coloque STAYUP_API_URL e STAYUP_API_KEY como segredos do repositório.',
    },

    full: {
      heading: 'O arquivo inteiro',
      body: 'check_hn.py de uma vez — os seis blocos acima, em ordem.',
    },

    next: {
      heading: 'A partir daqui',
      body: 'Troque fetch_stories pela sua própria fonte e ajuste o template — é todo o trabalho. Os 5 coletores que a instância de referência roda (changelog, youtube, rss, scrap, github-trending) são exemplos mais completos; rss é o mais curto. O contrato que todo conector segue está na página de provedores.',
      cta: 'O contrato do provedor',
    },
  },
}
