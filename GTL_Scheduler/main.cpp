#include <iostream>
#include <fstream>
#include <string>
#include "algorithm.h"
using namespace std;

#define DEBUG 1


int  helpMain(string fileNameStudents, string fileNameCourses, int time, int factor){
#ifdef DEBUG
	 cout<<"debug mode"<<endl;
#endif 

#ifndef DEBUG
	 cout<<"debug mode off"<<endl;
#endif 

	fileIO io;
	io.readStudentFile(fileNameStudents);
	io.readCourseFile(fileNameCourses);
	conflict con(&io);
	algorithm al(&con);
	con.randomize(factor);
	con.printInfo2();

	al.maincontrol(time);
	if (al.isFinished()){
		al.sched.printInfo();
		al.sched.printCSV();
		return 0;
	}else{
		return 1;
	}
}

//command arguements should be time constraints and then the parameter for randomness
// time, limiter for helpMain(time, limiter)
int main(int argc, char* argv[]){

	string filenameStudents;
	string filenameCourses;
	int time;
	int limiter;
	if (argc == 5){

		filenameStudents = argv[1];
		filenameCourses = argv[2];
		time = atoi(argv[3]);
		limiter = atoi(argv[4]);
	}else{
		return 2;
	}
	
	bool win = false;
	for (int i=0;i<400;i++){
		cout<<"loop:  "<<i<<endl;
		if(helpMain(filenameStudents,filenameCourses,time,limiter)==0){ // as the factor increases, more randomization = more possibilities = set more likely to have success in set, but method of placing takes longer
			cout<<"you win"<<endl; // time on left goes shorter, then harder to schedule
			win = true;
			break;
		}
	}
	if(win){
		cout<<"success"<<endl;
		return 0;
	}else{
		cout<<"failure"<<endl;
		return 2;
	}

	return 0;
}