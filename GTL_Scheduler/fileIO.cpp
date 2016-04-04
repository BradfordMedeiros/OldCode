#include "fileIO.h"
#include <algorithm>



fileIO::fileIO(){
	numStudents = 0;
	numClasses = 0;
}

string fileIO::toUpper(string str){
	std::transform(str.begin(),str.end(),str.begin(),::toupper);
	return str;
}

void fileIO::readCourseFile(string filename){ // reads in from a .csv file generated from excel for the COURSE FILE.  I used openoffice to generate the csv file (shouldnt matter but thats how it was tested)
	int counter = 0; // counter to pick which column to store (0 for classname, 4 for prof name, 7 for sch)
	int intValue;

	ifstream file(filename); //opens the csv file
	string value = "";
	 
	for (int i=0;i<6;i++){ // gets rid of labels
		getline(file,value,','); 
	}
	getline(file,value,'\n'); // to next line
	counter =0;

	
	while(file.good()){ // while more lines to read
		for (int i=0;i<6;i++){
			getline(file,value,','); // gets next block
			if (counter==0){ // first one = class name--> add to list
				//cout<<"\tadd|"<<value<<"|to class"<<endl;
				
				classNameList.push_back(toUpper(value)); 
			}else if(counter == 4){ //fifth one = prof name --> add to list
				//cout<<"\tadd|"<<value<<"|to prof"<<endl;
				classProfList.push_back(toUpper(value));
			}
			counter++;
		}
		getline(file,value,'\n');
		istringstream(value) >>intValue; // puts number in the string to the integer version "313" becomes 313
		classHoursList.push_back(intValue);
		counter = 0;
	}
	
	classProfList.pop_back(); // removes ending since theres a extra line in csv
	classNameList.pop_back();
	classHoursList.pop_back(); 
	
	file.close();
	numClasses = classProfList.size();

}

void fileIO::printInfo(){
	int size1 = classProfList.size();
	int size2 = gtID.size();
	cout<<"size is :  "<<size1<<endl;
	cout<<"size i :  "<<numClasses<<endl;
	for (int i=0;i<size1;i++){
		cout<<"name:  "<<classNameList[i]<<endl;
		cout<<"prof:  "<<classProfList[i]<<endl;
		cout<<"hour:  "<<classHoursList[i]<<endl;
	}

	for (int i=0;i<size2;i++){
		cout<<"gtid:  "<<gtID[i]<<endl;
		cout<<"c1  :  "<<course1[i]<<endl;
		cout<<"c2  :  "<<course2[i]<<endl;
		cout<<"c3  :  "<<course3[i]<<endl;
		cout<<"c4  :  "<<course4[i]<<endl;
	}

}

void fileIO::readStudentFile(string filename){
	int counter = 0;
	int intValue;

	ifstream file(filename); //opens the csv file
	string value = "";
	 
	for (int i=0;i<12;i++){ // gets rid of labels
		getline(file,value,','); 
	}
	getline(file,value,'\n'); // to next line
	while (file.good()){
		
		//cout<<"NE TDUENT!!"<<endl;
		for (int i=0;i<12;i++){ 
			getline(file,value,','); 
			if (counter == 0){
				//cout<<"add:  "<<value<<endl;
				istringstream(value) >>intValue; 
				gtID.push_back(intValue);
			}else if(counter == 5){
				//cout<<"name i:  "<<value<<endl;	
				course1.push_back(toUpper(value));
			}else if(counter == 6){
				//add if essential or not
			}else if(counter ==7){
				course2.push_back(toUpper(value));
			}else if (counter ==8){
			
			}else if(counter ==9){
				course3.push_back(toUpper(value));
			}else if (counter ==10){
			
			}else if(counter ==11){
				course4.push_back(toUpper(value));
			}			
			counter++;
		}
		getline(file,value,'\n'); // to next line
		counter = 0;
	}
	
	gtID.pop_back();
	course1.pop_back();
	course2.pop_back();
	course3.pop_back();
	course4.pop_back();
	numStudents = course4.size();
	file.close();
}

