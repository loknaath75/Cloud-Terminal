# Experiment 10 — Apache Spark Installation & WordCount Execution

This guide covers setting up **Apache Spark** on Ubuntu and executing the **WordCount** application in `spark-shell` using both the **Local File System** and **HDFS**.

---

## 🎯 Aim:
To install and configure Apache Spark on a single-node cluster and execute a WordCount program using the interactive Spark Shell (`spark-shell`) on local files and HDFS.

---

## 💻 Environment & Prerequisites:
- **Ubuntu OS** (VM or native)
- **Java** (OpenJDK 8 or 11)
- **Scala**
- **Apache Spark** (e.g. Spark 3.x with Hadoop 3)
- **Hadoop HDFS** *(optional, for HDFS execution in Step 8)*

---

## 📝 Step-by-Step Procedure:

### Step 1 — Check Java and Scala
Open your Ubuntu terminal and check versions:
```bash
java -version
scala -version
```

If Java is not installed:
```bash
sudo apt update
sudo apt install default-jdk -y
```

If Scala is not installed:
```bash
sudo apt install scala -y
```

Check if Spark is already installed on the system:
```bash
spark-shell --version
```
> If the `spark-shell` command is found, skip directly to **Step 4**. Otherwise, continue with Step 2.

---

### Step 2 — Download and Install Apache Spark
Check whether `/usr/local/spark` already exists:
```bash
ls /usr/local/spark/bin/spark-shell
```
If the file exists, skip to **Step 3**.

Otherwise, download an Apache Spark binary distribution (compatible with your Hadoop version) from the [Apache Spark Downloads Page](https://spark.apache.org/downloads.html).

Extract the `.tgz` archive:
```bash
cd ~/Downloads
tar -xzf spark-*.tgz
```

Move the extracted folder to `/usr/local/spark`:
```bash
sudo mv spark-<extracted-folder-name> /usr/local/spark
```
*(Replace `<extracted-folder-name>` with the actual name of the extracted folder, without angle brackets).*

---

### Step 3 — Configure Spark PATH in `.bashrc`
Open `.bashrc`:
```bash
nano ~/.bashrc
```

Add these environment variables at the bottom of the file:
```bash
export SPARK_HOME=/usr/local/spark
export PATH=$PATH:$SPARK_HOME/bin
```

Save and exit: `Ctrl + O` → `Enter` → `Ctrl + X`.

Apply the environment updates:
```bash
source ~/.bashrc
```

Verify installation:
```bash
spark-shell --version
```

---

### Step 4 — Start Spark Shell
Launch the interactive Scala-based Spark shell:
```bash
spark-shell
```

Upon successful startup, the Scala prompt will appear:
```text
Spark context available as 'sc' (master = local[*], app id = ...).
SparkSession available as 'spark'.
scala>
```

---

### Step 5 — Create the Sample Input File
Open a **second terminal window** (keep `spark-shell` open in the first) and run:
```bash
mkdir -p ~/spark_lab
cd ~/spark_lab
nano input.txt
```

Paste the sample text:
```text
In as name to here them deny wise this. As rapid woody my he me which. Men but they fail shew just wish next put. Led all visitor musical calling nor her. Within coming figure sex things are. Pretended concluded did repulsive education smallness yet yet described. Had countryman his pressed shewing. No gate dare rose he. Eyes year if miss he as upon.
```

Save and exit: `Ctrl + O` → `Enter` → `Ctrl + X`.

---

### Step 6 — Execute Spark WordCount (Local Filesystem)

Return to the terminal running `spark-shell`. Enter the Scala statements one by one:

#### 1. Read the input file:
```scala
val inputfile = sc.textFile("file:///home/" + System.getProperty("user.name") + "/spark_lab/input.txt")
```
*(Or manually replace `System.getProperty("user.name")` with your Ubuntu username e.g. `"file:///home/osboxes/spark_lab/input.txt"`).*

#### 2. Split words, map to pairs, and aggregate counts:
```scala
val counts = inputfile
  .flatMap(line => line.split("\\s+"))
  .map(word => (word, 1))
  .reduceByKey(_ + _)
```

#### 3. Display the output:
```scala
counts.collect().foreach(println)
```

**Sample Output:**
```text
(fail,1)
(men,1)
(he,2)
(all,1)
...
```

#### How it works:
- `flatMap(line => line.split("\\s+"))`: Breaks each line into words separated by whitespace.
- `map(word => (word, 1))`: Emits a key-value tuple for each word.
- `reduceByKey(_ + _)`: Aggregates the occurrences for each unique word across partitions.
- `collect()`: Action that pulls the distributed RDD dataset back to the driver.

---

### Step 7 — Save Output to Disk
At the `scala>` prompt:
```scala
counts.saveAsTextFile("file:///home/" + System.getProperty("user.name") + "/spark_lab/output")
```

> [!WARNING]
> Spark will throw an error if the destination directory already exists. Delete or choose a new path if re-running.

Exit `spark-shell`:
```scala
:quit
```

In your regular terminal, inspect the saved results:
```bash
ls ~/spark_lab/output
cat ~/spark_lab/output/part-00000
```

---

### Step 8 — Examiner Scenario: Running on top of HDFS

If the examiner asks for **Spark on HDFS**:

1. Ensure Hadoop HDFS services are active:
   ```bash
   start-dfs.sh
   jps
   ```

2. Create HDFS directory and upload `input.txt`:
   ```bash
   hdfs dfs -mkdir -p /user/$USER/spark_lab/input
   hdfs dfs -put ~/spark_lab/input.txt /user/$USER/spark_lab/input/
   ```

3. Open `spark-shell` and run:
   ```scala
   val inputfile = sc.textFile("hdfs://localhost:9000/user/" + System.getProperty("user.name") + "/spark_lab/input/input.txt")

   val counts = inputfile
     .flatMap(line => line.split("\\s+"))
     .map(word => (word, 1))
     .reduceByKey(_ + _)

   counts.saveAsTextFile("hdfs://localhost:9000/user/" + System.getProperty("user.name") + "/spark_lab/output")
   ```

4. Exit `:quit` and view the HDFS output:
   ```bash
   hdfs dfs -cat /user/$USER/spark_lab/output/part-00000
   ```

---

## 🏆 Result:
Thus, Apache Spark was successfully configured and the WordCount program was executed using Spark Shell on both local storage and HDFS.
