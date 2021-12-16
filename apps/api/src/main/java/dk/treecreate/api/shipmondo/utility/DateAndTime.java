package dk.treecreate.api.shipmondo.utility;

import java.text.Format;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;

public class DateAndTime
{
    private String date = "null"; // Requested pickup date. |format: yyyy-mm-dd
    private String from_time = "null"; // Requested earliest pickup time. |format: 13:00
    private String to_time = "null"; // Requested latest pickup time |format: 16:00


    /**
     * Simple function to enforce formatting of time
     * @param time String representing time separated by a ':' <p> Example: "15:00"
     * @return String<Time>
     * @throws Exception If the passed time does not follow the format
     */
    private String checkTime(String time) {
        try {
            DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH':'mm");
            return LocalTime.parse(time, timeFormatter).toString(); 
        } catch (Exception e) {
            System.err.println("Failed to parse time: [" + time + "]");
            throw e;
        }
    }

    /**
     * Simple function to enforce required formatting of date
     * @param date String representing the date separated by two '-' <p> Example: "2021-12-24"
     * @return String<Date>
     * @throws Exception If the passed date does not match the format
     */
    private String checkDate(String date) {
        try
        {
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy'-'MM'-'dd");
            return LocalDate.parse(date, dateFormatter).toString();
        } catch (Exception e)
        {
            System.err.println("Failed to parse date!");
            throw e;
        }
    }
    // Getters and setters

    public String getDate()
    {
        return this.date;
    }

    /**
     * Sets and formats the date if it can be parsed <p>
     * Throws an error if it can't
     * @param date Date formatted: yyyy-mm-dd <p> Example: "2021-02-24"
     */
    public void setDate(String date)
    {
        this.date = checkDate(date);
    }

    public String getFrom_time()
    {
        return this.from_time;
    }

    /**
     * Sets the time if the time matches the format <p> 
     * Throws an Exception if it does not.
     * @param from_time Time formatted: HH:mm <p> Example: "02:49"
     */
    public void setFrom_time(String from_time)
    {
        this.from_time = checkTime(from_time); 
    }

    public String getTo_time()
    {
        return this.to_time;
    }

    /**
     * Sets the time if the time matches the format <p> 
     * Throws an Exception if it does not.
     * @param from_time Time formatted: HH:mm <p> Example: "02:49"
     */
    public void setTo_time(String to_time)
    {
        this.to_time = checkTime(to_time); 
    }
}
