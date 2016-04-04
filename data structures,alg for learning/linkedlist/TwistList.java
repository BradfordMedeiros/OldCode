
/**
 * This class extends LinkedList, but there's a twist. Read the documentation
 * for each method. Note that the data here is Comparable.
 */
public class TwistList<E extends Comparable<E>> extends LinkedList<E> {

	/**
	 * Add a piece of data either at the front of the list if the data
	 * is less than the head. If the data to be added is not less then 
	 * the data at the front of the list then find the first place in the
	 * list where the data is between two other points of data. If this is
	 * never true then place the new piece of data at the end of the list.
	 * 
	 * Last of all call swing with the index at which the new piece of data was added.
	 */
	@Override
	public void add(E e) {
		// TODO Auto-generated method stub
		
	}
	
	/**
	 * Reverses the order of the list between the start and stop index inclusively.
	 * 
	 * Assume the indices given are valid and start <= stop
	 * 
	 * @param start The beginning index of the sub section to be reversed
	 * @param stop The end index (inclusive) of the sub section to be reversed
	 */
	public void reverse(int start, int stop) {
		// TODO Auto-generated method stub
	}
	
	/**
	 * This method will take in an index and move everything after 
	 * that index to the front of the list
	 * 
	 * Assume the index given is valid
	 * 
	 * @param index The index at which to cut the list
	 */
	public void flipFlop(int index) {
		// TODO Auto-generated method stub
	}
	
	/**
	 * This method will reverse the order of the first half of the list up to 
	 * the index argument (inclusive), and also reverse the second half of the 
	 * list from index + 1 to the end of the list
	 * 
	 * Assume the index given is valid, however the second half may be empty
	 * 
	 * @param index The index to swing around
	 */
	public void swing(int index) {
		// TODO Auto-generated method stub
	}
}
