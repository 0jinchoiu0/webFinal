# webFinal

本工作區原始範本包含 Vue 3 + Vite 前端快速啟動架構。

> 真正專案內容已遷移到 `project/` 目錄，請以 `project/client` 和 `project/server` 為主。
>
> 詳細說明請參考 `project/README.md`。

## Root 文件注意事項

- `project/client`：Vue 3 + Vite 前端應用
- `project/server`：Express + SQLite 後端 API
- `project/server/data`：SQLite 資料庫檔案，會於啟動時自動建立

## 不要使用這個根目錄的舊前端配置

根目錄中的 `index.html`、`src/`、`vite.config.js` 等僅為原始範本，不屬於最終提交的專案內容。

## 使用流程

1. 進入 `project/server` 安裝並啟動後端
2. 進入 `project/client` 安裝並啟動前端

## 參考說明

請直接參考 `project/README.md` 來啟動與測試專案，避免使用本根目錄的範本指令。

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```
