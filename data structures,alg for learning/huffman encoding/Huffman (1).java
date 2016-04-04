import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Map;

public class Huffman {

	
	public static void main(String[] args){
		
	}
	public static String printEncodedString(EncodedString str){
		String temp = "";
		int k = str.length();
		for (int i=0;i<k;i++){
			temp = str.remove()+temp;
		}
		return temp;
	}
	/**
	 * Builds a frequency map of characters for the given string.
	 * 
	 * This should just be the count of each character.
	 * 
	 * @param s
	 * @return
	 */
	public static Map<Character, Integer> buildFrequencyMap(String s) {
		HashMap map = new HashMap();
		int count;
		for (int i=0;i<s.length();i++){
			char mapping = s.charAt(i);
			count =0;
			for (int j=0;j<s.length();j++){
					if (mapping ==s.charAt(j)){
						count++;
					}
			}
			map.put(mapping, count);
		}
		return map;
	}
	
	/**
	 * Build the Huffman tree using the frequencies given.
	 * 
	 * The frequency map will not necessarily come from the buildFrequencyMap() method.
	 * 
	 * @param freq
	 * @return
	 */
	public static Node buildHuffmanTree(Map<Character, Integer> freq) {
		
		int count =0;
		//System.out.println();
		for (Integer k:freq.values()){
			count++;
		}
		
	
		Integer[] freqArray = new Integer[count];
		Character[] charArray = new Character[count];
		//System.out.println("count is: "+count);
		freqArray = freq.values().toArray(freqArray);
		charArray = freq.keySet().toArray(charArray);
		
		if(count==0){
			return null;
		}else if(count==1){
			Node re = new Node(charArray[0],freqArray[0]);
			return re;
		}
		bubbleSort(freqArray,charArray);
		/*for (int i=0;i<freqArray.length;i++){
			System.out.print(freqArray[i]+ "  ");System.out.println(charArray[i]);
		}*/
		
		ArrayList<Node> nodes = new ArrayList<Node>();
		
		for (int i=0;i<freqArray.length;i++){
			nodes.add(new Node(charArray[i],freqArray[i]));
		}
		
		//System.out.println("original:  : -----");
		/*for (Node a: nodes){
			System.out.println(a.character+"  "+a.frequency);
		}*/
		
		Node min1;
		Node min2;
		
		comparator a = new comparator();
		//System.out.println();
		Node leaf = null;
		while(length(nodes)>1){
			min1 = nodes.remove(0);
			min2 = nodes.get(0);
			leaf = new Node(min1,min2);
			nodes.set(0, leaf);
		 	Collections.sort(nodes, a);
		 	/*for (Node b:nodes){
		 		System.out.println(b.frequency+" "+b.character);
		 	}
		 	System.out.println("-----");*/
		}
		
		
		return leaf;
	}
	
	public static int length(ArrayList<Node> list){
		int count =0;
		for (Node a:list){
			count++;
		}return count;
	}
	
	
	public static ArrayList<Node> sortList(ArrayList<Node> list){
		ArrayList<Node> r = new ArrayList<Node>();
		int count = 0;
		for (Node a: list){
			count++;
		}
		
		
		Integer[] arr = new Integer[count];
		Character[] arrc = new Character[count];
		for (int i=0;i<count;i++){
			Node a = list.remove(0);
			arr[i] = a.frequency;
			arrc[i] = a.character;
		}
		
		bubbleSort(arr,arrc);
		for (int i=0;i<count;i++){
			r.add(new Node(arrc[i],arr[i]));
		}
		
		return r;
	}
	public static void bubbleSort(Integer[] arr,Character[] arrc){
		for (int i=0;i<arr.length;i++){
			for (int j=1;j<arr.length;j++){
				if (arr[j]<arr[j-1]){
					Integer temp = arr[j];
					arr[j]= arr[j-1];
					arr[j-1] = temp;
					
					Character temp2 = arrc[j];
					arrc[j] = arrc[j-1];
					arrc[j-1] = temp2;
				}
			}
		}
	}
	
	
	
