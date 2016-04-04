import java.util.ArrayList;

public class StringSearches {


	/**
	 * Return a table for use with Boyer-Moore.
	 * 
	 * map[c] = the length - 1 - last index of c in the needle
	 * map[c] = the length if c doesn't appear in the needle
	 * 
	 * the map should have an entry for every character, 0 to Character.MAX_VALUE
	 */
	public static int[] buildCharTable(String needle) {
		int[] map = new int[Character.MAX_VALUE + 1];
		int index,value;
		int mlen = map.length;
		for (int i=0;i<mlen;i++){
			map[i]=needle.length();
		}
		for (int i=0;i<needle.length();i++){
			index = needle.charAt(i);
			value = needle.length()-needle.lastIndexOf(index)-1;
			value = value>1?value:1;
			map[index] = value;
		}
		return map;
	}

	/**
	 * Run Boyer-Moore on the given strings, looking for needle in haystack.
	 * Return an array of the indices of the occurrence of the needle in the
	 * haystack. 
	 * 
	 * If there are matches that start at index 4, 7, and 9 in the
	 * haystack, return an array containing only 4, 7, and 9. If there are no
	 * matches return an empty array, new int[0]
	 * 
	 * Running time matters, you will not get full credit if it is not
	 * implemented correctly
	 * 
	 * 
	 */
	public static int[] boyerMoore(String needle, String haystack) {
		int offset = 0;
		ArrayList<Integer> array = new ArrayList<Integer>();
		int[] map = buildCharTable(needle);
		while(offset+needle.length()<=haystack.length()){
			for (int i=needle.length()-1;i>=0;i--){
					//System.out.println("needle char is:  "+needle.charAt(i));
					//System.out.println("haystack char is:  "+haystack.charAt(offset+i));
					if (needle.charAt(i)!=haystack.charAt(offset+i)){
					int newoffset = map[haystack.charAt(offset+needle.length()-1)];
				//	System.out.println("newoffsetdiff is:  "+newoffset);
					offset = offset+newoffset;
				//	System.out.println("offset is:  "+offset);
					
					i = needle.length();
				}
				if (i==0){
				//	System.out.println(offset);
					array.add(offset);
					offset= offset+needle.length();
				}
			}
		}
		int[] arr = new int[array.size()];
		for (int i=0;i<arr.length;i++){
			arr[i] = array.get(i);
		}
		return (arr);
	}

	/**
	 * Return a table for use with KMP. In this table, table[i] is the length of
	 * the longest possible prefix that matches a proper suffix in the string
	 * needle.substring(0, i)
	 */
	public static int[] buildTable(String needle) {
		int[] array = new int[needle.length()];
		for (int i=0;i<needle.length();i++){
			if(i==0){
				array[i] = -1;
			}else{
				array[i] = calcVal(needle.substring(0,i));
			}
			//System.out.println(needle.substring(0,i));
		}
		return array;
	}
	
	public static int calcVal(String substring){
		ArrayList<String> pre = new ArrayList<String>();
		ArrayList<String> suf = new ArrayList<String>();
		int max= 0;
		for (int i=1;i<substring.length();i++){
			pre.add(substring.substring(0,i));
			suf.add(substring.substring(i));
		}	
		for (String str:pre){
			if (suf.contains(str)){
				max = str.length()>max?str.length():max;
			}
		}
		return max;
	}

