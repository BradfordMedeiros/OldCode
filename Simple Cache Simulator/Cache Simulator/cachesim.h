#ifndef __CACHESIM_H
#define __CACHESIM_H



//int linesize; // the size of each line/block
//int cachesize; // the size of the cache
//int associativity; // the number of lines per set
//int numSets; // the number of sets (can be derived but who cares)
//int lineBits;
//int setBits;
//int tagBits;

typedef unsigned long long addr_t;
typedef unsigned long long counter_t;


void cachesim_init(int block_size, int cache_size, int ways);
void cachesim_access(addr_t physical_add, int write);

void cachesim_print_stats(void);



//decoding and stuff


int log2(int num);

#endif
