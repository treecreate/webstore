package dk.treecreate.api.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import java.io.IOException;
import java.util.Map;

@Converter
public class HashMapConverter implements AttributeConverter<Map<String, Object>, String>
{

    private static final Logger logger = LoggerFactory.getLogger(HashMapConverter.class);

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(Map<String, Object> data)
    {

        String dataJson = null;
        try
        {
            dataJson = objectMapper.writeValueAsString(data);
        } catch (final JsonProcessingException e)
        {
            logger.error("JSON writing error", e);
        }

        return dataJson;
    }

    @Override
    public Map<String, Object> convertToEntityAttribute(String dataJson)
    {

        Map<String, Object> data = null;
        try
        {
            data = objectMapper.readValue(dataJson, Map.class);
        } catch (final IOException e)
        {
            logger.error("JSON reading error", e);
        }

        return data;
    }

}
