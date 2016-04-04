#include "cache.h"
#include "stack.h"
#include "stdio.h"
#include "stdlib.h"
#include "cachesim.h"



int isvalid(set* sett, int tag){
	int i;
	for (i=0;i<sett->size;i++){
		if ((sett->tags[i] == tag) && sett->valid[i]){
			return 1;
		}
	}
	return 0;
}
void initCache(cache* ca, int blocksize, int cachesize, int ways){
//	cache = (set*)malloc (sizeof(set)* numSets);
	int i;
	set* sett;
	stack* stackk;
	ca->writeMiss = 0;
	ca->readMiss=  0;
	ca->hit = 0;
	ca->miss = 0;
	ca->write = 0;
	ca->blocksize = blocksize;
	ca->cachesize = cachesize;
	ca->ways = ways;
	ca->numSets = cachesize/(blocksize*ways);
	ca->lineBits = log2(blocksize);
	ca->setBits = log2(ca->numSets);
	ca->tagBits = 32-(ca->lineBits)-(ca->setBits);
	ca->sets = (set*)malloc(sizeof(set)*ca->numSets);
	ca->stacks = (stack*)malloc(sizeof(stack)*ca->numSets);
	for (i=0;i<ca->numSets;i++){
		sett = (set*)malloc(sizeof(set));
		stackk = (stack*)malloc(sizeof(stack));
		initSet(sett,ways);
		initStack(stackk,ways);
		ca->sets[i] = *(sett);
		ca->stacks[i] = *(stackk);
	}
}

void addressTag(cache* ca, int address, int write){

	static int count =0;
	char* c = (char*)malloc(sizeof(char));
	stack_node* node;
	int* tag = (int*)malloc(sizeof(int));
	int* toPush = (int*)malloc(sizeof(int));
	int dirty = 0;
	int set;
	int i,index;
	unsigned int k=1;
	unsigned int m=1;

	count++;
	
	k=1;
	for (i=1;i<ca->lineBits+ca->setBits;i++){
		k=(k<<1)|k;
	}
	//printf("\n\nk is:  %x\n",k);
	*tag = address&(~k);
	*tag = (*tag)>>(ca->lineBits+ca->setBits);
	for (i=1;i<ca->lineBits;i++){
		m=(m<<1)|m;
	}
	//m = ~m;
	m = m|(~k);
	set = address&(~m);
	for (i=0;i<ca->lineBits;i++){
		set = set>>1;
	}
	//set = 
	
	index = indexOf(&(ca->stacks[set]),*tag); // check if tag is in set
	/**if (count >0){
		printf("\n------------------------------\nphysical address is:  %x",address);
		printf("\nindex (in stack):  %d",index);
		printf("\n\ntag is:  %x\n",*tag);
		printf("set is:  %x\n",set);
	//	printf("tagbits is:  %d\n",ca->setBits);
	//	printf("numsets is:  %d\n",ca->numSets);
	//	printf("linebits is:  %d\n",ca->lineBits);
	//	exit(0);
	}**/

	if (*tag==15){ // TEMPORARY CODE
		//printSet(&(ca->sets[set]));
		//exit(0);
	}
	
	if (index==-1){ // miss  if not in there or tag is not valid
		
	if (count == 4){
		//printf("\ncount is 4\n");
		//printf("tag is:  %x",*tag);
		//printf("set is:  %x",set);
		//printStack(&(ca->stacks[set]));
		//exit(0);
	}
		//misses++;
		//printf("miss\n");
		//printf("miss: tag: %x to set %d \n",*tag,set);
		ca->miss++;
		if (write){
			ca->writeMiss++;
		}else{
			ca->readMiss++;
		}
		node = popBottom(&(ca->stacks[set]));
		
	//	printf("node popped was:  %x\n",*((int*)node->value));
	///node =  popBottom(ca->stack);
		*toPush = *tag;
		push(&(ca->stacks[set]),tag);

		dirty = replaceTag(&(ca->sets[set]),*((int*)node->value),*tag,write);
		if (dirty){
			ca->write++;
		}
		free(node);
//		if (count==4){
//			printStack(&(ca->stacks[set]));
//			exit(0);
//		}
		
	}else{ //hit
		//printf("hit: tag: %x to set %d \n",*tag,set);
		//hits++;
		//printf("hit\n");
		ca->hit++;

		node = removeIndex(&(ca->stacks[set]),index);
		
		if (count >5 && ((*tag) == 5) && set ==3){
		//	printf("node tag is: %x ",*((int*)node->value));
		//	printf("removing node at index:  %d",index);
		}
			
			if (count >5 && ((*tag) == 5) && set ==3){
		//	printf("set 3 looks like\n before push:  \n");
		//printStack(&(ca->stacks[set]));
		}
		//printf("pushed tag= %x \n",*tag);
		push(&(ca->stacks[set]),tag);
		if (count >5 && ((*tag) == 5) && set ==3){
			//printf("set 3 looks like\n this now:  \n");
		//printStack(&(ca->stacks[set]));
		}
			
		
		
	//	replaceTag(&(ca->sets[set]),*((int*)node->value),*tag,write); // this was problematic while coding
	}
	//printf("the set is %d",set);

	
}

int replaceTag(set* sett,int oldTag, int newTag, int write){
	int oldDirty = 0;
	int replaced = 0;
	int i;
	for (i=0;i<sett->size;i++){
		if (sett->tags[i] == oldTag){
			oldDirty = sett->dirty[i];
			sett->tags[i] = newTag;
			sett->valid[i] = 1;
			replaced = 1;
			if (write){
				sett->dirty[i] =1;
			}else{
				sett->dirty[i] = 0;

			}
		}
	}
	return oldDirty;
}

void initSet(set* sett,int ways){
	int i;
	sett->size = ways;
	sett->tags = (int*)malloc(sizeof(int)*ways);
	sett->dirty = (int*)malloc(sizeof(int)*ways);
	sett->valid = (int*)malloc(sizeof(int)*ways);
	for (i=0;i<ways;i++){
		sett->tags[i] = -1;// check this a lot
		sett->dirty[i] = 0;
		sett->valid[i] = 0;
	}
}


void printSet(set* sett){
	int i;
	printf("print set alled\nset size is:  %d",sett->size);
	for (i=0;i<sett->size;i++){
		printf(" %x (%d,%d), ",sett->tags[i],sett->dirty[i],sett->valid[i]);
	}
}

int log2(int num){
	int counter =0;
	while((num = num>>1) !=0){
		counter++;
	}
	return counter;
}

void printCache(cache* cc){
	int i;
	printf("\nlinebits:  %d,  setbits: %d,  tagbits:  %d\n",cc->lineBits,cc->setBits,cc->tagBits);
	for (i=0;i<cc->numSets;i++){
		printf("set %d\n",i);
		printSet(&(cc->sets[i]));
		printf("\n\n");
		printStack(&(cc->stacks[i]));

	}
}