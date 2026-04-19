# 稳胜石材项目

本仓库拆分为两个可以独立部署的静态项目：

- `site/`：公开官网，包含产品、博客、OEM/ODM 服务和询盘流程。
- `admin/`：独立管理后台原型，用于产品、博客和素材内容发布。

每个目录都可以作为独立静态项目部署。在 Vercel 上可以从同一个仓库创建两个项目，并分别将 Root Directory 设置为 `site` 或 `admin`。

## 本地预览：

在仓库根目录启动一个本地静态服务器：

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

然后打开：

- 公开官网：`http://127.0.0.1:4173/site/`
- 管理后台：`http://127.0.0.1:4173/admin/`

## 部署方式说明：

在 Vercel 中创建两个独立项目，分别对应：

- 官网项目 `site/` → `winwinstonecustom`
- 后台项目 `admin/` → `winwinstoneadmin`

两个项目都指向同一个 Git 仓库，但使用不同的 Root Directory：

```shell
# 官网
cd site
vercel --prod

# 后台
cd admin
vercel --prod
```

首次部署时，Vercel 会引导你完成项目设置。对于官网项目，示例部署过程如下：

```shell
joeljhou@macos site % vercel --prod
? Set up and deploy “~/CodeHub/joeljhou/projects/winwinstone/site”? yes
? Which scope should contain your project? geekyspace-team
? Link to existing project? no
? What’s your project’s name? winwinstonecustom
? In which directory is your code located? ./
> No framework detected. Default Project Settings:

- Build Command: `npm run vercel-build` or `npm run build`
- Development Command: None
- Install Command: `yarn install`, `pnpm install`, `npm install`, or `bun install`
- Output Directory: `public` if it exists, or `.`
? Want to modify these settings? no
? Do you want to change additional project settings? no
🔗  Linked to geekyspace-projects/winwinstonecustom (created .vercel and added it to .gitignore)
🔍  Inspect: https://vercel.com/geekyspace-projects/winwinstonecustom/GV6sE8q6BiZ3kEdeJzkbxsyok6Ns [3s]
✅  Production: https://winwinstonecustom-8ayf1buj4-geekyspace-projects.vercel.app [11s]
🔗  Aliased: https://winwinstonecustom.vercel.app [11s]
```

后续只需要进入对应目录并运行 `vercel --prod` 即可更新部署。