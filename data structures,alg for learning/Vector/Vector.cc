// Implementation of the templated Vector class
// ECE4893/8893 lab 3
// Bradford Medeiros

#include <iostream> // debugging
#include "Vector.h"
#include <stdlib.h>
#define NUMADD 1
// Your implementation here
// Fill in all the necessary functions below
using namespace std;

/*int main(){
//return 0;
 //cout<<q.reserved<<endl; 

 Vector<string> v;
 //char buffer[100];
 for (int i=0;i<50;++i){
     v.Push_Back("back");
 }
 for (int i=0;i<50;++i){
    v.Push_Front("front");
}

 for (size_t i = 0;i<v.Size();++i){
	cout<<i<<" : "<<v[i]<<endl;
 }

 
  return 0;
}*/
// Default constructor
template <typename T>
Vector<T>::Vector()
{
    elements = NULL;
    count = 0 ;
    reserved = 0;
}

// Copy constructor
template <typename T>
Vector<T>::Vector(const Vector& rhs)
{
    count =  rhs.count;
    reserved = rhs.reserved;
    elements = (T*)(malloc(sizeof(T)*rhs.reserved));
    for (int i=0;i<rhs.count;i++){
  	new(&elements[i])T(rhs.elements[i]);
    }
}

// Assignment operator
template <typename T>
Vector<T>& Vector<T>::operator=(const Vector& rhs)
{
    count = rhs.count;
    reserved = rhs.reserved;
    for (int i=0;i<rhs.count;i++){
	new(&elements[i])T(rhs.elements[i]);
    }  
}

#ifdef GRAD_STUDENT
// Other constructors
template <typename T>
Vector<T>::Vector(size_t nReserved)
{ // Initialize with reserved memory
}

template <typename T>
Vector<T>::Vector(size_t n, const T& t)
{ // Initialize with "n" copies of "t"
}
#endif

// Destructor
template <typename T>
Vector<T>::~Vector()
{
   for(int i=0;i<count;i++){
	elements[i].~T();
    } 
    free(elements);

} 


// Add and access front and back
template <typename T>
void Vector<T>::Push_Back(const T& rhs)
{
	if (count == reserved){
	//    cout<<"new allocation called"<<endl;
  	    reserved = reserved+NUMADD;
	    T* newElements = (T*)(malloc(sizeof(T)*(reserved)));
	    for (int i=0;i<count;i++){
		new(&newElements[i])T(elements[i]);
		//cout<<"inside hur"<<endl;
		//cout<<"new Element  "<<newElements[i]<<endl;
		//cout<<"=============="<<endl;
	    }

	    for (int i=0;i<count;i++){
		elements[i].~T();
	    }
	    free(elements);
	    elements = newElements;
	}
//	count++;
	new(&elements[count])T(rhs);
 	//cout<<"elements["<<count<<"]"<<" = "<<elements[count]<<endl;
        count++;
}


template <typename T>
void Vector<T>::Push_Front(const T& rhs)
{
    T* newElements = (T*)(malloc(sizeof(T)*(reserved+1))); // reserves space for new array and new first element
    reserved = reserved+1;
    for(int i=0;i<count;i++){
	new(&newElements[i+1])T(elements[i]);  		   // 
        elements[i].~T();
    }
    new(&newElements[0])T(rhs);

    free(elements);
    elements = newElements;
    count++;

}

template <typename T>
void Vector<T>::Pop_Back()
{ // Remove last element
    if(count ==0){
	return;
    }
    count--;
    elements[count].~T();
}

template <typename T>
void Vector<T>::Pop_Front()
{ // Remove first element

    if(count ==0){
	return;
    }

    T* newElements = (T*)(malloc(sizeof(T)*reserved-1));
    for (int i=1;i<count;i++){
	new(&newElements[i-1])T(elements[i]);
  	elements[i].~T();
    }
    elements[0].~T();
    free(elements);
    elements = newElements;
    count--;   
}

// Element Access
template <typename T>
T& Vector<T>::Front() const
{
	return((*this)[0]);
}

// Element Access
template <typename T>
T& Vector<T>::Back() const
{
	return((*this)[count-1]);
}

template <typename T>
T& Vector<T>::operator[](size_t i) const
{
 //`: cout<<"elements["<<i<<"]"<<" = "<< elements[i]<<endl;  
     return ((elements[i]));
}

template <typename T>
size_t Vector<T>::Size() const
{
    return (count);
}

template <typename T>
bool Vector<T>::Empty() const
{
    return (count ==0);
}

// Implement clear
template <typename T>
void Vector<T>::Clear()
{
    for (int i=0;i<count;i++){
	elements[i].~T();	
    }
    count = 0;
   

}

// Iterator access functions
template <typename T>
VectorIterator<T> Vector<T>::Begin() const
{
  return VectorIterator<T>(elements);
}

template <typename T>
VectorIterator<T> Vector<T>::End() const
{
    return VectorIterator<T>(elements+count); 
}

#ifdef GRAD_STUDENT
// Erase and insert
template <typename T>
void Vector<T>::Erase(const VectorIterator<T>& it)
{
}

template <typename T>
void Vector<T>::Insert(const T& rhs, const VectorIterator<T>& it)
{
}
#endif

// Implement the iterators

// Constructors
template <typename T>
VectorIterator<T>::VectorIterator()
{
    current = NULL;
}

template <typename T>
VectorIterator<T>::VectorIterator(T* c)
{
    current = c;
}

// Copy constructor
template <typename T>
VectorIterator<T>::VectorIterator(const VectorIterator<T>& rhs)
{
    current = rhs.current;
}

// Iterator defeferencing operator
template <typename T>
T& VectorIterator<T>::operator*() const
{
    return (*current);
}

// Prefix increment
template <typename T>
VectorIterator<T>  VectorIterator<T>::operator++()
{
    current = current++;
    return (VectorIterator<T>(current));
}

// Postfix increment
template <typename T>
VectorIterator<T> VectorIterator<T>::operator++(int)
{
    current = current++;
    return (VectorIterator<T>(current-1));
}

// Comparison operators
template <typename T>
bool VectorIterator<T>::operator !=(const VectorIterator<T>& rhs) const
{
    return (!(current == rhs.current));
}

template <typename T>
bool VectorIterator<T>::operator ==(const VectorIterator<T>& rhs) const
{
    return (current == rhs.current);
}




