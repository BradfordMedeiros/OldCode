import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;


public class HashTable<K,V> {

	/**
	 * The maximum load factor for this hashtable
	 */
	private final double MAX_LOAD_FACTOR = .64;

	/**
	 * The number of entries in this hashtable
	 */
	private int size = 11; // initial size 11 

	/**
	 * The underlying array for this hashtable
	 */
	private Entry<K,V>[] table = new Entry[11];
	
	/**
	 * Puts the key value pair into the table. If the
	 * key already exists in the table, replace the
	 * old value with the new one and return the old value
	 * 
	 * @param key, never null
	 * @param value, possibly null
	 * @return the replaced value, null if nothing existed previously
	 */
	public V put(K key ,V value) {
		
		int index = key.hashCode()%table.length;
		Entry<K,V> temp;
		while(true){
			temp = table[index];
			if (temp == null || temp.isAvailable() == true){
				table[index] = new Entry<K, V>(key,value);
				System.out.println("put at index:  "+index);
				resize();
				return null;
			}else if (temp.key.equals(key)){
				V tempValue = temp.value;
				table[index].value = value;
				System.out.println("put at index: also returning value  "+index+"\t"+tempValue);
				resize();
				return tempValue;
			}else {
				System.out.println("upping the index");
				index++;
				if(index==size){
					index%=size;
				}
			}
		}
		
	}
	
	private double calcLoad(){
		int freespace = 0;
		//System.out.println("size is:  "+size);
		for (int i=0;i<size;i++){
			if (table[i]== null || table[i].isAvailable() == true){
				freespace++;
			}
		}
		
		//System.out.println("freespace is:  "+freespace);
		return ((double)size-(double)freespace)/((double)size);
	}
	
	private void regrow(){ // finish once other methods are complete
		Entry<K,V>[] oldTable = table;
		table = new Entry[size*2];
		for (int i=0;i<oldTable.length;i++){
			if (oldTable[i] !=null){
				if (oldTable[i].isAvailable()==false){
					K key = oldTable[i].getKey();
					V value = oldTable[i].getValue();
					put(key,value);
				}
			}
		}
		size = size*2;
	}
	
	  
	public void resize(){
		if (calcLoad() >= MAX_LOAD_FACTOR){
			regrow();
		}
	}
	/**
	 * Removes the entry containing the given key
	 * 
	 * (remember that all objects have a hashCode method)
	 * 
	 * @param key, never null
	 * @return the value of the removed entry
	 */
	public V remove(Object key) {
		int counter = 0;
		int index = key.hashCode()%size;
		while (true){
			if (table[index]==null || table[index].isAvailable()==true){
				return null;
			}else{ // already know it's not null
				if (table[index].key.equals(key)){
					table[index].setAvailable(true);
					return table[index].value;
				}else{
					index++;
					if (index == size){
						index=index%size;
					}
					counter++;
					if (counter == size){
						return null;
					}
				}
			}
		
		}
	}
	
	/**
	 * Gets the value of the entry given a specific key
	 * 
	 * (remember that all objects have a hashCode method)
	 * 
	 * @param key, never null
	 * @return
	 */
	public V get(Object key) {
		int counter = 0;
		int index = key.hashCode()%size;
		while (true){
			if (table[index]==null || table[index].isAvailable()==true){
				return null;
			}else{ // already know it's not null
				if (table[index].key.equals(key)){
					return table[index].value;
				}else{
					index++;
					if (index == size){
						index=index%size;
					}
					counter++;
					if (counter == size){
						return null;
					}
				}
			}
		
		}
	}
	
	/**
	 * @param key, never null
	 * @return true if this table contains the given key, false otherwise
	 */
	public boolean containsKey(Object key) {
		int counter = 0;
		int index = key.hashCode()%size;
		while (true){
			if (table[index]==null ||table[index].isAvailable()==true){
				return false;
			}else{ // already know it's not null
				if (table[index].key.equals(key)){
					return true;
				}else{
					index++;
					if (index == size){
						index=index%size;
					}
					counter++;
					if (counter == size){
						return false;
					}
				}
			}
		
		}
	}
	
	/**
	 * Clears this hashTable
	 */
	public void clear() {
		for (int i=0;i<size;i++){
			table[i] = null;
		}
	}
	
	/**
	 * @return true if this hashtable is empty, false otherwise
	 */
	public boolean isEmpty() {
		for (int i=0;i<size;i++){
			if (table[i]!=null && table[i].isAvailable()== false){
				return false;
			}
		}
		return true;
	}
	
	/**
	 * @return the value from this hashtable
	 */
	public Collection<V> values() {
		ArrayList<V> list = new ArrayList<>();
		for (int i=0;i<size;i++){
			if (table[i]!=null){
				if (table[i].isAvailable()== false){
					list.add(table[i].getValue());
				}
			}
		}
		return list;
	}
	
	/**
	 * @return the unique keys from this hashtable
	 */
	public Set<K> keySet() {
		HashSet<K> set = new HashSet<>();
		boolean repeat = false;
		for (int i=0;i<size;i++){
			if (table[i]==null)continue;
			for (K thing: set){
				if (table[i].key.equals(thing)){
					repeat = true;
				}
			}
			if (!repeat){
				set.add(table[i].getKey());
			}
		}
		return set;
	}
	
	/**
	 * @return the unique entries from this hashtable
	 */
	public Set<Entry<K, V>> entrySet() {
		HashSet<Entry<K,V>> set = new HashSet<>();
		for (int i=0;i<size;i++){
			if (table[i]!=null){
				if (table[i].isAvailable()==false){
					set.add(table[i]);
				}
			}
		}
		
		return set;
	}
	
	/**
	 * @return the size of this hashtable
	 */
	public int size() {
		return size;
	}

	/*
	 * Don't modify any code below this point
	 */
	
	public void setSize(int size) {
		this.size = size;
	}

	public Entry<K,V>[] getTable() {
		return table;
	}

	public void setTable(Entry<K,V>[] table) {
		this.table = table;
	}

	public double getMaxLoadFactor() {
		return MAX_LOAD_FACTOR;
	}

	public static class Entry<K,V> {
		private K key;
		private V value;
		private boolean available;
		
		public Entry(K key, V value) {
			this.setKey(key);
			this.setValue(value);
			this.setAvailable(false);
		}
		
		public void setKey(K key) {
			this.key = key;
		}
		
		public K getKey() {
			return this.key;
		}
		
		public void setValue(V value) {
			this.value = value;
		}
		
		public V getValue() {
			return this.value;
		}

		public boolean isAvailable() {
			return available;
		}

		public void setAvailable(boolean available) {
			this.available = available;
		}
	}
	
	/*public static void main(String[] args){
		HashTable a = new HashTable();
	}*/
}