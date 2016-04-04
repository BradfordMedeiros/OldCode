import java.util.ArrayList;
import java.util.Collection;
import java.util.List;


public class BST<T extends Comparable<T>> {
	
	private Node<T> root;
	private int size = 0;
	/**
	 * Adds a data entry to the BST
	 * 
	 * null is positive infinity
	 * 
	 * @param data The data entry to add
	 */
	
	//working
	public void add(T data) {
		if (root == null){
			root = new Node<T>(data);
		}else{
			if (data.compareTo(root.data)>0){
				root.right = addIn(data,root.right);
			}else if(data.compareTo(root.data)<0){
				root.left = addIn(data,root.left);
			}
		}
		
		size++;

	}
	private Node<T> addIn(T data, Node<T> temp){
		if (temp == null){
			temp = new Node<T>(data);
		}else if (data.compareTo(temp.data)>0 || data == null){
			temp.setRight(addIn(data,temp.right));
		}else if (data.compareTo(temp.data)<0){
			temp.setLeft(addIn(data,temp.left));
		}
		return temp;
}

	
	
	//working
	/**
	 * Adds each data entry from the collection to this BST
	 * 
	 * @param c
	 */
	public void addAll(Collection<? extends T> c) {
		for (T element: c){
			add(element);
		}
	}
	
	
	
	/**
	 * Removes a data entry from the BST
	 * 
	 * null is positive infinity
	 * 
	 * @param data The data entry to be removed
	 * @return The removed data entry (null if nothing is removed)
	 */
	public T remove(T data) {
		ArrayList<T> preorder = (ArrayList<T>) preOrder();
		ArrayList<T> inorder = (ArrayList<T>) inOrder();
		preorder.remove((T)data);
		if (contains(data)==false){
			return null;
		}
		inorder.remove((T)data);
		reconstruct(preorder,inorder);
		return data;
	}
	
	
	
	
	//works
	/**
	 * Checks if the BST contains a data entry
	 * 
	 * null is positive infinity
	 * 
	 * @param data The data entry to be checked
	 * @return If the data entry is in the BST 
	 */
	public boolean contains(T data){
		ArrayList<T>a;
		a = (ArrayList<T>) inOrder();
		if (a.contains(data)){
			return true;
		}else{
			return false;
		}
	}
	
	
	
	//working 
	/**
	 * Finds the pre-order traversal of the BST
	 * 
	 * @return A list of the data set in the BST in pre-order
	 */
	public List<T> preOrder() {
		ArrayList<T> a = new ArrayList<T>();
		callChildren(root,a);
		return a;
	}
	private void callChildren(Node<T> node, List<T>a){
		if(node!=null){
			a.add(node.getData());
			callChildren(node.left,a);
			callChildren(node.right,a);
		}
	}

	
	//working
	/**
	 * Finds the in-order traversal of the BST
	 * 
	 * @return A list of the data set in the BST in in-order
	 */
	public List<T> inOrder() {
		ArrayList<T> a = new ArrayList<T>();
		callChildren3(root,a);
		return a;
	}
	private void callChildren3(Node<T> node, List<T>a){
		if(node!=null){
			callChildren3(node.left,a);
			a.add(node.getData());
			callChildren3(node.right,a);

		}
	}
	
	
	//working
	/**
	 * Finds the post-order traversal of the BST
	 * 
	 * @return A list of the data set in the BST in post-order
	 */
	public List<T> postOrder() {
		ArrayList<T> a = new ArrayList<T>();
		callChildren2(root,a);
		return a;
	}
	private void callChildren2(Node<T> node, List<T>a){
		if(node!=null){
			callChildren2(node.left,a);
			callChildren2(node.right,a);
			a.add(node.getData());
		}
	}
	
	//working
	/**
	 * Checks to see if the BST is empty
	 * 
	 * @return If the BST is empty or not
	 */
	public boolean isEmpty() {
		if (root == null){
			return true;
		}else{
			return false;
		}
	}
	
	//working
	/**
	 * Clears this BST
	 */
	public void clear() {
		root = null;
	}
	
