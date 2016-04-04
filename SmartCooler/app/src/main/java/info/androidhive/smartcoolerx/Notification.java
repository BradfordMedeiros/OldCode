package info.androidhive.smartcoolerx;



import android.app.NotificationManager;
import android.content.Intent;
import android.app.PendingIntent;

import android.app.Activity;
import android.content.Context;
import android.R;
import android.media.RingtoneManager;
import android.support.v4.app.NotificationCompat;

public class Notification implements MonitorItem {

    private NotificationManager notificationmanager;
    private Activity activity;

    static int notificationID = 0;

    public Notification (Activity activity){
        this.activity = activity;

    }

    public void sendNotification (String title, String content){
        NotificationCompat.Builder builder = new NotificationCompat.Builder(activity.getApplicationContext());
        builder.setSmallIcon(R.drawable.ic_menu_camera);    // change this to the icon we want
        builder.setContentTitle(title);
        builder.setContentText (content);
        long[] pattern = {1,1,1};
        builder.setVibrate(pattern);
        builder.setSound(RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION));

        NotificationManager notificationManager = (NotificationManager) activity.getSystemService(Context.NOTIFICATION_SERVICE);
        notificationManager.notify(notificationID++, builder.build());

    }



    public String conditionStatus(){
        return null;
    }

    public String getFormat(){
        return "NOTIFICATION";
    }

    public void feedInfo(String info){
        sendNotification("Smart Cooler", info);

    }
}
