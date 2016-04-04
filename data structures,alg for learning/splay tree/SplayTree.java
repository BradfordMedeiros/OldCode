import java.util.ArrayList;
import java.util.List;



public class SplayTree<T extends Comparable<? super T>> {

	private Node<T> root;
	private Node<T> nullNode = new Node<T>(null);
	private int size;


	
	public void splay(Node<T> n){
		Node<T> left;
		Node<T> right;
		Node<T> temp = null;
		Node<T> temp2 = null;
		left = nullNode;
		right = nullNode;
		temp = root;
		nullNode.left = null;
		nullNode.right = null;
		while (true) {
			if (n == null){break;}
		    if (n.compareTo(temp) < 0) {
			if (temp.left == null) break;
			if (n.compareTo(temp.left) < 0) {
			    temp2 = temp.left;                           
			    temp.left = temp2.right;
			    temp2.right = temp;
			    temp = temp2;
			    if (temp.left == null) break;
			}
			right.left = temp;                                 
			right = temp;
			temp = temp.left;
		    } else if (n.compareTo(temp) > 0) {
			if (temp.right == null) break;
			if (n.compareTo(temp.right) > 0) {
			    temp2 = temp.right;                          
			    temp.right = temp2.left;
			    temp2.left = temp;
			    temp = temp2;
			    if (temp.right == null) break;
			}
			left.right = temp;                               
			left = temp;
			temp = temp.right;
		    } else {
			break;
		    }
		}
		left.right = temp.left;                                 
		right.left = temp.right;
		temp.left = nullNode.right;
		temp.right = nullNode.left;
		root = temp;
	  }
	
	
	/**
	 * Splay the node containing data after adding
	 * 
	 * @param data
	 */
	
	
	public void add(T data) {  
		// TODO Auto-generated method stub
		Node<T> add= null;
		if (root == null){
			add = new Node<T>(data);
			root = add;
		}else{
			if (data.compareTo(root.data)>0){
				add = addIn(data,root.right,root);
				root.right = add;
			}else if(data.compareTo(root.data)<0){
				add = addIn(data,root.left,root);
				root.left = add;
			}
		}
		splay(add);
		contains(data);
		size++;
	}
	
	
	private Node<T> addIn(T data, Node<T> temp, Node<T> parent){
		if (temp == null){
			temp = new Node<T>(data);
			temp.setParent(parent);
		}else if (data.compareTo(temp.data)>0 || data == null){
			temp.setRight(addIn(data,temp.right,temp));		}else if (data.compareTo(temp.data)<0){
			temp.setLeft(addIn(data,temp.left,temp));
		}
		return temp;
}

	/**
	 * Splay the parent of the node removed, do nothing
	 * if o is not in the tree, or was the root
	 * 
	 * @param o
	 * @return
	 */
	public T remove(T data) {
		// TODO Auto-generated method stub
		if (data.compareTo(root.getData())==0){
			System.out.println("woah charlie");
			return data;
		}
		else{
			return removeHelp(data);
		}
	}
	public T removeHelp(T data){
		Node<T> temp = getNodeParent(data,root);
		ArrayList<T> preorder = (ArrayList<T>) preOrder();
		ArrayList<T> inorder = (ArrayList<T>) inOrder();
		preorder.remove((T)data);
		if (contains(data)==false){
			System.out.println("wooh");
			return null;
		}
		inorder.remove((T)data);
		reconstruct(preorder,inorder);
		splay(temp);
		return data;
	}

	/**
	 * Splay the object found matching the data, do nothing
	 * if o is not in the tree
	 * 
	 * @param o
	 * @return
	 */
	public T get(T data) {
		// TODO Auto-generated method stub
		if (root == null){
			return null;
		}else{
			return getHelp(data,root);
		}
	}

