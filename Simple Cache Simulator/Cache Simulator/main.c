#include <stdio.h>
#include <stdlib.h>
#ifndef STACK_H
	#include "stack.h"
#endif

#include "cache.h"
#include "cachesim.h"

FILE *open_trace(const char *filename) {
  return fopen(filename, "r");
}

addr_t prev_addr;
int next_line(FILE* trace) {
  if (feof(trace) || ferror(trace)) return 0;
  else {
    char t;
    unsigned long long va, pa;
    unsigned sz;
    fscanf(trace, "%c %llx %llx %u\n", &t, &va, &pa, &sz);
    prev_addr = pa;
    cachesim_access(pa, (t == 'w'));
  }
  return 1;
}

int main(int argc, char **argv) {
  FILE *input;

  if (argc != 5) {
    fprintf(stderr, "Usage:\n  %s <trace> <block size(bytes)>"
                    " <cache size(bytes)> <ways>\n", argv[0]);
    return 1;
  }

  input = open_trace(argv[1]);
  printf("input is:  %s",input);
  cachesim_init(atol(argv[2]), atol(argv[3]), atol(argv[4]));
  while (next_line(input)){
	//  break; // comment this out later
  }

  cachesim_print_stats();
  
   /**stack st;
   stack_node* node;
   int r = 5;
   int k = 23;
   int index;
  
   initStack(&st,4);
 

  index = indexOf(&st,r); // check if tag is in set
	
	if (index==-1){ // miss  if not in there or tag is not valid
		
		printf("miss\n");
		node = popBottom(&st);
		push(&st,&r);

	}else{ //hit
		printf("hit: tag: %x to set %d \n",r,0);
		//hits++;
		node = removeIndex(&st,index);
		push(&st,&r);
	}

	 index = indexOf(&st,r); // check if tag is in set
	
	if (index==-1){ // miss  if not in there or tag is not valid
		printf("this was a miss: \n");
		printf("miss\n");
		node = popBottom(&st);
		push(&st,&r);

	}else{ //hit
		printf("this was a hit: \n");
		printf("hit: tag: %x to set %d \n",r,0);
		//hits++;
		printf("index is:  %d\n",index);
		
		node = removeIndex(&st,index);
		
		
		push(&st,&r);
		printStack(&st);
	}
	
	printf("stack after push:\n---------------------------\n");
	printStack(&st);
  /**
  int one,two,three,four,a,b,c,index;
  stack st;
  int* val;
  stack_node* n;
  one = 1; two = 2; three = 3; four = 4;
  a = 0x5; b = 0x8; c = 0x18;
  initStack(&st,4);
  
  popBottom(&st);
  push(&st,&a); // 5
   popBottom(&st);
  push(&st,&c); // 18
  popBottom(&st);
  push(&st,&b); // 18

  index = indexOf(&st,0x05);
  printf("index is:  %d",index);
  n =  removeIndex(&st,index);
  val = (int*)n->value;
  push(&st,val);
    printStack(&st);

  
	/**int i;
	stack st;
	int a = 3;
	int b = 5;
	int d=  2;
	stack_node* sn;
	
  initializeStack(&st);
  printStack(&st);
  push(&st,&a);
  printStack(&st);
  push(&st,&b);
  push(&st,&d);
 // printStack(&st);
 // sn= getIndex(&st,0);
//  printf("value of sn is:  %d",*((int*)(sn->value)));
//stack_node* getIndex(stack* st, int index);
//stack_node * removeIndex(stack* st, int index);  
//  sn = removeIndex(&st,0);
  
  removeIndex(&st,1);
//  removeIndex(&st,0);**/

//  printStack(&st);
  //printf("% d ",log2(64));
  /**typedef struct set{
	int* tags;
	int valid;
	int dirty;
}set;**/
  //void initSet();
//int replaceTag(set* sett);
  /**set a;
  stack b;
  int toPush = 50;
  stack_node* node ;
  initSet(&a,8);
  initStack(&b,8);

  printSet(&a);
  printStack(&b);
 // printf("\n");
  node =  popBottom(&b);
  push(&b,&toPush);
  replaceTag(&a,*((int*)node->value),toPush,1);
  free(node);
  node = popBottom(&b);
  push(&b,&toPush);
  replaceTag(&a,*((int*)node->value),toPush,1);
  free(node);
 // replaceTag(&a,50,300,0);
  printSet(&a);
  printStack(&b);
  printf("index of 5:  %d",indexOf(&b,509));**/
 /**  cache cc;
   
   int i,j;
   unsigned int r = 0xFFFFFFFF;
   initCache(&cc,64,8192,4);
   printf("blocksize: %d  cachesize: %d  numSets: %d   ways:  %d\n",cc.blocksize,cc.cachesize,cc.numSets,cc.ways);
   printf("linebits:  %d  setbits:  %d,  tagbits:  %d ",cc.lineBits,cc.setBits,cc.tagBits);
   addressTag(&cc,r , 0);
   printf("numsets is:  %d\n",cc.numSets);
  for (i=0;i<cc.numSets;i++){
	   printSet(&cc.sets[i]);
   }**/
  return 0;
}
