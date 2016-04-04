#include <iostream>
#include "math.h"
#include "list.h"
using namespace std;
#define PI 3.14159265359


int roundUp(int numToRound, int multiple);
int writePGM(const char *filename,unsigned char *image,int xsize,int ysize);
class shape{ // abstract class shape
	public:
		float costable[1024];
		float sintable[1024];
		float x,y,theta; // top left coordinate

	public: 
		virtual void drawOutline(unsigned char* image, int width, int height)=0;  // virtual functions to be defined in children classes
		virtual bool isValidLocation(float x,float y,float theta,unsigned char *image,int width,int height)=0;
		virtual bool isValidLocation(unsigned char *image,int width,int height)=0;
		virtual void setLocation(float x, float y,float theta)=0;


		void setxyt(float x, float y, float theta){ // sets data members of x,y,z
			this->x = x; this->y=  y; this->theta = theta;
		}
		float getX(){ // standard getters
			return x;
		}
		float getY(){
			return y;
		}	
		float getTheta(){
			return theta;
		}
	shape(){
		x = 0;
		y = 0;
		theta = 0;
	}

	void fillTrigTables(){
	for (int i = 0;i<1024;i++){
		costable[i] = cos(i*360.0/1024.0/180.0*PI);
		sintable[i] = sin(i*360.0/1024.0/180.0*PI);
		
	}
	}
};

class Line: public shape{
	public:
		float length,x_increment,y_increment;
		int* pixelsX;
		int* pixelsY;
		int vsr;
		list<int>* precomputedPixels[36];

		
		Line(float length):shape(){ // intiializes the line and reserves  memory
			
			vsr = 5;
			this->length = length;
			int r = (int)length*5;
			pixelsY = new int[r];
			pixelsX = new int[r];
			x_increment = cos(getTheta())/5; // L*cos(theta)/N --> N = 5L
			y_increment = sin(getTheta())/5;

			// ensure trig tables are populated
			fillTrigTables();
		
			// precompute pixels for all values of theta
			for (int i = 0;i<36;i++){
					// create a list
					list<int> * l = new list<int>(length*5*2+10);
					precomputedPixels[i] = l;		
			}
			
			// compute pixels
			for (int i = 0;i<36;i++){
					// create a list
					list<int> * l =precomputedPixels[i];
					float theta = 10*i;
					float drawX = 0;
					float drawY = 0;
					int indexX,indexY;
					x_increment = cos(theta)/5; // L*cos(theta)/N --> N = 5L
					y_increment = sin(theta)/5;
					for (int x=0;x<length*5;x++){
						indexX = (int)(drawX+0.5);
						indexY = (int)(drawY+0.5);
						l->append(indexX);
						l->append(indexY);
						drawX = drawX+x_increment;
						drawY = drawY+y_increment;
					}		
			}
		}
	

		bool isValidLocation(float x,float y,float theta,unsigned char *image,int width,int height){ // checks if valid location by temporarily chaning location of line
			/*float drawX = x;
				float drawY = y; 
				int indexX,indexY;
				int tempTheta = getTheta(); // old thetas and junk
				int tempX = getX();
				int tempY = getY();
				setLocation(x,y,theta);
				for (int i=0;i<length*5;i++){ 
					indexX =(int)(drawX+0.5); 
					indexY =(int)(drawY+0.5); // rounding /casting as defined by document (even though it rounds up )
					if (indexX<0 || indexX >=width || indexY <0||indexY > height){
						setLocation(tempX,tempY,tempTheta);
						return false;
					}
					pixelsY[i] = indexY;
					pixelsX[i] = indexX; // stores the coordinates in memory
					if(image[indexY*width+indexX] == 0){
						setLocation(tempX,tempY,tempTheta); // if the elemment is black, cannot draw
						return false;
					}
					
					
					drawX = drawX+x_increment;
					drawY = drawY+y_increment;	
					
				}
				//setLocation(tempX,tempY,tempTheta);*/
				return false; // unuused function
		}

