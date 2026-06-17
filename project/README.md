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

## 部署

本專案支援單一 Azure App Service 部署，讓 `project/server` 同時提供 API 與前端靜態頁面。

### Azure App Service（建議）

1. 在 Azure Portal 建立 Resource Group
2. 建立 App Service Plan（Linux）
3. 建立 Node.js Web App，Runtime 選 `NODE|20-lts`
4. 下載 Azure App Service 的 Publish Profile
5. 在 GitHub repository 加入 workflow 檔案，並設定 Azure Publish Profile secrets

### GitHub Actions 自動部署

新增 `.github/workflows/azure-deploy.yml` 檔案，內容如下：

```yaml
name: Azure App Service Deploy

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install client dependencies
        run: |
          cd project/client
          npm install

      - name: Build client
        run: |
          cd project/client
          npm run build

      - name: Install server dependencies
        run: |
          cd project/server
          npm install

      - name: Deploy to Azure Web App
        uses: azure/webapps-deploy@v4
        with:
          app-name: ${{ secrets.AZURE_WEBAPP_NAME }}
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
          package: project/server
```

### Azure Secrets

在 GitHub repository 的 Settings > Secrets and variables > Actions 中建立：

- `AZURE_WEBAPP_NAME`
- `AZURE_WEBAPP_PUBLISH_PROFILE`

### 本地部署測試

確認後端可執行：

```bash
cd project/server
npm install
npm start
```

確認前端可打包：

```bash
cd project/client
npm install
npm run build
```

部署完成後，Azure App Service 會同時提供前端靜態檔案與 API。