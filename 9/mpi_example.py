from mpi4py import MPI

# Initialize MPI communicator
comm = MPI.COMM_WORLD
rank = comm.Get_rank()
size = comm.Get_size()

# Each process prints its rank and the total number of processes
print(f"Hello from process {rank} out of {size}")
