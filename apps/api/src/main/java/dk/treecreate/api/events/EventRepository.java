package dk.treecreate.api.events;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
  List<Event> findAllByOrderByCreatedAtDesc();

  List<Event> findByNameOrderByCreatedAtDesc(String name);

  List<Event> findByUserIdOrderByCreatedAtDesc(UUID userId);

  List<Event> findByNameAndUserIdOrderByCreatedAtDesc(String name, UUID userId);

  @Query(
      nativeQuery = true,
      value =
          "SELECT created_at as createdAt, COUNT(DISTINCT user_id) as count FROM events WHERE created_at BETWEEN NOW() - INTERVAL ?1 MINUTE AND NOW() GROUP BY UNIX_TIMESTAMP(created_at) DIV ?2 ORDER BY created_at DESC")
  List<RecentUsers> getRecentUsers(int duration, int interval);

  @Query(
      nativeQuery = true,
      value =
          "SELECT url, COUNT(url) as count from events WHERE name = 'webstore.page-viewed' AND created_at BETWEEN NOW() - INTERVAL ?2 DAY AND NOW() - INTERVAL ?1 DAY GROUP BY url")
  List<PagesViewed> getPagesViewed(int daysOffsetA, int daysOffsetB);

  public interface RecentUsers {
    LocalDateTime getCreatedAt();

    Integer getCount();
  }

  public interface PagesViewed {
    String getUrl();

    Integer getCount();
  }
}
