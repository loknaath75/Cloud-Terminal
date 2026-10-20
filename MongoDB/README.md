# Cloud Computing Lab - Configuration & Setup Guide

This guide contains step-by-step instructions to configure and run the Cloud Computing lab experiments, including **MongoDB Atlas**, **Firebase Firestore (Ex. 3)**, and **Dropbox STaaS**.

---

## 1. MongoDB Atlas Configuration (Expense Tracker / 68IT004-CC)

### Step 1: Create a MongoDB Atlas Account & Cluster
1. Sign in to [MongoDB Atlas](https://cloud.mongodb.com/).
2. Click **Create** and select the **M0 Free Tier** cluster.
3. Choose your preferred cloud provider and region (e.g., AWS / Mumbai - `ap-south-1`).
4. Click **Create Deployment**.

### Step 2: Configure Database User Access
1. In the left navigation bar, go to **Security** → **Database Access**.
2. Click **Add New Database User**.
3. Select **Password Authentication**.
4. Enter a **Username** (e.g., `loknaath759106_db_user`) and a secure **Password** (e.g., `webdev@14`).
5. Under **Database User Privileges**, select **Read and write to any database**.
6. Click **Add User**.

### Step 3: Configure Network Access (IP Whitelist)
1. In the left navigation bar, go to **Security** → **Network Access**.
2. Click **Add IP Address**.
3. Click **Allow Access from Anywhere** (`0.0.0.0/0`) so requests from your local machine can connect.
4. Click **Confirm**.

### Step 4: Get Connection String & URL-Encode Special Characters
1. In **Deployment** → **Database**, click the **Connect** button on your cluster.
2. Select **Drivers** (Node.js).
3. Copy the connection string format:
   ```text
   mongodb+srv://<username>:<password>@cluster0.<cluster-id>.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```
4. **CRITICAL**: If your password contains special characters (e.g., `@`, `:`, `/`, `?`, `#`), you **must URL-encode** them:
   - `@` becomes `%40`
   - Example: `webdev@14` → `webdev%4014`
   - Connection String:
     ```text
     mongodb+srv://loknaath759106_db_user:webdev%4014@cluster0.unn59vq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
     ```

### Step 5: Update `backend/.env`
In `backend/.env`:
```env
MONGODB_URI=mongodb+srv://loknaath759106_db_user:webdev%4014@cluster0.unn59vq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
PORT=6000
```

### Step 6: Start Backend & Frontend
```bash
# Terminal 1 - Backend
cd backend
npm install
npm start

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

---

## 2. Firebase Firestore Configuration (Ex. 3)

### Step 1: Create a Firebase Project
1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** (or select an existing project, e.g., `terminal-lab-d7ed1`).
3. Enter your project name and click **Continue** (Google Analytics can be disabled for lab).
4. Click **Create Project**.

### Step 2: Register Web App to Get Config Credentials
1. On the Project Overview / Home page, click the **Web icon `</>`** to add an app.
2. Enter an App nickname (e.g., `lab-ex3-web`).
3. Click **Register app**.
4. Firebase will display your `firebaseConfig` object:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyDwkheIodqAQORnDd9NrDj5OJq0jWWncKY",
     authDomain: "terminal-lab-d7ed1.firebaseapp.com",
     projectId: "terminal-lab-d7ed1",
     storageBucket: "terminal-lab-d7ed1.firebasestorage.app",
     messagingSenderId: "1039170619541",
     appId: "1:1039170619541:web:7591163d98237a8437339c"
   };
   ```

### Step 3: Enable Firestore Database
1. In the Firebase console left menu, navigate to **Build** → **Firestore Database**.
2. Click **Create database**.
3. Choose a location closest to you (e.g., `asia-south1`).
4. Under Security Rules, select **Start in test mode** (allows read/write during development and lab exams).
5. Click **Enable**.

### Step 4: Update `src/firebase.js` in Ex. 3
Open `src/firebase.js` and paste your project credentials:
```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

### Step 5: Run Ex. 3 Application
```bash
npm install
npm run dev
```

---

## 3. Dropbox API Token Configuration (Dropbox STaaS)

### Step 1: Create a Dropbox App
1. Go to the [Dropbox App Console](https://www.dropbox.com/developers/apps).
2. Click **Create app**.
3. Choose **Scoped access**.
4. Choose access type: **Full Dropbox** (or **App folder** depending on lab requirements).
5. Name your app (e.g., `cloud-lab-uploader-<your-id>`).
6. Click **Create app**.

### Step 2: Configure Scopes & Permissions
1. Under the **Permissions** tab of your app:
   - Check `files.content.write` (allows uploading files).
   - Check `files.content.read` (allows listing/downloading files).
   - Check `files.metadata.read` and `files.metadata.write`.
2. Click **Submit** at the bottom to save permissions.

### Step 3: Generate Generated Access Token
1. Go to the **Settings** tab of your Dropbox app.
2. Scroll to the **OAuth 2** section.
3. Under **Generated access token**, click the **Generate** button.
4. Copy the long token string starting with `sl.u....`.

> [!NOTE]
> Dropbox generated access tokens are short-lived (valid for ~4 hours). If your token expires during the exam, click **Generate** again in the Dropbox console and update `DEFAULT_TOKEN`.

### Step 4: Update `src/App.jsx` in Dropbox Project
In `Dropbox/src/App.jsx`:
```javascript
const DEFAULT_TOKEN = 'sl.u.YOUR_COPIED_TOKEN_HERE';
```

### Step 5: Run Dropbox App
```bash
npm install
npm run dev
```
