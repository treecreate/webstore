package dk.treecreate.api.user;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.util.Objects;

@Entity
public class User
{
    @Id
    @GeneratedValue
    private long id;
    private String oktaId;
    private String email;
    private String firstName;
    private String lastName;

    public User()
    {
    }

    public User(long id, String oktaId, String email, String firstName, String lastName)
    {
        this.id = id;
        this.oktaId = oktaId;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
    }


    public long getId()
    {
        return id;
    }

    public void setId(long id)
    {
        this.id = id;
    }

    public String getOktaId()
    {
        return oktaId;
    }

    public void setOktaId(String oktaId)
    {
        this.oktaId = oktaId;
    }

    public String getEmail()
    {
        return email;
    }

    public void setEmail(String email)
    {
        this.email = email;
    }

    public String getFirstName()
    {
        return firstName;
    }

    public void setFirstName(String firstName)
    {
        this.firstName = firstName;
    }

    public String getLastName()
    {
        return lastName;
    }

    public void setLastName(String lastName)
    {
        this.lastName = lastName;
    }

    @Override
    public boolean equals(Object o)
    {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return id == user.id && Objects.equals(oktaId, user.oktaId) &&
            Objects.equals(email, user.email) && Objects.equals(firstName, user.firstName) &&
            Objects.equals(lastName, user.lastName);
    }

    @Override
    public int hashCode()
    {
        return Objects.hash(id, oktaId, email, firstName, lastName);
    }

    @Override
    public String toString()
    {
        return "User{" +
            "id=" + id +
            ", oktaId='" + oktaId + '\'' +
            ", email='" + email + '\'' +
            ", firstName='" + firstName + '\'' +
            ", lastName='" + lastName + '\'' +
            '}';
    }
}
