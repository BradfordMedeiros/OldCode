package info.androidhive.smartcoolerx;

import android.app.Activity;
import android.view.View;
import android.widget.TextView;

import java.util.ArrayList;
public class TemperatureItem implements MonitorItem {


    int count = 0;
    ArrayList <TimeTempPair> tempStamps;

    boolean maxSet = false;
    boolean hasReported = false;
    double maxTemperature = 0;
    double currentTemperature = -1;

    private TextView temperatureText;
    private Activity main;

    public TemperatureItem (MainActivity activity){
        tempStamps = new ArrayList<TimeTempPair>();
        this.main = activity;
        //this.temperatureText = temperatureText;
    }





    private class TimeTempPair {
        double timestamp;
        double temperature;


        public TimeTempPair(double temperature){
            this.temperature = temperature;
            this.timestamp = (double) System.currentTimeMillis();
        }

        public String toString (){
            String result = "";
            result+= "timestamp:\t"+timestamp+"\n";
            result+= "temperature:\t"+temperature+"\n";
            return result;
        }
    }


    public String conditionStatus(){

        if ( maxSet && !hasReported &&  ( currentTemperature > maxTemperature) ){
            hasReported = true;
            return ("NOTIFICATION:NOTICE Cooler Temperature @ "+currentTemperature);
        }

        if (currentTemperature == -1){
            return ("SS:Waiting on Network");
        }
        System.out.println("sending to ss");
        return ("SS:"+currentTemperature);
    }


    // what do we do when we get new temperature shit
    // this should be temperatures

    // Temperature:39893  --> feeds in temperature reading
    // Temperature:SET:60 --> sets a maximum t5emperature value
    // Temperature:OFF    --> turns off max temperature
    // Temperature:RESET  --> makes it so you can report again to phone
    public void feedInfo (String info){

        System.out.println("FEEDING INFO TO TEMP");
        int colindex = info.indexOf(':');
        if (info.contains("RESET")){

            if (colindex < 0 ){
                System.out.println("WARNING:  Invalid temperature command: "+info);
            }else{
                hasReported = false;
            }

        }else if (info.contains("OFF")) {
            if (colindex < 0 ){
                System.out.println("WARNING:  Invalid temperature command: "+info);
            }else{
                maxSet = false;
            }

        }else if (info.contains("SET")){
            if (colindex < 0 || (colindex == info.length()-1) ){
                System.out.println("WARNING:  Invalid temperature command: "+info);
            }else{
                System.out.println("SETTING TEMPERATURE");
                double newMax = Double.parseDouble(info.substring(colindex+1,info.length()));
                setMax(newMax);
            }


        }else{          // if just a normal temperature stream
            System.out.println("FEEDING INFO:  |"+info+"|");
            double temperature = Double.parseDouble(info);
            currentTemperature = temperature;

            tempStamps.add(new TimeTempPair(temperature));

            System.out.println("new temp:  " + temperature);






        }

    }



    public void setMax (double newMax){
        maxSet = true;
        hasReported = false;
        maxTemperature = newMax;
    }

    public String getFormat(){
        return "TEMPERATURE";
    }
}