		void setLocation(float x, float y,float theta){ // setter for line
			//setxyt(x,y,theta);
			this->x = x;
			this->y = y;
			this->theta = theta;
			int ti = ((int)((theta/(2*PI)+10)*1024))%1024;
			//cout << "theta = " << theta << ", ti = " << ti << "sin(theta) = " << sin(theta) << "sintable[ti] = " << sintable[ti] << endl;

			x_increment = costable[ti]/vsr; 
			y_increment = sintable[ti]/vsr;
		}
		
		
		bool isValidLocation(unsigned char* image,int width, int height){ // works same as the x,y,t but doesn't have to change location
				float drawX = getX();
				float drawY = getY();
				int indexX,indexY;
				for (int i=0;i<length*vsr;i++){ 
					indexX =(int)(drawX+0.5); // this is iffy
					indexY =(int)(drawY+0.5);
					if (indexX<0 || indexX >=width || indexY <0||indexY >= height){
						return false;
					}
					pixelsY[i] = indexY;
					pixelsX[i] = indexX;
					//image[indexY*width+indexX] = 0;
					if(image[indexY*width+indexX] == 0){
						return false;
					}
					
					
					drawX = drawX+x_increment;
					drawY = drawY+y_increment;	
				}
				return true;
		}

		void drawOutline(unsigned char* image, int width, int height){ // assuming width/height refers to image (it odes i think)
				float drawX = getX();
				float drawY = getY();
				float x_increment = cos(theta)/5;
				float y_increment = sin(theta)/5;


				int indexX,indexY;
				for (int i=0;i<length*5;i++){ 
					indexX =(int)(drawX+0.5); // this is iffy
					indexY =(int)(drawY+0.5);
					
					//pixelsY[i] = indexY;
					//pixelsX[i] = indexX;
					
					image[indexY*width+indexX] = 80;
					drawX = drawX+x_increment;
					drawY = drawY+y_increment;	
				}

		}

		~Line(){
			//cout<<"line deconstructor being called"<<endl;
			delete[] pixelsY; // frees memory
			delete[] pixelsX;
		}
	/*	void printInfo(){ // prints data about the line
			cout<<"length is: "<<length<<endl;
			cout<<"theta is:  "<<getTheta()<<endl;
			cout<<"x is :  "<<getX()<<endl;
			cout<<"y is:  "<<getY()<<endl;
			cout<<"x_incr:  "<<x_increment<<endl;
			cout<<"y_incr:  "<<y_increment<<endl;
		}*/
};


