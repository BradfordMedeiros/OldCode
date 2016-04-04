
public class Dynamic implements DynamicInterface {

	
	
	@Override
	public int lcs(String a, String b) {
		// TODO Auto-generated method stub
		int length1 = a.length(); int length2 = b.length();
		int[][] array = new int[length1+1][length2+1];
	
		for (int i=0;i<length1;i++){ // for every character in a (vertical)
			for (int j=0;j<length2;j++){ // for every in b (horizontal)
				if (a.charAt(i)==b.charAt(j)){ // do diagnol
					match(array,i,j);
					//print2dArray(array);
				}else{ // max above and left	
					noMatch(array,i,j);
					//print2dArray(array);
				}
			}
		}
		//print2dArray(array);
		return array[array.length-1][array[0].length-1];
	}
	public void print2dArray(int[][] array){ // prints out the 2d array
		for (int i=0;i<array.length;i++){
			for (int j=0;j<array[0].length;j++){
				System.out.print(array[i][j]+ " ");
			}
			System.out.println();
		}
	}
	public void noMatch(int[][]array,int i, int j){
		i++;j++; // convert to grid coordinates
		int max = array[i][j-1]>array[i-1][j]?array[i][j-1]:array[i-1][j];
		array[i][j] = max;
	}

	public void match(int[][]array,int i,int j){ // i and j being location in string
		i++; j++; // convert to grid coordinates
		array[i][j]=array[i-1][j-1]+1;
	}
	
	
	@Override
	public int edit(String a, String b) {
		// TODO Auto-generated method stub
		int length1 = a.length(); int length2 = b.length();
		int different; int gridI; int gridJ;
		int[][] array = new int[length1+1][length2+1];
		for (int i=1;i<length1+1;i++){
			array[i][0] = i;
		}
		for (int i=1;i<length2+1;i++){
			array[0][i] = i;
		}
		for (int i=0;i<length1;i++){
			for (int j=0;j<length2;j++){
				gridI= i +1; gridJ = j+1;
				if (a.charAt(i)==b.charAt(j)){
					different = 0;
				}else{
					different = 1;
				}
				int num1 = array[gridI-1][gridJ]+1;
				int num2 = array[gridI][gridJ-1]+1;
				int num3 = array[gridI-1][gridJ-1]+different;
				int min = num1;
				if(num2<num1){min = num2;}
				if (num3<min){min = num3;}
				array[gridI][gridJ] = min;
			}
		}
		
		return array[array.length-1][array[0].length-1];
	}

	@Override
	public int shop(int[] weight, int[] value, int max) {
		// TODO Auto-generated method stub
		
		int[] array = new int[max+1];
		array[0] = 0;
		
		for (int i=1;i<=max;i++){
			array[i] = array[i-1];
			for (int j=0;j<weight.length;j++){
				if(i-weight[j]>=0){
					array[i] = Math.max(array[i], array[i-weight[j]]+value[j]);
				}
			}
		}
		return array[max];
	}

	@Override
	public long matrix(int[] matrices) {
		// TODO Auto-generated method stub
		int n = matrices.length;
		long[][] m = new long[n+1][n+1];
		
		    for (int i = 1; i < n; i++)
		        m[i][i] = 0;
 
		    for (int L=2; L<n; L++)   
		    {
		        for (int i=1; i<=n-L; i++)
		        {
		            int j = i+L-1;
		            m[i][j] = 2147483647;
		            for (int k=i; k<=j-1; k++)
		            {
		                long q = m[i][k] + m[k+1][j] + matrices[i-1]*matrices[k]*matrices[j];
		                if (q < m[i][j])
		                    m[i][j] = q;
		            }
		        }
		    }
		return m[1][n-1];
	}

	@Override
	public int robbers(int[] weight, int[] value, int max) {
		// TODO Auto-generated method stub
		int [][] arr = new int[weight.length+1][max+1];
		for (int i=0;i<=value.length;i++){
			for (int w=0;w<=max;w++){
				if (i==0||w==0){
					continue;
				}else if (weight[i-1]<=w){
					arr[i][w] =Math.max(value[i-1]+arr[i-1][w-weight[i-1]], arr[i-1][w]);
				}else{
					arr[i][w] = arr[i-1][w];
				}
			}
		}
		return arr[weight.length][max];
	}

	@Override
	public int circus(String[] forest) {
		int width = forest[0].length();
		int depth = forest.length;
		int[][] array = new int[depth][width];
		String curr;
		for (int i=0;i<depth;i++){
			curr = forest[i];
			for (int j=0;j<width;j++){
				if (curr.charAt(j)=='.'){
					array[i][j] = 0;
				}else{
					array[i][j] = 1;
				}
			}
		}
		
		//print2dArray(array);
		int max = 0;
		int[][] arrr = new int[array.length][array[0].length];
		for (int i =0;i<arrr.length;i++){
			if (array[i][0]==0){
				arrr[i][0]=1;
			}
			max = Math.max(max, arrr[i][0]);
		}
		
		for (int j=0;j<arrr[0].length;j++){
			if(array[0][j]==0){
				arrr[0][j]=1;
			}
			max = Math.max(max, arrr[0][j]);
		}
		
		
		for (int i=1;i<arrr.length;i++){
			for (int j=1;j<arrr[0].length;j++){
				if (array[i][j]==0){
					arrr[i][j] = Math.min(arrr[i-1][j], arrr[i][j-1]);
					if ( array[i-arrr[i][j]][j-arrr[i][j]] == 0) {
						arrr[i][j]++;
					}
					max = Math.max(max,arrr[i][j]);
				}
			}
		}
		max*=max;
		// TODO Auto-generated method stub
		return max;
	}

	@Override
	public int[] realEstate(String[] flatLand) {
		// TODO Auto-generated method stub
		return null;
	}

}