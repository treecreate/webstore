package dk.treecreate.api.designs;

import dk.treecreate.api.user.User;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "designs")
public class Design
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
    @Column(name = "design_id", updatable = false, nullable = false)
    @ApiModelProperty(notes = "UUID of the design entity",
        example = "c0a80121-7ac0-190b-817a-c08ab0a12345")
    private UUID designId;

    @ManyToOne
    @ApiModelProperty(notes = "The user the design belongs to")
    private User user;

    @Column(name = "design_properties", nullable = false)
    @ApiModelProperty(notes = "Design-specific properties, as a JSON string",
        example = "{ title: Example design," +
            "  front: 'Roboto'," +
            "  design: 'first'," +
            "  boxSize: 10," +
            "  banner: false," +
            "  largeFont: true," +
            "  boxes: []}")
    private String designProperties;

    @Column(name = "design_type", nullable = false)
    @ApiModelProperty(notes = "Design type", example = "FAMILY_TREE")
    private DesignType designType;

    public Design()
    {
    }

    public UUID getDesignId()
    {
        return designId;
    }

    public void setDesignId(UUID designId)
    {
        this.designId = designId;
    }

    public User getUser()
    {
        return user;
    }

    public void setUser(User user)
    {
        this.user = user;
    }

    public String getDesignProperties()
    {
        return designProperties;
    }

    public void setDesignProperties(String designProperties)
    {
        this.designProperties = designProperties;
    }

    public DesignType getDesignType()
    {
        return designType;
    }

    public void setDesignType(DesignType designType)
    {
        this.designType = designType;
    }

    @Override public boolean equals(Object o)
    {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Design design = (Design) o;
        return designId.equals(design.designId) && Objects.equals(user, design.user) &&
            designProperties.equals(design.designProperties) && designType == design.designType;
    }

    @Override
    public int hashCode()
    {
        return Objects.hash(designId, user, designProperties, designType);
    }
}
