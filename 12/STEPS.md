# Experiment 12 — CloudAnalyst Simulation (GUI Simulation)

This folder contains the complete step-by-step guide to install, configure, and execute cloud environment simulations using **CloudAnalyst** in **Apache NetBeans IDE**.

---

## 🎯 Aim:
To perform cloud simulation using **CloudAnalyst** and analyze the performance and response times of a cloud computing environment.

---

## 💻 Requirements:
- **Java SE Development Kit (JDK)** (JDK 8 is recommended for native NetBeans/CloudAnalyst Swing GUI compatibility)
- **Apache NetBeans IDE** (or NetBeans 8.2 / latest Apache NetBeans)
- **CloudAnalyst Source Project** (NetBeans project format from SourceForge)

---

## 🔗 Reference Download Links:
- **CloudAnalyst on SourceForge:** [https://sourceforge.net/projects/cloudanalyst/](https://sourceforge.net/projects/cloudanalyst/)
- **Apache NetBeans IDE:** [https://netbeans.apache.org/front/main/download/](https://netbeans.apache.org/front/main/download/)
- **Oracle JDK Downloads:** [https://www.oracle.com/java/technologies/downloads/](https://www.oracle.com/java/technologies/downloads/)

---

## 📝 Step-by-Step Procedure:

### Step 1: Download CloudAnalyst
1. Visit the SourceForge link: [https://sourceforge.net/projects/cloudanalyst/](https://sourceforge.net/projects/cloudanalyst/)
2. Download the latest `CloudAnalyst` zip package (e.g., `CloudAnalyst.zip` or NetBeans project archive).
3. Extract the ZIP file to an easily accessible folder on your computer (e.g. `C:\CloudAnalyst` or within your workspace).

### Step 2: Install Apache NetBeans
1. Download the Windows x64 installer for Apache NetBeans from the official website.
2. Run the installer and complete the setup by following the on-screen wizard instructions.
3. Ensure NetBeans is configured to point to your installed JDK.

### Step 3: Open the Project in NetBeans
1. Launch **Apache NetBeans IDE**.
2. Go to the top menu: **File** → **Open Project...** (or press `Ctrl + Shift + O`).
3. Browse to the directory where you extracted CloudAnalyst.
4. Select the project folder (it will be indicated by the NetBeans Java project icon) and click **Open Project**.

### Step 4: Run the Project
1. In the NetBeans toolbar, click the green **Run Project** button (▶️) or press `F6`.
2. If a dialog appears asking to select the Main Class, select:
   ```text
   cloudsim.ext.gui.CloudSimGUI
   ```
   (or the default main class detected by NetBeans) and click **Select Main Class**.
3. The CloudAnalyst graphical user interface (World Map with regions 0 to 5) will launch.

### Step 5: Configure the Simulation
1. On the CloudAnalyst main GUI screen, click the **Configure Simulation** button.
2. Adjust the simulation parameters according to your lab experiment scenario:
   - **User Bases:** Define user regions (Region 0 to Region 5), peak hours, average requests per user per hour.
   - **Data Centers:** Set the number of physical Data Centers, their geographic regions, number of physical host machines, RAM, storage, and processors per host.
   - **Virtual Machines (VMs):** Configure VM image size, memory, and bandwidth.
   - **Service Broker Policy:** Choose routing policies such as:
     - *Closest Data Center*
     - *Optimize Response Time*
     - *Reconfigure Dynamically*
   - **VM Load Balancing Policy:** Select the allocation algorithm:
     - *Round Robin*
     - *Equally Spread Current Execution Load (ESCE)*
     - *Throttled*
3. After setting all parameters, click the **Done** button.

### Step 6: Run the Simulation
1. Back on the main CloudAnalyst dashboard, click **Run Simulation**.
2. Wait for the simulation progress bar to finish processing all cloudlet requests.
3. Review the generated performance analytics and visual charts:
   - **Overall Response Time:** Average, minimum, and maximum response times across all user bases.
   - **Data Center Request Processing Time:** Servicing latency at each data center.
   - **Data Center Loading & Cost:** Virtual machine utilization and financial costs (VM cost, data transfer cost, storage cost).

---

## 📊 Summary of Key CloudAnalyst Load Balancing Policies:

| Policy | Mechanism | Best Use Case |
|---|---|---|
| **Round Robin** | Distributes incoming VM allocation requests in circular, cyclic order across all available hosts. | Uniform workloads with identical VM requirements. |
| **Equally Spread Current Execution Load (ESCE)** | Tracks the active load of all VMs and allocates jobs to the VM with the least current workload. | Dynamic traffic with varying task execution lengths. |
| **Throttled** | Maintains an active index of VM states; assigns only one request per VM at a time until threshold capacity is reached. | Preventing host overload in latency-sensitive cloud services. |

---

## 🏆 Result:
Thus, the CloudAnalyst simulation environment was configured and executed successfully in Apache NetBeans, and the cloud performance metrics were analyzed.
