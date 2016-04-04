package info.androidhive.smartcoolerx;


import java.util.ArrayList;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothServerSocket;
import android.bluetooth.BluetoothSocket;
import android.bluetooth.BluetoothAdapter;

import java.io.DataInputStream;
import java.io.DataOutput;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.UUID;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.util.Log;

/**
 * Created by Brad on 4/26/2015.
 */
public class BluetoothComm implements Runnable, MonitorItem {
    private static final String UUID_SERIAL_PORT_PROFILE = "00001101-0000-1000-8000-00805F9B34FB";


    private BluetoothServerSocket mmServerSocket;
    private BluetoothSocket outsocket;

    private DataInputStream input = null;
    private DataOutputStream output = null;
    private ArrayList<String> outgoingbuffer = new ArrayList<String>();
    private boolean ready = false;
    private BluetoothDevice device;


    public BluetoothComm(BluetoothDevice device){
        this.device = device;
    }

    private UUID getSerialPortUUID(){
        return UUID.fromString(UUID_SERIAL_PORT_PROFILE);
    }

    public char readChar() throws IOException{


        if (input == null || input.available() == 0){    // if no bytes are available
            //System.out.println("NO MORE DATA AVAILABLE");
            return 0;           // signifies unsuccessful read
        }else{
            int result =  input.readByte();

            // input.readChar() // --> let's try that to see if it does anything different (wont)
            // System.out.println("Socket just read:  "+(char)(int)result);
            ready = true;
            return (char)result;

        }

    }

    // if caller type == 0 we write it outbound, data is disregarded (null)
    // if caller type == 1 we append to arraylist

    public String readLine() throws IOException {
        String bluetoothRecieve = readLineHelper();
        if (bluetoothRecieve.length() == 0){
            bluetoothRecieve = readLineHelper();
        }
        return bluetoothRecieve;
    }

    public String readLineHelper () throws IOException{
        StringBuilder builder = new StringBuilder();

        char nextChar = 0;

        while ((  (nextChar = readChar()) !=0 && (nextChar !='\n' ) )){
            builder.append(nextChar);

        }
        return builder.toString();
    }



    public void run(){

        ready = false;
        BluetoothSocket socket = null;
        BluetoothAdapter mAdapter = BluetoothAdapter.getDefaultAdapter();

        // listen to the server socket if we're not connected
        int tries = 10;
        while (true && tries < 50 ){
            tries++;
            System.out.println("Trying to connect");
            try{
                Thread.sleep(1000);
            }catch (Exception e){}

            //System.out.println("Trying to connect");
            // opens the socket

            try{
                mmServerSocket = mAdapter.listenUsingRfcommWithServiceRecord (this.device.getName(), this.getSerialPortUUID());

                outsocket = device.createRfcommSocketToServiceRecord(this.getSerialPortUUID());
                System.out.println("got to outsocket");
                outsocket.connect();
                OutputStream outstream = outsocket.getOutputStream();
                InputStream instream = outsocket.getInputStream();

                input = new DataInputStream(instream);
                output = new DataOutputStream(outstream);

               write("hello ");
                //ready = true;
                break;



            }catch (IOException e){
                System.out.println("Exception 1");
                if (ready){
                    break;
                }
            }



        }

        System.out.println("BLUETOOTH CONNECTION ESTABLISHED\n-----------------------");



    }



    public boolean isReady (){
        return this.ready;
    }

    public void write(String outbound) throws IOException {
        if (output !=null){
            System.out.println("WROTE OUTBOUND:  "+outbound);
            char[] towrite = outbound.toCharArray();
            for (char letter: towrite){
                System.out.println(letter);
                output.writeByte(letter);
            }

            output.writeByte('\n');
            output.writeByte(0);
            output.writeByte(0);

            output.writeByte(0);
            output.writeByte(0);
            output.writeByte(0);

            //output.write(0);
            //output.writeChars(outbound);
            //output.writeChar('\n');
            // output.writeChar(0);
        }else{
            System.out.println("COULD NOT WRITE:  "+outbound);
        }
    }



    public void feedInfo (String info) {
        try{
            write(info);
        }catch (Exception e){
            System.out.println("ERROR: Could not write info");
        }
    }


    // FEED IN COMMMUNICATIONS STUFF


    int count = 0;
    public String conditionStatus(){
        count ++;

        if (count %2 == 0){
            return null;
        }
        try{
            System.out.println("reading info in bluetooth");

            String request = readLine();
            request = request.trim();
            System.out.println("request:  ("+request+")");

           // int index = request.indexOf(':');
           // if ( index < 0 || index == request.length()-1 || index == 0){
            //    throw (new Exception ());
            //}

            double incoming = Double.parseDouble(request);

          //  System.out.println("(TEMPERATURE:"+incoming+")");
            return ("TEMPERATURE:"+incoming);
        }catch (Exception e){
            System.out.println("ERROR:  Could not read info");
            return null;
        }

    }

    public String getFormat(){
        return "BLUETOOTH";
    }

}
