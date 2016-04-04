#include "schedule.h"
#define offset(a,b,c) ((a*48*6)+(b*48)+c)   


schedule::schedule(){

	for (int i=0;i<48*4*6;i++){  
		backbone[i] = NULL;
	}
}

//should use this guy
int schedule::addClass(int day, int hour, gtclass* gtclass){
	
	int duration = gtclass->getDuration();
	int tiertoadd = 6;
	int foundclass= 0;
	for (int k=0;k<6;k++){
		foundclass = 0;
		for (int z=0;z<duration;z++){
			if(getClass(day,k,hour+z)!=NULL){
				foundclass = 1;
				break;
			}
		}
		if(!foundclass){
			tiertoadd = k;
			break;
		}

	}

	//if (gtclass->getHours()==1){
		
	//}

	if (tiertoadd > 5){
		return 0;
	}

	return addClass(day,tiertoadd,hour,gtclass);	
}

int schedule::addClass(int day, int tier, int hour, gtclass* gtclass){
	
	if (gtclass->getDuration()==1){
		//cout<<"problemhhur"<<endl<<endl;
		//cout<<"tier is "<<tier<<endl;
	}
	int duration = gtclass->getDuration();
	if (gtclass->getDuration()==1){
		//cout<<"duration is:  "<<duration<<endl;
	}

	for (int i=0;i<duration;i++){
		if (backbone[offset(day,tier,hour+i)]!=NULL || day >3 || tier > 6){
			if (gtclass->getDuration()==1){
			//cout<<"we are here"<<endl<<endl;
			}
			return 0;
		}
		backbone[offset(day,tier,hour+i)] = gtclass;
		gtclass->setTime(day,hour);
	}


	return 1;
}

gtclass* schedule::getClass(int day, int tier, int hour)
{
	return backbone[offset(day,tier,hour)];
}


bool schedule::canAddClass(int day, int tier, int hour, gtclass* gtclass){
	
	if (gtclass->getDuration()==1){
	//	cout<<"problemhhur"<<endl<<endl;
	//	cout<<"tier is "<<tier<<endl;
	}
	int duration = gtclass->getDuration();
	if (gtclass->getDuration()==1){
	//	cout<<"duration is:  "<<duration<<endl;
	}

	for (int i=0;i<duration;i++){
		if (backbone[offset(day,tier,hour+i)]!=NULL || day >3 || tier > 6){
			if (gtclass->getDuration()==1){
			//cout<<"we are here"<<endl<<endl;
			}
			return false;
		}
		//backbone[offset(day,tier,hour+i)] = gtclass;
		//gtclass->setTime(day,hour);
	}
	return true;
}

bool schedule::canAddClass(int day, int hour, gtclass* gtclass){
	int duration = gtclass->getDuration();
	int tiertoadd = 6;
	int foundclass= 0;
	for (int k=0;k<6;k++){
		foundclass = 0;
		for (int z=0;z<duration;z++){
			if(getClass(day,k,hour+z)!=NULL){
				foundclass = 1;
				break;
			}
		}
		if(!foundclass){
			tiertoadd = k;
			break;
		}

	}

	//if (gtclass->getHours()==1){
		
	//}

	if (tiertoadd > 5){
		return false;
	}

	return canAddClass(day,tiertoadd,hour,gtclass);
}

void schedule::printInfo(){
	ofstream outputFile;
	outputFile.open("output_schedule.csv");
	//cout<<"-------------"<<endl<<endl;
	for (int i=0;i<48;i++){
		//cout<<" "<<(i+8);
		outputFile<<(i/2);
		if (i%2==0){
			//cout<<":00";
			outputFile<<":00,";
		}
		if (i%2!=0){
			//cout<<":30";
			outputFile<<":30,";
		}
	}

	outputFile<<endl;
	
	int counter =0;
	int stringCounter = 0;
	for (int i=0;i<48*4*6;i++){
		if (backbone[i]!=NULL){
			//cout<<backbone[i]->getclassID()<<" ";
			string out = backbone[i]->className;
			//std::cout<<"out is:  "<<out<<endl;
		//	cout<<out<<endl;
			//cout<<out;
			char toPrint;
			int length = out.length();
			for (int st = 0;st<length;st++){
				outputFile<<out[st];
			}
			
			outputFile<<',';
			
		}

		//if (i%48==0 && i!=0){
	//		cout<<endl;
			//outputFile<<endl;
		//}
		if (i%(48*6)==0 && i!=0){
			//cout<<endl<<endl;
	//		outputFile<<endl<<endl;
		}
		counter++;
		if (counter%48 == 0){
			outputFile<<endl;
		}
		if (counter %(6*48) == 0){
			outputFile<<endl;
		}
	}

	outputFile.close();


	//////////////////////////////////
	
}

void schedule::printCSV(){

	ofstream outputFile;
	outputFile.open("output.txt");
	cout<<backbone[4]->getclassID()<<endl;
	for (int i=0;i<4;i++){ // for every day
		for (int j=0;j<6;j++){ // every tier
			outputFile<<"\n";
			for (int k=0;k<48;k++){ // every hour
				if(getClass(i,j,k)==NULL){
					outputFile<<",";
				}else{
					outputFile<<getClass(i,j,k)->getclassID()<<",";
				}
				
			}
		}
	}
	//day tier hour
	outputFile.close();
}

