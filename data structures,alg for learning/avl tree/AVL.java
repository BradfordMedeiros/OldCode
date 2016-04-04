import java.util.ArrayList;
import java.util.Collection;
import java.util.List;



public class AVL<T extends Comparable<T>> {
	
	private Node<T> root;
	private int size;
	
	/**
	 * Adds a data entry to the AVL tree
	 * 
	 * @param data The data entry to add
	 */
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
		root = rotate(root);
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
	
	/**
	 * Adds each data entry from the collection to this AVL tree
	 * 
	 * @param c The collection 
	 */
	public void addAll(Collection<? extends T> c) {
		for (T element: c){
			add(element);
		}
	}
	
	/**
	 * Removes a data entry from the AVL tree
	 * 
	 * Return null if the value does not exist
	 * 
	 * @param data The data entry to be removed
	 * @return The removed data entry
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
	
	/**
	 * Checks if the AVL tree contains a data entry
	 * 
	 * @param data The data entry to be checked
	 * @return If the data entry is in the AVL tree 
	 */
	public boolean contains(T data) {
		ArrayList<T>a;
		a = (ArrayList<T>) inOrder();
		if (a.contains(data)){
			return true;
		}else{
			return false;
		}
	}
	
	/**
	 * Calculates the current height and balance factor for a node and updates the values
	 * 
	 * THIS DOES NOT RECURSIVELY UPDATE N AND ALL OF N'S CHILDREN, ONLY UPDATE N
	 * (caps because it's important! Don't kill the running time of everything!)
	 * 
	 * @param n The node whose values are to be calculated and updated
	 * @return The node passed in with updated values
	 */
	private Node<T> updateHeightAndBF(Node<T> n) {
		int total = findHeight(n);
		n.height = total;
		n.bf = findHeight(n.left)-findHeight(n.right);
		
		//System.out.println("total:  "+total);
		return n;
	}
	private int findHeight(Node<T>n){
		if (n == null){
			return -1;
		}else{
			int a = findHeight(n.getLeft())+1;
			int b = findHeight(n.getRight())+1;
			if (a >b){
				return a;
			}else{
				return b;
			}
		}
	}
	
	/**
	 * Determines what rotation, if any, needs to be performed on a node and does the appropriate rotation
	 * 
	 * @param n The node to potentially be rotated
	 * @return The new root of the subtree that is now balanced due to the rotation 
	 * 			(possibly the same node that was passed in) 
	 */
	private Node<T> rotate(Node<T> n) {
		Node<T> re = n;
		updateHeightAndBF(n);
		if (n.bf <-1){
			updateHeightAndBF(n.right);
			if (n.right.bf >1){
				re =leftRight(n);
			}else{
				re = left(n);
			}
		}else if(n.bf >1) {
			updateHeightAndBF(n.left);
			if(n.left.bf<-1){
				re = rightLeft(n);
			}else{
				re = right(n);
			}
		}
		updateHeightAndBF(re);
		if (re.bf <-1 ||
				re.bf >1){
			return rotate(re);
		}
		return re;
	}
	
	/**
	 * Performs a left rotation on a node
	 * 
	 * @param n The node to have the left rotation performed on
	 * @return The new root of the subtree that is now balanced due to the rotation
	 */
	private Node<T> left(Node<T> n) {
		Node<T> newHead = n.getRight();
		Node<T> nhr;
		if (newHead == null){
			nhr = null;
		}else{
			nhr = newHead.getLeft();
		}
		n.setRight(nhr);
		if (newHead!=null){
			newHead.setLeft(n);
		}
		
		if (n == root){
			root = newHead;
		}
		return newHead;
	}
	
	/**
	 * Performs a right rotation on a node
	 * 
	 * @param n The node to have the right rotation performed on
	 * @return The new root of the subtree that is now balanced due to the rotation
	 */
	private Node<T> right(Node<T> n) {
		Node<T> newHead = n.getLeft();
		Node<T> nhr;
		if (newHead == null){
			nhr = null;
		}else{
			nhr = newHead.getRight();
		}
		n.setLeft(nhr);
		if (newHead!=null){
			newHead.setRight(n);
		}
		if (n == root){
			root = newHead;
		}
		return newHead;
	}
	
	/**
	 * Performs a left right rotation on a node
	 * 
	 * @param n The node to have the left right rotation performed on
	 * @return The new root of the subtree that is now balanced due to the rotation
	 */
	private Node<T> leftRight(Node<T> n) {
		Node<T> child = n.getRight();
		Node<T> temp = right(child);
		n.right = temp;		
		Node<T> re = left(n);
		if (n == root){
			root = re;
		}
		return re;
	}
	
	/**
	 * Performs a right left rotation on a node
	 * 
	 * @param n The node to have the right left rotation performed on
	 * @return The new root of the subtree that is now balanced due to the rotation
	 */
	private Node<T> rightLeft(Node<T> n) {
		Node<T> child = n.getLeft();
		Node<T> temp = left(child);
		n.left = temp;		
		Node<T> re = right(n);
		if (n == root){
			root = re;
		}
		return re;
	}
	
	/**
	 * Checks to see if the AVL tree is empty
	 * 
	 * @return If the AVL tree is empty or not
	 */
	public boolean isEmpty() {
		if (root == null){
			return true;
		}else{
			return false;
		}
	}
	
	/**
	 * Clears this AVL tree
	 */
	public void clear() {
		root = null;
	}
	
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
	 * 
	 * Getters and Setters: Do not modify anything below this point
	 */
	
	public Node<T> getRoot() {
		return root;
	}

	public void setRoot(Node<T> root) {
		this.root = root;
	}
	
	public int size() {
		return size;
	}
	
	public void setSize(int size) {
		this.size = size;
	}
	
	public static class Node<K extends Comparable<K>> {
		
		private K data;
		private Node<K> left, right;
		private int height;
		private int bf;
		
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

		public int getHeight() {
			return height;
		}

		public void setHeight(int height) {
			this.height = height;
		}

		public int getBf() {
			return bf;
		}

		public void setBf(int bf) {
			this.bf = bf;
		}
	}
	
	/*public static void main(String[] args){
		AVL<Integer> a = new AVL<Integer>();
		ArrayList<Integer> b = new ArrayList<Integer>();
		b.add(30);
		b.add(40);
		b.add(50);
		b.add(60);
		b.add(45);
		b.add(75);
		a.addAll(b);
		
		System.out.println(a.root.left.getData());
	}*/
}
