#include <omp.h>
#include <iostream>
using namespace std;

int main() {
    // Set the number of threads to 4
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
