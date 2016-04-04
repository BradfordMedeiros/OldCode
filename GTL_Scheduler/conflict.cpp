#include "conflict.h"


conflict::conflict(fileIO* io){
	this->io = io;
	nameSize = io->classNameList.size();
	conflicts = new int*[nameSize];
	conflicts2 = new int*[nameSize];
	for (int i=0;i<nameSize;i++){
		conflicts[i] = new int[nameSize];
		conflicts2[i] = new int[nameSize];
	}

	for (int j=0;j<nameSize;j++){
		for (int k=0;k<nameSize;k++){
			conflicts[j][k] = 0;
			conflicts2[j][k] = 0;
		}
		numConflicts.push_back(0);
	}
	evaluateConflicts();
	calculateTotalConflicts();
}

//original function run once to evaluate how many conflicts
void conflict::evaluateConflicts(){
	for (int w=0;w<io->course1.size();w++){  // this method assumes 4 desired courses each
		addConflict(io->course1[w],io->course2[w]);
		addConflict(io->course1[w],io->course3[w]);
		addConflict(io->course1[w],io->course4[w]);
		addConflict(io->course2[w],io->course3[w]);
		addConflict(io->course2[w],io->course4[w]);
		addConflict(io->course3[w],io->course4[w]);
	}
}
int conflict::nextHighIndex(int* notTheseIndices,int length){
	    int max = -1;
		int currLeader = -1;
		int good = true;
		
		for (int i=0;i<numConflicts.size();i++){
			good = true;
			//cout<<"i is :  "<<i<<endl;
			for (int j=0;j<length;j++){
				if (i==notTheseIndices[j]){
					good = false;
				}
			}

			//cout<<"the number of conficts at i is:  "<<numConflicts[i]<<endl;
			//cout<<"the max is:  "<<max<<endl;
			//cout<<"good is:  "<<good<<endl;
			if (good && numConflicts[i]>max){
				max = numConflicts[i];
				//cout<<"the max is:  "<<max<<endl;
				currLeader = i;
			}
		}
		return currLeader;
}

int conflict::nextHighIndex(int* notTheseIndices,int length, int* notTheseEither, int length2){
	int max = -1;
	int currLeader = -1;
	for (int i=0;i<numConflicts.size();i++){
		for (int j=0;j<length;j++){
			if (i==notTheseIndices[j]){
				i++;
				continue;
			}
		}

		for (int f=0;f<length2;f++){
			if(i==notTheseEither[f]){
				i++;
				continue;
			}
		}
		if (i<numConflicts.size() && numConflicts[i]>max){
			max = numConflicts[i];
			currLeader= i;
		}
	}
	return currLeader;
}

//helper function todeal with adding a conflict between two class names
void conflict::addConflict(string first, string second){
	if(!first.compare("-")|| !second.compare("-") || !first.compare(" ") || !second.compare(" ") || !first.compare(second)){
		//cout<<"--1"<<endl;
		return;
	}
	int posFirst =0; int posSecond=0;
	//cout<<"name size is:  "<<nameSize<<endl;
	for (int i=0;i<nameSize;i++){
		
		//cout<<"namesize is: "<<nameSize<<endl;
		if (!first.compare(io->classNameList[i])){
			//cout<<"--3"<<endl;
			posFirst = i;
		}else if(!second.compare(io->classNameList[i])){
			//cout<<"--4"<<endl;
			posSecond = i;
		}
	}
	if (posFirst!=posSecond){
		conflicts[posFirst][posSecond]++;
		conflicts[posSecond][posFirst]++;
		conflicts2[posFirst][posSecond]++;
		conflicts2[posSecond][posFirst]++;
	}
}   //properly adds to the table, a conflicts between the two classes here (adds 1 to the table)


//calculate the sum of conflicts for each class
bool conflict::calculateTotalConflicts(){
	int sum;
	bool stillConflicts = false;
	for (int i=0;i<nameSize;i++){
		sum = 0;
		for (int j=0;j<nameSize;j++){
			sum+=conflicts[i][j];
		}
		numConflicts[i]=(sum);
		if(sum !=0){
			stillConflicts = true;
		}
	}
	return stillConflicts;
}

// reevaluatates conflicts assuming that the class at index is removed
void conflict::reevaluateConflicts(int indexClass){
	for (int i=0;i<nameSize;i++){
		conflicts[i][indexClass]-=conflicts[indexClass][i];
	}
	for (int j=0;j<nameSize;j++){
		conflicts[indexClass][j] = 0;
	}
}

void conflict::randomize(int limit){
	int numToAdd = 0;
	srand((unsigned)time(0));
	for (int i=0;i<nameSize;i++){
		for (int j=0;j<nameSize;j++){
			numToAdd = rand();
			if(numToAdd%10!=1){continue;}
			numToAdd = numToAdd%limit;
			conflicts[i][j]+= numToAdd;
			conflicts[j][i]+= numToAdd;
		}
	}
	calculateTotalConflicts();
}
//prints updated conflict matrix
void conflict::printInfo(){ // print this to a file itll be easier
	ofstream outputFile;
	outputFile.open("conflicts.txt");
	
	for (int i=0;i<nameSize;i++){
		for (int k=0;k<nameSize;k++){
			if(k == 0){
				outputFile<<io->classNameList[i]<<"   ";
			}
			outputFile<<conflicts[i][k]<<"\t";
		}
		outputFile<<endl;
	}

	outputFile<<endl;
	for (int z = 0;z<nameSize;z++){
		outputFile<<io->classNameList[z]<<" :  "<<numConflicts[z]<<endl;
	}
	outputFile.close();	
}

//prints original conflict matrix 
void conflict::printInfo2(){ // print this to a file itll be easier
	ofstream outputFile;
	outputFile.open("conflicts2.txt");
	
	for (int i=0;i<nameSize;i++){
		for (int k=0;k<nameSize;k++){
			if(k == 0){
				outputFile<<io->classNameList[i]<<"   ";
			}
			outputFile<<conflicts2[i][k]<<"\t";
		}
		outputFile<<endl;
	}

	outputFile<<endl;
	for (int z = 0;z<nameSize;z++){
		outputFile<<io->classNameList[z]<<" :  "<<numConflicts[z]<<endl;
	}
	outputFile.close();	
}