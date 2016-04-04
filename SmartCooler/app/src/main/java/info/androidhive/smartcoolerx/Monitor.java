package info.androidhive.smartcoolerx;

/**
 * Created by Brad on 4/30/2015.
 */


import java.util.ArrayList;
import java.util.HashMap;

public class Monitor implements Runnable  {

    private final long MONITOR_FREQUENCY = 1000;     // check every 1000 milliseconds

    private ArrayList<MonitorItem> monitorlist;
    private HashMap <String, MonitorItem> services;
    private ArrayList <String> forcedRequests;

    public Monitor(){
        monitorlist = new ArrayList<MonitorItem>();
        services = new HashMap<String, MonitorItem>();
        forcedRequests = new ArrayList < String > ();
    }


    public void add (MonitorItem item){
        monitorlist.add(item);
        services.put(item.getFormat(),item);

    }

    public void forceRequests( String request ){
        forcedRequests.add(request);
    }

    private void allowforcedRequests( ArrayList <String> requests){
        for (String forced: forcedRequests){
            requests.add(forced);               // add the the forced requests
        }

        forcedRequests.clear();

    }

    public void run() {
        ArrayList <String> serviceItems = new ArrayList<String>();

        long beginTime;
        long endTime;

        while (true){

            beginTime = System.currentTimeMillis();
            while (true){
                endTime = System.currentTimeMillis();
                if (endTime - beginTime > MONITOR_FREQUENCY){
                    for (MonitorItem item : monitorlist){
                        String request = item.conditionStatus();//everyone gets condition status called (update)
                        if (request !=null){
                            serviceItems.add(request);
                        }
                    }

                    allowforcedRequests( serviceItems );  // allow to manually add items (for debugging)

                    for (String item: serviceItems){
                        int colindex = item.indexOf(':');
                        if (colindex < 0 || (colindex == item.length()-1) ){  // error checking
                            continue;       // probably should throw exception here but w/e
                        }

                        String service = item.substring(0,colindex);    // rips service part
                        String info = item.substring(colindex+1, item.length());    // rips payload

                        MonitorItem servicer = services.get(service);

                        if (servicer !=null){
                            servicer.feedInfo(info); // magic statement
                        }else{
                            System.out.println("WARNING:  NO SERVICER INITIATIED");
                        }
                    }

                    serviceItems.clear();
                    break;
                }
            }
        }
    }


}
