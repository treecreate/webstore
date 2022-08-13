package dk.treecreate.api.user;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByEmail(String email);

  Optional<User> findByUserId(UUID userId);

  Optional<User> findByToken(UUID token);

  Boolean existsByEmail(String email);
}
