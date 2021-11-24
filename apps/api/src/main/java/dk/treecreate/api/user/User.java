package dk.treecreate.api.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import dk.treecreate.api.authentication.models.Role;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.*;

@Entity
@Table(name = "users",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = "username"),
        @UniqueConstraint(columnNames = "email")
    })
public class User
{
    @Type(type = "uuid-char")
    @Column(name = "token", nullable = false, unique = true)
    @ApiModelProperty(notes = "UUID token used for things like verification",
        example = "c0a80121-7ac0-190b-817a-c08ab0a12346")
    private UUID token = UUID.randomUUID();

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
    @Column(name = "user_id", updatable = false, nullable = false)
    @ApiModelProperty(notes = "UUID of the user entity",
        example = "c0a80121-7ac0-190b-817a-c08ab0a12345")
    private UUID userId;

    @Column(name = "is_verified", columnDefinition = "boolean default false", nullable = false)
    @ApiModelProperty(notes = "Verification status of the user account", example = "false")
    private boolean isVerified;

    // for simplicity, the username is the email, and just exists as an extra field/column to satisfy spring security requirements
    @NotBlank
    @Size(max = 254)
    @ApiModelProperty(name = "Same as the email, used for authentication",
        example = "example@hotdeals.dev", required = true)
    @JsonIgnore // the username is not relevant for anything but internals of spring security
    private String username;

    @NotBlank
    @Size(max = 254)
    @Email
    @ApiModelProperty(name = "User's email address", example = "example@hotdeals.dev",
        required = true)
    private String email;

    @NotBlank
    @Size(max = 120)
    @JsonIgnore // don't show the password when returning a user
    private String password;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id"))
    @ApiModelProperty(notes = "A list of roles the user can have",
        example = "[\"ROLE_USED\", \"ROLE_DEVELOPER\", \"ROLE_ADMIN\"]", required = true)
    private Set<Role> roles = new HashSet<>();

    @Basic
    @ApiModelProperty(notes = "User's name, used for shipping purposes", example = "John Doe")
    @Column(name = "name", length = 80)
    private String name;

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

    public User()
    {
    }

    public User(String username, String email, String password)
    {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    public UUID getUserId()
    {
        return userId;
    }

    public void setUserId(UUID id)
    {
        this.userId = id;
    }

    public UUID getToken()
    {
        return token;
    }

    public void setToken(UUID token)
    {
        this.token = token;
    }

    public Boolean getIsVerified()
    {
        return isVerified;
    }

    public void setIsVerified(boolean isVerified)
    {
        this.isVerified = isVerified;
    }

    public String getUsername()
    {
        return username;
    }

    public void setUsername(String username)
    {
        this.username = username;
    }

    public String getEmail()
    {
        return email;
    }

    public void setEmail(String email)
    {
        this.email = email;
    }

    public String getPassword()
    {
        return password;
    }

    public void setPassword(String password)
    {
        this.password = password;
    }

    public Set<Role> getRoles()
    {
        return roles;
    }

    public void setRoles(Set<Role> roles)
    {
        this.roles = roles;
    }

    public String getName()
    {
        return name;
    }

    public void setName(String name)
    {
        this.name = name;
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

    @Override public String toString()
    {
        return "User{" +
            "userId=" + userId +
            ", isVerified=" + isVerified +
            ", token=" + token +
            ", username='" + username + '\'' +
            ", email='" + email + '\'' +
            ", roles=" + roles +
            ", name='" + name + '\'' +
            ", phoneNumber='" + phoneNumber + '\'' +
            ", streetAddress='" + streetAddress + '\'' +
            ", streetAddress2='" + streetAddress2 + '\'' +
            ", city='" + city + '\'' +
            ", postcode='" + postcode + '\'' +
            ", country='" + country + '\'' +
            '}';
    }

    @Override public boolean equals(Object o)
    {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return isVerified == user.isVerified && token.equals(user.token) &&
            userId.equals(user.userId) && Objects.equals(username, user.username) &&
            email.equals(user.email) && Objects.equals(roles, user.roles) &&
            Objects.equals(name, user.name) && Objects.equals(phoneNumber, user.phoneNumber) &&
            Objects.equals(streetAddress, user.streetAddress) &&
            Objects.equals(streetAddress2, user.streetAddress2) &&
            Objects.equals(city, user.city) && Objects.equals(postcode, user.postcode) &&
            Objects.equals(country, user.country);
    }

    @Override
    public int hashCode()
    {
        return Objects.hash(token, userId, isVerified, username, email, roles, name, phoneNumber,
            streetAddress, streetAddress2, city, postcode, country);
    }
}