//tried to implement more efficient line rendering ussing precomputed theta.
/*

class Line: public shape{
public:
	float length, x_increment,y_increment;
	int* pixelsX[360];
	int* pixelsY[360];
	int arrayLength;
	int r;

public:
	Line():shape(){
		length = 0;
		x_increment = 0;
		y_increment = 0;
		r = 0;
	}

	Line(float length):shape(){

		int indexX,indexY;
		cout<<getX()<<" "<<getY()<<endl;
		float drawX = getX(); float drawY = getY();
		this->length = length;
		r = (int)length*5;
		for (int i=0;i<360;i++){
			pixelsY[i] = (int*)new int[r+1];
			pixelsX[i] = (int*)new int[r+1];
		}

		float theta = 0;
		for (int i=0;i<360;i++){
			
			drawX = getX(); drawY = getY();
			arrayLength = 0;
			y_increment =  (sin(theta))/5;
			x_increment = (cos(theta))/5;
			for (int x=0;x<r;x++){
			//	cout<<"r is :  "<<r<<endl;
				
				indexX = (int)(drawX+0.5);
				indexY = (int)(drawY+0.5);
			
			//cout<<"arrayLenghth is:  "<<arrayLength<<endl;
			//	cout<<"indexY  :  "<<indexY<<endl;
			//	cout<<"indexX  :  "<<indexX<<endl;
			//	cout<<"arraylength-1 is:  "<<arrayLength-1<<endl;
			//	cout<<"pixelsY[i][arrayLength-1]"  <<pixelsY[i][arrayLength-1]<<endl;
			//	cout<<"pixelsX[i][arrayLength-1]"  <<pixelsX[i][arrayLength-1]<<endl;
				if(x!=0){
					if(indexY !=pixelsY[i][arrayLength-1]|| indexX!=pixelsX[i][arrayLength-1]){
						//cout<<indexX<<"  "<<indexY<<endl;
						pixelsY[i][arrayLength] = indexY;
						//cout<<"Y: "<<i<<" "<<arrayLength<<endl;
						pixelsX[i][arrayLength] = indexX;
						//cout<<"X: "<<i<<" "<<arrayLength<<endl;
						arrayLength++;
					}
				}else{
					pixelsY[i][arrayLength] = indexY;
					pixelsX[i][arrayLength] = indexX;
					arrayLength++;
				}
				drawX = drawX+x_increment;
				drawY = drawY+y_increment;
			}
			pixelsX[i][r] = arrayLength;
			pixelsY[i][r] = arrayLength;
			arrayLength = 0;
			theta = theta+(1*PI/180); // every 10 degrees
		}

		
	}


	~Line(){
		delete[] pixelsX;
		delete[] pixelsY;
	}
	
	


	void setLocation(float x, float y, float theta){
		//deal with theta later--> make a look up table

		
		int index = ((int)theta)%360;
		int xoffset = (int)(x-getX()+0.5);
		int yoffset = (int)(y-getY()+0.5);
		for (int i=0;i<pixelsY[index][r];i++){
			pixelsY[index][i] = pixelsY[index][i]+yoffset;
			pixelsX[index][i] = pixelsX[index][i]+xoffset;
		}
		setxyt(x,y,theta);
	}

	bool isValidLocation(float x,float y,float theta,unsigned char *image,int width,int height){
		int tempX = getX(); int tempY = getY(); int tempTheta = getTheta();
		setLocation(x,y,theta); bool isValid = isValidLocation(image,width,height);
		setLocation(tempX,tempY,tempTheta);
		return isValid;
	}
	bool isValidLocation(unsigned char* image,int width, int height){
		int index = int(getTheta());
		
		int imageIndex;
		
		for (int i=0;i<pixelsY[index][r];i++){
				imageIndex = pixelsY[index][i]*width+pixelsX[index][i];
				cout<<"imgidex  "<<imageIndex<<endl;
				if (imageIndex <0 || imageIndex >=(width*height) || image[imageIndex] == 0){
					cout<<"fuck"<<endl;
					return false;
				}
		}

		return true;
		
	}

	void drawOutline(unsigned char* image, int width, int height){
		int index = (int)getTheta();
		int imageIndex;
		cout<<"in outline  "<<pixelsY[index][r]<<endl;
		for (int i=0;i<pixelsY[index][r];i++){
				imageIndex = pixelsY[index][i]*width+pixelsX[index][i];
				image[imageIndex] = 80;
		}
	}
	
	

	int roundUp(int numToRound, int multiple)  
	{  if(multiple == 0)  {  
		return numToRound;  
	}  

	int remainder = numToRound % multiple; 
	if (remainder == 0)
	 {
	  return numToRound; 
	}
	return numToRound + multiple - remainder; 
}  

};



*/
class Arc: public shape{
	private:
		float arc_angle, radius;
		float radian_increment;
		int* pixelsX;
		int* pixelsY;
		

	public:

		Arc():shape(){ // default constructor
			arc_angle = 0; radius = 0;
			radian_increment = 0;
			pixelsX = 0; pixelsY = 0;
			//printInfo();
		}

		Arc(float arc_angle,float radius):shape(){ // non_default constructor
			this->arc_angle = arc_angle; // intiializes+ reserves memory for pixel points
			this->radius = radius;
			int r = (int)(5*arc_angle*radius);
			radian_increment = 1/(5*radius);
			pixelsY = new int[r];
			pixelsX = new int[r];
			//cout<<"dynamic memory has "<<r<<" elements"<<endl;
			//printInfo();
		}

		~Arc(){
			delete[] pixelsY; // frees memory
			delete[] pixelsX;
		}
		
		
	/*void printInfo(){ // prints relevant arc information
			cout<<"arc_angle is: "<<arc_angle<<endl;
			cout<<"radius is:  "<<radius<<endl;
			cout<<"theta is:  "<<getTheta()<<endl;
			cout<<"x is :  "<<getX()<<endl;
			cout<<"y is:  "<<getY()<<endl;
			cout<<"radian_incr:  "<<radian_increment<<endl;
		}*/
		void drawOutline(unsigned char* image, int width, int height){ // assuming width/height refers to image (it odes i think)
			//int startIndex = getX();
		//	if (isValidLocation(this->getX(),this->getY(),this->getTheta(),image,width,height)){	
			static int r = 0;
				int index=0;
				for (int i=0;i<5*arc_angle*radius;i++){
					index =pixelsY[i]*width+pixelsX[i];


					if (index<0 || index>=height*width){
						cout << "invalid index: " << index << endl;
					}

					if (index >width*height-1){index = width*height-1;}
					if (index<width*height){
					
					}


					if(index<(width*height-10)){
						image[index] = 80;
					}
					

				//	cout<<"index is:  "<<index<<endl;
				//	cout<<"pixel Y is:  "<<pixelsY[i]<<endl;
				//	cout<<"pixel X is:  "<<pixelsX[i]<<endl;
				}
		//	}else{
		//		cout<<"will not draw"<<endl;
		//	}
		}
		bool isValidLocation(float x,float y,float theta,unsigned char *image,int width,int height){ // works like the rest of the isValid functions
				
				//unused in this code
				return false;
		}
		
