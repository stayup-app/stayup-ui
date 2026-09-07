import type { DocContent } from './en'

export const ja: DocContent = {
  common: {
    onThisPage: 'このページの内容',
    backToDocs: 'ドキュメントに戻る',
    docsHome: 'ドキュメント',
  },
  home: {
    meta: {
      title: 'StayUp — ドキュメント',
      description:
        'StayUp とは何か、各部品がどう噛み合うか、そして次にどこへ行くか：自分のインスタンスを動かす、運用する、あるいはプロバイダーを書く。',
    },
    eyebrow: 'ドキュメント',
    title: 'StayUp のしくみ',
    lede: 'StayUp は、多様な外部ソース — リリースノート、動画、フィード、スクレイプしたページ、プログラムが読めるもの何でも — を一人ひとりのフィードに変えます。このページは考え方と用語を示します。そのあと必要な道を選んでください。',
    concept: {
      heading: '4 文で言うと',
      points: [
        'StayUp はあなたがフォローするソースの新しいコンテンツを表示します。何がソースかは固定されておらず、あるプロバイダーが取得できるものすべてです。',
        'プロバイダーは、ある種類のソースを取得し、見つけたものをインスタンスの API に HTTP で送る小さなプログラムです — データベースには決して触れません。新しい種類のソースに対応するとはプロバイダーを書くこと。StayUp の他は何も変わりません。',
        'StayUp API はデータベースを所有し、アプリに提供します。ソースの種類をハードコードせず、プロバイダーは登録するかコンテンツを送った時点で存在し、API は各プロバイダーの表示マニフェストをそのまま返します。',
        'アプリ — Web、デスクトップ、モバイル — は API を読みます。どのアプリも任意のインスタンス、つまり任意のデータベースに向けられ、名前も知らないプロバイダーを表示できます。',
      ],
      note: 'ソースの集合は構造上開かれています。インスタンスは、そのデータベースに対して動くプロバイダーだけを正確に表示します — 組み込みの一覧も、中央機関への登録もありません。',
      diagram: {
        title: 'ソースからあなたの画面まで',
        sources: '外部ソース',
        sourcesItems:
          'ポッドキャストのフィード · フォーラムのスレッド · ステータスページ · プログラムが読めるもの何でも',
        providers: 'プロバイダー',
        providersSub: 'ソースの種類ごとに 1 つの小さなプログラム、スケジュール実行、HTTP 経由',
        database: 'データベース',
        databaseSub: 'PostgreSQL、MySQL、SQLite、MongoDB — API が保存するものすべてを 1 か所に',
        api: 'StayUp API',
        apiSub: 'プロバイダーが送るものを受け取り、アプリに提供し、何もハードコードしない',
        apps: 'Web · デスクトップ · モバイル · 管理',
        appsSub: 'それぞれ別のインスタンスに設定可能',
      },
    },
    vocabulary: {
      heading: '用語を一度きり固定する',
      intro: 'これらの語はあちこちに出てきて混同されやすいものです。StayUp での意味は次のとおり。',
      columnTerm: '用語',
      columnMeaning: '意味',
      terms: [
        {
          term: 'インスタンス',
          meaning:
            '1 つのデータベース + その前段の 1 つの API + それを供給するプロバイダー群。公開インスタンスがその 1 つ。あなたのものは別の 1 つ。インスタンス同士は決して通信しません。',
        },
        {
          term: 'プロバイダー（別名コネクター）',
          meaning:
            'ある種類のソースを取得し、コネクター鍵で認証して API に行を送る独立したプログラム。「コネクター」と「プロバイダー」は同じもので、リポジトリ名は stayup-cmd-* です。',
        },
        {
          term: 'ソース（別名 flux）— repository の行',
          meaning:
            '追跡される 1 つの対象：特定のフィード URL、チャンネル、ページ。共有テーブル repository の行として保存され、type はプロバイダー名と等しくなります。',
        },
        {
          term: '購読',
          meaning:
            'ユーザーとソースの結び付き：「この人はこの flux をフォローする」。アプリで flux を追加すると購読が作られます（存在しなければソース自体も）。',
        },
        {
          term: '表示テンプレート',
          meaning:
            'プロバイダーが API に登録する任意の JSON マニフェスト（provider_registry.template に保存）。行をどう描画するかをアプリに伝えます。テンプレートなし → 素朴な汎用カード。',
        },
        {
          term: '管理者',
          meaning:
            'インスタンスの運用者。最初の 1 人（スーパー管理者）はコマンドラインで作成し、残りは管理用 Web UI で管理します。ユーザーアカウントとは別物です。',
        },
      ],
    },
    paths: {
      heading: 'どの道が必要ですか？',
      installTitle: '自分のインスタンスを動かす',
      installBody:
        '自分の API と自分のデータベース。データは自分のもので、そこに対して何を動かすかも自分で決めます。完全なローカル手順つき。',
      installCta: 'インストールガイド',
      generateTitle: 'セットアップスクリプトを生成',
      generateBody:
        'ガイド付きの道：データベースと必要なコネクターを選ぶと、スタック全体を立ち上げる単一の bash スクリプトが手に入ります。',
      generateCta: 'セットアップジェネレーター',
      adminTitle: 'インスタンスを運用する',
      adminBody:
        '管理用 Web UI：管理者の管理、どのプロバイダーが新しい flux を自由に受け入れるかの決定、承認キューの処理、ユーザーと flux の整理。',
      adminCta: '管理ガイド',
      providersTitle: '新しいソースをつなぐ',
      providersBody:
        'プロバイダーを書く — StayUp がまだカバーしていないソースを取得し、見つけたものを保存するプログラム。表示テンプレートを含む。',
      providersCta: 'プロバイダーガイド',
      relation:
        'インスタンスの運用とプロバイダーを書くことは関連していますが別物です。書くのにインストールガイドは要りません — API を呼ぶだけのプログラムです。動かすのは別の話：供給先のインスタンスでのコネクター鍵が必要で、公開インスタンスではそれがありません。実際には、自分のプロバイダーは自分のインスタンスとセットになります。',
    },
  },
  install: {
    meta: {
      title: 'StayUp — インストール',
      description:
        '自分の StayUp インスタンスを立ち上げる：各部品、完全なローカル手順、4 つのデータベース、設定、そしてアプリの向け方。',
    },
    eyebrow: 'インストール',
    title: '自分のインスタンスを動かす',
    lede: 'インスタンスとは、データベース、その前段の API、供給のために選んだプロバイダー、そして — ブラウザから運用したいなら — 管理用 Web UI です。このページはその全体を、ローカルで、端から端まで進みます。',
    why: {
      heading: 'なぜわざわざ',
      intro:
        '公開インスタンスには独自のプロバイダーと独自のデータがあります。自分のを動かすと次ができます：',
      items: [
        '自分が管理するデータベースにすべてを保つ；',
        'どのプロバイダーがどの頻度で動くかを選ぶ；',
        '公開インスタンスがカバーしないソースをフォローする；',
        'プロバイダーごとの承認で、誰が何を追加できるかを決める；',
        'Web・デスクトップ・モバイルのアプリをそこに向ける — 設定 1 つ、コード変更なし。',
      ],
      note: 'インスタンス同士は通信しません。空のデータベースとプロバイダーなしから始まり、1 つ動かすまでそのままです。',
    },
    pieces: {
      heading: '4 つの部品',
      database: 'データベース',
      databaseBody:
        'すべてを保持します：追跡中のソース、収集したコンテンツ、アカウント、管理者。PostgreSQL、MySQL/MariaDB、SQLite、MongoDB — API は指定したものに適応します。',
      api: 'StayUp API',
      apiBody:
        'そのデータベースの上にある薄いステートレスな層。プロバイダー名をハードコードせず、リクエストごとにデータベースに何があるかを尋ねます。Node、Docker、または Cloudflare Workers で動きます。',
      providers: 'プロバイダー',
      providersBody:
        '実際にインスタンスを満たすプログラム。独立したリポジトリで、スケジュール実行され、API とだけ話します — 管理者が発行するコネクター鍵つきで。最低 1 つないと、インスタンスは動いても何も表示しません。',
      adminUi: '管理用 Web UI（任意）',
      adminUiBody:
        '/admin で開く Web アプリのデプロイ。管理者の管理、各プロバイダーの承認モードの設定、flux 申請キューの処理、ユーザーと flux の整理ができます。省いても API は動きます — ブラウザのコンソールを失うだけです。',
    },
    fastPath: {
      heading: '手早い道',
      body: 'とにかく動かしたいなら、セットアップジェネレーターがいくつか質問し、以下のすべてを代わりに行う単一の stayup-setup.sh を渡します — クローン、compose、スキーマ、スーパー管理者、コネクターの初回実行、スケジューラー。',
      cta: 'セットアップジェネレーターを開く',
    },
    walkthrough: {
      heading: '完全なローカル手順',
      intro:
        '手作業で、可動部を一つずつ見えるように。ここでは PostgreSQL と Docker。同じ手順は対応するどのエンジンでも動きます。',
      steps: [
        'API をクローン：git clone https://github.com/stayup-app/stayup-api.git && cd stayup-api',
        '.env.example を .env にコピーし、DATABASE_URL と JWT_SECRET（openssl rand -hex 32）を設定。管理者のユーザー名やパスワードを設定する項目はありません — 管理者はデータベースに存在します。',
        'データベースと API を起動：docker compose up -d db api。compose ファイルは初回 init で Postgres にスキーマを流し込み、API はポート 3000 で待ち受けます。',
        'その自動 init に頼らなかった場合は、スキーマを一度自分で適用：psql "$DATABASE_URL" -f src/db/schema.sql。追加のみなので何度でも安全に実行できます。',
        '最初のスーパー管理者を作成：npm run create-admin -- root@example.com "Root" \'強いパスワード\'。管理用 Web UI を管理するアカウントです。',
        'コネクター鍵を発行。管理用 Web UI で コネクター鍵 → 新しい鍵、プロバイダー rss — または POST /ui/connector-keys。シークレット（stayup_conn_…）は一度だけ表示されるのでコピーします。',
        'プロバイダーを追加。1 つクローン — git clone https://github.com/stayup-app/stayup-cmd-rss.git — STAYUP_API_URL を http://localhost:3000 に、STAYUP_API_KEY を上の鍵に設定し、依存関係を入れ、次を実行：python fetch_rss.py --add https://blog.example.com/feed.xml と python fetch_rss.py。最初の本番実行がプロバイダーを API に登録し、その後収集します。',
        'API が認識したか確認：curl localhost:3000/connectors/providers に rss と表示マニフェストが並ぶはずです。',
        'デスクトップアプリを開き、プロフィール → API URL に http://localhost:3000 を貼り付け、保存。アカウントを作り、flux を追加 — コネクターが実行されると rss のエントリが現れます。',
        'コネクターを動かし続けるよう予定：cron エントリ、systemd タイマー、GitHub Actions のスケジュール、またはジェネレーターが用意する Ofelia コンテナ。',
      ],
      note: 'API はコネクターを起動しません。コネクターは独自のスケジュールで動く別プログラムで、API から必要なのはその URL とコネクター鍵だけです。',
    },
    requirements: {
      heading: '必要なもの',
      items: [
        '下の一覧のデータベース。API が動く場所から到達可能なもの。',
        'Docker、またはコンテナを使わないなら Node.js 22 以降。',
        '任意で Cloudflare アカウント。参照インスタンスのように Workers にデプロイする場合。',
      ],
    },
    databases: {
      heading: 'どのデータベース',
      intro:
        'API は直接 SQL を話しません。ストレージ契約を呼び出し、それをエンジンごとのアダプターが満たします。どのアダプターになるかは DATABASE_URL のスキームが決めます。標準で 4 つのエンジンが同梱されています：',
      columnEngine: 'エンジン',
      columnScheme: 'URL スキーム',
      columnDriver: '入れるドライバー',
      note: 'どのエンジンも同じ適合スイートを通過します — 同じ振る舞いを、本物の PostgreSQL、MySQL、SQLite、MongoDB に対して CI で検証。だから選択は可逆です：テーブル、コレクション、カラムの名前はどこでも同じで、プロバイダーは一度記述すれば方言だけが変わります。',
      workersNote:
        '例外が 1 つ、そしてそれは私たちのせいではありません：Cloudflare Workers は PostgreSQL が使う種類の接続しか開けません。MySQL、SQLite、MongoDB のドライバーには Node が必要です — Docker か素の Node.js で、Workers ではありません。',
    },
    env: {
      heading: '設定',
      columnVariable: '変数',
      columnRequired: '必須',
      columnDescription: '説明',
      yes: 'はい',
      no: 'いいえ',
      descriptions: [
        'スキームがエンジンを選びます：postgres://、mysql://、sqlite://、mongodb://。Node と Docker のビルドは PostgreSQL 向けに DB_HOST、DB_PORT、DB_NAME、DB_USER、DB_PASSWORD を個別に受け付けます。',
        '認証トークンに署名するランダムなシークレット。openssl rand -hex 32 で生成。インスタンスの寿命の間は変えないこと — 変えると既存のトークンはすべて無効になります。',
        'Web デプロイの公開 URL。OAuth のリダイレクト先としてのみ使用。Google や GitHub ログインを有効にしないなら省略可。',
        '「Google でログイン」を有効にします。無効にするには空のまま。',
        '「GitHub でログイン」を有効にします。無効にするには空のまま。',
      ],
      note: '管理者のユーザー名やパスワードの変数はありません。旧来の API_USERNAME / API_PASSWORD の組はなくなりました：管理者はデータベースの行で、最初の 1 人は npm run create-admin で作成します。通常ユーザーのメール＋パスワードのログインは、OAuth 変数をどうしようと常に機能します。',
    },
    deploy: {
      heading: 'API をデプロイ',
      tabs: ['Docker Compose', 'Cloudflare Workers', '素の Node.js'],
      dockerIntro: '最短の道：クローン、.env を埋める、起動。',
      dockerNote:
        'compose ファイルはスキーマを Postgres の init ディレクトリにマウントするので、ボリュームが初期化される最初の一度でコアのテーブルが作られます。その後 API はポート 3000 で待ち受けます。次にスーパー管理者を作成 — 下記参照。',
      workersIntro: '参照インスタンスが動かしているもの。',
      workersNote:
        'データベースは Cloudflare のネットワークから到達可能である必要があります — プール接続文字列を持つマネージドプロバイダーが定番の答えです。Workers は家庭内ネットワークのデータベースには到達できず、create-admin スクリプトも実行できません：スーパー管理者は自分のマシンからデータベースに対して作成してください。',
      nodeIntro: 'オーケストレーションなし、ビルド済みサーバーだけ。',
      nodeNote:
        'または、Compose なしでコンテナを動かしたいなら、同梱の Dockerfile を自分でビルドしてください。ビルド済みイメージには create-admin スクリプトも入っています。',
    },
    schema: {
      heading: 'テーブルを作り、最初の管理者を作る',
      applyIntro:
        'Compose の自動 init に頼らないなら、スキーマを一度自分で適用します。エンジンごとに 1 ファイル、テーブル名とカラム名はどれも同じ：',
      applyNote:
        'SQL ファイルは追加のみ — CREATE TABLE IF NOT EXISTS、ADD COLUMN IF NOT EXISTS — なのでいつでも再実行して安全。すでにデータのあるデータベースに対しても安全です。',
      engineNotes: [
        '参照スキーマ。バージョン 14 以降。',
        'MySQL 8 または MariaDB 10.2 以降：API はウィンドウ関数でコンテンツを並べます。',
        'ホストするものなし — API のそばの 1 ファイル。個人インスタンスには良いが、複数箇所から同時にアプリが叩くものには不向き。',
        '適用するスキーマなし：MongoDB は最初の書き込みでコレクションを作ります。重要なのはインデックスだけで、API は接続時に自分で作ります — 上のコマンドは前もって行うだけです。',
      ],
      adminIntro:
        '管理者は admin テーブルの行で、既定のアカウントはありません。最初の 1 人 — 常にスーパー管理者 — をコマンドラインで作成します。先にスキーマを適用してから行を挿入します：',
      userIntro:
        '通常のユーザーアカウントはアプリのサインアップフォームから作成します。フォームなしでテスト用に作るには：',
      verifyIntro: '次に API が応答するか確認します：',
      verifyNote:
        'ここでプロバイダー一覧が空なのは想定どおりの応答です：まだ何も収集していません。それがプロバイダーガイドです。',
    },
    auth: {
      heading: 'ユーザーと認証',
      intro:
        'あなたのインスタンスで people がどうアカウントを得るか、そして Google や GitHub でのサインインをどう有効にするか。',
      registration: {
        heading: '登録モード',
        body: 'REGISTRATION_MODE が公開登録の挙動を決めます。open（既定）：アカウントが作られ、その場でサインインします — 現在の挙動です。approval：登録は保留されます。POST /auth/register はトークンなしで 202 を返し、OAuth 登録は ?error=pending_approval で戻り、待機中のメールでのログイン試行は 403 を返します。管理者は /admin/users →「Comptes en attente」でキューを処理します。管理者が作ったアカウントはモードに関わらず常に有効です。検証済みメールが既存の有効なアカウントに一致する OAuth 登録も同様です。',
      },
      pointing: {
        heading: 'アプリがどこにサインインするか',
        body: 'デスクトップ／モバイルアプリ、そして Web のログイン・登録ページは、いずれもサインイン画面に「サーバー」の行を持ちます。API のホストを表示し、変更・リセットの入力欄に展開します — アカウントが存在する前に、です。だから誰も既定の API に先にサインインする必要はありません。各画面は設定中のインスタンスの GET /auth/config を読み、そのインスタンスが提供するサインイン方法だけを表示します。ホスト型 Web アプリは SSRF 対策として、依然としてプライベートホスト（localhost、10.x、192.168.x…）を拒否します：Web UI をローカル API に向けるには、デプロイ時に STAYUP_API_URL を設定した stayup-ui の自前コピーを動かしてください。',
      },
      oauth: {
        heading: 'Google と GitHub でのサインイン',
        intro:
          '任意。各プロバイダーには、あなたが所有する OAuth アプリと、API 上の 4 つの環境変数が必要です：',
        steps: [
          'OAuth アプリを作成 — Google は console.cloud.google.com/apis/credentials、GitHub は github.com/settings/developers。',
          'コールバック（またはリダイレクト）URL を https://<あなたの API のオリジン>/auth/oauth/<provider>/callback に設定。どちらのプロバイダーも開発用に http://localhost を許可します。',
          'client ID と secret を API 上の GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET（または GITHUB_ の組）に入れます。',
          'UI_URL を Web デプロイのオリジンに設定 — ブラウザ OAuth の後、API は UI_URL/api/auth/callback にリダイレクトします。デスクトップアプリはこのパスを自分で横取りするので、空でない UI_URL なら何でも動きます。モバイルアプリは自前の stayup:// ディープリンクを使い、すでに許可リストに入っています。',
        ],
        note: 'GitHub の OAuth アプリはコールバック URL をちょうど 1 つしか許しません。したがって API オリジンごとに GitHub アプリが必要です。セットアップジェネレーターは実行時にこれらの資格情報を尋ね、スクリプトではなく docker-compose.yml に直接書き込みます。',
      },
    },

    pointing: {
      heading: 'アプリを自分のインスタンスに向ける',
      items: [
        'Web：デプロイに STAYUP_API_URL を設定 — または設定せず、各訪問者にプロフィールから上書きさせる（ブラウザごとに保存）。',
        '3 つのアプリすべて：サインイン画面の「サーバー」の行、またはサインイン後のプロフィール →「サーバー」。ここで各サーバーを設定・改名・リセットできます。',
        '管理用 Web UI は同じ Web アプリ：その STAYUP_API_URL を自分の API に向けて /admin を開きます。',
        '1 つのアプリで複数インスタンス：プロフィール →「サーバー」から副 API インスタンスを追加でき、フィードは全インスタンスをまとめて表示し、各行に取得元サーバーのバッジが付きます。フラックスの追加・削除は選んだサーバーに送られます。Web アプリでは副サーバーはメールアドレスとパスワードで追加します。デスクトップアプリとモバイルアプリは副サーバーの OAuth にも対応します。',
      ],
      note: '他は何も変わりません。プロバイダー一覧、データ、描画はすべて設定したインスタンスに従います — アプリが名前で知らないプロバイダー向けの素朴なフォールバックも含めて。',
    },
    troubleshooting: {
      heading: '何かおかしいとき',
      items: [
        {
          symptom: 'プロバイダー一覧が空で返る。',
          cause:
            'まっさらなデータベースでは想定どおり：まだどのプロバイダーも動いていません。1 つ動かして再確認を。',
        },
        {
          symptom: 'アプリにコンテンツが出ないが、プロバイダー一覧は埋まっている。',
          cause:
            'プロバイダーは動いているが誰もまだ何もフォローしていない、または追跡中のソースに新しいコンテンツがありません。アプリからソースを追加してください。',
        },
        {
          symptom: 'プロバイダーが素のテキストカード、ときに生の JSON で表示される。',
          cause:
            '使える表示テンプレートがありません。プロバイダーが API に登録していないか、content が JSON 文字列なのにそれを解釈するテンプレートがありません。プロバイダーガイドを参照。',
        },
        {
          symptom: 'flux を追加すると購読ではなく「申請を送信しました」と出る。',
          cause:
            'そのプロバイダーは手動承認モードです。管理者が /admin/flux-requests で承認または却下します。望みでなければ /admin/providers でモードを変更してください。',
        },
        {
          symptom: 'create-admin がメールはすでに使用中だと言う。',
          cause:
            'スーパー管理者はすでに存在します。以降の管理者は管理用 Web UI で作成し、コマンドラインではありません。',
        },
        {
          symptom: 'ログインはできるが他のすべての呼び出しが拒否される。',
          cause:
            'トークンを発行したインスタンスと応答するインスタンスで署名シークレットが異なります。トークンはインスタンス間で持ち越せません。',
        },
      ],
    },
  },
  admin: {
    meta: {
      title: 'StayUp — 管理',
      description:
        'ブラウザから StayUp インスタンスを運用する：管理者、プロバイダーごとの flux 承認、申請キュー、ユーザーと flux。',
    },
    eyebrow: '管理',
    title: 'インスタンスを運用する',
    lede: 'API が動き出したら、管理用 Web UI はブラウザからインスタンスを運用する場所です：誰が何を追加できるか、どの申請が保留中か、どのユーザーがどの flux をフォローしているか。',
    webUi: {
      heading: '管理用 Web UI',
      body: '公開サイトと同じ Web アプリで、/admin で開き、自分の API に向けます。任意です — 行うことすべてに API ルートが裏にあります — が、インスタンスを運用する現実的な方法です。Web アプリの他のコピーと同じようにデプロイし、STAYUP_API_URL を自分の API に設定し、/admin/login からサインインします。',
      note: '管理セッションはユーザーセッションとは別の Cookie です。同じブラウザが両方を同時に保持でき、一方が他方をサインアウトさせません。',
    },
    roles: {
      heading: 'スーパー管理者と管理者',
      intro:
        '2 段階。最初の管理者は常にスーパー管理者で、コマンドラインで作成します（npm run create-admin）。それ以降の管理者は UI から作成され、通常の管理者です。',
      columnRole: '役割',
      columnCan: 'できること',
      rows: [
        {
          role: 'スーパー管理者',
          can: '通常の管理者ができることすべてに加えて：他の管理者の作成・編集・削除。UI からは削除されず、自分自身も削除できません。',
        },
        {
          role: '管理者',
          can: '運用作業：ユーザー、flux、プロバイダーの承認モード、申請キュー。管理者一覧は見えず触れません。自分のパスワードは変更できます。',
        },
      ],
      note: '管理者はユーザーアカウントではありません。独自のテーブル、独自のログインを持ち、自分のフィードはありません。',
    },
    managingAdmins: {
      heading: '管理者の管理',
      body: 'スーパー管理者のみ、/admin/admins で：',
      steps: [
        'メール、名前、パスワードで管理者を作成。通常の管理者で、他の管理者は管理できません。',
        '管理者の名前、メール、パスワードを編集。',
        '管理者を削除。スーパー管理者の行と自分の行はロックされています。',
      ],
      note: '自分のパスワードを変える必要のある通常の管理者は、/admin/settings で現在のパスワードを使って行います。',
    },
    fluxApproval: {
      heading: 'プロバイダーごとの flux 承認',
      intro:
        'ユーザーがまだ存在しない flux を追加したとき、何が起きるかはプロバイダーの承認モードによります。/admin/providers でプロバイダーごとに設定します。',
      autoBody:
        'auto — 既定。ソースが作成され、ユーザーはすぐ購読されます。どの URL でもよいプロバイダー（RSS、changelog）に向いています。',
      manualBody:
        'manual — 未知の flux の追加は代わりに申請を作ります（アプリは「申請を送信しました」と表示）。管理者が承認するまで何も作られません。ソースを動かすことにコストがあるプロバイダー（スクレイピングなど）に向いています。',
      note: 'すでに存在する flux の購読は決して承認対象になりません — 承認はまっさらなソースをインスタンスに取り込むことだけに関わります。',
    },
    usersAndFluxes: {
      heading: 'ユーザーと flux',
      body: 'コンソールの残りは閲覧と整理です：',
      items: [
        '/admin/users — 各アカウントと、そのアカウントがフォローする flux。誰かの代わりに購読を追加・削除。',
        '/admin/repositories — 全プロバイダーの各ソースと、その config。直接 1 つ作成（手動プロバイダーの下地作りに便利）、または引退。',
        '/admin/flux-requests — 保留キュー。承認はソースを作成または再利用し、申請者を購読させます。却下は却下済みとして記録。どちらも最終です。',
      ],
    },
    dataSources: {
      heading: 'セカンダリーデータベース',
      intro:
        'プライマリーデータベースはインスタンスそのもの — 管理者、ユーザー、購読、プロバイダーレジストリ — を保持します。それに加えて、コネクターのデータだけを載せた読み取り専用のセカンダリーデータベースへインスタンスを向け、そこにある flux をユーザーにフォローさせることができます。管理は /admin/data-sources で行います。',
      steps: [
        'プライマリーデータベースはページ上部に情報としてのみ表示されます：そのエンジンとホスト、変更する項目はありません。',
        '名前と接続文字列でセカンダリーを追加します。プライマリーと同じ 4 つのエンジンに対応しています。',
        '接続をテストします。インスタンスは接続できること、そしてコネクターのテーブルが少なくとも 1 つ存在することを確認し、見つかったプロバイダーを一覧にします。',
        '確定します。接続文字列は保存時に暗号化されて保管され、そのソースが一覧に加わります。いつでも削除できます — それを指していた購読も一緒に消えます。',
      ],
      note: '同じ名前のプロバイダーはアプリ上で統合されます：ユーザーには 1 つの「RSS」タイルが見え、その flux 一覧はすべてのデータベースの flux をまとめます。セカンダリー由来の行にはデータベース名の小さなバッジが付きます。セカンダリーへ書き戻すことは決してありません — それはデータの供給元であって、第二の住まいではありません。',
    },

    addingFlux: {
      heading: 'ユーザーはどのアプリからでもどう flux を追加するか',
      intro: 'どのプロバイダーでも同じ流れ — アプリにプロバイダーごとの特別扱いはもうありません：',
      steps: [
        'プロバイダーを選ぶ。',
        'アプリは、そのプロバイダーがすでに追跡していて、あなたがまだフォローしていない flux を表示します。タップ 1 つで購読 — 承認は一切なし。',
        'または「新しく追加」に切り替える。入力欄はプロバイダーの form ディスクリプターに従います：そのラベル、プレースホルダー、期待する形式。',
        '送信。プロバイダーが auto なら購読されます。manual なら、アプリは「申請を送信しました」と表示し、管理者が引き継ぎます。',
      ],
      note: 'だからプロバイダーはテンプレートに form ディスクリプターを同梱すべきです — 素っ気ないテキスト欄を「YouTube のハンドルを貼り付け」や「フィード URL を貼り付け」に変えるものです。',
    },
  },
  generate: {
    meta: {
      title: 'StayUp — セルフホスト構成を生成',
      description:
        'データベースと必要なコネクターを選ぶと、自分の StayUp インスタンスを立ち上げる単一の bash スクリプトをダウンロードできます。',
    },
    eyebrow: 'インストール',
    title: 'セットアップスクリプトを生成',
    lede: 'データベースと必要なコネクターを選びます。リポジトリのクローン、Docker 構成の作成、スーパー管理者の作成、全体の起動までを行う単一の bash スクリプトが手に入ります。',
    how: {
      heading: 'スクリプトの動作',
      items: [
        'API、選んだコネクター、そして残す場合は管理用 Web UI をクローンします。',
        'PostgreSQL、API、コネクターごとのコンテナ、Ofelia スケジューラーを含む docker-compose.yml を書き出します。',
        'スーパー管理者アカウントと各コネクターの実行間隔を尋ねます。',
        'スキーマを適用し、スーパー管理者を作成し、provider ごとにコネクター鍵を発行し、その後各コネクターを一度実行して登録させます。',
        'API、UI、スケジューラーを起動します。',
      ],
      note: 'すべて Docker であなたのマシン上で動作します。どこにも送信されません — ページはブラウザ内でスクリプトを組み立てます。',
    },
    requirements: {
      heading: '実行前に',
      items: [
        'Docker と Docker Compose v2（`docker compose`）。',
        'git。',
        'Linux または macOS。Windows では WSL 内で実行してください。',
      ],
    },
    form: {
      database: 'データベース',
      comingSoon: '近日',
      connectors: '公式コネクター',
      customConnectors: '自作コネクター',
      customHint:
        'ルートに Dockerfile を持つ任意の git リポジトリで、その ENTRYPOINT がコレクターを一度実行し、STAYUP_API_URL / STAYUP_API_KEY を読むこと。スクリプトが発行する鍵はサービス名にスコープされるため、コネクターの provider 名がそれと一致している必要があります。プロバイダーガイドを参照。',
      customConnectorAdd: 'コネクターを追加',
      customUrlPlaceholder: 'https://github.com/you/your-connector.git',
      customNamePlaceholder: '名前（任意）',
      remove: '削除',
      adminUi: '管理用 Web UI を含める',
      adminUiHint: 'プロバイダー管理、flux 申請の承認、管理者の追加。',
      registration: '登録',
      registrationOpen: 'オープン',
      registrationOpenHint: 'API に到達できる人は誰でもすぐにアカウントを作成できます。',
      registrationApproval: '承認制',
      registrationApprovalHint: '新しいアカウントは管理者が有効化するまでキューで待機します。',
      signInMethods: 'ログイン方法',
      emailPassword: 'メール＋パスワード',
      oauthHint:
        'スクリプトは実行時に OAuth のクライアント ID とシークレットを尋ねます。スクリプトには残りません。',
      advanced: '詳細',
      projectDir: 'プロジェクトフォルダ',
      apiPort: 'API ポート',
      uiPort: 'UI ポート',
      dbPort: 'DB ポート',
      preview: 'stayup-setup.sh',
      download: 'ダウンロード',
      copy: 'コピー',
      copied: 'コピーしました',
      invalid: '生成できません',
    },
    run: {
      heading: '実行',
      intro: 'ファイルを保存してから：',
      note: '初回実行はすべてのイメージをビルドするため数分かかることがあります。',
    },
    after: {
      heading: 'セットアップ後',
      items: [
        'API ドキュメント: http://localhost:3000/docs — 管理 UI: http://localhost:3001/admin。',
        'デスクトップまたはモバイルアプリで API URL を http://localhost:3000 に設定し、アカウントを作成します。',
        'フィードはアプリから追加します — 各プロバイダーは既存 flux の一覧と新規追加フォームを提供します。',
        'すべて削除: docker compose --profile connectors down -v（データベースを削除します）。',
      ],
      note: 'スケジューラーはコネクターを定時起動するため Docker ソケットをマウントします — ホスト上では root 相当であり、ローカルの開発インスタンスでは許容範囲です。',
    },
    production: {
      heading: '本番環境へ',
      intro:
        '上のジェネレーターは全体を自分のマシン上に立ち上げます。ここでは同じインスタンスをほぼ無料でホスティング運用する一例を示します。PostgreSQL は Neon、API は Cloudflare Workers、コネクターのスケジューラーは GitHub Actions です。以下のコマンドはすべてコピー＆ペーストできます。',
      dbHeading: 'データベース — Neon',
      dbSteps: [
        'Neon のアカウントを作り、プロジェクトを作成します。API を動かす場所に最も近いリージョンを選びます。',
        'プロジェクトで connection pooling を有効にし、pooled 接続文字列（ホスト名に「-pooler」が入る）をコピーします。Workers はリクエストごとに新しい接続を開くため、pooled エンドポイントが PostgreSQL の枯渇を防ぎます。この文字列は API 専用です — コネクターは決して見ません。',
        '自分のマシンから、スキーマの適用と最初のスーパー管理者の作成を 1 コマンドで行います。これは Node から実行しなければならない唯一の手順です。Workers 自身はスキーマを適用しません：',
        'このコマンドで src/db/schema.sql が実行され、管理者が挿入されました。プロバイダーはまだ 1 つも登録されていません。最初のコネクター実行が登録します（手順 3）。',
      ],
      dbNote:
        'Neon の無料プランはアイドル時にデータベースを休止します。休止後の最初のリクエストは復帰に約 1 秒かかります。個人インスタンスなら問題ありません。',
      apiHeading: 'API — Cloudflare Workers',
      apiSteps: [
        'GitHub で stayup-app/stayup-api を fork します。後で push デプロイを使うなら、clone ではなく fork にします。',
        'Wrangler をインストールし Cloudflare アカウントでログインしてから、シークレットを登録します。Cloudflare が保管し、リポジトリには書き込まれません：',
        '秘密でない設定（UI_URL、INSTANCE_NAME、REGISTRATION_MODE）は wrangler.toml の [vars] に置きます：',
        'デプロイします。Wrangler が URL を表示します：',
        'push デプロイの場合：fork の Settings → Secrets and variables → Actions で CLOUDFLARE_API_TOKEN を追加します（Cloudflare ダッシュボード → My Profile → API Tokens → 「Edit Cloudflare Workers」テンプレート）。リポジトリにある ci.yml が main への push ごとにテストして再デプロイします。',
      ],
      apiNote:
        'Workers 向けにバンドルされるのは PostgreSQL ドライバーのみです。ランタイムは MySQL や MongoDB のソケットを開けません。Workers ではデータベースは PostgreSQL です。',
      connHeading: 'コネクター — GitHub Actions',
      connIntro:
        'コネクターは STAYUP_API_URL と STAYUP_API_KEY を読み、API に対して一巡して終了する Python スクリプトです。定期実行する仕組みが必要で、GitHub Actions が schedule: と workflow_dispatch: で無料で行います。stayup-cmd-* の各リポジトリには .github/workflows/daily.yml が同梱済みです。',
      connSteps: [
        '管理 UI（または POST /ui/connector-keys）で、動かすプロバイダーごとにコネクター鍵を発行します — rss、youtube など。各シークレットは一度だけ表示されます。',
        '欲しいコネクターを fork します：stayup-cmd-rss、stayup-cmd-youtube、stayup-cmd-changelog、stayup-cmd-github-trending、stayup-cmd-scrap。',
        '各 fork で：Settings → Secrets and variables → Actions → New repository secret。STAYUP_API_URL（あなたの Workers URL）と STAYUP_API_KEY（そのプロバイダーの鍵）を追加します。',
        'ワークフローはすでにあります。全体は次のとおりです：',
        'cron: 行（UTC）で頻度を設定します。コネクターが同じ分に API へ集中しないようずらします：',
        '起動します：Actions タブ → 該当ワークフロー → Run workflow。最初の実行でプロバイダーが API に登録されます。その後、プロバイダーはアプリと GET /connectors/providers に現れます。',
        'GitHub は 60 日間活動のないリポジトリのスケジュール実行を一時停止します。コミットまたは手動実行で再び有効になります。',
      ],
      connNote:
        'スケジュール実行はキューに入り、正確な時刻ではありません。負荷時、GitHub は cron を数分遅らせることがあります。フィードリーダーなら問題ありません。',
      checkHeading: '全体の経路を確認',
      checkSteps: [
        'curl https://<api>/ が {"status":"ok"} を返す — API が Neon に到達しています。',
        '管理者ベアラートークン付きの curl https://<api>/connectors/providers が、少なくとも 1 回実行されたすべてのコネクターを一覧します。',
        'StayUp アプリでサーバーを Workers の URL に設定し、アカウントを作成してフィードを追加します。購読がデータベースに入り、次のコネクター実行で取り込まれます。',
        '管理 UI は、stayup-ui をどこかにデプロイし（Vercel なら 1 クリック）、STAYUP_API_URL を Workers の URL に設定して /admin を開きます。',
      ],
      checkNote:
        'アイドル時のコストはゼロです：Neon 無料プラン、Workers 無料プラン（1 日 10 万リクエスト）、GitHub Actions は公開リポジトリで無料です。',
    },
  },
  providers: {
    meta: {
      title: 'StayUp — プロバイダー',
      description: '任意の外部ソースを StayUp のコンテンツに変えるプログラムを書く。',
    },
    eyebrow: 'プロバイダー',
    title: '新しいソースをつなぐ',
    lede: 'プロバイダーは、ある種類のソースを取得し、見つけたものを保存するプログラムです。StayUp を拡張するために書くのはこれだけ — API と 3 つのアプリは自分で取り込みます。',
    what: {
      heading: 'プロバイダーとは実際に何か',
      body: 'プラグインでも、登録するモジュールでもありません：任意の言語の普通のプログラムで、スケジュールで実行されます。自分宛のソースを API に尋ね、それぞれを取得し、新しいものを保持し、API に送り返します。API は自分で取り込み、3 つのアプリが表示します — どこのコードも 1 行変わりません。',
      note: 'プロバイダーは StayUp API とだけ、HTTP で、コネクター鍵を使って話します。データベースには決して触れません。',
      diagram: {
        title: 'プロバイダー、ステップごとに',
        sources: 'そのソース、API から取得',
        sourcesItems: 'このプロバイダーが追跡を指示されたポッドキャストのフィード',
        fetch: '各フィードを取得',
        compare: '前になかったものだけ保持',
        store: 'API に送り返す',
        exposed: 'API が公開し、アプリが表示',
      },
      steps: {
        heading: '実行のたびに',
        items: [
          '表示名とテンプレートを API に登録する。',
          '自分宛のソースを API に尋ねる。',
          '外の世界からそれぞれを取得する。',
          'どこまで進んだかを API に尋ね、新しいものだけ保持する。',
          '新しい項目を 1 バッチで API に送り返す。',
          '古くなったものの削除を API に依頼し、そこで落ちる代わりに失敗を報告する。',
        ],
      },
    },
    access: {
      heading: '始める前に：何が必要か？',
      body: 'プロバイダーには、供給先のインスタンスの URL と、そのインスタンスの管理者が発行した自分の名前向けのコネクター鍵が必要です。公開インスタンスではそれがないので、実際には自分のプロバイダーは自分のインスタンスとセットになります。書くのにインストールガイドは要りません。動かすには、供給先のインスタンスでの鍵が要ります。',
      cta: 'インストールガイド',
    },
    existing: {
      heading: '読める実例',
      body: 'ステップごとのチュートリアルは、空のフォルダーから Hacker News 用の connector を丸ごと組み立てます — 最速の入り口です。次に本物を読みます — changelog、youtube、rss、scrap、github-trending — 参照インスタンスがたまたま動かしているもので、StayUp が何をカバーするかの定義ではありません。rss は下の契約の最短の実例、github-trending はリッチな表示テンプレートの参照です。',
      cta: 'チュートリアルを進める',
    },
    creating: {
      heading: '自分のを書く',
      naming: {
        heading: '名前を選ぶ',
        intro:
          '短く小文字で、識別子として使えるもの — podcast、hackernews、reddit_thread。その 1 つの文字列が複数の場所でそのまま使われます：',
        columnWhere: 'どこ',
        columnExample: '「podcast」の場合',
        rows: [
          'スクリプトが呼ぶ API パス',
          'あなたに属するソース',
          'レジストリのあなたの行',
          'flux 追加時にアプリが送る provider フィールド',
        ],
        note: '事前に予約するものはありません：名前は単に、あなたのコネクター鍵がひも付く名前であり、あなたが登録する名前です。2 つのプロバイダーは同じ名前を選んだときだけ衝突します。',
      },
      shape: {
        heading: '何を保存するか',
        body: '見つけた項目ごとに 1 行。コンテンツ自体はプレーンテキストでも JSON でも — あなた次第。API は決して解析しません。表示テンプレートがないと、アプリは素朴なカードを見せます：コンテンツの冒頭、日付、あなたの表示名。機能しますが見た目は地味で、コンテンツがそうなら生の JSON を見せます。テンプレートがそれを直します。次のセクションです。',
      },
      schedule: {
        heading: 'スケジュールで動かす',
        body: '既存のコレクターをどれか写してください：ルートに、ENTRYPOINT がスクリプトを一度実行する Dockerfile と、STAYUP_API_URL と STAYUP_API_KEY を環境に入れて起動する job。特定の CI は不要です — systemd タイマー、素の cron、またはジェネレーターの Ofelia コンテナが同じことをします。',
      },
    },
    templates: {
      heading: '表示テンプレート',
      body: 'テンプレートは、プロバイダーが register 呼び出しの template フィールドで送る JSON マニフェストです。API はそれを provider_registry.template に保存し、GET /connectors/providers でそのまま中継します。各アプリのエンジンがそれを読んで行を描画します — リストのレイアウトと、7 つのモード（テキスト、html、メディア、音声、ギャラリー、テーブル、リンクリスト）のいずれかの読み取りペイン。アプリのどのコードもあなたのプロバイダー名を知りません。',
      fallbackNote:
        'テンプレートのないプロバイダー（一度も送っていない、読めない JSON、未知の version）でも動きます — アプリは素朴なカードに戻ります。コンテンツが短い 1 行のテキスト以上になった時点で、テンプレートを強く推奨します。',
      cta: 'テンプレートの完全なリファレンス',
    },
    form: {
      heading: 'form ディスクリプター',
      body: 'テンプレート内の小さな form ブロックが、あなたのプロバイダー用の「新しい flux を追加」入力欄がどう見えるべきかをアプリに伝えます。ないと、ユーザーは素っ気ないテキスト欄。あると、検証してソース URL を代わりに組み立てる、ラベル付きの欄になります。',
      fields: [
        {
          field: 'label · placeholder',
          meaning: '欄が言うことと、ヒントとして見せるもの。',
        },
        {
          field: 'urlTemplate',
          meaning:
            '例：https://www.youtube.com/@{value} — {value} はユーザーが入力したもの。値がすでに http(s) URL ならスキップ。',
        },
        {
          field: 'pattern',
          meaning: '変換後の入力が満たすべき正規表現。送信前にクライアント側で検査。',
        },
        {
          field: 'transform',
          meaning:
            'trim、既知の接頭辞/接尾辞の除去、キャプチャグループの抽出 — 貼り付けた完全な URL と素のハンドルが同じ結果になるように。',
        },
      ],
      note: 'アプリは組み立てた URL をソースとして保存し、あなたのコレクターは他と同じようにソース一覧で受け取ります。',
    },
    fluxApproval: {
      heading: '承認モード',
      body: 'どのプロバイダーもレジストリに flux_approval モードを持ちます：auto（既定）または manual。auto はユーザーが新しい flux を追加するとすぐ購読させます。manual は管理者が承認すべき申請にします。これは運用者の設定です — コネクターが自分で設定することはできません。管理者が /admin/providers でインスタンスごとに設定します。スクレイピングが manual で種付けされているのには理由があります — そこではソースを動かすことにコストがあります。',
      note: 'これはまっさらなソースを取り込むことだけを制御します。すでに存在するソースの購読は決して承認対象になりません。',
    },
    contract: {
      heading: '技術契約',
      lede: '参照資料。プロバイダーを書くのに必要で、StayUp を理解するのには要りません。',
      diagramTitle: 'スクリプトが呼ぶもの',
      yourScript: 'あなたのプロバイダー',
      announce: '名乗る',
      read: '読む',
      write: '書く',
      seed: '種をまく',
      announceDesc: '実行のたびに表示名とテンプレートを登録',
      readDesc: '収集すべきソースと、どこまで進んだか',
      writeDesc: '新しい行、config のマージ、エラー',
      seedDesc: '新しい URL を追跡する — --add フラグ',
      warning:
        'コネクターはデータベースの資格情報を持たず、テーブル名も知りません。その鍵は /connector-api/<自分の名前>/* の下でしか効きません：他のプロバイダーとして書くことも、ユーザー・管理者・購読に触れることもできません。',
      authHeading: '認証',
      authBody:
        '管理者があなたのプロバイダー名向けにコネクター鍵を発行します（管理 UI → コネクター鍵、または POST /ui/connector-keys）。シークレット stayup_conn_… は一度だけ表示されます。スクリプトは毎回の呼び出しで Authorization: Bearer <鍵> として送り、インスタンス URL とともに STAYUP_API_KEY と STAYUP_API_URL から読み取ります。',
      endpointsHeading: 'エンドポイント',
      retentionNote:
        '保持がこの一覧にないのは意図的です。connector は削除しません — 管理者が Web UI の「メンテナンス」でコンテンツの寿命（全体、またはプロバイダーごと）を設定し、API 上のスケジュールされたジョブが削除を行います。',
      endpointsIntro:
        'すべて /connector-api/<name>/ の下、すべて鍵が必要。おおむね 1 回の実行が使う順です。',
      columnCall: '呼び出し',
      columnPurpose: '何をするか',
      endpointPurposes: [
        '名乗る：表示名、並び順、任意のテンプレート。冪等 — 実行のたびに呼ぶ。sortOrder は一度設定すると上書きされず、template はフィールドがあるときだけ置き換わる。',
        '新しい URL を追跡。URL について冪等：作成なら 201、既存なら 200、他のプロバイダーが持つなら 409。',
        'この実行で収集すべきソースの一覧 — それぞれ id、url、config つき。',
        'そのソースについて最後に保存されたバージョン、または初回実行では null — どこから再開するか。',
        'そのソースについて既に保存済みのすべてのバージョン — 最新の後を再開するだけでなく穴を埋めるコネクター向け。',
        'そのソースの config にキーを浅くマージ（例：ラベル用にチャンネル名を保存）。完全な置き換えは決してしない。',
        '収集した行を一括で書き込む。content は API が決して解析しない不透明な文字列。',
        '収集の失敗を記録。API のエラーログに入る。',
      ],
      itemHeading: 'アイテムの形',
      itemIntro: 'POST /connector-api/<name>/items のバッチ内の各行：',
      required: '必須',
      optional: '任意',
      itemFieldDescriptions: [
        'ソースの id。あなたのソース一覧から。',
        '不透明な文字列 — プレーンテキストか JSON 文字列、あなたの選択。',
        'この実行の ISO タイムスタンプ。',
        'そのソースの取得が成功したかどうか。',
        '重複排除キー。リッチな描画の横にも表示される（リリースタグ、動画 ID）。',
        'コンテンツ自身のタイムスタンプ。「最新順」で並べるとき executedAt より優先。',
        '自由な JSON。今日使うのはスクレイピングのプロバイダーだけ。',
      ],
      addingSources: {
        heading: 'ソースを入れる',
        body: '2 通り。POST /connector-api/<name>/sources を呼んで終了する --add フラグ — コマンドラインから種をまくのに便利。もう 1 つ、エンドユーザーが実際に取る道は、アプリからソースを追加すること。これは POST /ui/users/<userId>/repositories に送られ、provider フィールドはあなたの名前と等しく、auto/manual の承認フローを通ります。',
      },
      checklist: {
        heading: '完了と呼ぶ前に',
        items: [
          '実行のたびに呼ばれ、表示名と（推奨）テンプレートつき。',
          'この実行で収集すべきソースをくれる。',
          '新しい行を 1 バッチで送り、保存済みバージョンに対して重複排除。',
          '各ソースについてどこまで進んだかを教えてくれる。',
          'ソースごとの失敗を、実行を落とす代わりに報告する。',
          '1 回の実行後にあなたのプロバイダーを一覧する。',
        ],
      },
    },
  },

  tutorial: {
    meta: {
      title: 'StayUp — connector を書く',
      description:
        '空のフォルダーから組み立てる、Hacker News 用の完全に動く StayUp connector — 各ステップをコピーしてください。',
    },
    eyebrow: 'Providers',
    title: 'connector を書く、ステップごとに',
    lede: '1 ファイル、約 90 行、自前の API キーなし。Hacker News のリスト（top、best、new…）を追い、まだ見ていないストーリーを保持して、stayup-api に渡します。各ブロックを順にコピーしてください。ファイル全体は末尾にあります。',

    intro: {
      heading: '何を作るか',
      body: 'hackernews という名前の connector。追跡する各ソースは Hacker News のリストエンドポイント — https://hacker-news.firebaseio.com/v0/topstories.json など。実行のたびにスクリプトはリストを読み、まだ保存していない最新のストーリーを取得して送ります。HTTP で stayup-api とだけ話し、データベースには決して触れません。',
      note: 'Firebase の Hacker News API はキーも User-Agent も不要でレート制限もありません — だから最初の対象に向いています。',
    },

    prereqs: {
      heading: '始める前に',
      items: [
        'Python 3.11 以上と pip。',
        '到達できる stayup-api インスタンス（公開のもの、または自分のもの）。',
        'provider hackernews 用のコネクター鍵。そのインスタンスの管理画面で作成：コネクター鍵 → 新しい鍵、provider は hackernews。シークレットは一度だけ表示されます。',
      ],
    },

    steps: {
      heading: 'ステップ',
      setup: 'フォルダーを用意し、2 つの環境変数をインスタンスとその鍵に向けます。',
      helper:
        '1 ファイル、check_hn.py。まず import と、唯一の api() ヘルパー — stayup-api への呼び出しはすべてこれを通り、Bearer 鍵が付きます。',
      template:
        '実行のたびに connector は名乗ります：表示名と表示テンプレート — アプリがその行を描画するための JSON で、アプリ側のコードは不要。stayup-api はそれを保存し、そのまま中継します。',
      fetch:
        'Hacker News 固有なのはここだけ：リストエンドポイントを読み、各ストーリーを取得し、1 行を形にします。version は重複排除キー — ストーリー id を文字列にしたもの。content は不透明な JSON 文字列で、上のテンプレートがアプリに読み方を伝えます。',
      collect:
        '追跡する各ソースについて：API に既知のバージョンを尋ね、新しいストーリーだけを残し、1 バッチで送ります。1 つのソースの失敗は API に報告し、投げません。',
      main: 'エントリポイント：register、その後 --add でリストエンドポイントを追加するか、収集パスを回します。',
    },

    run: {
      heading: '実行する',
      body: 'リストを 1 つ 2 つ追跡し、それから本番実行します。provider はもう存在します — GET /connectors/providers とアプリに現れ、ユーザーが購読できます。',
      note: 'この connector は 1 実行あたり最大 STORIES_PER_RUN 行を保持し、削除は一切しません。古いコンテンツの刈り取りは別の関心事です — provider の契約を参照。',
    },

    schedule: {
      heading: 'スケジュールに載せる',
      body: 'コンテナ化したいなら Dockerfile を、そしてスケジュール実行の GitHub Actions ワークフロー — あるいは任意の cron を追加します。STAYUP_API_URL と STAYUP_API_KEY をリポジトリのシークレットに設定します。',
    },

    full: {
      heading: 'ファイル全体',
      body: 'check_hn.py を一続きで — 上の 6 ブロックを順に。',
    },

    next: {
      heading: 'ここから先',
      body: 'fetch_stories を自分のソースに差し替え、テンプレートを調整する — 作業はそれだけです。参照インスタンスが動かす 5 つのコレクター（changelog、youtube、rss、scrap、github-trending）はより充実した例で、rss が最短です。すべての connector が従う契約は provider ページにあります。',
      cta: 'provider の契約',
    },
  },
}
