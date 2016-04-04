#include "fileIO.h"
#include <fstream>
#include <iostream>
#include <stdlib.h>
#include <stdio.h>
#include <ctime>
//using namespace std;

class conflict{


public:	
	fileIO* io;
	int nameSize;
	std::vector<int> numConflicts;


	conflict(fileIO* io);
	int** conflicts;
	int** conflicts2;


	void printInfo();
	void printInfo2();
	void evaluateConflicts();
	void addConflict(string first, string second); //increments conflict table by 1
	bool calculateTotalConflicts(); // returns false if there are no more conflicts
	
	int nextHighIndex(int* notTheseIndices,int length);
	int nextHighIndex(int* notTheseIndices,int length, int* notTheseEither, int length2);
	void reevaluateConflicts(int indexClass); // revelate the conflcit matrix as if the class specified at index had just been added (so dont count these conflicts)
	
	void randomize(int limit);

	~conflict(){
		for (int i=0;i<nameSize;i++){
			delete[] conflicts[i];	
			delete[] conflicts2[i];
		}
		delete[] conflicts;
		delete[] conflicts2;
	}
};