		bool isValidLocation(unsigned char* image,int width, int height){ // checks if the drawing is okay, if not returns false
			
				float radians = getTheta();
				float drawX = getX()+radius*cos(radians);
				float drawY = getY()+radius*sin(radians);
				int indexX,indexY;
				for (int i=0;i<5*arc_angle*radius;i++){ 
					indexX =(int)(drawX+0.5); // this is iffy
					indexY =(int)(drawY+0.5);
					//cout<<"indexY: "<<indexY<<"  indexX:  "<<indexX<<endl;
					if (indexX<0 || indexX >=width || indexY <0||indexY >= height){
						return false;
					}

					if( image[indexY*width+indexX] == 0){
						return false;
					}
					//cout<<"i is:  "<<i<<endl;
					pixelsY[i] = indexY; // stores computed values in mem so only do once
					pixelsX[i] = indexX;
					//image[indexY*width+indexX] = 0;
					
					
					radians = radians+radian_increment;
					drawX = getX()+radius*cos(radians);
					drawY = getY()+radius*sin(radians);	
					
				}
				//cout<<"finished"<<endl;
				return true;
		}
		void setLocation(float x, float y,float theta){
			setxyt(x,y,theta);
			radian_increment = 1/(5*radius);
		}

};



class rhombus: public shape{

	private:
		Line* line1;
		Line* line2;
		Line* line3;
		Line* line4;
		float width,height,corner;
	public:

		rhombus():shape(){
			//cout<<"rhomus default constructor"<<endl;
			width = 0; height = 0; corner = 0;
			/*line1.printInfo();
			line2.printInfo();
			line3.printInfo();
			line4.printInfo();*/	
		}

		rhombus(float width, float height,float corner){ // intiailizes memory for 4 lines
			
			this->width = width;
			this->height=  height;
			this->corner = (corner/360)*2*PI;
			float x,y, theta;
			setxyt(0,0,0);
			x = 0; y = 0; theta = 0;

			line1 = new Line(width);
			line1->setLocation(x,y,theta);

			
			line2 = new Line(height);
			x = x+width*cos(theta);
			y = y+width*sin(theta);
			theta = theta+corner;
			line2->setLocation(x,y,theta);

			line3 = new Line(width);
			x = x+height*cos(theta);
			y = y+height*sin(theta);
			theta = PI;
			line3->setLocation(x,y,theta);

			x = x+width*cos(theta);
			y = y+width*sin(theta);
			theta  = PI+corner;
			line4 = new Line(height);
			line4->setLocation(x,y,theta);

			
		}

		void setParams(float width, float height, float corner){// uses degrees, though computes as radians, allows you to set parameters external
			this->width = width;
			this->height=  height;
			this->corner = (corner/360)*2*PI;
			//line1 = 0;
			//line2 = 0;
			//line3 = 0;
			//line4 = 0;
			float x,y, theta;
			setxyt(0,0,0);
			x = 0; y = 0; theta = 0;

			line1 = new Line(width); // formula as specified on homework description
			line1->setLocation(x,y,theta);

			
			line2 = new Line(height);
			x = x+width*cos(theta);
			y = y+width*sin(theta);
			theta = theta+corner;
			line2->setLocation(x,y,theta);

			line3 = new Line(width);
			x = x+height*cos(theta);
			y = y+height*sin(theta);
			theta = PI;
			line3->setLocation(x,y,theta);

			x = x+width*cos(theta);
			y = y+width*sin(theta);
			theta  = PI+corner;
			line4 = new Line(height);
			line4->setLocation(x,y,theta);
		}
		/*void printInfo(){
			if (line1!=0){
				line1->printInfo();
				line2->printInfo();
				line3->printInfo();
				line4->printInfo();
			}
			
		}*/