 	/**
 	 * Traverse the tree and extract the encoding for each character in the tree
 	 * 
 	 * The tree provided will be a valid huffman tree but may not come from the buildHuffmanTree() method.
 	 * 
 	 * @param tree
 	 * @return
 	 */
 	public static Map<Character, EncodedString> buildEncodingMap(Node tree) {
 		HashMap map = new HashMap();
 		ArrayList<String>nav = new ArrayList<String>();
 		traverse(tree,map,"");
 		return map;
 	}
 	
 	public static void traverse(Node n,HashMap<Character, EncodedString> map,String t){
 		//System.out.println("path so far is:  "+Integer.toString(t));
 		//System.out.println("n.left is: "+n.left);
 		//System.out.println("n.right isL  "+n.right);
 		if(n.left == null && n.right == null){
 			//System.out.print("for character: "+n.character);
 			//String temp = Integer.toString(t);
 			//System.out.println("old is:  "+temp);
 			//temp = temp.substring(1,temp.length());
 			//System.out.println("old is:  "+temp);
 			//String temp2 = Integer.toString(t);
 			EncodedString a = new EncodedString();
 			for (int i=0;i<t.length();i++){
 				char tt = t.charAt(i);
 				if(tt=='0'){
 					a.zero();
 				}else if(tt=='1'){
 					
 					a.one();
 				}
 			}
 			map.put(n.character, a);
 			//System.out.println(n.character);
 			//System.out.println(n.character +" is encoded to "+t);
 			return;
 		}
 		
 		
 		traverseLeft(n,map,t);
 		traverseRight(n,map,t);
 	}
 	public static void traverseLeft(Node n,HashMap<Character, EncodedString> map,String t){
 		if(n.left!=null){
 			t = t+"0";
 			traverse(n.left,map,t);
 		}
 	}
 	public static void traverseRight(Node n,HashMap<Character, EncodedString> map,String t){
 		if(n.right!=null){
 			//String temp;
 			t = t+"1";
 			
 			traverse(n.right,map,t);
 		}
 	}
	
	/**
	 * Encode each character in the string using the map provided.
	 * 
	 * If a character in the string doesn't exist in the map ignore it.
	 * 
	 * The encoding map may not necessarily come from the buildEncodingMap() method, but will be correct
	 * for the tree given to decode() when decoding this method's output.
	 * 
	 * @param encodingMap
	 * @param s
	 * @return
	 */
	public static EncodedString encode(Map<Character, EncodedString> encodingMap, String s) {
		EncodedString re = new EncodedString();
		for (int i=0;i<s.length();i++){
			re.concat(encodingMap.get(s.charAt(i)));
		}
	
		return re;
	}
	
	
	
	/**
	 * Decode the encoded string using the tree provided.
	 * 
	 * The encoded string may not necessarily come from encode, but will be a valid string for the given tree.
	 * 
	 * (tip: use StringBuilder to make this method faster -- concatenating strings is SLOW)
	 * 
	 * @param tree
	 * @param es
	 * @return
	 */
	public static String decode(Node tree, EncodedString es) {
		Node head = tree;
		//System.out.println("tree.left "+tree.left);
		//System.out.println("tree.right"+tree.right);
		
		String temp;
		temp = printEncodedString(es);
		//System.out.println("runnn  "+temp);
		String re = "";
		while(temp.length()>0){
			char a= temp.charAt(0);
			//System.out.println("temp  "+temp);
			//System.out.println("char  "+a);
			if(a=='0' && tree.left !=null){
				tree = tree.left;
				int length = temp.length();
				temp = temp.substring(1,length);
			}else if(a=='1' && tree.right !=null){
				tree = tree.right;
				int length = temp.length();
				temp = temp.substring(1,length);
			}else{
				re=re+tree.character;
				//System.out.println("char is :"+tree.character);
				tree= head;
			}
		}
		
		re = re+tree.character;
		
		return re;
	}
}