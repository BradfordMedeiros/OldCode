#include <stdio.h>
#include <stdlib.h>
#include <string.h>




#include "cachesim.h"
#include "stack.h"
#include "cache.h"

counter_t accesses = 0, hits = 0, misses = 0, writebacks = 0;
cache cc;

//called at begginning of program
void cachesim_init(int blocksize, int cachesize, int ways) {
   initCache(&cc,blocksize,cachesize,ways);
  // printCache(&cc);
//	printf("line bits:  %d\nsetBits:  %d\ntagBits:  %d\n",lineBits,setBits,tagBits);
//	printf("line bits are from 0 to:  %d\n",lineBits-1);
//	printf("set bits are from %d to %d\n",lineBits,lineBits+setBits-1);
//	printf("tag bits are from %d to %d\n",lineBits+setBits,lineBits+setBits+tagBits-1);
}
//int lineBits;
//int setBits;
//int tagBits;

//called for each memory address access, 1 for write, 0 for not-write
void cachesim_access(addr_t physical_addr, int write) {
	accesses++;
	addressTag(&cc,physical_addr,write);
	if (accesses%1000000==0){
		printf("still running!");
	}
}

void cachesim_print_stats() {
	hits = cc.hit;
	misses = cc.miss;
	writebacks = cc.write;
	printCache(&cc);
	printf("read miss: %d  write miss: %d\n",cc.readMiss,cc.writeMiss);
  printf("%llu, %llu, %llu, %llu\n", accesses, hits, misses, writebacks);
}


