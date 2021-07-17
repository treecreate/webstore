package dk.treecreate.api.authentication.models;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "roles")
public class Role
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
    @Column(name = "role_id", updatable = false, nullable = false)
    private UUID roleId;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ERole name;

    public Role()
    {

    }

    public Role(ERole name)
    {
        this.name = name;
    }

    public UUID getRoleId()
    {
        return roleId;
    }

    public void setRoleId(UUID roleId)
    {
        this.roleId = roleId;
    }

    public ERole getName()
    {
        return name;
    }

    public void setName(ERole name)
    {
        this.name = name;
    }

    @Override public String toString()
    {
        return "Role{" +
            "id=" + roleId +
            ", name=" + name +
            '}';
    }
}