	public T getHelp(T data, Node<T> n){
		if (n == null || data == null){
			return null;
		}else{
			int eval = data.compareTo(n.getData());
			if (eval <0){
				return getHelp(data,n.getLeft());
			}else if (eval > 0){
				return getHelp(data,n.getRight());
			}else{
				splay(n);
				if (eval == 0){
					return data;
				}else{return null;}
			}
		}
	}
	/**
	 * Splay the object found matching the data, do nothing if
	 * o is not in the tree
	 * 
	 * @param o
	 * @return
	 */
	public boolean contains(T data) {
		// TODO Auto-generated method stub
		if (root == null){
			return false;
		}else{
			return containsHelp(data,root);
		}
	}
	public Node<T> getNodeParent(T data, Node <T> n){
		if (n == null || data == null){
			return null;
		}else{
			int eval = data.compareTo(n.getData());
			if (eval <0){
				return getNodeParent(data,n.getLeft());
			}else if (eval > 0){
				return getNodeParent(data,n.getRight());
			}else{
				return n.parent ;
			}
		}
	}
	
	public boolean containsHelp(T data, Node<T> n){
		if (n == null || data == null){
			return false;
		}else{
			int eval = data.compareTo(n.getData());
			if (eval <0){
				return containsHelp(data,n.getLeft());
			}else if (eval > 0){
				return containsHelp(data,n.getRight());
			}else{
				splay(n);
				return true;
			}
		}
	}
	
	public int size() {
		// TODO Auto-generated method stub
		return size;
	}

	public boolean isEmpty() {
		// TODO Auto-generated method stub
		if (root == null){
			return true;
		}else{
			return false;
		}
	}
	
	public void clear(){
		root = null;
		size = 0;
	}
	
	//i use reconstruct to remove nodes, it's a remant from the old hw, but it still works.  

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
			add2(temp);
			for (int j=(inorder.size()-1);j>=0;j--){
				if (inorder.get(j).compareTo(temp)<0){
					add2(inorder.get(j));
				}
			}
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
	/*
	 * These methods are for grading, don't modify them
	 */

	public void setSize(int size) {
		this.size = size;
	}

	public Node<T> getRoot() { 
		return root;
	}

	public void setRoot(Node<T> root) {
		this.root = root;
	}

	public static class Node<E extends Comparable<? super E>> implements Comparable<Node<E>>{

		private Node<E> parent, left, right;
		private E data;

		public Node(E data) {
			this.data = data;
		}

		public Node<E> getParent() {
			return parent;
		}

		public void setParent(Node<E> parent) {
			this.parent = parent;
		}

		public Node<E> getLeft() {
			return left;
		}

		public void setLeft(Node<E> left) {
			this.left = left;
		}

		public Node<E> getRight() {
			return right;
		}

		public void setRight(Node<E> right) {
			this.right = right;
		}

		public E getData() {
			return data;
		}
		
		public void setData(E data) {
			this.data = data;
		}
		
		@Override
		public int compareTo(Node<E> tht) {
			if (data == null && tht.data == null) return 0;
			if (tht.data == null) return -1332;
			if (data == null) return 1332;
			return data.compareTo(tht.data);
		}
	}
	
	
	public void add2(T data) {
		if (root == null){
			root = new Node<T>(data);
		}else{
			if (data.compareTo(root.data)>0){
				root.right = addIn2(data,root.right,root);
			}else if(data.compareTo(root.data)<0){
				root.left = addIn2(data,root.left,root);
			}
		}

	}
	private Node<T> addIn2(T data, Node<T> temp,Node<T> parent){
		if (temp == null){
			temp = new Node<T>(data);
			temp.setParent(parent);

			size++;
		}else if (data.compareTo(temp.data)>0 || data == null){
			temp.setRight(addIn2(data,temp.right,temp));
		}else if (data.compareTo(temp.data)<0){
			temp.setLeft(addIn2(data,temp.left,temp));
		}
		return temp;
}
	public static void main(String[] args){

		
		SplayTree a = new SplayTree();
		a.add(20);
		a.add(25);
		a.add(18);
		a.add(19);
		a.add(12);
		a.add(13);
		a.add(2);
		a.get(12);
		a.remove(12);
		a.remove(18);
		a.remove(12);
		
		System.out.println(a.contains(12));
		System.out.println(a.root.getData());

	}

}
