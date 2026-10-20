# Experiment 9 — Implementation of Parallel Processing using MPI and OpenMP

This guide covers parallel programming across distributed memory environments (**Part A: MPI**) and shared memory multi-threaded environments (**Part B: OpenMP**).

---

## 🎯 Aim:
To understand and implement parallel processing concepts using:
1. **MPI (Message Passing Interface)** with Python (`mpi4py`) for distributed process communication.
2. **OpenMP (Open Multi-Processing)** with C++ (`g++ -fopenmp`) for multi-threaded shared-memory execution.

---

## 🌐 Part A — MPI (Distributed Memory Parallelism)

MPI distributes execution across multiple isolated processes where each process has its own address space and communicates via messages.

### Step 1: Install Required Packages

In your Ubuntu terminal:
```bash
sudo apt update
sudo apt install python3 python3-pip mpich -y
python3 -m pip install mpi4py
sudo apt install libopenmpi-dev openmpi-bin -y
```

> [!NOTE]
> If your system already has an active MPI installation (either MPICH or OpenMPI), stick to that single implementation to avoid binary/library conflicts with `mpirun`.

### Step 2: Create the MPI Program
Create and open `mpi_example.py`:
```bash
nano mpi_example.py
```

Paste the following code (available in [`mpi_example.py`](./mpi_example.py)):
```python
from mpi4py import MPI

comm = MPI.COMM_WORLD
rank = comm.Get_rank()
size = comm.Get_size()

print(f"Hello from process {rank} out of {size}")
```

Save and exit: `Ctrl + O` → `Enter` → `Ctrl + X`.

#### Code Explanation:
- `MPI.COMM_WORLD`: Default communicator encompassing all running MPI processes.
- `comm.Get_rank()`: Returns unique process ID ($0, 1, \dots, N-1$).
- `comm.Get_size()`: Returns total number of launched processes ($N$).

### Step 3: Execute the MPI Program

1. **Test with 1 process:**
   ```bash
   mpirun -np 1 python3 mpi_example.py
   ```
   **Expected Output:**
   ```text
   Hello from process 0 out of 1
   ```

2. **Test with 2 processes:**
   ```bash
   mpirun --oversubscribe -np 2 python3 mpi_example.py
   ```
   *(Use `--oversubscribe` if running more processes than physical CPU cores).*

   **Expected Output** *(Process output order may vary)*:
   ```text
   Hello from process 0 out of 2
   Hello from process 1 out of 2
   ```

---

## 🧵 Part B — OpenMP (Shared Memory Thread Parallelism)

OpenMP uses compiler directives (`#pragma omp ...`) to fork worker threads that share memory and join back at synchronization points.

### Step 4: Install the C++ Compiler
```bash
sudo apt update
sudo apt install g++ build-essential -y
```

---

### Program 1: OpenMP Hello World
Demonstrates thread creation, setting thread counts, and retrieving thread IDs.

**File:** [`hello_omp.cpp`](./hello_omp.cpp)
```cpp
#include <omp.h>
#include <iostream>
using namespace std;

int main() {
    omp_set_num_threads(4);

    #pragma omp parallel
    {
        int thread_id = omp_get_thread_num();
        int total_threads = omp_get_num_threads();

        cout << "Hello world from thread "
             << thread_id << " out of "
             << total_threads << " threads." << endl;
    }

    return 0;
}
```

**Compile and Run:**
```bash
g++ -fopenmp hello_omp.cpp -o hello_omp.out
./hello_omp.out
```

**Expected Output:** *(Thread execution order is non-deterministic)*
```text
Hello world from thread 0 out of 4 threads.
Hello world from thread 1 out of 4 threads.
Hello world from thread 2 out of 4 threads.
Hello world from thread 3 out of 4 threads.
```

---

### Program 2: Loop-Level Parallelism with Reduction
Calculates the sum of integers from 1 to 100 in parallel without race conditions on the accumulator.

**File:** [`loop_parallel.cpp`](./loop_parallel.cpp)
```cpp
#include <omp.h>
#include <iostream>
using namespace std;

int main() {
    int sum = 0;

    #pragma omp parallel for reduction(+:sum)
    for (int i = 1; i <= 100; i++) {
        sum += i;
    }

    cout << "Parallel Sum: " << sum << endl;

    return 0;
}
```

**Compile and Run:**
```bash
g++ -fopenmp loop_parallel.cpp -o loop_parallel.out
./loop_parallel.out
```

**Expected Output:**
```text
Parallel Sum: 5050
```

> [!TIP]
> The `reduction(+:sum)` clause gives each worker thread a private copy of `sum` initialized to 0, and at the end of the parallel loop automatically combines all private partial sums into the global `sum`.

---

### Program 3: Critical Section
Protects a shared variable from simultaneous concurrent write operations by ensuring mutual exclusion.

**File:** [`critical.cpp`](./critical.cpp)
```cpp
#include <omp.h>
#include <iostream>
using namespace std;

int main() {
    int total_sum = 0;

    #pragma omp parallel for
    for (int i = 0; i < 1000; i++) {
        int local_sum = i;

        #pragma omp critical
        {
            total_sum += local_sum;
        }
    }

    cout << "Total sum: " << total_sum << endl;

    return 0;
}
```

**Compile and Run:**
```bash
g++ -fopenmp critical.cpp -o critical.out
./critical.out
```

**Expected Output:**
```text
Total sum: 499500
```

> [!NOTE]
> `#pragma omp critical` serializes execution inside the critical block, preventing race conditions when multiple threads update `total_sum`.

---

## 📊 MPI vs OpenMP Comparison

| Feature | MPI (Message Passing Interface) | OpenMP (Open Multi-Processing) |
|---|---|---|
| **Architecture** | Distributed Memory (Clusters / Separate nodes) | Shared Memory (Multi-core CPUs) |
| **Communication** | Explicit Message Passing (`Send` / `Recv` / `bcast`) | Implicit via shared memory variables |
| **Execution Unit** | Separate OS Processes (`rank`) | Lightweight Threads |
| **Compiler / Tools** | `mpirun`, `mpicc`, `mpi4py` | `-fopenmp` compiler flag (`g++`, `gcc`) |

---

## 🏆 Result:
Thus, parallel processing programs were implemented and evaluated using MPI (Python `mpi4py`) and OpenMP (C++ multi-threading with reduction and critical sections).
