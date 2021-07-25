package dk.treecreate.api.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, Long>
{
    Optional<User> findByEmail(String email);

    Optional<User> findByUserId(UUID userId);

    Boolean existsByEmail(String email);
}
