package dk.treecreate.api.designs;

import dk.treecreate.api.contactinfo.ContactInfo;
import dk.treecreate.api.contactinfo.dto.CreateContactInfoRequest;
import org.springframework.stereotype.Service;

@Service
public class ContactInfoService {
  public ContactInfo mapCreateContactInfoRequest(
      ContactInfo contactInfo, CreateContactInfoRequest createContactInfoRequest) {
    contactInfo.setName(createContactInfoRequest.getName());
    contactInfo.setEmail(createContactInfoRequest.getEmail());
    contactInfo.setPhoneNumber(createContactInfoRequest.getPhoneNumber());
    contactInfo.setStreetAddress(createContactInfoRequest.getStreetAddress());
    contactInfo.setStreetAddress2(createContactInfoRequest.getStreetAddress2());
    contactInfo.setCity(createContactInfoRequest.getCity());
    contactInfo.setPostcode(createContactInfoRequest.getPostcode());
    return contactInfo;
  }
}