		~rhombus(){
		}
		void drawOutline(unsigned char* image, int width, int height){ // draws the outline by drawing each element-> the isValidLocation method should be called first
			isValidLocation(image,width,height);
			//cout<<"drawing outline for line1"<<endl;
			line1->drawOutline(image,width,height);
			//cout<<"drawing outline for line2"<<endl;
			line2->drawOutline(image,width,height);
			//cout<<"drawing outline for line3"<<endl;
			line3->drawOutline(image,width,height);
			//cout<<"drawing outline for line4"<<endl;
			line4->drawOutline(image,width,height);
		}
		bool isValidLocation(float x,float y,float theta,unsigned char *image,int width,int height){ //changes loc and does is valid by doing it for each of its parts
			float tempX = getX();
			float tempY = getY();
			float tempTheta = getTheta();
			setLocation(x,y,theta);
			if (line1->isValidLocation(image,width,height) && line2->isValidLocation(image,width,height) && line3->isValidLocation(image,width,height)&& line4->isValidLocation(image,width,height)){
				setLocation(tempX,tempY,tempTheta);
				return true;
			}else{
				setLocation(tempX,tempY,tempTheta);
				return false;
			}
		}
		bool isValidLocation(unsigned char *image,int width,int height){ // // coes is valid by doing it for each of its parts
			// just a composite
			if (line1->isValidLocation(image,width,height)&&line2->isValidLocation(image,width,height)&&line3->isValidLocation(image,width,height)&&line4->isValidLocation(image,width,height)){
				//cout<<"line 1 is valid"<<endl;
				return true;
			}else{
				return false;
			}
		}
		void setLocation(float x, float y,float theta){
			// compute it for each line in the rhombus
			/*float tempX,tempY,tempTheta;
			setxyt(x,y,theta);
			line1->setLocation(x,y,theta);
			
			tempTheta = theta+corner;
			tempX = x+width*cos(theta); tempY = y+width*sin(theta);
			line2->setLocation(tempX,tempY,tempTheta);

			tempX =  tempX+height*cos(tempTheta);
			tempY = tempY+height*sin(tempTheta);
			line3->setLocation(tempX,tempY,theta+3.14159265359);

			line4->setLocation(tempX+width*cos(theta+3.14159265359),tempY+width*sin(theta+3.14159265359),theta+3.14159265359+corner);
			*/
			//cout<<"set location called"<<endl;
			theta = (theta/360)*2*PI;
				this->width = width;
			this->height=  height;
			this->corner = corner;
			//line1 = 0;
			//line2 = 0;
			//line3 = 0;
			//line4 = 0;

			float tempX, tempY,tempTheta;
			setxyt(x,y,theta);
			tempX = x; tempY = y; tempTheta = theta;
			
			line1->setLocation(tempX,tempY,tempTheta);

			
			tempX = tempX+width*cos(tempTheta); // formula as defined in hw
			tempY = tempY+width*sin(tempTheta);
			tempTheta = tempTheta+corner;
			line2->setLocation(tempX,tempY,tempTheta);

			tempX = tempX+height*cos(tempTheta);
			tempY = tempY+height*sin(tempTheta);
			tempTheta = theta+ PI;
			line3->setLocation(tempX,tempY,tempTheta);

			tempX = tempX+width*cos(tempTheta);
			tempY = tempY+width*sin(tempTheta);
			tempTheta  = theta+PI+corner;
			line4->setLocation(tempX,tempY,tempTheta);
		}
	
		
	
};


class lens: public shape{
	
private:
	Arc* arc1;
	Arc* arc2;
	float radius, angle,v_unitX,v_unitY;
	//Arc* arrayLookup[];
public:


		//need to account for seperation part here.
	lens(float radius,float angle):shape(){ // intiializes all elements at x=0,y=0,theta=0 to the formula as described
		angle = (angle/360)*2*PI;
		this->radius = radius;
		this->angle = angle;
		arc1 = new Arc(angle,radius);
		arc1->setLocation(0,0,0);
		v_unitX = cos(getTheta()+angle/2);
		v_unitY = sin(getTheta() +angle/2);
		float seperation = 2*radius*cos(angle/2);
		arc2 = new Arc(angle,radius);
		arc2->setLocation(v_unitX,v_unitY*seperation,PI*seperation);
		

	}
	/*void fillLookup(){
			theta = 0;
			 //= new Arc*[360];
			arcArray = new Arc[360];
			for (int i=0;i<360;i++){
				Arc temp(0,0);
				temp.setLocation(0,0,theta);
				arcArray[i] = &temp;
				theta = theta+1;
			}
		}
		*/
	void drawOutline(unsigned char* image, int width, int height){ // draws the outine by doing so for each part
		isValidLocation(image,width,height);
		arc1->drawOutline(image,width,height);
		arc2->drawOutline(image,width,height);
	}

