package dk.treecreate.api.shipmondo.utility;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class DateAndTime
{
    private static final Logger LOGGER = LoggerFactory.getLogger(DateAndTime.class);

    private String date ; // Requested pickup date. |format: yyyy-mm-dd
    private String from_time ; // Requested earliest pickup time. |format: 13:00
    private String to_time ; // Requested latest pickup time |format: 16:00

    /**
     * Blank class constructor
     */
    public DateAndTime() { /* Blank constructor */ }

    /**
     * Class constructor with only a date in it
     * @param date Requested pickup date. |format: yyyy-mm-dd
     */
    public DateAndTime(String date) {
        setDate(date);
    }

    /**
     * Class constructor with all possible fields
     * @param date Requested pickup date. |format: yyyy-mm-dd
     * @param from_time Requested earliest pickup time. |format: 13:00
     * @param to_time Requested latest pickup time |format: 16:00
     */
    public DateAndTime(String date, String from_time, String to_time) {
        setDate(date);
        setFrom_time(from_time);
        setTo_time(to_time);
    }


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
            LOGGER.error("Failed to parse time: {" + time + "}", e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unable to process time {'" + time + "'} into HH:mm");
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
            LOGGER.error("Failed to parse time: {" + date + "}", e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unable to process date {'" + date + "'} into yyyy-MM-dd");
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