	//working
	/**
	 * @return the size of this BST
	 */
	public int size() {
		return size;
	}
	
	
	//working
	/**
	 * First clears this BST, then reconstructs the BST that is
	 * uniquely defined by the given preorder and inorder traversals
	 * 
	 * (When you finish, this BST should produce the same preorder and
	 * inorder traversals as those given)
	 * 
	 * @param preorder a preorder traversal of the BST to reconstruct
	 * @param inorder an inorder traversal of the BST to reconstruct
	 */
	public void reconstruct(List<? extends T> preorder, List<? extends T> inorder) {
		clear();
		//add original, then get all numbers in sorted on inOrder less than
		// then find biggest for right node, all numbrs less than in sorted, then to right node bigger
		ArrayList<T> bigNodes=  new ArrayList<T>();// the numbers that increase in preorder
		T max = preorder.get(0);
		bigNodes.add(max);
		for (int i=0;i<preorder.size();i++){
			T temp = preorder.get(i);
			if (temp.compareTo(max)>0){
				bigNodes.add(temp);
				max = temp;
			}
		}
		
		for (int k=0;k<bigNodes.size();k++){
			T temp = bigNodes.get(k);
			add(temp);
			for (int j=(inorder.size()-1);j>=0;j--){
				if (inorder.get(j).compareTo(temp)<0){
					add(inorder.get(j));
				}
			}
		}
		
		
		
		
	}
	
	/*
	 * The following methods are for grading, do not modify them
	 */
	
	public Node<T> getRoot() {
		return root;
	}

	public void setRoot(Node<T> root) {
		this.root = root;
	}
	
	public void setSize(int size) {
		this.size = size;
	}

	public static class Node<K extends Comparable<K>> {
		
		private K data;
		private Node<K> left, right;
		
		public Node(K data) {
			setData(data);
		}

		public K getData() {
			return data;
		}

		public void setData(K data) {
			this.data = data;
		}
		
		public Node<K> getLeft() {
			return left;
		}
		
		public void setLeft(Node<K> left) {
			this.left = left;
		}
		
		public Node<K> getRight() {
			return right;
		}
		
		public void setRight(Node<K> right) {
			this.right = right;
		}
	}
	
/*	public static void main(String[] args){
		BST<Integer> a = new BST<Integer>();
		a.add(2);
		a.add(-10);
		a.add(-40);
		a.add(40);
		a.add(3);
		a.add(-5);
		a.add(-3);
		a.add(-50);
		
		ArrayList<Integer> preorder = new ArrayList<Integer>();
		preorder.add(10);
		preorder.add(4);
		preorder.add(2);
		preorder.add(16);
		preorder.add(12);
		preorder.add(18);
		
		ArrayList<Integer> inorder = new ArrayList<Integer>();
		inorder.add(2);
		inorder.add(4);
		inorder.add(10);
		inorder.add(12);
		inorder.add(16);
		inorder.add(18);


		a.reconstruct(preorder, inorder);
	//	System.out.println(a.getRoot().left.left.getData());
	//	ArrayList<Integer>b = (ArrayList<Integer>) a.inOrder();
	//	System.out.println(b.get(0));
	//	System.out.println(b.get(1));
	//	System.out.println(b.get(2));
	//	System.out.println(b.get(3));
	//	System.out.println(b.get(4));
	//	System.out.println(b.get(5));
	//	System.out.println(a.contains(999));
	//	Integer b = a.remove(-50);
	//	System.out.println(a.root.getLeft().getLeft().getLeft().getData());
	//	System.out.println(b);
		//System.out.println(a.root.left.getData());
	//	System.out.println(a.root.getData());
	//	System.out.println(a.root.right.right.getData());
		//System.out.println("size:\t"+a.size);
	//	a.clear();
		//System.out.println(a.isEmpty());
	//	List<Integer>b = a.preOrder();
		//System.out.println(a.root);
	//	a.add(10);
	//	System.out.println(a.root.right.right.getData());
		//System.out.println(a.root.getData());
	//	a.add(25);
	//	a.add(10);
	//	System.out.println(a.root.right.left.getData());
	//	ref = (Node) a.root.getLeft();
	//System.out.println(a.root.right.getData());
	//	a.remove(16);
	//	System.out.println(a.root.getRight().getRight().getData());
	}*/

}
