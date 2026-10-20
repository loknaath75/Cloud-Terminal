# Dropbox API File Uploader (Storage as a Service)

A simple, lightweight Vite + React application created to integrate the Dropbox API for Cloud Storage as a Service (STaaS).

---

## 🛠️ Configuration Steps (How to Get Dropbox API Token)

1. **Go to Dropbox App Console**:
   Visit [https://www.dropbox.com/developers/apps](https://www.dropbox.com/developers/apps) and sign in.

2. **Create New App**:
   - Click **"Create app"**
   - Choose: **Scoped access**
   - Choose: **Full Dropbox** (or *App folder*)
   - Name your app (e.g. `STaaS-Dropbox-Uploader`)

3. **Enable Permissions**:
   - Go to the **Permissions** tab
   - Enable:
     - `files.content.write` (to upload files)
     - `files.content.read` (to read/access files)
     - `files.metadata.read`
   - Click **Submit** at the bottom.

4. **Generate Access Token**:
   - Go to the **Settings** tab
   - Scroll to the **OAuth 2** section
   - Click **"Generate"** next to *Generated access token*

5. **Upload**:
   - Paste the generated token into the web app
   - Choose your file and click **"Upload to Dropbox"**!

---

## 🚀 Running the App

```bash
npm run dev
```

Server URL: `http://localhost:5174/`
