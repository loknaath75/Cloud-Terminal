# Cloud-Terminal

Cloud Computing Lab experiments and implementations covering Storage as a Service (STaaS), Platform as a Service (PaaS) / Hosting, and Database as a Service (DBaaS).

## 📁 Repository Structure

| Folder | Module | Tech Stack / Services | Description |
|---|---|---|---|
| [`Dropbox/`](./Dropbox) | Storage as a Service (STaaS) | React + Vite, Dropbox API | Cloud file upload and storage management via Dropbox API |
| [`Firebase/`](./Firebase) | Platform as a Service (PaaS) | React + Vite, Firebase (Auth, Firestore, Hosting) | Real-time task management with Google Auth, Firestore DB, and Firebase Hosting |
| [`MongoDB/`](./MongoDB) | Database as a Service (DBaaS) | Node.js, Express, MongoDB Atlas, React + TypeScript | Full-stack cloud expense tracker connected to MongoDB Atlas M0 cluster |

---

## 🚀 Quick Start

### 1. Dropbox (STaaS)
```bash
cd Dropbox
npm install
npm run dev
```

### 2. Firebase (PaaS / Hosting & Firestore)
```bash
cd Firebase
npm install
npm run dev
# To deploy:
firebase deploy --only hosting
```

### 3. MongoDB (DBaaS - Backend & Frontend)
```bash
# Terminal 1 - Backend
cd MongoDB/backend
npm install
npm start

# Terminal 2 - Frontend
cd MongoDB/frontend
npm install
npm run dev
```

For detailed configuration guides for each service, refer to individual README files in each folder or [`MongoDB/README.md`](./MongoDB/README.md).