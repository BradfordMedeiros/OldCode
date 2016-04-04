#include "stack.h"

#ifndef CACHE_H
#define CACHE_H


typedef struct set{
	int* tags;
	int* valid;
	int* dirty;
	int size;
}set;

typedef struct cache{
	int hit,miss,write;
	int writeMiss,readMiss;
	set* sets;
	stack* stacks;
	int numSets;
	int blocksize;
	int cachesize; 
	int ways;
	int lineBits;
	int setBits;
	int tagBits;
}cache;


void initCache(cache* ca,int blocksize, int cachesize, int ways);

void initSet(set* sett,int ways);
int replaceTag(set* sett, int oldTag,int newTag, int write);

void addressTag(cache* ca,int address,int write);

void printSet(set* sett);

int log2(int num);

int isvalid(set* sett, int tag);
void printCache(cache* cc);
#endif