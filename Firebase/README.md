# Firebase + React (Vite) Deployment Guide

This project is a React application built with Vite and connected to Google Firebase (Authentication, Firestore, and Hosting).

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Step 1: Get and Modify Firebase Config](#step-1-get-and-modify-firebase-config)
3. [Step 2: Local Development & Testing](#step-2-local-development--testing)
4. [Step 3: Firebase CLI Authentication & Project Selection](#step-3-firebase-cli-authentication--project-selection)
5. [Step 4: Build and Deploy to Firebase Hosting](#step-4-build-and-deploy-to-firebase-hosting)
6. [Useful Firebase CLI Commands](#useful-firebase-cli-commands)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- **Node.js** (v18+ or v20+ recommended)
- **Firebase CLI** installed globally:
  ```powershell
  npm install -g firebase-tools
  ```

---

## Step 1: Get and Modify Firebase Config

### 1. Retrieve Config from Firebase Console
1. Open the [Firebase Console](https://console.firebase.google.com/) and sign in.
2. Select your project (or click **Add project** to create one).
3. Click the **Settings gear icon (⚙️)** in the top-left sidebar next to **Project Overview** → **Project settings**.
4. In the **General** tab, scroll down to the **Your apps** card:
   - If a Web app already exists, select **Config** under **SDK setup and configuration**.
   - If not registered yet, click the **Web icon (`</>`)**, enter an app nickname (e.g. `firebase-app`), and click **Register app**.
5. Copy the configuration object:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

### 2. Update Configuration in the Code
Paste the copied keys into [`src/firebase.js`](src/firebase.js):

```javascript
// src/firebase.js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. Enable Required Firebase Services in Console
- **Authentication**: Go to **Build** → **Authentication** → **Get Started** → enable **Google** (or Email/Password).
- **Firestore Database**: Go to **Build** → **Firestore Database** → **Create database** (choose **Start in test mode** for lab development).

---

## Step 2: Local Development & Testing

1. Install project dependencies:
   ```powershell
   npm install
   ```

2. Start the local Vite development server:
   ```powershell
   npm run dev
   ```

3. Open the displayed local URL (usually `http://localhost:5173`) to verify Firebase connection status.

---

## Step 3: Firebase CLI Authentication & Project Selection

1. **Log in to Firebase CLI**:
   ```powershell
   firebase login
   ```
   *(This opens a browser window for Google authentication).*

2. **List available Firebase projects**:
   ```powershell
   firebase projects:list
   ```

3. **Set the active project** to match your `projectId` in `src/firebase.js`:
   ```powershell
   firebase use <YOUR_PROJECT_ID>
   ```
   *(e.g., `firebase use terminal-lab-d7ed1`)*

   > This updates the `.firebaserc` file automatically with your active target project.

---

## Step 4: Build and Deploy to Firebase Hosting

### 1. Build the Production Bundle
Compile the React frontend into static assets in the `dist/` directory:

```powershell
npm run build
```

### 2. Verify Hosting Configuration
Ensure [`firebase.json`](firebase.json) points to the `dist` folder:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### 3. Deploy to Firebase
Run the deployment command:

```powershell
firebase deploy --only hosting
```

### 4. Open Live App
Upon successful deployment, Firebase outputs your live site URLs:
- `https://<YOUR_PROJECT_ID>.web.app`
- `https://<YOUR_PROJECT_ID>.firebaseapp.com`

---

## Useful Firebase CLI Commands

| Command | Description |
|---|---|
| `firebase login` | Authenticate with your Google account |
| `firebase projects:list` | Show all projects accessible by your account |
| `firebase use <project-id>` | Switch the active deployment project |
| `npm run build` | Build the Vite React app for production into `dist/` |
| `firebase deploy --only hosting` | Deploy only the static hosting files |
| `firebase hosting:channel:deploy <channel-name>` | Deploy to a preview channel before production |

---

## Troubleshooting

- **Deploying to the wrong project?**
  Run `firebase projects:list` to see your project IDs, then run `firebase use <correct-project-id>`.
- **404 / Page Not Found on refresh?**
  Make sure the `rewrites` rule in [`firebase.json`](firebase.json) redirects `**` to `/index.html`.
- **Changes not reflecting on the live site?**
  Always remember to run `npm run build` **before** running `firebase deploy --only hosting`.
