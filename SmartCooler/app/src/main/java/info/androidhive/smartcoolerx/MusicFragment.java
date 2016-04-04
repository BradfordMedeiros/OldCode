package info.androidhive.smartcoolerx;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import java.io.IOException;

public class MusicFragment extends Fragment {

    private Monitor monitor = null;

    public void setMonitor (Monitor monitor){
        this.monitor = monitor;
    }

    @Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container,
			Bundle savedInstanceState) {

		View rootView = inflater.inflate(R.layout.fragment_music, container, false);
		return rootView;
	}

    public void readStuff(View view) throws IOException{
        BluetoothComm communication = ((MainActivity)getActivity().getParent()).communication;
        if (communication !=null){
            //  System.out.println(communication.isReady());
            String result = communication.readLine();
            System.out.println("ReadLine:  "+result);
            System.out.println("Length:  "+result.length());

        }
    }


}
