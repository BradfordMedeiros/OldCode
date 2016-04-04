#include <iostream>
//#define DEBUG 1
using namespace std;

class gtclass{

private:	
	int classTime[4];
	int hours;
	int classID;
	int duration;

public:
	string className;
	gtclass(){
	}
	gtclass(int classID, int hours);
	void printInfo();
	void setTime(int day, int hour);
	int getTime(int day);
	int getHours(){return hours;}
	int getclassID(){return classID;}
	int getDuration(){return duration;}
};