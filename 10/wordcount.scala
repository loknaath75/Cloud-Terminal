// ============================================================================
// Experiment 10 — Apache Spark WordCount (Scala Shell Commands)
// ============================================================================
// Usage in spark-shell:
// You can enter these commands interactively in spark-shell,
// or run: :load wordcount.scala
// ============================================================================

// ----------------------------------------------------------------------------
// Option A: Local File System Execution
// ----------------------------------------------------------------------------
// 1. Read input text from local disk:
val inputfileLocal = sc.textFile("file:///home/" + System.getProperty("user.name") + "/spark_lab/input.txt")

// 2. Tokenize into words, map to (word, 1), and sum by key:
val countsLocal = inputfileLocal
  .flatMap(line => line.split("\\s+"))
  .map(word => (word, 1))
  .reduceByKey(_ + _)

// 3. Print word-count results to console:
println("=== WORD COUNT RESULTS (LOCAL) ===")
countsLocal.collect().foreach(println)

// 4. Save results to output directory:
// Note: Output folder must not already exist!
countsLocal.saveAsTextFile("file:///home/" + System.getProperty("user.name") + "/spark_lab/output")


// ----------------------------------------------------------------------------
// Option B: HDFS Execution (Spark on top of HDFS)
// ----------------------------------------------------------------------------
// If your examiner asks for HDFS:
// Ensure Hadoop daemons are running (start-dfs.sh)
//
// val username = System.getProperty("user.name")
// val inputfileHDFS = sc.textFile("hdfs://localhost:9000/user/" + username + "/spark_lab/input/input.txt")
//
// val countsHDFS = inputfileHDFS
//   .flatMap(line => line.split("\\s+"))
//   .map(word => (word, 1))
//   .reduceByKey(_ + _)
//
// countsHDFS.collect().foreach(println)
// countsHDFS.saveAsTextFile("hdfs://localhost:9000/user/" + username + "/spark_lab/output")
