#include <omp.h>
#include <iostream>
using namespace std;

int main() {
    int sum = 0;

    // Parallel loop with reduction for calculating sum of 1 to 100
    #pragma omp parallel for reduction(+:sum)
    for (int i = 1; i <= 100; i++) {
        sum += i;
    }

    cout << "Parallel Sum: " << sum << endl;

    return 0;
}
