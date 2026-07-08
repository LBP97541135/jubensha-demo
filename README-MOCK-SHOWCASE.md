# evo-murder-game Mock Showcase

这个目录是独立的纯前端展示副本，只用于部署到 GitHub Pages 给外部人员看效果。

## 边界说明

- 不属于真实项目运行链路。
- 不连接真实后端、数据库、LLM 或 evomap。
- 不要求真实项目引用本目录里的任何代码。
- 不应该把这里的 mock 数据、mock API、GitHub Pages 配置合并回真实后端项目。
- 真实项目仍以 `evo-murder-game` 原仓库为准；本目录只是从完整前端复制出来的静态展示版。

## 展示版目标

- 保留现有完整前端的页面结构、视觉风格、素材、开屏、导航、剧本库、入局页和游戏页。
- 只替换数据来源：所有接口在 mock 模式下返回本地静态数据。
- 支持无后端、无数据库、无 LLM 的静态部署。
- 入口为 `/#/mock`，进入后会打开本地 mock 模式并跳转到原有 `/play/xiutie-avenue-missing-three-minutes` 流程。

## 本地运行

```bash
cd web
npm install
npm run build
npm run preview -- --host 127.0.0.1 --port 4174
```

浏览器访问：

```text
http://127.0.0.1:4174/#/mock
```

## GitHub Pages 部署

构建产物在：

```text
web/build
```

部署时只需要把 `web/build` 作为静态站点发布即可。Vite 已设置 `base: "./"`，路由使用 `HashRouter`，适合 GitHub Pages 的子路径部署。

## Mock 数据位置

```text
web/src/mockShowcase/mockApi.ts
```

这里包含：

- 剧本信息
- 角色信息
- Agent/persona 展示数据
- 线索池
- 私人剧本章节
- 会话创建与阶段推进
- 搜证、出示证据、投票、真相揭示
- 本地 scripted fallback 发言

## 注意事项

- 展示版可以复用真实前端的组件和素材，但不能反向成为真实项目依赖。
- 若真实项目前端以后大改，可以重新复制一份展示目录，再把 mock 数据层迁移过去。
- 如果要给别人演示，请从 `/#/mock` 进入，避免访问普通路径时尝试真实 API。
