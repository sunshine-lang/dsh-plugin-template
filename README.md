# {{TITLE}}（dsh-plugin 模板）

[English](README.en.md) | 中文

一个开箱即用的 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 插件骨架。一切皆插件：本模板把 bundle 格式、工具 DSL、配置校验、测试与发布清单集中在一个项目里。

## 快速开始

```sh
# 1. 用模板生成一个新插件
node scripts/scaffold.mjs dsh-myplugin --description "what it does"

# 2. 修改骨架
cd ../dsh-myplugin
#    - src/index.ts：把演示用的 `hello` 工具替换成你的能力
#    - src/index.ts：调整 Config 字段
#    - README.md：补充安装、用法、配置说明

# 3. 在 DeepSeek Harness 仓库内测试
#    （要求模板位于 <checkout>/scratch-plugin/dsh-plugin-template）
node --import tsx/esm scratch-plugin/dsh-myplugin/test-integration.ts

# 4. 构建（提交 lib/——用户安装无需构建权限）
pnpm exec tsc -p tsconfig.local.json   # 在 harness 仓库内
# 或独立克隆后安装依赖再构建：
npm install && npm run build

# 5. 在 Web UI 中试运行（从 harness 仓库）
pnpm dsh --profile web --patch ./scratch-plugin/dsh-myplugin/cordis.patch.yml
```

## 发布清单

- [ ] npm 包名可用（`curl -s -o /dev/null -w "%{http_code}" https://registry.npmjs.org/<name>` → 404）
- [ ] `lib/` 已构建并提交（GitHub 安装不运行构建脚本）
- [ ] package.json 的 `repository` 字段指向你的 GitHub 仓库
- [ ] README 说明了安装、用法和每个 Config 配置项
- [ ] 推送到 GitHub 时使用**独立仓库**（一插件一仓库是生态惯例；`dsh plugin add "github:you/repo"` 需要包根目录）
- [ ] 添加话题：`dsh-plugin`、`deepseek-harness`
- [ ] （可选）`npm publish`——用户之后可 `dsh plugin add <name>`
- [ ] （可选）把仓库提交到 [awesome-deepseek-harness](https://github.com/0xsline/awesome-deepseek-harness)（README.md + README.zh-CN.md，各一行）

## 目录结构

```
├── package.json           # dsh.bundle.patch —— bundle 清单
├── cordis.patch.yml       # profile 挂载本 bundle 时插入的层
├── src/index.ts           # 插件本体：name / inject / Config / apply + 工具
├── test-integration.ts    # 无 key 的 harness 上下文测试
├── tsconfig.json          # 干净的构建配置（随包发布）
└── tsconfig.local.json    # 在 harness 仓库内构建（工作区类型路径）
```

## 值得保留的约定（踩坑总结）

- **可选工具参数要省略 `required`**——写 `required: false` 会被 schema 编译器拒绝。
- **用 Schemastery 定义 Config**（`@deepseek-ai/schemastery` 的 `z.object`）：所有可调项都是 Config 字段，无效配置在加载时响亮失败。
- **对完整结果施加边界**：限制文件大小、页数、字符数；在有意义的边界截断，并告诉模型如何继续。
- **Node 解析**：相对导入使用 `.js` 后缀（NodeNext ESM）；`@deepseek-ai/*` 依赖声明在 `dependencies` 中，从 profile 的 node_modules 解析。
- **pnpm workspace 子目录里跑 `npm install` 会失败**（`workspace:` 协议）——独立开发请在 harness 仓库外脚手架；在仓库内构建请用 `tsconfig.local.json`。

## 同作者更多插件

该作者的全部 DeepSeek Harness 插件（统一入口）：[dsh-plugins](https://github.com/sunshine-lang/dsh-plugins)

## 许可证

MIT。
