#include "stack.h"

#ifndef STDIO_H
#include  <stdio.h>
#include <stdlib.h>
#define STDIO_H
#endif

#define VERBOSE






//intializes the stack.  Must be called before using the stack
stack_node* initStack(stack* st,int ways){
	int* a;
	int i;
	
	#ifdef VERBOSE 
		printf("Stack initialized");
	#endif

	
	st->stackSize = 0; // 0 because ghost node does not count for the size
    st->ghostPlate = (stack_node*)malloc(sizeof(stack_node));  

    // pointing to null because we should not point to anything else

	st->ghostPlate->top = 0;
	st->topOfStack = st->ghostPlate;  

	for (i=0;i<ways;i++){
		a = (int*)malloc(sizeof(int));
		//*a = (i-1000);
		*a = -1;
		
		push(st,a);
	}
	return st->ghostPlate;
}

//pushes an element on the top of the stack
void push(stack* st,void* pValue){

	
	stack_node* newNode = (stack_node*)malloc(sizeof(stack_node)); // reserve memory for a new node
	
	if (((*(int*)pValue))==0x18  ){
		///printf("before\n");
		//printf("p value is:  %x",(*(int*)pValue));
		//printStack(st);

		//printf("top of top:  %x",st->topOfStack->top);
	}
	
	newNode->value = pValue; // make the value pointer point to the intended value
	//printf("pushed the value:  %x",(*(int*)pValue));
	newNode->top = 0;
	st->topOfStack->top = newNode; // make the old top of stack point to the new top 
	
	st->topOfStack = newNode; // make the new node the top of the stack

	
	st->stackSize++;
	if (((*(int*)pValue))==0x18 || ((*(int*)pValue))==0x05 ){
		//printf("p value is:  %x",(*(int*)pValue));
		//printStack(st);

		//printf("top of top:  %x",st->topOfStack->top);
	}
}

//pops off the top of the stack
stack_node* popTop(stack* st){
	stack_node* currNode;
	int i;
	if (st->stackSize == 0){
		return;
	}
	//printf("popping top\n");
	//printf("stack in poptop before popping is:  \n\n-------------");
	//printStack(st);
	//printf("\n");
	currNode = st->ghostPlate->top;
	
	for (i=0;i<st->stackSize-2;i++){
	//	printf("Stack Value at height =  %d:  %d\n",i,*(int*)(currNode->value));
		currNode = currNode->top;
	}
	
	//free(currNode->top);
	
	currNode->top->top = 0;
	st->topOfStack = currNode;
	st->topOfStack->top = 0;
	st->stackSize--;
	//printf("stack in poptop after popping is:  \n-------------");
	//printStack(st);
	return currNode->top;
}


//pops off the bottom of the stack
stack_node* popBottom(stack* st){
	stack_node* bottomNode;
	#ifdef VERBOSE
	//printf("stack size is:  %d\n",st->stackSize);
#endif
	//printf("popping bottom\n");
	if (st->stackSize == 0){
		return 0;
	}
	bottomNode = st->ghostPlate->top;
	st->ghostPlate->top = bottomNode->top; // sets bottom element to next value in stack
	
	st->stackSize--;
	return bottomNode;
}

//returns the top of the stack
stack_node*getTop(stack* st){
	return st->topOfStack;
}

//return the bottom element of the stack 
stack_node* getBottom(stack* st){
	return st->ghostPlate->top;
}

//empties the stack
void freeStack(stack* st){
	int i;
	int size = st->stackSize;
	for (i=0;i<size;i++){
		popTop(st);
	}
}

//prints out values in the stack (assuming ints for values)
void printStack(stack* st){ // assumes using int (if not it sucks and errors -- this is just for debugging)
	stack_node* currNode;
	int i;
	//printf("stack of size:  %d\n",st->stackSize);
	currNode = st->ghostPlate->top;
	printf("\n");
	for (i=0;i<st->stackSize;i++){
		printf("Stack Value at height =  %d:  %x\n",i,*(int*)(currNode->value));
		currNode = currNode->top;
	}

	i=0;
	while(currNode !=0){
		printf("Stack Value at height =  %d:  %x\n",i,*(int*)(currNode->value));
		currNode = currNode->top;
		i++;
	}

	
}

int indexOf(stack* st,int value){
	int i;
	stack_node* node;
	for (i=0;i<st->stackSize;i++){
		node = getIndex(st,i);
		if (*((int*)(node->value))==value){
			return i;
		}
	}
	return -1;
}

//gets the stack node at a given index
stack_node* getIndex(stack* st, int index){
	stack_node* currNode;
	int i;
	currNode = st->ghostPlate->top;
	for (i=0;i<index;i++){
		//printf("Stack Value at height =  %d:  %d\n",i,*(int*)(currNode->value));
		currNode = currNode->top;
	}
	return currNode;
}

//removes the stack node at a given index

stack_node * removeIndex(stack* st, int index){
	stack_node* below;
	stack_node * middle;
	stack_node* top;
	if (index>=st->stackSize || index <0){
		return 0;
	}else if(index ==0){
		return popBottom(st);
	}else if (index==(st->stackSize-1)){
		//printf("index is:  %d",index);
		return popTop(st);
	}else{
		//printf("popping generally\n");
		//printf("index is:  %d",index);
		//printStack(st);
		below = getIndex(st,index-1);
		
		middle = below->top;
		top = middle->top;
		free(middle);
		below->top = top;
		st->stackSize--;
		return middle;
	}
}