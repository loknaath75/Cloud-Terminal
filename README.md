# Cloud-Terminal

Cloud Computing Lab experiments and implementations covering Storage as a Service (STaaS), Platform as a Service (PaaS) / Hosting, Database as a Service (DBaaS), Hadoop & MapReduce, Parallel Processing (MPI & OpenMP), Apache Spark, and Cloud Simulation with CloudSim & CloudAnalyst.

## 📁 Repository Structure

| Folder | Module | Tech Stack / Services | Description |
|---|---|---|---|
| [`Dropbox/`](./Dropbox) | Storage as a Service (STaaS) | React + Vite, Dropbox API | Cloud file upload and storage management via Dropbox API |
| [`Firebase/`](./Firebase) | Platform as a Service (PaaS) | React + Vite, Firebase (Auth, Firestore, Hosting) | Real-time task management with Google Auth, Firestore DB, and Firebase Hosting |
| [`MongoDB/`](./MongoDB) | Database as a Service (DBaaS) | Node.js, Express, MongoDB Atlas, React + TypeScript | Full-stack cloud expense tracker connected to MongoDB Atlas M0 cluster |
| [`8/`](./8) | Experiment 8 | Hadoop 3.3.6, Java 11, HDFS, YARN | Single-node Hadoop cluster setup and Word Count MapReduce execution |
| [`9/`](./9) | Experiment 9 | Python (`mpi4py`), C++ (`OpenMP`), MPICH / OpenMPI | Parallel processing with MPI distributed memory and OpenMP shared memory threads |
| [`10/`](./10) | Experiment 10 | Apache Spark, Scala, Spark Shell, HDFS | Apache Spark single-node setup and WordCount execution on local files and HDFS |
| [`11/`](./11) | Experiment 11 (A & B) | Java, CloudSim 5.0 / 3.0.3, Eclipse | CloudSim installation steps (11A) and resource allocation algorithm code (11B) |
| [`12/`](./12) | Experiment 12 | Java, CloudAnalyst, Apache NetBeans | CloudAnalyst GUI simulation configuration and performance analysis |

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

### 4. Experiment 8 (Hadoop & MapReduce WordCount)
- Follow the setup and terminal execution steps in [`8/STEPS.txt`](./8/STEPS.txt).
- MapReduce code: [`8/WordCount.java`](./8/WordCount.java).

### 5. Experiment 9 (MPI & OpenMP Parallel Processing)
- Follow the setup and execution steps in [`9/STEPS.md`](./9/STEPS.md) or [`9/STEPS.txt`](./9/STEPS.txt).
- MPI Python code: [`9/mpi_example.py`](./9/mpi_example.py).
- OpenMP C++ codes: [`9/hello_omp.cpp`](./9/hello_omp.cpp), [`9/loop_parallel.cpp`](./9/loop_parallel.cpp), [`9/critical.cpp`](./9/critical.cpp).

### 6. Experiment 10 (Apache Spark WordCount)
- Follow the setup and execution steps in [`10/STEPS.md`](./10/STEPS.md) or [`10/STEPS.txt`](./10/STEPS.txt).
- Spark Scala commands: [`10/wordcount.scala`](./10/wordcount.scala).
- Sample input text: [`10/input.txt`](./10/input.txt).

### 7. Experiment 11 (CloudSim)
- Follow the setup and execution steps in [`11/STEPS.md`](./11/STEPS.md).
- Allocation code for 11(B): [`11/BasicResourceAllocation.java`](./11/BasicResourceAllocation.java).

### 8. Experiment 12 (CloudAnalyst)
- Follow the GUI simulation setup and execution guide in [`12/STEPS.md`](./12/STEPS.md).

---

For detailed configuration guides for each service, refer to individual README and STEPS files in each folder.