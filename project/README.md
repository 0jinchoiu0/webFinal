# 校園心理健康中心

## 專案說明

本專案為「校園心理健康中心」系統，包含：

- `server`：Express API + SQLite 後端
- `client`：Vue 3 + Vite 前端

此專案可作為校園心理健康資源展示、文章推薦與諮商預約系統，符合「前後端、資料庫、純 HTML/CSS/JS」需求。

## 功能

- 查看諮商師資訊
- 查看心理健康文章
- 查看服務時段與諮商類型
- 預約諮商並送出表單

## 專案架構

```
/project
  /server
  /client
```

## 參考來源

- 參考 GitHub 上的校園諮商系統與心理健康資源網站設計
- 參考 Vite + Vue 專案結構與 Express API 分離架構

## 啟動方式

1. 安裝 server 依賴

```bash
cd project/server
npm install
```

2. 安裝 client 依賴

```bash
cd ../client
npm install
```

3. 啟動 server

```bash
cd ../server
npm start
```

4. 啟動 client

```bash
cd ../client
npm run dev
```

5. 開啟瀏覽器並訪問

```
http://localhost:5174
```

## 資料來源說明

本系統使用 AI 生成模擬的校園心理健康資源與預約資料，包含：

- 諮商師名單
- 心理健康文章標題與摘要
- 服務時段說明
- 預約紀錄

## GitHub 提交與本地執行

本專案代碼已提交至 GitHub：`https://github.com/0jinchoiu0/webFinal`

任何人可以 clone 後在本地執行此專案。

### 本地執行步驟

按照上述「啟動方式」的步驟 1-5 即可：

1. 安裝 server 依賴並啟動後端
2. 安裝 client 依賴並啟動前端
3. 瀏覽器開啟 `http://localhost:5174`

### 本地編譯打包

若要測試生產環境的前端打包：

```bash
cd project/client
npm install
npm run build
```

產生的 `dist` 資料夾會被 Express 提供為靜態檔案。