package info.androidhive.smartcoolerx;

import info.androidhive.smartcoolerx.SmartSensorFragment;
import info.androidhive.smartcoolerx.MusicFragment;

import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentPagerAdapter;

public class TabsPagerAdapter extends FragmentPagerAdapter {

    private Monitor monitor;
    SmartSensorFragment smartsensor;
    MusicFragment music;
	public TabsPagerAdapter(Monitor m, FragmentManager fm){
		super(fm);
        smartsensor = new SmartSensorFragment();
        music = new MusicFragment();
        smartsensor.setMonitor(m);
        music.setMonitor(m);

     //   this.monitor = monitor;
	}

	@Override
	public Fragment getItem(int index) {

		switch (index) {
		case 0:
			// Top Rated fragment activity
			return smartsensor;
		case 1:
			// Games fragment activity
			return music;

		}

		return null;
	}

	@Override
	public int getCount() {
		// get item count - equal to number of tabs
		return 2;
	}

}
