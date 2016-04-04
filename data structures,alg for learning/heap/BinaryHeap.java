import java.lang.reflect.Array;
import java.util.Comparator;

/**
 * This is an implementation of a heap that is backed by an array.
 * 
 * This implementation will accept a comparator object that can be used to
 * define an ordering of the items contained in this heap, other than the
 * objects' default compareTo method (if they are comparable). This is useful if
 * you wanted to sort strings by their length rather than their lexicographic
 * ordering. That's just one example.
 * 
 * Null should be treated as positive infinity if no comparator is provided. If
 * a comparator is provided, you should let it handle nulls, which means it
 * could possibly throw a NullPointerException, which in this case would be
 * fine.
 * 
 * If a comparator is provided that should always be what you use to compare
 * objects. If no comparator is provided you may assume the objects are
 * Comparable and cast them to type Comparable<T> for comparisons. If they
 * happen to not be Comparable you do not need to handle anything, and you can
 * just let your cast throw a ClassCastException.
 * 
 * This is a minimum heap, so the smallest item should always be at the root.
 * 
 * @param <T>
 *            The type of objects in this heap
 */
public class BinaryHeap<T> implements Heap<T> {

	/**
	 * The comparator that should be used to order the elements in this heap
	 */
	private Comparator<T> comp;

	/**
	 * The backing array of this heap
	 */
	private T[] data; // change back to private
	private Object[] o;
	/**
	 * The number of elements that have been added to this heap, this is NOT the
	 * same as data.length
	 */
	private int size;
	private int nextIndex;
	private int capacity = 11;
	private boolean compareProvided = false;

	/**
	 * Default constructor, this should initialize data to a default size (11 is
	 * normally a good choice)
	 * 
	 * This assumes that the generic objects are Comparable, you will need to
	 * cast them when comparing since there are no bounds on the generic
	 * parameter
	 */
	public BinaryHeap() {
		// TODO Implement this.
		data = (T[])new Object[11];	
		size = 0;
		nextIndex = size+1;
	}

	/**
	 * Constructor that accepts a comparator to use with this heap. Also
	 * initializes data to a default size.
	 * 
	 * When a comparator is provided it should be preferred over the objects'
	 * compareTo method
	 * 
	 * If the comparator given is null you should attempt to cast the objects to
	 * Comparable as if a comparator were not given
	 * 
	 * @param comp
	 */
	public BinaryHeap(Comparator<T> comp) {
		// TODO Implement this.
		data = (T[]) new Object[11];
        this.comp = comp;
        size = 0;
        compareProvided = true;
        nextIndex = size+1;
	}

	@Override
	public void add(T item) {
		// TODO Implement this.
		if (size==(capacity-1)){
			resize();
			System.out.println("resizing...  ");
		}
		if (item == null){
			data[nextIndex] = null;
			nextIndex++;
			size++;
			return;
		}
		int childIndex = nextIndex;
		int parentIndex;
		data[childIndex] = item;
		for (int i=0;i<calcDepth(nextIndex)-1;i++){
			//System.out.println(calcDepth());
			T child = data[childIndex];
			if ((nextIndex&1)==0){ // if is even/ left node
				parentIndex = childIndex/2; // finds the right parent
			}else{
				parentIndex = (childIndex-1)/2;
			}
			T parent = data[parentIndex]; //gets the parent
			if (compareProvided && (comp !=null)){
				if (comp.compare(child,parent)>0){
					break;
				}else{
					swapParent(childIndex);
					int temp = parentIndex;
					parentIndex = childIndex;
					childIndex = temp;
				}
			}else{
				if (parent == null){
					swapParent(childIndex);
					int temp = parentIndex;
					parentIndex =childIndex;
					childIndex = temp;
					continue;
				}
				Comparable compChild = (Comparable)child;
				Comparable compParent = (Comparable)parent;
				if (compChild.compareTo(compParent)>0){
					break;
				}else{
					swapParent(childIndex);
					int temp = parentIndex;
					parentIndex = childIndex;
					childIndex = temp;
				}
			}
			
		}
		nextIndex++;
		size++;
		
	}

