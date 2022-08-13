package dk.treecreate.api.authentication.repository;

import dk.treecreate.api.authentication.models.ERole;
import dk.treecreate.api.authentication.models.Role;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
  Optional<Role> findByName(ERole name);
}
