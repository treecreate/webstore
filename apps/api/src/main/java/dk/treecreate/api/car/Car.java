package dk.treecreate.api.car;

import org.springframework.lang.NonNull;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.util.Objects;

@Entity
public class Car
{
    @Id
    @GeneratedValue
    private Long id;

    @NonNull
    private String name;

    public Car()
    {
    }

    public Car(Long id, @NonNull String name)
    {
        this.id = id;
        this.name = name;
    }

    public Long getId()
    {
        return id;
    }

    public void setId(Long id)
    {
        this.id = id;
    }

    @NonNull public String getName()
    {
        return name;
    }

    public void setName(@NonNull String name)
    {
        this.name = name;
    }

    @Override public boolean equals(Object o)
    {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Car car = (Car) o;
        return Objects.equals(id, car.id) && name.equals(car.name);
    }

    @Override
    public int hashCode()
    {
        return Objects.hash(id, name);
    }
}
