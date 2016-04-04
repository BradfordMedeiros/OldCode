package info.androidhive.smartcoolerx;


// when condition is true we call handleCondition (we check based upon condition timer)
// Monitor uses this to check status of what needs to be called
public interface MonitorItem {

    // WE ARE NOT ACTUALLY GOING TO SUPPORT THIS
    // WOULD BE NICE BUT WE'LL JUST CHECK EVERY 5 SECONDS
    //  public int getConditionTimer();    // returns how often the item should be checked


    public String conditionStatus();    // "true" --> execute condition handler, "notification:stuff");
    public void feedInfo (String info);
    public String getFormat();

    // example:
    // we if conditionStatus returns Temperature:stuff we call feedInfo(stuff) to items
    // that return getFormat as Temperature
}
