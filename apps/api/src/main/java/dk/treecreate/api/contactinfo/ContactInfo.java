package dk.treecreate.api.contactinfo;

import io.swagger.annotations.ApiModelProperty;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Date;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "contact_info")
public class ContactInfo
{

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
        name = "UUID",
        strategy = "org.hibernate.id.UUIDGenerator",
        parameters = {
            @org.hibernate.annotations.Parameter(
                name = "uuid_gen_strategy_class",
                value = "org.hibernate.id.uuid.CustomVersionOneStrategy"
            )
        }
    )
    @Type(type = "uuid-char")
    @ApiModelProperty(notes = "UUID of the order entity",
        example = "c0a80121-7ac0-190b-817a-c08ab0a12345")
    private UUID contactInfoId;

    @Basic
    @ApiModelProperty(notes = "User's name, used for shipping purposes", example = "John Doe")
    @Column(name = "name", length = 80)
    private String name;

    @NotBlank
    @Size(max = 254)
    @Email
    @ApiModelProperty(name = "User's email address", example = "example@hotdeals.dev",
        required = true)
    private String email;

    @Basic
    @ApiModelProperty(notes = "User's phoneNumber, used for shipping purposes",
        example = "+4512345678")
    @Size(max = 15)
    @Column(name = "phone_number", length = 15)
    private String phoneNumber;

    @Basic
    @ApiModelProperty(notes = "User's address, used for shipping purposes",
        example = "StreetGade 123")
    @Column(name = "street_address", length = 99)
    private String streetAddress;

    @Basic
    @ApiModelProperty(notes = "Extra information about the address", example = "3rd floor")
    @Column(name = "street_address_2", length = 99)
    private String streetAddress2;

    @Basic
    @ApiModelProperty(example = "Copenhagen")
    @Column(name = "city", length = 50)
    private String city;

    @Basic
    @ApiModelProperty(example = "9999")
    @Column(name = "postcode", length = 15)
    private String postcode;

    @Basic
    @ApiModelProperty(example = "Denmark")
    @Column(name = "country", length = 50)
    private String country;

    @ApiModelProperty(name = "Date the entity was created at",
        example = "2021-08-31T19:40:10.000+00:00")
    @CreationTimestamp
    private Date createdAt;

    @ApiModelProperty(name = "Date the entity was updated at",
        example = "2021-08-31T19:40:10.000+00:00")
    @UpdateTimestamp
    private Date updatedAt;

    public UUID getContactInfoId()
    {
        return contactInfoId;
    }

    public void setContactInfoId(UUID contactInfoId)
    {
        this.contactInfoId = contactInfoId;
    }

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

    public Date getCreatedAt()
    {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt)
    {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt()
    {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt)
    {
        this.updatedAt = updatedAt;
    }

    @Override public boolean equals(Object o)
    {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ContactInfo that = (ContactInfo) o;
        return contactInfoId.equals(that.contactInfoId) && Objects.equals(name, that.name) &&
            email.equals(that.email) && Objects.equals(phoneNumber, that.phoneNumber) &&
            Objects.equals(streetAddress, that.streetAddress) &&
            Objects.equals(streetAddress2, that.streetAddress2) &&
            Objects.equals(city, that.city) && Objects.equals(postcode, that.postcode) &&
            Objects.equals(country, that.country);
    }

    @Override
    public int hashCode()
    {
        return Objects.hash(contactInfoId, name, email, phoneNumber, streetAddress, streetAddress2,
            city, postcode, country);
    }
}
