package info.androidhive.smartcoolerx;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.NumberPicker;
import android.widget.TextView;

public class SmartSensorFragment extends Fragment implements MonitorItem {

   private Monitor monitor = null;

   public void setMonitor (Monitor monitor){
       this.monitor = monitor;
       monitor.add(this);
   }
    public String conditionStatus(){

        return null;
    }    // "true" --> execute condition handler, "notification:stuff");

    int count = 0;
    public void feedInfo (String info){
        count ++;
        count = count % 4;
        if (info == null){
            return;
        }

         View v = getView();
         if (v == null ) {
             return;
         }
         final TextView tmp = (TextView)v.findViewById(R.id.temp);
        final String temp;
        if (info.equals("-1")){
            temp = "Waiting on Network";
        }else{
            temp = info;

        }
         if (tmp !=null){


             tmp.post(new Runnable() {
                 public void run() {
                     if (temp.equals("Waiting on Network")){
                         tmp.setTextSize(30);

                         String append = "";
                         for (int i=0; i< count;i++){
                             append = append+".";
                         }
                         tmp.setText(temp+append);
                     }else{
                         tmp.setTextSize(50);
                         tmp.setText(temp+" F");
                     }
                 }
             });
         }
        // tmp.setText("hello world");

    }
    public String getFormat(){
        return "SS";
    }



    @Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container,
			Bundle savedInstanceState) {

		View rootView = inflater.inflate(R.layout.fragment_smartsensor, container, false);
      //  TextView tmp = (TextView)this.getView().findViewById(R.id.temp);
       // tmp.setText("hello world");
        NumberPicker num1 = (NumberPicker)(rootView.findViewById(R.id.numberPicker1));
        NumberPicker num2 = (NumberPicker)(rootView.findViewById(R.id.numberPicker2));
        num1.setDescendantFocusability(NumberPicker.FOCUS_BLOCK_DESCENDANTS);
        num2.setDescendantFocusability(NumberPicker.FOCUS_BLOCK_DESCENDANTS);

        num1.setMinValue(0);
        num1.setMaxValue(9);
        num2.setMinValue(0);
        num2.setMaxValue(9);

		return rootView;
	}


}