	bool isValidLocation(float x,float y,float theta,unsigned char *image,int width,int height){ // checks if valid by changing loc and doing so for each part
		/*float tempX = getX();
		float tempY = getY();
		float tempTheta = getTheta();
		setLocation(x,y,theta);
		if (arc1->isValidLocation(image,width,height) && arc2->isValidLocation(image,width,height)){
			return true;
		}else{
			return false;
		}*/
		return false;
	}
	bool isValidLocation(unsigned char *image,int width,int height){ // checks if valid by checking for each part
		
		bool arc1Val = arc1->isValidLocation(image,width,height);
		bool arc2Val = arc2->isValidLocation(image,width,height);
		if(arc1Val && arc2Val){
			//cout<<"is valid"<<endl;
			return true;
		}else{
			//cout<<"isn't valid"<<endl;
			return false;
		}
	}
	void setLocation(float x, float y,float theta){ // sets location by changing xyt and applying the formula for each part
		
		theta = (theta/360)*2*PI;
		setxyt(x,y,theta);
		arc1->setLocation(getX(),getY(),getTheta());
		
		v_unitX = cos(getTheta()+angle/2);
		v_unitY = sin(getTheta() +angle/2);
		float seperation = 2*radius*cos(angle/2);
		arc2->setLocation(getX()+v_unitX*seperation,getY()+v_unitY*seperation,getTheta()+PI);
	}

	lens():shape(){
		radius = 0; angle = 0; v_unitX = 0; v_unitY = 0;
	}




	void setParams(float radius, float angle){ // allows you to specify the parameters outside the function
		this->radius = radius;
		angle = (angle/360)*2*PI; // formula as defined on website
		this->radius = radius;
		this->angle = angle;
		arc1 = new Arc(angle,radius); // changes the parts to fit the parameters
		arc1->setLocation(0,0,0);
		v_unitX = cos(getTheta()+angle/2); 
		v_unitY = sin(getTheta() +angle/2);
		float seperation = 2*radius*cos(angle/2); 
		arc2 = new Arc(angle,radius);
		arc2->setLocation(v_unitX,v_unitY*seperation,PI*seperation); // =V
	}
};

class capsule: public shape{

private:
	Line* line1;
	Line* line2;
	Arc* arc1;
	Arc* arc2;
	float width,height;
	//Arc* arcArray[];
	
public:
	capsule():shape(){
		width = 0; height = 0;
	}

	/*void fillLookup(){
			theta = 0;
			 //= new Arc*[360];
			arcArray = new Arc[360];
			for (int i=0;i<360;i++){
				Arc temp(0,0);
				temp.setLocation(0,0,theta);
				arcArray[i] = &temp;
				theta = theta+1;
			}
		}
		*/
	capsule(float width, float height):shape(){ // sets as x=0,y=0, theta= 0
		setxyt(0,0,0);
		float x =0; float y=0; float theta2= getTheta();
		this->width = width; this->height = height; 
		line1 = new Line(width);
		line1->setLocation(x,y,theta2);
		 
		x = width*cos(getTheta())- height*sin(getTheta()); // offsets each element according to capsule formula
		y = width*sin(getTheta())+height*cos(getTheta());
		theta2 = getTheta()+ PI;
		line2 = new Line(width);
		line2->setLocation(x,y,theta2);

		x = getX();
		y = getY();
		theta2 = getTheta()-(PI/2);
		x = width*cos(getTheta())- (height/2)*sin(getTheta());
		y = width*sin(getTheta())+(height/2)*cos(getTheta());
		arc1 = new Arc(PI,height/2);
		arc1->setLocation(x,y,theta2);

		x = getX(); y = getY();
		x = x-(height/2)*sin(getTheta());
		y = y+(height/2)*cos(getTheta());
		theta2 = getTheta()+(PI/2);
		arc2 = new Arc(PI,height/2);
		arc2->setLocation(x,y,theta2);
	}

