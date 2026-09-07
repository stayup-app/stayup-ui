import type { DocContent } from './en'

export const zh: DocContent = {
  common: {
    onThisPage: '本页内容',
    backToDocs: '返回文档',
    docsHome: '文档',
  },
  home: {
    meta: {
      title: 'StayUp — 文档',
      description:
        'StayUp 是什么、各部分如何拼合，以及接下来去哪：运行自己的实例、运维它，或编写一个 provider。',
    },
    eyebrow: '文档',
    title: 'StayUp 的工作方式',
    lede: 'StayUp 把多种外部来源 — 发布说明、视频、订阅源、抓取的页面，凡是程序能读的东西 — 变成每个人的一份 feed。本页是心智模型和词汇；然后选择你需要的路径。',
    concept: {
      heading: '四句话讲清楚',
      points: [
        'StayUp 向你展示你所关注来源的新内容。什么算作来源并不固定：它是某个 provider 会去获取的东西。',
        '一个 provider 是一个小程序，去获取某一类来源，并通过 HTTP 把找到的东西发送给实例的 API — 它从不碰数据库。覆盖一类新来源就是写一个 provider；StayUp 其他部分什么都不变。',
        'StayUp API 拥有数据库并提供给各应用。它不硬编码任何来源类型：一个 provider 一旦注册过或发送过任何内容就算存在，API 原样返回每个 provider 的展示清单。',
        '各应用 — Web、桌面、移动 — 读取 API。每个都可指向任意实例，也就是任意数据库，而且每个都能展示一个它从未听说过的 provider。',
      ],
      note: '来源的集合在设计上是开放的。一个实例恰好展示对其数据库运行的那些 provider — 没有内置清单，无需向中央机构注册。',
      diagram: {
        title: '从一个来源到你的屏幕',
        sources: '外部来源',
        sourcesItems: '一个播客订阅源 · 一个论坛帖子 · 一个状态页 · 凡是程序能读的东西',
        providers: 'Providers',
        providersSub: '每类来源一个小程序，按计划运行，走 HTTP',
        database: '数据库',
        databaseSub: 'PostgreSQL、MySQL、SQLite 或 MongoDB — API 存储的一切，都在一处',
        api: 'StayUp API',
        apiSub: '接收 provider 发送的东西、供应用、什么都不硬编码',
        apps: 'Web · 桌面 · 移动 · 管理',
        appsSub: '每个都可配置指向另一个实例',
      },
    },
    vocabulary: {
      heading: '把这些词一次性钉死',
      intro: '这些术语到处都是，很容易混。以下是它们在 StayUp 里的意思。',
      columnTerm: '术语',
      columnMeaning: '含义',
      terms: [
        {
          term: '实例（Instance）',
          meaning:
            '一个数据库 + 前面一个 API + 供应它的那些 provider。公共实例是一个；你的会是另一个。实例之间从不通信。',
        },
        {
          term: 'Provider（又称连接器）',
          meaning:
            '一个独立程序，去获取某一类来源，并用一个连接器密钥认证后向 API 发送行。“连接器”和“provider”是一回事；仓库名为 stayup-cmd-*。',
        },
        {
          term: '来源（又称 flux）— 一行 repository',
          meaning:
            '被追踪的一样东西：一个具体的订阅源 URL、一个频道、一个页面。作为共享表 repository 的一行存储，type 等于 provider 的名字。',
        },
        {
          term: '订阅',
          meaning:
            '用户与来源之间的关联：“这个人关注这个 flux”。在应用中添加一个 flux 会创建一个订阅（如果来源不存在，也会创建来源本身）。',
        },
        {
          term: '展示模板',
          meaning:
            'provider 向 API 注册的可选 JSON 清单（存放在 provider_registry.template 中）。它告诉各应用如何渲染该 provider 的行。没有模板 → 一张朴素的通用卡片。',
        },
        {
          term: '管理员（Admin）',
          meaning:
            '一个实例的运维者。第一个（超级管理员）由命令行创建；其余在管理后台 Web 界面里管理。与用户账户相互独立。',
        },
      ],
    },
    paths: {
      heading: '你需要哪条路径？',
      installTitle: '运行你自己的实例',
      installBody:
        '你自己的 API 和你自己的数据库，让你的数据仍属于你，也由你选择对它运行什么。附完整的本地演练。',
      installCta: '安装指南',
      generateTitle: '生成安装脚本',
      generateBody: '引导式路径：选择数据库和你想要的连接器，得到一个搭建整个技术栈的 bash 脚本。',
      generateCta: '安装生成器',
      adminTitle: '运维你的实例',
      adminBody:
        '管理后台 Web 界面：管理管理员，决定哪些 provider 自由接受新 flux，处理审批队列，整理用户和 flux。',
      adminCta: '管理指南',
      providersTitle: '接入一个新来源',
      providersBody:
        '编写一个 provider — 一个去获取 StayUp 尚未覆盖的来源并保存所得的程序。含展示模板。',
      providersCta: 'provider 指南',
      relation:
        '运维一个实例与编写一个 provider 相关但不同。写一个不需要安装指南里的任何东西 — 它只是一个调用 API 的程序。运行它是另一回事：它需要在所供应实例上的一个连接器密钥，而在公共实例上你没有。实际上，你自己的 provider 与你自己的实例配套。',
    },
  },
  install: {
    meta: {
      title: 'StayUp — 安装',
      description:
        '搭建你自己的 StayUp 实例：各部分、一份完整的本地演练、四种数据库、配置，以及如何把各应用指向它。',
    },
    eyebrow: '安装',
    title: '运行你自己的实例',
    lede: '一个实例是一个数据库、前面的 API、你选来供应它的那些 provider，以及 — 如果你想从浏览器运维 — 管理后台 Web 界面。本页把整套东西在本地从头到尾走一遍。',
    why: {
      heading: '为什么要费这个事',
      intro: '公共实例有它自己的 provider 和它自己的数据。运行你自己的可以让你：',
      items: [
        '把一切放在你控制的数据库里；',
        '选择哪些 provider 运行、多久一次；',
        '关注公共实例不覆盖的来源；',
        '通过按 provider 的审批，决定谁能添加什么；',
        '把 Web、桌面和移动应用指向它 — 一个设置，无需改代码。',
      ],
      note: '实例之间不通信。你从一个空数据库、没有 provider 开始，直到你对它运行一个。',
    },
    pieces: {
      heading: '四个部分',
      database: '一个数据库',
      databaseBody:
        '保存一切：被追踪的来源、收集的内容、账户、管理员。PostgreSQL、MySQL/MariaDB、SQLite 或 MongoDB — API 会适配你指向的那个。',
      api: 'StayUp API',
      apiBody:
        '该数据库之上一层薄的、无状态的层。它不硬编码任何 provider 名 — 每次请求都问数据库里有什么。可在 Node、Docker 或 Cloudflare Workers 上运行。',
      providers: 'Providers',
      providersBody:
        '真正往实例里填东西的程序。独立仓库，按计划启动，只与 API 通信 — 带着管理员为它们签发的连接器密钥。没有至少一个，你的实例能运行但什么都不显示。',
      adminUi: '管理后台 Web 界面（可选）',
      adminUiBody:
        'Web 应用的一份部署，在 /admin 打开。可用来管理管理员、设置每个 provider 的审批模式、处理 flux 请求队列，以及整理用户和 flux。不要它 API 也照常工作 — 你只是失去了浏览器控制台。',
    },
    fastPath: {
      heading: '快捷路径',
      body: '如果你只想让它跑起来，安装生成器问几个问题，交给你一个 stayup-setup.sh，替你做完下面所有事 — 克隆、compose、结构、超级管理员、连接器首次运行、调度器。',
      cta: '打开安装生成器',
    },
    walkthrough: {
      heading: '完整的本地演练',
      intro:
        '手动来做，好让你看到每一个活动部件。这里用 PostgreSQL 和 Docker；同样的步骤适用于任何受支持的引擎。',
      steps: [
        '克隆 API：git clone https://github.com/stayup-app/stayup-api.git && cd stayup-api',
        '把 .env.example 复制为 .env，设置 DATABASE_URL 和 JWT_SECRET（openssl rand -hex 32）。没有要设的管理员用户名或密码 — 管理员存在于数据库中。',
        '启动数据库和 API：docker compose up -d db api。compose 文件会在首次 init 时把结构灌入 Postgres；API 在端口 3000 监听。',
        '如果你没依赖那个自动 init，就手动应用一次结构：psql "$DATABASE_URL" -f src/db/schema.sql。它只做新增，所以可以放心重复执行。',
        '创建第一个超级管理员：npm run create-admin -- root@example.com "Root" \'一个强密码\'。这是管理管理后台 Web 界面的账户。',
        '签发一个连接器密钥。在管理后台 Web 界面中，连接器密钥 → 新建密钥，provider 选 rss — 或 POST /ui/connector-keys。密文（stayup_conn_…）只显示一次；复制它。',
        '添加一个 provider。克隆一个 — git clone https://github.com/stayup-app/stayup-cmd-rss.git — 把 STAYUP_API_URL 设为 http://localhost:3000、STAYUP_API_KEY 设为上面的密钥，安装依赖，然后：python fetch_rss.py --add https://blog.example.com/feed.xml 和 python fetch_rss.py。首次真正运行会把该 provider 注册到 API，然后开始收集。',
        '检查 API 是否看到它：curl localhost:3000/connectors/providers 现在应列出 rss 及其展示清单。',
        '打开桌面应用，进入「个人资料」→「API 地址」，粘贴 http://localhost:3000，保存。创建一个账户，然后添加一个 flux — 连接器运行过后 rss 条目就会出现。',
        '为连接器排期让它持续运行：一条 cron、一个 systemd timer、一个 GitHub Actions 计划，或者生成器搭起来的 Ofelia 容器。',
      ],
      note: 'API 从不启动连接器。它们是各自按计划运行的独立程序；它们从 API 只需要它的 URL 和一个连接器密钥。',
    },
    requirements: {
      heading: '你需要什么',
      items: [
        '下方列表中的一种数据库，从 API 运行处可以访问到。',
        'Docker，或者不用容器的话 Node.js 22 或更高。',
        '可选一个 Cloudflare 账户，用于像参考实例那样部署到 Workers。',
      ],
    },
    databases: {
      heading: '选哪种数据库',
      intro:
        'API 并不直接说 SQL。它调用一份存储契约，每种引擎由一个适配器来实现，而 DATABASE_URL 的协议头决定用哪个适配器。开箱即用的引擎有四种：',
      columnEngine: '引擎',
      columnScheme: 'URL 协议头',
      columnDriver: '要安装的驱动',
      note: '每种引擎都通过同一套一致性测试 — 同样的行为，在 CI 中针对真实的 PostgreSQL、MySQL、SQLite 和 MongoDB 验证。这使选择可逆：表、集合和列在各处名字都一样，于是一个 provider 只描述一次，只有方言在变。',
      workersNote:
        '有一个例外，而且不怪我们：Cloudflare Workers 只打开 PostgreSQL 所用的那种连接。MySQL、SQLite 和 MongoDB 的驱动需要 Node — Docker 或纯 Node.js，不是 Workers。',
    },
    env: {
      heading: '配置',
      columnVariable: '变量',
      columnRequired: '必填',
      columnDescription: '说明',
      yes: '是',
      no: '否',
      descriptions: [
        '协议头决定引擎：postgres://、mysql://、sqlite:// 或 mongodb://。Node 和 Docker 构建也接受单独的 DB_HOST、DB_PORT、DB_NAME、DB_USER 和 DB_PASSWORD，用于 PostgreSQL。',
        '用于签名鉴权 token 的随机密钥。用 openssl rand -hex 32 生成。在实例的整个生命周期内必须保持不变 — 改了它，所有现有 token 都会失效。',
        '你的 Web 部署的公开 URL。仅用作 OAuth 回跳目标；若不启用 Google 或 GitHub 登录，可以省略。',
        '启用「用 Google 登录」。留空则禁用。',
        '启用「用 GitHub 登录」。留空则禁用。',
      ],
      note: '没有管理员用户名或密码变量。旧的 API_USERNAME / API_PASSWORD 组合已不存在：管理员是数据库里的行，第一个用 npm run create-admin 创建。普通用户的邮箱＋密码登录始终可用，无论你如何设置 OAuth 变量。',
    },
    deploy: {
      heading: '部署 API',
      tabs: ['Docker Compose', 'Cloudflare Workers', '纯 Node.js'],
      dockerIntro: '最短路径：克隆、填 .env、运行。',
      dockerNote:
        'compose 文件把结构挂进 Postgres 的 init 目录，因此在卷首次初始化时创建核心表。API 随后在端口 3000 监听。接着创建超级管理员 — 见下文。',
      workersIntro: '参考实例所运行的。',
      workersNote:
        '你的数据库必须能从 Cloudflare 的网络访问到 — 带池化公网连接串的托管服务商是常见答案。Workers 无法访问你家庭网络里的数据库，也无法运行 create-admin 脚本：请从你自己的机器上对着数据库创建超级管理员。',
      nodeIntro: '没有编排，只有构建好的服务器。',
      nodeNote:
        '或者你自己构建随附的 Dockerfile，如果你更想不用 Compose 跑一个容器。构建好的镜像也带 create-admin 脚本。',
    },
    schema: {
      heading: '创建表，以及第一个管理员',
      applyIntro:
        '如果你不依赖 Compose 的自动 init，就自己手动应用一次结构。每种引擎一个文件，各文件的表名和列名都一样：',
      applyNote:
        'SQL 文件只做新增 — CREATE TABLE IF NOT EXISTS、ADD COLUMN IF NOT EXISTS — 所以任何时候都可重复执行，包括对着已有数据的数据库。',
      engineNotes: [
        '参考结构。版本 14 或更高。',
        'MySQL 8 或 MariaDB 10.2 及以上：API 用窗口函数对内容排序。',
        '无需托管 — API 旁边的一个文件。适合个人实例，不适合被多处应用同时访问的实例。',
        '没有要应用的结构：MongoDB 在首次写入时创建集合。只有索引重要，API 连接时会自己创建 — 上面的命令只是提前做而已。',
      ],
      adminIntro:
        '管理员是 admin 表里的行；没有默认账户。用命令行创建第一个 — 始终是超级管理员。它先应用结构，再插入这一行：',
      userIntro: '普通用户账户从各应用的注册表单创建。要不用表单造一个用于测试：',
      verifyIntro: '然后检查 API 是否响应：',
      verifyNote:
        '这里 provider 列表为空是预期的回应：还没有任何东西收集过。那是 provider 指南的事。',
    },
    auth: {
      heading: '用户与认证',
      intro: '人们如何在你的实例上获得账户，以及如何开启用 Google 或 GitHub 登录。',
      registration: {
        heading: '注册模式',
        body: 'REGISTRATION_MODE 决定公开注册的行为。open（默认）：账户被创建，本人当即登录 —— 就是当前行为。approval：注册被搁置。POST /auth/register 返回 202 且没有 token，OAuth 注册带 ?error=pending_approval 返回，等待中的邮箱尝试登录返回 403。管理员随后在 /admin/users →「Comptes en attente」处理队列。管理员创建的账户始终是激活的，无论哪种模式；已验证邮箱已匹配到某个激活账户的 OAuth 注册也一样。',
      },
      pointing: {
        heading: '应用在哪里登录',
        body: '桌面和移动：登录界面的「服务器」行，或登录后进入个人资料 →「API 地址」。「恢复默认」随时回到内置那个。',
      },
      oauth: {
        heading: '用 Google 和 GitHub 登录',
        intro: '可选。每个提供方都需要一个你自己的 OAuth 应用，以及 API 上的四个环境变量：',
        steps: [
          '创建一个 OAuth 应用 —— Google 在 console.cloud.google.com/apis/credentials，GitHub 在 github.com/settings/developers。',
          '把它的回调（或重定向）URL 设为 https://<你的 API 源>/auth/oauth/<provider>/callback。两个提供方都允许 http://localhost 用于开发。',
          '把 client ID 和 secret 放进 API 上的 GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET（或 GITHUB_ 那一对）。',
          '把 UI_URL 设为你的 Web 部署源 —— 浏览器 OAuth 之后，API 会重定向到 UI_URL/api/auth/callback。桌面应用会自己拦截这个路径，所以任何非空的 UI_URL 对它都行；移动应用用自己的 stayup:// 深链，已在允许名单里。',
        ],
        note: '一个 GitHub OAuth 应用只允许恰好一个回调 URL，所以每个 API 源都需要单独的 GitHub 应用。脚本生成器在运行时询问这些凭据，并直接写进 docker-compose.yml，绝不写进脚本。',
      },
    },

    pointing: {
      heading: '把一个应用指向你的实例',
      items: [
        'Web：在你的部署上设置 STAYUP_API_URL — 或者不设，让每位访客从个人资料里覆盖它，按浏览器保存。',
        '三个应用都一样：登录界面的「服务器」一行，或登录后在个人资料 →「服务器」里设置、重命名和重置每一个。',
        '管理后台 Web 界面就是同一个 Web 应用：把它的 STAYUP_API_URL 指向你的 API，打开 /admin。',
        '一个应用，多个实例：在个人资料 →「服务器」里可以添加次级 API 实例，随后信息流会合并所有实例，每一行都带有来源服务器的标记。添加或删除订阅会路由到你所选的服务器。Web 应用通过邮箱和密码添加次级服务器；桌面端和移动端还支持次级服务器的 OAuth。',
      ],
      note: '其他一切都不变。provider 列表、数据和渲染都跟随所配置的实例 — 包括对应用不认识其名字的 provider 的朴素回退。',
    },
    troubleshooting: {
      heading: '当有什么不对劲',
      items: [
        {
          symptom: 'provider 列表返回为空。',
          cause: '在全新数据库上是预期的：还没有 provider 对它运行过。运行一个再看。',
        },
        {
          symptom: '应用不显示内容，但 provider 列表已填充。',
          cause:
            'provider 在运行，但还没人关注任何东西，或它们追踪的来源没有新内容。从应用里添加一个来源。',
        },
        {
          symptom: '某个 provider 显示为朴素文本卡片，有时是原始 JSON。',
          cause:
            '没有可用的展示模板。provider 没有向 API 注册模板，或它的 content 是 JSON 字符串却没有模板来解释。见 provider 指南。',
        },
        {
          symptom: '添加一个 flux 时提示「请求已发送」而不是订阅。',
          cause:
            '那个 provider 处于手动审批模式。管理员在 /admin/flux-requests 批准或拒绝。如果这不是你想要的，在 /admin/providers 切换模式。',
        },
        {
          symptom: 'create-admin 说该邮箱已被占用。',
          cause: '超级管理员已经存在。后续管理员从管理后台 Web 界面创建，而不是命令行。',
        },
        {
          symptom: '登录能用，但其他每个调用都被拒。',
          cause: '签发你 token 的实例与响应的实例签名密钥不同。token 不能跨实例。',
        },
      ],
    },
  },
  admin: {
    meta: {
      title: 'StayUp — 管理',
      description:
        '从浏览器运维一个 StayUp 实例：管理员、按 provider 的 flux 审批、请求队列、用户和 flux。',
    },
    eyebrow: '管理',
    title: '运维你的实例',
    lede: 'API 一旦跑起来，管理后台 Web 界面就是你在浏览器里运维实例的地方：谁能添加什么、哪些请求待处理、哪些用户关注哪些 flux。',
    webUi: {
      heading: '管理后台 Web 界面',
      body: '它就是与公共站点相同的 Web 应用，在 /admin 打开，指向你的 API。它是可选的 — 它做的每件事背后都有一条 API 路由 — 但它是运维实例的实用方式。像 Web 应用的任何其他副本一样部署它，把 STAYUP_API_URL 设为你的 API，在 /admin/login 登录。',
      note: '管理会话是与用户会话相互独立的 cookie。同一浏览器可同时持有两者，互不注销。',
    },
    roles: {
      heading: '超级管理员与管理员',
      intro:
        '两个级别。第一个管理员始终是超级管理员，由命令行创建（npm run create-admin）。之后的每个管理员都从 UI 创建，是普通管理员。',
      columnRole: '角色',
      columnCan: '可以做',
      rows: [
        {
          role: '超级管理员',
          can: '普通管理员能做的一切，外加：创建、编辑和删除其他管理员。不能从 UI 删除，也不能删除自己。',
        },
        {
          role: '管理员',
          can: '运维工作：用户、flux、provider 审批模式、请求队列。看不到也碰不到管理员列表。可以改自己的密码。',
        },
      ],
      note: '管理员不是用户账户。他们有自己的表、自己的登录，没有自己的 feed。',
    },
    managingAdmins: {
      heading: '管理管理员',
      body: '仅超级管理员，在 /admin/admins：',
      steps: [
        '用邮箱、名字和密码创建一个管理员。它是普通管理员 — 不能管理其他管理员。',
        '编辑一个管理员的名字、邮箱或密码。',
        '删除一个管理员。超级管理员的行和你自己的行是锁定的。',
      ],
      note: '需要改自己密码的普通管理员在 /admin/settings 里用当前密码来改。',
    },
    fluxApproval: {
      heading: '按 provider 的 flux 审批',
      intro:
        '当用户添加一个尚不存在的 flux，会发生什么取决于该 provider 的审批模式。在 /admin/providers 按 provider 设置。',
      autoBody:
        'auto — 默认。来源被创建，用户立即订阅。适合任何 URL 都行的 provider（RSS、changelog）。',
      manualBody:
        'manual — 添加一个未知 flux 会改为创建一个请求（应用显示「请求已发送」）。在管理员批准前什么都不创建。适合运行一个来源有成本的 provider，比如抓取。',
      note: '订阅一个已存在的 flux 从不需要审批 — 审批只关乎把一个全新来源引入实例。',
    },
    usersAndFluxes: {
      heading: '用户和 flux',
      body: '控制台的其余部分是浏览和整理：',
      items: [
        '/admin/users — 每个账户，以及它关注的 flux。代表某人添加或移除一个订阅。',
        '/admin/repositories — 所有 provider 的每个来源，以及它的 config。直接创建一个（对给手动 provider 铺垫很有用），或退役一个。',
        '/admin/flux-requests — 待处理队列。批准会创建或复用来源并让请求者订阅；拒绝把它标记为已拒绝。两者都是最终的。',
      ],
    },
    dataSources: {
      heading: '次级数据库',
      intro:
        '主数据库承载实例本身 — 管理员、用户、订阅、provider 注册表。在它之外，你可以把实例指向只读的次级数据库，这些库只携带连接器数据，并让用户关注住在那里的 flux。它们在 /admin/data-sources 管理。',
      steps: [
        '主数据库列在页面顶部，仅供参考：它的引擎和主机，没有可改的项。',
        '用一个名称和一条连接字符串添加一个次级库。支持的四种引擎与主库相同。',
        '测试连接。实例会检查它能否连上、以及是否至少存在一张连接器表，并列出它找到的 provider。',
        '确认。连接字符串以静态加密方式存储，该数据源加入列表。你可以随时移除它 — 指向它的订阅会随之一起消失。',
      ],
      note: '同名的 provider 在应用里会被合并：用户看到的是单个「RSS」磁贴，它的 flux 列表汇集每个数据库的 flux，而来自次级库的一行会带一个写着数据库名的小徽标。永远不会向次级库写回 — 它是一条数据供给，而不是第二个家。',
    },

    addingFlux: {
      heading: '用户如何从任意应用添加一个 flux',
      intro: '每个 provider 都是同一套流程 — 应用里不再有按 provider 的特殊处理：',
      steps: [
        '选择一个 provider。',
        '应用展示该 provider 已经追踪、而你还没关注的那些 flux。轻点一下即订阅 — 从不需审批。',
        '或者切换到「新增一个」。输入框由该 provider 的 form 描述符驱动：它的标签、占位符，以及它期望的形态。',
        '提交。如果 provider 是 auto，你就被订阅了。如果是 manual，应用显示「请求已发送」，由管理员接手。',
      ],
      note: '所以一个 provider 应当在其模板里带上一个 form 描述符 — 它把一个光秃秃的文本框变成「粘贴一个 YouTube handle」或「粘贴一个订阅源 URL」。',
    },
  },
  generate: {
    meta: {
      title: 'StayUp — 生成自托管配置',
      description: '选择数据库和所需的连接器，下载一个 bash 脚本来搭建你自己的 StayUp 实例。',
    },
    eyebrow: '安装',
    title: '生成你的安装脚本',
    lede: '选择数据库和所需的连接器。你会得到一个 bash 脚本，它会克隆仓库、写入 Docker 配置、创建超级管理员并启动一切。',
    how: {
      heading: '脚本做什么',
      items: [
        '克隆 API、所选连接器，以及（如果保留）管理后台 Web 界面。',
        '写出一个包含 PostgreSQL、API、每个连接器一个容器以及 Ofelia 调度器的 docker-compose.yml。',
        '询问超级管理员账户以及每个连接器的运行频率。',
        '应用结构、创建超级管理员、为每个 provider 各签发一个连接器密钥，然后让每个连接器先运行一次以完成注册。',
        '启动 API、界面和调度器。',
      ],
      note: '一切都在你的机器上通过 Docker 运行。不会发送到任何地方——页面在你的浏览器中构建脚本。',
    },
    requirements: {
      heading: '运行之前',
      items: [
        'Docker 和 Docker Compose v2（`docker compose`）。',
        'git。',
        'Linux 或 macOS。在 Windows 上请在 WSL 中运行脚本。',
      ],
    },
    form: {
      database: '数据库',
      comingSoon: '即将',
      connectors: '官方连接器',
      customConnectors: '你的连接器',
      customHint:
        '任意包含根 Dockerfile 的 git 仓库，其 ENTRYPOINT 运行采集器一次并读取 STAYUP_API_URL / STAYUP_API_KEY。脚本签发的密钥按服务名限定作用域，因此连接器的 provider 名必须与之一致。参见 provider 指南。',
      customConnectorAdd: '添加连接器',
      customUrlPlaceholder: 'https://github.com/you/your-connector.git',
      customNamePlaceholder: '名称（可选）',
      remove: '移除',
      adminUi: '包含管理后台 Web 界面',
      adminUiHint: '管理 provider、审批 flux 请求、添加管理员。',
      registration: '注册',
      registrationOpen: '开放',
      registrationOpenHint: '任何能访问 API 的人都可以立即创建账户。',
      registrationApproval: '需审批',
      registrationApprovalHint: '新账户会排队等待，直到管理员激活。',
      signInMethods: '登录方式',
      emailPassword: '邮箱 + 密码',
      oauthHint: '脚本会在运行时询问 OAuth 的 client ID 和 secret —— 它们不会写入脚本。',
      advanced: '高级',
      projectDir: '项目目录',
      apiPort: 'API 端口',
      uiPort: 'UI 端口',
      dbPort: '数据库端口',
      preview: 'stayup-setup.sh',
      download: '下载',
      copy: '复制',
      copied: '已复制',
      invalid: '无法生成',
    },
    run: {
      heading: '运行',
      intro: '保存文件，然后：',
      note: '首次运行会构建每个镜像，可能需要几分钟。',
    },
    after: {
      heading: '安装之后',
      items: [
        'API 文档：http://localhost:3000/docs —— 管理界面：http://localhost:3001/admin。',
        '在桌面或移动应用中，将 API 地址设为 http://localhost:3000，然后创建账户。',
        '在应用中添加订阅源——每个 provider 都提供已有 flux 列表和新增表单。',
        '全部移除：docker compose --profile connectors down -v（会删除数据库）。',
      ],
      note: '调度器挂载 Docker socket 以按计划启动连接器——在宿主机上等同于 root，对本地开发实例可以接受。',
    },
    production: {
      heading: '上生产环境',
      intro:
        '上面的生成器会在你的机器上把整套东西跑起来。这里给出一种把同一实例托管运行、成本几乎为零的做法：PostgreSQL 用 Neon，API 用 Cloudflare Workers，连接器的调度用 GitHub Actions。下面每条命令都可直接复制粘贴。',
      dbHeading: '数据库 — Neon',
      dbSteps: [
        '注册 Neon 账户，然后创建一个项目。选择离 API 运行地最近的区域。',
        '在项目中开启连接池（connection pooling），复制带池化的连接串——主机名里含「-pooler」。Workers 每个请求都会新开一个连接，池化端点能避免耗尽 PostgreSQL。这条连接串只给 API 用——连接器从不会看到它。',
        '在你的机器上，用一条命令应用 schema 并创建第一个超级管理员。这是唯一必须从 Node 运行的步骤——Workers 从不自行应用 schema：',
        '该命令执行了 src/db/schema.sql 并插入了管理员。还没有任何 provider 被注册——由第一次连接器运行完成（第 3 步）。',
      ],
      dbNote:
        'Neon 免费套餐在空闲时会挂起数据库；暂停后第一次请求需要约一秒把它唤醒。个人实例完全够用。',
      apiHeading: 'API — Cloudflare Workers',
      apiSteps: [
        '在 GitHub 上 fork stayup-app/stayup-api——如果之后想要推送即部署，就 fork 而不只是 clone。',
        '安装 Wrangler 并用你的 Cloudflare 账户登录，然后推送 secret。它们由 Cloudflare 保存，绝不写入仓库：',
        '非机密配置——UI_URL、INSTANCE_NAME、REGISTRATION_MODE——放在 wrangler.toml 的 [vars] 下：',
        '部署。Wrangler 会打印出 URL：',
        '推送即部署：在 fork 的 Settings → Secrets and variables → Actions 中添加 CLOUDFLARE_API_TOKEN（Cloudflare 控制台 → My Profile → API Tokens → 「Edit Cloudflare Workers」模板）。仓库里已有的 ci.yml 会在每次推送到 main 时测试并重新部署。',
      ],
      apiNote:
        '为 Workers 打包的只有 PostgreSQL 驱动——运行时无法打开 MySQL 或 MongoDB 的 socket。在 Workers 上，数据库就是 PostgreSQL。',
      connHeading: '连接器 — GitHub Actions',
      connIntro:
        '连接器是一个读取 STAYUP_API_URL 和 STAYUP_API_KEY、对 API 跑一轮然后退出的 Python 脚本。它需要有东西按计划运行它；GitHub Actions 用 schedule: 和 workflow_dispatch: 免费做到这点。每个 stayup-cmd-* 仓库都已自带 .github/workflows/daily.yml。',
      connSteps: [
        '在管理 UI（或 POST /ui/connector-keys）中，为你要运行的每个 provider 各签发一个连接器密钥——rss、youtube 等。每个密文只显示一次。',
        'fork 你想要的每个连接器：stayup-cmd-rss、stayup-cmd-youtube、stayup-cmd-changelog、stayup-cmd-github-trending、stayup-cmd-scrap。',
        '在每个 fork 中：Settings → Secrets and variables → Actions → New repository secret。添加 STAYUP_API_URL（你的 Workers URL）和 STAYUP_API_KEY（该 provider 的密钥）。',
        '工作流已经在那里——全部内容就是这些：',
        '用 cron: 行（UTC）设置频率。错开各连接器，别让它们在同一分钟一起打 API：',
        '先手动跑一次：Actions 标签页 → 该工作流 → Run workflow。第一次运行会把该 provider 注册到 API；之后 provider 就会出现在各 App 和 GET /connectors/providers 中。',
        'GitHub 会暂停 60 天无活动仓库里的定时工作流。一次提交或手动运行即可重新启用。',
      ],
      connNote:
        '定时运行是排队执行，并不精确——负载高时 GitHub 可能把 cron 推迟几分钟。对订阅阅读器来说无所谓。',
      checkHeading: '检查整条链路',
      checkSteps: [
        'curl https://<api>/ 返回 {"status":"ok"}——API 能连到 Neon。',
        '带管理员 bearer token 的 curl https://<api>/connectors/providers 会列出每个至少运行过一次的连接器。',
        '在 StayUp App 里把服务器设为你的 Workers URL，创建账户，添加一个订阅源。订阅会落到数据库；下一次连接器运行会把它采集进来。',
        '管理界面：把 stayup-ui 部署到任意地方（Vercel 一键），把 STAYUP_API_URL 设为你的 Workers URL，然后打开 /admin。',
      ],
      checkNote:
        '空闲时零成本：Neon 免费套餐、Workers 免费套餐（每天 10 万请求），GitHub Actions 对公开仓库免费。',
    },
  },
  providers: {
    meta: {
      title: 'StayUp — Providers',
      description: '编写一个把任意外部来源变成 StayUp 内容的程序。',
    },
    eyebrow: 'Providers',
    title: '接入一个新来源',
    lede: '一个 provider 是一个去获取某一类来源并保存所得的程序。它是你为扩展 StayUp 而编写的唯一东西 — API 和三个应用会自己接手。',
    what: {
      heading: 'provider 究竟是什么',
      body: '不是插件，不是要注册的模块：一个普通程序，任何语言，按计划运行。它向 API 询问分配给它的来源，逐个获取，保留新的，再发回给 API。API 会自己接手，三个应用会展示它 — 任何地方都不改一行代码。',
      note: 'provider 只与 StayUp API 通信，走 HTTP，用一个连接器密钥。它从不碰数据库。',
      diagram: {
        title: 'provider，一步一步',
        sources: '它的来源，从 API 获取',
        sourcesItems: '这个 provider 被要求追踪的播客订阅源',
        fetch: '获取每个订阅源',
        compare: '只保留之前没有的',
        store: '发回给 API',
        exposed: 'API 暴露它，应用展示它',
      },
      steps: {
        heading: '每次运行时',
        items: [
          '把你的展示名和模板注册到 API。',
          '向 API 询问分配给你的来源。',
          '从外部世界逐个获取。',
          '向 API 询问你上次到哪儿，只保留新的。',
          '把新条目一批发回给 API。',
          '请 API 移除已过期的，遇到失败时上报而不是崩在上面。',
        ],
      },
    },
    access: {
      heading: '开始之前：你需要什么？',
      body: 'provider 需要其所供应实例的 URL，以及该实例管理员为其名字签发的一个连接器密钥。公共实例上你没有，所以实际上你自己的 provider 与你自己的实例配套。写一个不需要安装指南里的任何东西；运行一个需要在你所供应实例上的一个密钥。',
      cta: '安装指南',
    },
    existing: {
      heading: '可读的实例',
      body: '分步教程从一个空文件夹开始，完整搭出一个 Hacker News 的 connector — 最快的上手方式。然后读那些真实的 — changelog、youtube、rss、scrap、github-trending — 这是参考实例恰好在运行的，并非 StayUp 所覆盖内容的定义。rss 是下面契约最短的真实示例；github-trending 是丰富展示模板的参考。',
      cta: '跟着教程走',
    },
    creating: {
      heading: '写你自己的',
      naming: {
        heading: '取个名字',
        intro:
          '短小、小写、可作标识符 — podcast、hackernews、reddit_thread。这一个字符串会原样用在多个地方：',
        columnWhere: '在哪',
        columnExample: '对于「podcast」',
        rows: [
          '你的脚本调用的 API 路径',
          '属于你的来源',
          '注册表里你的那一行',
          '添加 flux 时应用发送的 provider 字段',
        ],
        note: '无需事先预留：名字就是你的连接器密钥所绑定、以及你所注册的那个。两个 provider 只有选了同一个才会冲突。',
      },
      shape: {
        heading: '你存什么',
        body: '每个找到的条目一行。内容本身可以是纯文本或 JSON — 你定；API 从不解析它。没有展示模板时应用显示一张朴素卡片：内容开头、日期、你的展示名。能用，只是视觉朴素，而且如果你的内容是 JSON，就会显示原始 JSON。模板能修好这一点，就是下一节。',
      },
      schedule: {
        heading: '按计划运行它',
        body: '照抄任意现有采集器：一个根目录 Dockerfile，其 ENTRYPOINT 运行脚本一次，再加一个把 STAYUP_API_URL 和 STAYUP_API_KEY 放进环境来启动它的 job。不强求某种 CI — 一个 systemd timer、纯 cron，或生成器的 Ofelia 容器都一样。',
      },
    },
    templates: {
      heading: '展示模板',
      body: '模板是你的 provider 在其 register 调用的 template 字段里发送的 JSON 清单。API 把它存进 provider_registry.template，并通过 GET /connectors/providers 原样中转；每个应用都有一个引擎读取它并渲染你的行 — 一种列表布局，以及七种模式（文本、html、媒体、音频、画廊、表格、链接列表）之一的阅读面板。应用里没有任何代码知道你的 provider 名。',
      fallbackNote:
        '没有模板的 provider（从未发送、JSON 不可读、或 version 无法识别）照样能用 — 应用回退到朴素卡片。一旦你的内容不只是一行短文本，就强烈建议用模板。',
      cta: '模板完整参考',
    },
    form: {
      heading: 'form 描述符',
      body: '在模板里，一个小小的 form 块告诉各应用，你的 provider 的「添加一个新 flux」输入框应该长什么样。没有它，用户得到一个光秃秃的文本框；有它，得到一个会校验并替他构造来源 URL 的带标签字段。',
      fields: [
        {
          field: 'label · placeholder',
          meaning: '字段说什么，以及作为提示显示什么。',
        },
        {
          field: 'urlTemplate',
          meaning:
            '如 https://www.youtube.com/@{value} — {value} 是用户输入的内容。若值已是 http(s) URL 则跳过。',
        },
        {
          field: 'pattern',
          meaning: '变换后的输入必须匹配的正则，提交前在客户端校验。',
        },
        {
          field: 'transform',
          meaning:
            'trim、去掉已知前缀/后缀，或提取一个捕获组 — 好让粘贴的完整 URL 和光秃秃的 handle 最终一致。',
        },
      ],
      note: '应用把构造好的 URL 作为来源保存；你的采集器像其他任何来源一样，在自己的来源清单里收到它。',
    },
    fluxApproval: {
      heading: '审批模式',
      body: '每个 provider 在注册表里都有一个 flux_approval 模式：auto（默认）或 manual。auto 在用户添加新 flux 时立即订阅；manual 把它变成一个管理员必须批准的请求。这是运维者的设置 — 连接器不能为自己设定；管理员在 /admin/providers 按实例设定它。抓取以 manual 种付是有原因的 — 在那里运行一个来源有成本。',
      note: '这只管把一个全新来源引进来。订阅一个已存在的来源从不需审批。',
    },
    contract: {
      heading: '技术契约',
      lede: '参考资料。你写 provider 时需要它，理解 StayUp 时不需要。',
      diagramTitle: '你的脚本调用什么',
      yourScript: '你的 provider',
      announce: '声明自己',
      read: '读取',
      write: '写入',
      seed: '铺垫',
      announceDesc: '每次运行注册你的展示名 + 模板',
      readDesc: '要收集的来源，以及你上次到哪儿',
      writeDesc: '新行、一次 config 合并、错误',
      seedDesc: '追踪一个新 URL — --add 标志',
      warning:
        '连接器不持有数据库凭据，也不知道任何表名。它的密钥只在 /connector-api/<它自己的名字>/* 下有效：它不能为另一个 provider 写入，也够不到用户、管理员或订阅。',
      authHeading: '认证',
      authBody:
        '管理员为你的 provider 名签发一个连接器密钥（管理 UI → 连接器密钥，或 POST /ui/connector-keys）。密文 stayup_conn_… 只显示一次。你的脚本在每次调用时以 Authorization: Bearer <密钥> 发送它，并连同实例 URL 一起从 STAYUP_API_KEY 和 STAYUP_API_URL 读取。',
      endpointsHeading: '端点',
      retentionNote:
        '保留没有列在这里是有意为之。连接器从不删除 —— 管理员在 Web 界面的“维护”中设置内容的存活时长（全局或按提供方），由 API 上的计划任务执行清理。',
      endpointsIntro:
        '全部在 /connector-api/<name>/ 之下，全部需要密钥。大致按一次运行使用它们的顺序。',
      columnCall: '调用',
      columnPurpose: '它做什么',
      endpointPurposes: [
        '声明自己：展示名、排序、可选模板。幂等 — 每次运行都调用。sortOrder 一旦设定不会被覆盖；template 只在该字段存在时才被替换。',
        '追踪一个新 URL。对 URL 幂等：新建返回 201，已存在返回 200，被另一个 provider 占用返回 409。',
        '本次运行要收集的来源清单 — 每个带 id、url 和 config。',
        '该来源最后存储的版本，首次运行为 null — 从哪儿续。',
        '该来源已存储的所有版本 — 供需要补空缺而不只是从最新之后续的连接器。',
        '把键浅合并进该来源的 config（例如把频道标题存下来做标签）。绝不是整体替换。',
        '批量写入收集到的行。content 是一个 API 从不解析的不透明字符串。',
        '记录一次收集失败。它会进入 API 的错误日志。',
      ],
      itemHeading: '一个 item 的形状',
      itemIntro: 'POST /connector-api/<name>/items 批次里的每一行：',
      required: '必填',
      optional: '可选',
      itemFieldDescriptions: [
        '来源的 id，来自你的来源清单。',
        '一个不透明字符串 — 纯文本或一个 JSON 字符串，由你选择。',
        '本次运行的 ISO 时间戳。',
        '该来源的抓取是否成功。',
        '去重键；也显示在丰富渲染旁（一个版本标签、一个视频 id）。',
        '内容自身的时间戳，按「最新」排序时优先于 executedAt。',
        '自由 JSON；如今只有抓取 provider 用它。',
      ],
      addingSources: {
        heading: '把来源弄进来',
        body: '两种方式。一个 --add 标志，调用 POST /connector-api/<name>/sources 然后退出 — 便于从命令行铺垫。另一种，也是最终用户真正走的，是从一个应用里添加一个来源，它会 POST 到 /ui/users/<userId>/repositories；provider 字段必须等于你的名字，并会走 auto/manual 审批流程。',
      },
      checklist: {
        heading: '在你说完成之前',
        items: [
          '每次运行都调用，带上你的展示名和（建议）你的模板。',
          '给你本次运行要收集的来源。',
          '把新行一批发送，针对已存储版本去重。',
          '告诉你每个来源上次到哪儿。',
          '按来源的失败被上报，而不是让本次运行崩掉。',
          '运行一次后列出你的 provider。',
        ],
      },
    },
  },

  tutorial: {
    meta: {
      title: 'StayUp — 写一个 connector',
      description: '一个从空文件夹搭起、完整可用的 Hacker News StayUp connector —— 逐步复制。',
    },
    eyebrow: 'Providers',
    title: '写一个 connector，逐步',
    lede: '一个文件，约 90 行，没有自己的 API key。它跟踪 Hacker News 的列表（top、best、new…），保留没见过的 story，交给 stayup-api。按顺序复制每一段；整份文件在末尾。',

    intro: {
      heading: '你在搭什么',
      body: '一个叫 hackernews 的 connector。每个被跟踪的来源是一个 Hacker News 列表端点 —— https://hacker-news.firebaseio.com/v0/topstories.json 等。每次运行脚本读取列表，取回还没存过的最新 story 并发送。它只通过 HTTP 跟 stayup-api 通信；从不碰数据库。',
      note: 'Firebase 的 Hacker News API 不需要 key、不需要 User-Agent，也没有限流 —— 所以很适合作为第一个目标。',
    },

    prereqs: {
      heading: '开始之前',
      items: [
        'Python 3.11+ 和 pip。',
        '一个你能访问的 stayup-api 实例（公共的，或你自己的）。',
        '一个作用于 provider hackernews 的连接器密钥，在该实例的管理后台创建：连接器密钥 → 新建密钥，provider 选 hackernews。密文只显示一次。',
      ],
    },

    steps: {
      heading: '步骤',
      setup: '建好文件夹，把两个环境变量指向你的实例和它的密钥。',
      helper:
        '一个文件，check_hn.py。先写 import 和唯一的 api() 辅助函数 —— 对 stayup-api 的每次调用都走它，带上 Bearer 密钥。',
      template:
        '每次运行 connector 都会声明自己：展示名和一个展示模板 —— 各 app 据以渲染它的行的 JSON，无需每个 app 写代码。stayup-api 存下它并原样中转。',
      fetch:
        '唯一跟 Hacker News 相关的部分：读一个列表端点，取每个 story，拼成一行。version 是去重键 —— story id 的字符串形式。content 是不透明的 JSON 字符串；上面的模板告诉各 app 怎么读它。',
      collect:
        '对每个被跟踪的来源：问 API 已经有哪些 version，只留下新的 story，一批发出。某个来源出错就上报给 API，而不是抛出。',
      main: '入口：register，然后要么 --add 一个列表端点，要么跑一遍采集。',
    },

    run: {
      heading: '运行它',
      body: '跟踪一两个列表，然后跑一次真正的运行。provider 现在存在了 —— 它出现在 GET /connectors/providers 和各 app 里，用户可以订阅。',
      note: '这个 connector 每次运行最多保留 STORIES_PER_RUN 行，从不删除；修剪旧内容是另一回事 —— 见 provider 契约。',
    },

    schedule: {
      heading: '放到调度里',
      body: '想容器化就加一个 Dockerfile，再加一个定时的 GitHub Actions 工作流 —— 或任何 cron。把 STAYUP_API_URL 和 STAYUP_API_KEY 设为仓库 secret。',
    },

    full: {
      heading: '整份文件',
      body: 'check_hn.py 一整份 —— 上面六段，按顺序。',
    },

    next: {
      heading: '从这里出发',
      body: '把 fetch_stories 换成你自己的来源，调一下模板 —— 这就是全部工作。参考实例运行的 5 个采集器（changelog、youtube、rss、scrap、github-trending）是更完整的例子；rss 最短。每个 connector 遵循的契约在 provider 页面。',
      cta: 'provider 契约',
    },
  },
}
