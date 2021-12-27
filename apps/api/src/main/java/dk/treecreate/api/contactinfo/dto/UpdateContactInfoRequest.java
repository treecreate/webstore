package dk.treecreate.api.contactinfo.dto;

import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;

public class UpdateContactInfoRequest
{
    @NotEmpty
    @Length(min = 1, max = 80)
    @ApiModelProperty(notes = "User's name, used for shipping purposes", example = "John Doe")
    private String name;

    @NotEmpty
    @Length(min = 1, max = 254)
    @Email
    @ApiModelProperty(name = "User's email address", example = "example@hotdeals.dev",
        required = true)
    private String email;

    @Length(min = 0, max = 15)
    @ApiModelProperty(notes = "User's phoneNumber, used for shipping purposes",
        example = "+4512345678")
    private String phoneNumber;

    @Length(max = 99)
    @ApiModelProperty(notes = "User's address, used for shipping purposes",
        example = "StreetGade 123")
    private String streetAddress;

    @Length(max = 99)
    @ApiModelProperty(notes = "Extra information about the address", example = "3rd floor")
    private String streetAddress2;


    @Length(max = 50)
    @ApiModelProperty(example = "Copenhagen")
    private String city;

    @Length(max = 15)
    @ApiModelProperty(example = "9999")
    private String postcode;

    @Length(max = 50)
    @ApiModelProperty(example = "Denmark")
    private String country;

    public String getName()
    {
        return name;
    }

    public void setName(String name)
    {
        this.name = name;
    }

    public String getEmail()
    {
        return email;
    }

    public void setEmail(String email)
    {
        this.email = email;
    }

    public String getPhoneNumber()
    {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber)
    {
        this.phoneNumber = phoneNumber;
    }

    public String getStreetAddress()
    {
        return streetAddress;
    }

    public void setStreetAddress(String streetAddress)
    {
        this.streetAddress = streetAddress;
    }

    public String getStreetAddress2()
    {
        return streetAddress2;
    }

    public void setStreetAddress2(String streetAddress2)
    {
        this.streetAddress2 = streetAddress2;
    }

    public String getCity()
    {
        return city;
    }

    public void setCity(String city)
    {
        this.city = city;
    }

    public String getPostcode()
    {
        return postcode;
    }

    public void setPostcode(String postcode)
    {
        this.postcode = postcode;
    }

    public String getCountry()
    {
        return country;
    }

    public void setCountry(String country)
    {
        this.country = country;
    }
}