		void drawOutline(unsigned char* image, int width, int height){ // draws the outline by doing so for each part
			isValidLocation(image,width,height);
			line1->drawOutline(image,width,height); // is Valid should be called first
			line2->drawOutline(image,width,height);
			arc1->drawOutline(image,width,height);
			arc2->drawOutline(image,width,height);
		}
	
		bool isValidLocation(float x,float y,float theta,unsigned char *image,int width,int height){ // checks if valid by changing loc and calling isValid for each part
		/*	cout<<"is valid location in capsule called"<<endl;
			float tempX,tempY,tempTheta;
			tempX = getX(); tempY = getY(); tempTheta=  getTheta();
			setLocation(x,y,theta);
			if (isValidLocation(image,width,height)){
				setLocation(tempX,tempY,tempTheta);
				return true;
			}else{
				setLocation(tempX,tempY,tempTheta);
				return false;
			}*/
			return false;
		}

		
		bool isValidLocation(unsigned char *image,int width,int height){ // checks by doing so for each shape element
			bool l1Valid = line1->isValidLocation(image,width,height);
			bool l2Valid = line2->isValidLocation(image,width,height);
			bool a1Valid = arc1->isValidLocation(image,width,height);
			bool a2Valid = arc2->isValidLocation(image,width,height);
			//	bool a1Valid = true; bool a2Valid = true;
			/*cout << "l1 valid? "<< l1Valid << endl;
			cout << "l2 valid? "<< l2Valid << endl;
			cout << "a1 valid? "<< a1Valid << endl;
			cout << "a2 valid? "<< a2Valid << endl;*/

			return l1Valid && l2Valid && a1Valid && a2Valid;
		}
		void setLocation(float x, float y,float theta){ // changes the location based upon the formula described +height and width of capsule
			theta = (theta/360)*2*PI;
			setxyt(x,y,theta);
			float xTemp,yTemp,thetaTemp;
			xTemp = x; yTemp = y; thetaTemp = theta;
			//line1 = new Line(width);
			line1->setLocation(x,y,thetaTemp);

			xTemp = x+width*cos(getTheta())- height*sin(getTheta());
			yTemp = y+width*sin(getTheta())+height*cos(getTheta());
			thetaTemp = getTheta()+ PI;
			//line2 = new Line(width);
			line2->setLocation(xTemp,yTemp,thetaTemp);

			
			thetaTemp = getTheta()-(PI/2);
			xTemp = x+width*cos(getTheta())- (height/2)*sin(getTheta());
			yTemp = y+width*sin(getTheta())+(height/2)*cos(getTheta());
			//arc1 = new Arc(3.14159265359,height/2);
			arc1->setLocation(xTemp,yTemp,thetaTemp);

			
			xTemp = x-(height/2)*sin(getTheta());
			yTemp = y+(height/2)*cos(getTheta());
			thetaTemp = getTheta()+(PI/2);
			//arc2 = new Arc(3.14159265359,height/2);
			arc2->setLocation(xTemp,yTemp,thetaTemp);
		}

		void setParams(float width, float height){ // allows the parameters to change -- will change each shape object accordingly
			float x =getX(); float y=getY(); float theta2= getTheta();
			this->width = width; this->height = height; 
			line1 = new Line(width);  //line1
			line1->setLocation(x,y,theta2);

			x = x+width*cos(getTheta())- height*sin(getTheta()); // line2
			y = y+width*sin(getTheta())+height*cos(getTheta());
			theta2 = getTheta()+ PI;
			line2 = new Line(width);
			line2->setLocation(x,y,theta2);

			x = getX();
			y = getY();
			theta2 = getTheta()-(PI/2);
			x = x+width*cos(getTheta())- (height/2)*sin(getTheta()); // arc1
			y = y+width*sin(getTheta())+(height/2)*cos(getTheta());
			arc1 = new Arc(PI,height/2);
			arc1->setLocation(x,y,theta2);

			x = getX(); y = getY();
			x = x-(height/2)*sin(getTheta());
			y = y+(height/2)*cos(getTheta());
			theta2 = getTheta()+(PI/2); // arc2
			arc2 = new Arc(PI,height/2);
			arc2->setLocation(x,y,theta2);
		}
};
