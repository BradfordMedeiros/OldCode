package info.androidhive.smartcoolerx;

import android.app.ActionBar;
import android.app.ActionBar.Tab;
import android.app.Activity;
import android.app.FragmentTransaction;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.FragmentActivity;
import android.support.v4.view.ViewPager;
import android.view.View;
import android.widget.NumberPicker;
import android.widget.TextView;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.util.Set;
import java.util.Timer;
import java.util.TimerTask;

public class MainActivity extends FragmentActivity implements
		ActionBar.TabListener{
    // Tabs stuff
	private ViewPager viewPager;
	private TabsPagerAdapter mAdapter;
	private ActionBar actionBar;
	private String[] tabs = { "Smart Sensor", "Music" };

    //Bluetooth Stuff
    private BluetoothAdapter BA;
    private Set<BluetoothDevice> pairedDevices;
    private BluetoothSocket mSocket = null;
    private BufferedReader mBufferedReader = null;
    private BufferedWriter mBufferedWriter = null;
    public BluetoothComm communication;

    // monitor stuff
    boolean threadStarted = false;
    boolean monitorStarted = false;
    Monitor monitor = new Monitor();


	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);


		// Initilization

		viewPager = (ViewPager) findViewById(R.id.pager);
		actionBar = getActionBar();

        createMonitor();
        mAdapter = new TabsPagerAdapter(monitor,getSupportFragmentManager());

		viewPager.setAdapter(mAdapter);
		//actionBar.setHomeButtonEnabled(false);
		actionBar.setNavigationMode(ActionBar.NAVIGATION_MODE_TABS);		

		// Adding Tabs
		for (String tab_name : tabs) {
			actionBar.addTab(actionBar.newTab().setText(tab_name)
					.setTabListener(this));
		}

		/**
		 * on swiping the viewpager make respective tab selected
		 * */
		viewPager.setOnPageChangeListener(new ViewPager.OnPageChangeListener() {

			@Override
			public void onPageSelected(int position) {
				// on changing the page
				// make respected tab selected
				actionBar.setSelectedNavigationItem(position);
			}

			@Override
			public void onPageScrolled(int arg0, float arg1, int arg2) {
			}

			@Override
			public void onPageScrollStateChanged(int arg0) {
			}
		});

        BA = BluetoothAdapter.getDefaultAdapter();
        System.out.println("BA IS:  "+BA);
        Intent turnOn = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
        startActivityForResult(turnOn, 0);

        try{
            openBluetoothConnection();
        }catch(IOException e){
            System.out.println("FATALERROR:  Could not open connection");
            System.exit(0);
        }


	}



	@Override
	public void onTabReselected(Tab tab, FragmentTransaction ft) {
	}

	@Override
	public void onTabSelected(Tab tab, FragmentTransaction ft) {
		// on tab selected
		// show respected fragment view
		viewPager.setCurrentItem(tab.getPosition());
	}

	@Override
	public void onTabUnselected(Tab tab, FragmentTransaction ft) {
	}

    int count = 0;
    private void openBluetoothConnection () throws IOException{
        pairedDevices = BA.getBondedDevices();

        for (BluetoothDevice device:  pairedDevices){
            count++;
            System.out.println(device.getName());
            if (device.getName().equals("RNBT-366C")){
                System.out.println("FOUND THE COOL DEVICE");
                try {
                    openDeviceConnection(device);
                }catch (IOException e){ }
            }

        }
        if (count <= 0){
            System.out.println("NO DEVICES PAIRED");
        }

    }



    private void openDeviceConnection (BluetoothDevice device) throws IOException{
        if (!threadStarted){
            threadStarted = true;
            communication = new BluetoothComm(device);
            monitor.add(communication);
            (new Thread(communication)).start();

        }
    }

    private void createMonitor(){
        monitor.add(new TemperatureItem(this));

        monitor.add(new Notification(this));

        if (!monitorStarted){
            monitorStarted = true;
            //
          //  runOnUiThread(monitor);
            (new Thread(monitor)).start();


            // create the background monitor
        }

    }


    //////////////////
    ///On Click stuff

    public void readStuff (View view) throws Exception {
        //   System.out.println("TRYING TO READ STUFF");
        //   System.out.println (mBufferedReader.readLine());
        // System.out.println(communication.read());
        if (communication !=null){
            //  System.out.println(communication.isReady());
            String result = communication.readLine();
            System.out.println("ReadLine:  "+result);
            System.out.println("Length:  "+result.length());

        }
    }

    public void volumeUp (View view)throws IOException{
        //monitor.forceRequests("MUSIC:VOLUMEUP");
        communication.write("MUSIC:UP");

    }


    public void volumeDown (View view)throws IOException{
        //monitor.forceRequests("MUSIC:VOLUMEDOWN");
        communication.write("MUSIC:DOWN");


    }

    public void nextTrack (View view)throws IOException{
       // monitor.forceRequests("MUSIC:NEXT_TRACK");
        communication.write("MUSIC:NEXT");


    }

    public void prevTrack (View view) throws IOException{
       // monitor.forceRequests("MUSIC:PREV_TRACK");
        communication.write("MUSIC:PREV");


    }

    public void playTrack (View view)throws IOException{
        //monitor.forceRequests("MUSIC:PLAY");
        communication.write("MUSIC:PLAY");


    }

    public void stop(View view) throws IOException{
        //monitor.forceRequests("MUSIC:STOP");
        communication.write("MUSIC:STOP");

    }

    public void changeText (View view){
        TextView v = (TextView) findViewById(R.id.temp);
        v.setText("text was changed");
    }


    int counter = 0;
    public void pushNotification (View view) {

        System.out.println("push notification");
        //notifications.sendNotification("WARNING!!", "FLOOD WARNING");
        //      monitor.forceRequests("TURE:430");
        if (counter == 0){
            monitor.forceRequests("TEMPERATURE:SET:50");
        }else if (counter == 1){
            monitor.forceRequests("TEMPERATURE:30");
        }else if (counter == 2){
            monitor.forceRequests("TEMPERATURE:60");
        }else if (counter == 3){
            monitor.forceRequests("TEMPERATURE:70");
        }else if (counter == 4){
            monitor.forceRequests("TEMPERATURE:SET:60");
        }else if (counter == 5){
            monitor.forceRequests("TEMPERATURE:59.9");
        }else if (counter == 6){
            monitor.forceRequests("TEMPERATURE:61");
        }

        counter++;

    }

    boolean notify = false;
    String notificationTemp =  "TEMPERATURE:SET:70";

    public void sendToSSFragNotify(View view){
        System.out.println("notify called");
       notify = !notify;

        if (notify){
            TextView tmp = (TextView)findViewById(R.id.notifybutton);
            tmp.setText("Turn Off Notifications");
            monitor.forceRequests(notificationTemp);
        }else{
            TextView tmp = (TextView)findViewById(R.id.notifybutton);
            tmp.setText("Turn On Notifications");
            monitor.forceRequests("TEMPERATURE:OFF");
        }
    }

    public void sendToSSFragTemp(View view){

            NumberPicker np1 = (NumberPicker) findViewById(R.id.numberPicker1);
            NumberPicker np2 = (NumberPicker) findViewById(R.id.numberPicker2);
            String value1 = "" + np2.getValue();
            String value2 = "" + np1.getValue();

            notificationTemp = "TEMPERATURE:SET:" + value1 + value2;
            (  (TextView) findViewById(R.id.tempbutton)).setText("Set Temperature "+"("+value1+value2+")");
            System.out.println("temp set @ " + notificationTemp);
            if (notify ){
                monitor.forceRequests(notificationTemp);
            }



    }








}
