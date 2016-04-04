#include "gtclass.h"

gtclass::gtclass(int classID, int hours){
	this->classID = classID;
	this->hours = hours;
	classTime[0] = 0;
	classTime[1] = 0;
	classTime[2] = 0;
	classTime[3] = 0;
	if (hours == 1){
		duration = 2;
	}else if(hours==2){
		duration = 2;
	}else if (hours == 3){
		duration = 2;
	}else if (hours == 4){
		duration = 4;
	}else if (hours==6){
		duration = 4;
	}
#ifdef DEBUG
	cout<<"gt class created"<<endl;
#endif

}
void gtclass::printInfo(){
	//cout<<"number hours:  "<<hours<<endl;
	printf("class id:  %d\n",classID);
	printf("hours:  %d\n",hours);
	cout<<"M:  "<<classTime[0]<<"  T:  "<<classTime[1]<<"  W:  "<<classTime[2]<<"  R: "<<classTime[3]<<endl;
	
}

void gtclass::setTime(int day, int hour){
	classTime[day] = hour;
}

int gtclass::getTime(int day){ // format day hour day hour,etc.
	return classTime[day];
}
