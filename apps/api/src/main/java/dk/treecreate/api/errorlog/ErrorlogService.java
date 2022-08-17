package dk.treecreate.api.errorlog;

import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ErrorlogService {
  @Autowired ErrorlogRepository errorlogRepository;

  public List<Errorlog> updateErrorlogUserId(UUID oldUserId, UUID newUserId) {
    List<Errorlog> foundErrorlogs = errorlogRepository.findByUserIdOrderByCreatedAtDesc(oldUserId);
    foundErrorlogs.forEach(errorlog -> errorlog.setUserId(newUserId));
    errorlogRepository.saveAll(foundErrorlogs);
    return foundErrorlogs;
  }
}
