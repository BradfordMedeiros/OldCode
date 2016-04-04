import java.util.ArrayList;

public class MaxFlow {

	/**
	 * We will be grading this method solely based on the values you return. Yes
	 * it will be strict, but this is extra credit. There is only 1 method so we
	 * obviously won't be testing the intermediate parts of the algorithm. We
	 * are giving you the freedom to code it however you want though.
	 * 
	 * (the same things about changing the method headers and class headers from
	 * all previous homeworks applies to this, I just didn't feel the need to
	 * attach an entirely separate pdf just containing it. reference an old
	 * homework if you forgot what it says!)
	 * 
	 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * 
	 * This method should return a single integer, the maximum flow from s to t.
	 * You can assume that the max flow exists and is greater than 0.
	 * 
	 * There are n vertices in the graph. Numbered 0 to n-1 (inclusive).
	 * 
	 * capacities will be a n by n matrix, that represents an adjacency matrix
	 * of the network. capacities[i][j] is the capacity that can flow from
	 * vertex i to vertex j. A 0 represents there being no edge between i and j
	 * in the network.
	 * 
	 * note that the graph is directed, you may assume that if capacities[i][j]
	 * is greater than 0, then capacities[j][i] is 0, in other words there will
	 * be only one edge between two vertices in either direction
	 * 
	 * s is the source vertex that the flow should start from, s will be in the
	 * range [0, n)
	 * 
	 * t is the sink where the flow should end at, t will be in the range [0, n)
	 * 
	 * @param n
	 *            the number of vertices, this will be less than 500
	 * @param s
	 *            the source vertex
	 * @param t
	 *            the sink vertex
	 * @param capacities
	 *            the capacities of the network
	 * @return the maximum flow of the network
	 */
	@SuppressWarnings("unused")
	
	public static int flow(int n, int s, int t, int[][] capacities) {
		if (s==t || n ==2){
			return (capacities[s][t]);
		}
		
		ArrayList<pair> list = null;
		
		int counter = 0; int exhausted = 0;
		int length1 = capacities.length;
		int length2 = capacities[0].length;
		boolean foundSink = false;
		int[][] backEdges = new int[length1][length2];
		
		
		
		int sumFlow = 0;
		foundSink = true;
		int oldNode = -1;
		while(foundSink){
			int[] visited = new int[n];
			visited[s] = 1;
			int iterator = 0;
			int currNode = s;
			int it = 0;
			boolean anyFound = false;
			list = new ArrayList<pair>();
			for (int i=0;i<length2;i++){
			//	System.out.println("from:  "+currNode+" to:  "+i+" =  "+capacities[currNode][i]);
			//	System.out.println("from:  "+currNode+" to:  "+i+" =  "+backEdges[currNode][i]);
				if(currNode == s && i == length2-1 && capacities[currNode][i]==0 && backEdges[currNode][i]==0){foundSink=false; break;}
				if (capacities[currNode][i]!=0){
					if (visited[i]!=0){System.out.print("already vsited");continue;}
					anyFound = true;
					list.add(new pair(currNode,i));
					visited[i] = 1;
					//capacities[currNode][i] = 0; // just for debugging
					oldNode = -1;
					currNode = i; // use to be i
					if (currNode!=t){
						i = -1;
						continue;
					}
					if (i==t){ // this will happen when end node is found
						sumFlow += subtractEdges(list,capacities,backEdges);
						//System.out.println("sumflow is:  "+sumFlow);
						//System.out.println("new capacities:");
						/*for (pair e:list){
							System.out.println("capacities @ x("+e.x+","+e.y+")  = "+capacities[e.x][e.y]);
							System.out.println("backEdges @ x("+e.y+","+e.x+")  = "+backEdges[e.y][e.x]);
						}*/
						i = 0;
						break;
					}
				}else if(backEdges[currNode][i]!=0){
						if (visited[i]!=0){System.out.print("already vsited");continue;}
						anyFound = true;
						list.add(new pair(currNode,i));
						//capacities[currNode][i] = 0; // just for debugging
						currNode = i;
						visited[i] = 1;
						if (currNode!=t && visited[i]==0){
							i = -1;
							continue;
						}
						if (i==t){ // this will happen when end node is found
							foundSink = true;
							sumFlow += subtractEdges(list,backEdges,capacities);
							//System.out.println("sumflow is:  "+sumFlow);
						//	System.out.println("new capacities:");
							
							/*for (pair e:list){
								System.out.println("capacities @ x("+e.x+","+e.y+")  = "+capacities[e.x][e.y]);
								System.out.println("backEdges @ x("+e.y+","+e.x+")  = "+backEdges[e.y][e.x]);
							}*/
							i = 0;
							break;
							//break;
					}
				}else if (i==length2-1 && list.size()>=1){
					//System.out.println("go back");
					pair tt = list.remove(list.size()-1);
					i = tt.y;
					currNode = tt.x;
					
					
				}
				 counter++;
				 if (counter==100000){
					 foundSink = false;
					 break;
				 }
				/*if (i==s && !foundSink ){
					break;
				}
				
				if ((i==length2-1) && !anyFound){ // final iteration
					System.out.println("sink not found, invalid path");
					break;
				}*/
			}	
				
		
		
		}
		return sumFlow;
	}
	
	public static int subtractEdges(ArrayList<pair> list,int[][] capacities,int[][] backEdges){
			pair a = list.get(0);
			int min = capacities[a.x][a.y];
			for (pair e:list){
				int cap = capacities[e.x][e.y];
				if (cap<min){min = cap;}	
			}
			
			for (pair e:list){
				capacities[e.x][e.y] = capacities[e.x][e.y]-min;
				backEdges[e.y][e.x] = backEdges[e.y][e.x]+min;
			}
			
			
			return min; // this is the flow essentially
			
	}
	
	private static class pair{
		public int x;
		public int y;
		//boolean isMarker = false;
		public pair(int x,int y){
			this.x = x;
			this.y = y;
		}
		public String toString(){
			return ("x:  "+x+"y:  "+y);
		}
	}
	

	
}