	/**
	 * Run Knuth-Morris-Pratt on the given strings, looking for needle in
	 * haystack. Return an array of the indices of the occurrence of the needle
	 * in the haystack.
	 * 
	 * If there are matches that start at index 4, 7, and 9 in the
	 * haystack, return an array containing only 4, 7, and 9. If there are no
	 * matches return an empty array, new int[0]
	 */
	public static int[] kmp(String needle, String haystack) {
		int index = 0;
		int[] array = buildTable(needle);
		//System.out.println(haystack.charAt(13));
		int j = 0,i=0;
		ArrayList<Integer> arr = new ArrayList<Integer>();
		int matchIndex = 0;
		while(true){
				if (j>=needle.length()){
				//	System.out.println("match");
				//	System.out.println(matchIndex);
					arr.add(matchIndex);
					matchIndex = j;
					j=0;
					i = i-matchIndex+1;
				}

			if (i>=haystack.length()){
				//System.out.println("all comparisons completed");
				break;
			}
				//System.out.println("needle:  "+needle.charAt(j));

				//System.out.println("haystackL  "+haystack.charAt(i));

				if (haystack.charAt(i)==needle.charAt(j)){
					i++;					
					j++;
				}else{
					if(j!=0){
						j = array[j];
						matchIndex = i-j;
					}else if(j==0){
						i=i+1;
						matchIndex=  i-j;
					}
				}
		}
		
		int arr1[] = new int[arr.size()];
		for (int z=0;z<arr.size();z++){
			arr1[z] = arr.get(z);
		}
		return arr1;
	}

	// This is the base you should use, don't change it
	public static final int BASE = 1332;

	/**
	 * Given the hash for a string, return the hash for that string removing
	 * oldChar from the front and adding newChar to the end.
	 * 
	 * Power is BASE raised to the power of the length of the needle
	 */
	public static int updateHash(int oldHash, int power, char newChar,
			char oldChar) {
	//	System.out.println("in here " + oldHash);
		int newHash = oldHash-((int)oldChar)*power(BASE,power);
	//	System.out.println("newhash here is"+newHash);
		newHash = newHash*BASE;
		newHash = newHash+newChar;
	//	System.out.println("new hash is "+newHash);
		return newHash;
	}

	/**
	 * Hash the given string, using the formula given in the homework
	 */
	public static int hash(String s) {
		int sum = 0;
		for (int i=0;i<s.length();i++){
			int a =  s.charAt(s.length()-1-i);
			double b = power(BASE, i);
			double prod = a*b;
			sum = sum+(int)prod;
		}
		return Math.abs(sum);
	}
	
	public static int power(int base, int power){
		int sum = base;
		if (power == 0){
			return 1;
		}else{
			for (int i=0;i<power-1;i++){
				sum = sum*base;
			}
		}
		
		return sum;
	}

	/**
	 * Run Rabin-Karp on the given strings, looking for needle in haystack.
	 * Return an array of the indices of the occurrence of the needle in the
	 * haystack.
	 * 
	 * If there are matches that start at index 4, 7, and 9 in the
	 * haystack, return an array containing only 4, 7, and 9. If there are no
	 * matches return an empty array, new int[0]
	 */
	public static int[] rabinKarp(String needle, String haystack) {
		ArrayList<Integer> list =new ArrayList<Integer>();
		int indexhaylow = 0;
		int indexhayhigh = 0+needle.length();
		int index = 0;
		int hashneedle = hash(needle);
		int hashhay = hash(haystack);
	
		while(indexhayhigh<haystack.length()){
			
			//System.out.println("need is"+needle);
			
			if (hashneedle == hashhay){
				//System.out.println("we should do some stuff her");
				list.add(indexhaylow-1);
				hashhay = 0;
				continue;
			}
				char oldi = haystack.charAt(indexhaylow);
				char newi = haystack.charAt(indexhayhigh);
				String temp = haystack.substring(indexhaylow,indexhayhigh);
			//	System.out.println("temp is:  "+temp);
				hashhay = hash(temp);
				indexhaylow++;indexhayhigh++;
				if (hashneedle == hashhay){
				//	System.out.println("we should do some stuff her");
					list.add(indexhaylow-1);
					hashhay = 0;
					continue;
				}
			index++;
		}
		
		int[] array = new int[list.size()];
		for (int i=0;i<array.length;i++){
			array[i] = list.get(i);
		}
		return array;
	}
}