	@Override
	public boolean isEmpty() { // should work
		// TODO Implement this.
		return (size==0?true:false);
	}

	@Override
	public T peek() {
		// TODO Implement this.
		return data[1];
	}

	@Override
	public T remove() {
		// TODO Implement this.
		if (size==0){
			return null;
		}
		System.out.println("the size is "+size);
		T oldPeek = data[1];
		data[1] = data[size];
		data[size] = null;
		int parentIndex = 1;
		int childIndex;
		for (int i=0;i<calcDepth(nextIndex)-1;i++){
			T pC1,pC2;
			try{
				pC1 = data[parentIndex*2];
			}catch(Exception e){
				pC1 = null;
			}
			try{
				pC2 = data[(parentIndex*2)+1];
			}catch(Exception e){
				pC2 = null;
			}
			if (pC2==null && pC1 == null){
				break;
			}
			
			if(compareProvided){
				if (comp.compare(pC1, pC2)>0){
					childIndex = (parentIndex*2)+1;
				}else{
					childIndex = parentIndex*2;
				}
			}else{
				Comparable compChild1 = (Comparable)pC1;
				Comparable compChild2 = (Comparable)pC2;
				if (compChild2 == null && compChild1 == null){
					System.out.println("wooh");
					break;
				}else if (compChild1 == null){
					System.out.println("go right");
					childIndex = (parentIndex*2)+1;
				}else if (compChild2 == null){
					System.out.println("go left");
					childIndex = parentIndex*2;
				}else if (compChild1.compareTo(compChild2)>0){
					System.out.println("go right");
					childIndex = (parentIndex*2)+1;
				}else{
					System.out.println("go left");
					childIndex = parentIndex*2;
				}
				
			}
			T temp = data[parentIndex];
			
			
			data[parentIndex] = data[childIndex];
			data[childIndex] = temp;
			System.out.println("Data is: "+data[childIndex]+" at index  "+childIndex);
			System.out.println("Data is: "+data[parentIndex]+" at index  "+parentIndex);
			parentIndex = childIndex;

		}
		size--;
		nextIndex--;
		return oldPeek;
	}

	@Override
	public int size() { // should work
		// TODO Implement this.
		return size;
	}
	
	private void resize(){
		capacity*=2;
		T[] temp = data;
		data = (T[])new Object[capacity];
		for (int i=0;i<size+1;i++){
			data[i] = temp[i];
		}
	}
	
	public void swapParent(int index){
		if ((index&1)==0){
			T parentData = data[index/2];
			data[index/2] = data[index];
			data[index] = parentData;
		}else{
			T parentData = data[(index-1)/2];
			data[(index-1)/2]= data[index];
			data[index]= parentData;
		}
	}
	
	public int calcDepth(int lastIndex){
		int counter = 0;
		int index = 1;
		while(true){
			try{
				if (index<=lastIndex || data[index]!=null){
					counter++;
					index*=2;
				}else{break;}
			}catch(Exception e){
				break;
			}
			
		}
		return counter;
	}
	public T get(int index){
		return data[index];
	}
	
	public String toString(){
		String a = "";
		for (int i=0;i<size+1;i++){
			a+=data[i].toString()+"\t";
		}
		return a;
	}
	
	
	
	public static void main(String[] args){
		BinaryHeap<Integer> a  = new BinaryHeap<Integer>();
		//System.out.println(a.toString());
				//a.data[0] = null;
		a.add(1);
		a.add(2);
		a.add(-4);
		a.add(3);
		a.add(6);
		
		a.remove();
		a.remove();
		a.remove();

		

		System.out.println(a.size());

	//	System.out.println(a.isEmpty());
		
		///a.swapParent(4);
		//System.out.println(a.calcDepth());
	}
}