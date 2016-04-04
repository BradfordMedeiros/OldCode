#include <iostream>
#include <fstream>
#include "gtclass.h"
#define DEBUG 1;
using namespace std;

class schedule{

private:	
	
	gtclass* backbone[48*4*6 ];

public:
	schedule();

	int addClass(int day, int hour, gtclass* gtclass);
	int addClass(int day, int tier,int hour, gtclass* gtclass);

	//int addPairClass(int day, int tier, int hour, gtclass* gtclass); //day = 0 MW 1 = TH
	void printInfo();

	void printCSV();
	gtclass* getClass(int day, int tier, int hour);
	
	int addPairClass(int day, int hour, gtclass* gtclass);
	void exportOutput();
	
	bool canAddClass(int day, int hour, gtclass* gtclass);
	bool canAddClass(int day, int tier, int hour, gtclass* gtclass);


	//returns a "selector".  A selector is a mapping converting a simple integer to mean
	//a set of days
	/*
		note: 4sch is not currently supported.  Can force by making input weird
		0 = could not find a result (failure)

		- force options are not yet available, but maybe coded in the future
		2x a week (1 SCH)
		----------------------
		1 = MT  (only with anyDay = true)
		2 = MW 
		3 = MR (only with anyDay = true)
		4 = TW (only with anyDay = true)
		5 = TR 
		6 = WR (only with anyDay = true)


		3x a week (2 SCH)
		-----------------------
		7 = MTW
		8 = MTR
		9 = MWR
		10 = TWR

		4x a week (3 SCH  6 SCH)
		------------------------
		11 = MTWR (only 1 option)

	*/
	int callSchSelector(int hour, gtclass* gtclass);

	int getSelectorOneSch(int hour, gtclass* gtclass,bool anyDay); // coded
	int getSelectorTwoSch(int hour, gtclass* gtclass,bool anyDay); //codes
	int getSelectorThreeSch(int hour, gtclass* gtclass, bool anyDay); // coded
	int getSelectorSixSch(int hour, gtclass* gtclass, bool anyDay);  // codes
	
	//need to code:

	int getSelectorFourSch(int hour, gtclass* gtclass, bool anyDay); // will do later
};