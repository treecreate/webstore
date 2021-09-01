package dk.treecreate.api.newsletter;

import io.swagger.annotations.ApiModelProperty;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Date;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "Newsletter",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = "email")
    })
public class Newsletter
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
    @ApiModelProperty(notes = "UUID of the newsletter entity",
        example = "c0a80121-7ac0-190b-817a-c08ab0a12345")
    private UUID newsletterId;

    @NotBlank
    @Size(max = 254)
    @Email
    @Column(name = "email", updatable = false, nullable = false)
    @ApiModelProperty(name = "Subscribers email address", example = "example@hotdeals.dev",
        required = true)
    private String email;

    @ApiModelProperty(name = "Date the newsletter entry was created at",
        example = "2021-08-31T19:40:10.000+00:00")
    @CreationTimestamp
    private Date createdAt;

    public Newsletter()
    {
    }


    public UUID getNewsletterId()
    {
        return newsletterId;
    }

    public void setNewsletterId(UUID newsletterId)
    {
        this.newsletterId = newsletterId;
    }

    public String getEmail()
    {
        return email;
    }

    public void setEmail(String email)
    {
        this.email = email;
    }

    public Date getCreatedAt()
    {
        return createdAt;
    }

    public void setCreatedDate(Date createdAt)
    {
        this.createdAt = createdAt;
    }

    @Override public boolean equals(Object o)
    {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Newsletter that = (Newsletter) o;
        return newsletterId.equals(that.newsletterId) && email.equals(that.email) &&
            createdAt.equals(that.createdAt);
    }

    @Override
    public int hashCode()
    {
        return Objects.hash(newsletterId, email, createdAt);
    }
}
