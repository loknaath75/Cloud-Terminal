#include <omp.h>
#include <iostream>
using namespace std;

int main() {
    int total_sum = 0;

    // Critical section protects shared total_sum from race conditions
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