void schedule::exportOutput(){
	gtclass* gtclass = NULL;
	cout<<"Output Exported"<<endl;
	ofstream outputFile;
	outputFile.open("output.txt");

	for (int day =0;day<4;day++){
		for (int tier = 0;tier<6;tier++){
			for (int hour=0;hour<48;hour++){
				gtclass = getClass(day,tier,hour);
				if (gtclass!=NULL){
					outputFile<<gtclass->getclassID()<<"|";
				}else{
					outputFile<<"0"<<"|";
				}
				
			}
			outputFile<<",";  //signifies new tier
		}
		outputFile<<"."; //signifies new day
	}
	
	outputFile<<"%";  //signifies EOF 
	outputFile.close();
}

int schedule::getSelectorOneSch(int hour, gtclass* gtclass,bool anyDay){
	
	/*
	1 = MT  (only with anyDay = true)
		/2 = MW 
		/3 = MR (only with anyDay = true)
		/4 = TW (only with anyDay = true)
		/5 = TR 
		6 = WR (only with anyDay = true)*/
	if (canAddClass(0,hour,gtclass) && canAddClass(2,hour,gtclass)){ // monday wednesday
		addClass(0,hour,gtclass); addClass(2,hour,gtclass);
		return 2;
	}else if (canAddClass(1,hour,gtclass) && canAddClass(3,hour,gtclass)){ // tuesday thursday
		addClass(1,hour,gtclass); addClass(3,hour,gtclass);
		return 5;
	}else if (anyDay == true && canAddClass(0,hour,gtclass) && canAddClass(3,hour,gtclass)){ // monday thursday
		addClass(0,hour,gtclass); addClass(3,hour,gtclass);
		return 3;	
	}else if (anyDay == true && canAddClass(1,hour,gtclass) && canAddClass(2,hour,gtclass)){ // tuesday wednesday
		addClass(1,hour,gtclass); addClass(2,hour,gtclass);
		return 4;	
	}else if (anyDay == true && canAddClass(2,hour,gtclass) && canAddClass(3,hour,gtclass)){ // wednesday thursday
		addClass(2,hour,gtclass); addClass(3,hour,gtclass);
		return 6;	
	}else if(anyDay == true && canAddClass(0,hour,gtclass) && canAddClass(1,hour,gtclass)){ // monday tuesday
		addClass(0,hour,gtclass);  addClass(1,hour,gtclass);
		return 1;	
	}
	return 0;
}

/*3x a week (2 SCH)
------------------------
		7 = MTW
		8 = MTR
		9 = MWR
		10 = TWR*/
int schedule::getSelectorTwoSch(int hour, gtclass* gtclass,bool anyDay){
	if (canAddClass(0,hour,gtclass) && canAddClass(1,hour,gtclass) && canAddClass(2,hour,gtclass)){ // monday tuesday wednesday
		addClass(0,hour,gtclass); addClass(1,hour,gtclass); addClass(2,hour,gtclass);
		
		return 7;
	}else if(canAddClass(0,hour,gtclass) && canAddClass(1,hour,gtclass) && canAddClass(3,hour,gtclass)){ // monday thuesday thursday
		addClass(0,hour,gtclass); addClass(1,hour,gtclass); addClass(3,hour,gtclass);
		return 8;
	}else if (canAddClass(0,hour,gtclass) && canAddClass(2,hour,gtclass) && canAddClass(3,hour,gtclass)){ //monday wednesday thursday 
		addClass(0,hour,gtclass); addClass(2,hour,gtclass); addClass(3,hour,gtclass);
		return 9;
	}else if (canAddClass(1,hour,gtclass) && canAddClass(2,hour,gtclass) && canAddClass(3,hour,gtclass)){ // tuedsay wednesaday thursday
		addClass(1,hour,gtclass); addClass(2,hour,gtclass); addClass(3,hour,gtclass);
		return 10;
	}
	return 0;
	
}

int schedule::getSelectorThreeSch(int hour, gtclass* gtclass, bool anyDay){
	if (canAddClass(0,hour,gtclass) && canAddClass(1,hour,gtclass) && canAddClass(2,hour,gtclass) && canAddClass(3,hour,gtclass)){
		addClass(0,hour,gtclass); addClass(1,hour,gtclass); addClass(2,hour,gtclass); addClass(3,hour,gtclass);
		return 11;
	}
	return 0;
}

int schedule::getSelectorSixSch(int hour, gtclass* gtclass, bool anyDay){
	if (canAddClass(0,hour,gtclass) && canAddClass(1,hour,gtclass) && canAddClass(2,hour,gtclass) && canAddClass(3,hour,gtclass)){
		addClass(0,hour,gtclass); addClass(1,hour,gtclass); addClass(2,hour,gtclass); addClass(3,hour,gtclass);
		return 11;
	}
	return 0;
}

int schedule::callSchSelector(int hour, gtclass* gtclass){
	int numSch = gtclass->getHours();
	bool force = false;
	if (numSch==1){
		return (getSelectorOneSch(hour,gtclass,force));
	}else if (numSch==2){
		return(getSelectorTwoSch(hour, gtclass,force)); 
	}else if (numSch ==3){
		return(getSelectorThreeSch(hour, gtclass, force));
	}else if (numSch ==4){
		return(getSelectorSixSch(hour, gtclass, force)); // this needs to be replaced by its own code eventually
	}else if (numSch == 6){
		return(getSelectorSixSch(hour, gtclass, force));
	}
	return 0;

	/*int getSelectorOneSch(int hour, gtclass* gtclass,bool anyDay); // coded
	int getSelectorTwoSch(int hour, gtclass* gtclass,bool anyDay); //codes
	int getSelectorThreeSch(int hour, gtclass* gtclass, bool anyDay); // coded
	int getSelectorSixSch(int hour, gtclass* gtclass, bool anyDay);*/
}