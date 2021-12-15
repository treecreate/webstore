package dk.treecreate.api.shipmondo.utility;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Date;

import net.bytebuddy.asm.Advice.Local;

public class DateAndTime
{
    private String date; // Requested pickup date. |format: yyyy-mm-dd
    private String from_time; // Requested earliest pickup time. |format: 13:00
    private String to_time; // Requested latest pickup time |format: 16:00

    // Getters and setters

    public String getDate()
    {
        return this.date;
    }

    /**
     * Class method to parse the input date String to verify it is valid for the required Date format the Shipmondo API
     * expects
     * 
     * @param date
     */
    public void setDate(String date)
    {
        try
        {
            LocalDate dateParsed = LocalDate.parse(date);
            this.date = dateParsed.toString();
        } catch (Exception e)
        {
            System.err.println("Failed to parse date!");
            System.err.println(e);
        }
    }

    public String getFrom_time()
    {
        return this.from_time;
    }

    public void setFrom_time(String from_time)
    {
        this.from_time = from_time;
    }

    public String getTo_time()
    {
        return this.to_time;
    }

    public void setTo_time(String to_time)
    {
        this.to_time = to_time;
    }

}
