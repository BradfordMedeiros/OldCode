#include <iostream>
#include <fstream>
#include <list>
#include <vector>
#include <sstream>
#include <string>



//#define DEBUG 1;
using namespace std;

class fileIO{

	//next to do: read the summer students in, put gtid,and then the
	//courses they want if theyre essential
	// then after this create a class to generate conflict matrix
public:	
	//these three come from the classlist csv from excel
	int numClasses; 
	
	// for the following vectors the place in the array corresponds to the numerical id of the class so all three of these vectors,at the same index, reference different things for the same class
	std::vector<string> classNameList;  // class name
	std::vector<string> classProfList;  // professor teaching the class (currently only supports one professor)
	std::vector<int> classHoursList;    // how many sch the class is 
	
	//these four come from the summerstudent csv from excel
	int numStudents;
	std::vector<int> gtID; //the gtid of the student 
	std::vector<string> course1; //lists the absolutely desired classes for each student
	std::vector<string> course2; 
	std::vector<string> course3;
	std::vector<string> course4;
	std::vector<int> essential1; //is course 1 essential? 0 = no, 1 = yes, 2 = don't care (for a case like "-")
	std::vector<int> essential2; //is course 2 essential?
	std::vector<int> essential3; //is course 3 essential?
	std::vector<int> essential4; //is course 4 essential?
	
//public:
	fileIO();
	void readCourseFile(string filename);
	void readStudentFile(string filename);
	void printInfo();

	string toUpper(string str);
	
};