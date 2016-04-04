#ifndef STACK_H
#define STACK_H



typedef struct stack_node{
	struct stack_node* top;
	void* value;
	//int a;
}stack_node;

typedef struct stack{
	int stackSize;
	stack_node* ghostPlate; // the base of the stack.  This is uses for easy record keeping.
	stack_node* topOfStack;
}stack;

stack_node* initStack(stack* st, int ways);
void push(stack* st,void* pValue);
stack_node* popTop(stack* st);
stack_node* popBottom(stack* st);

stack_node* getTop(stack* st);
stack_node* getBottom(stack* st);

stack_node* getIndex(stack* st, int index);
stack_node * removeIndex(stack* st, int index);

int indexOf(stack* st,int value);
void freeStack(stack* st);
void printStack(stack* st);
#endif