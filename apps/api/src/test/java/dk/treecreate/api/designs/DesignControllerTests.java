package dk.treecreate.api.designs;

import dk.treecreate.api.TestUtilsService;
import dk.treecreate.api.authentication.services.AuthUserService;
import dk.treecreate.api.designs.dto.CreateDesignRequest;
import dk.treecreate.api.designs.dto.UpdateDesignRequest;
import dk.treecreate.api.user.User;
import dk.treecreate.api.user.UserRepository;
import dk.treecreate.api.user.UserService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@AutoConfigureMockMvc
public class DesignControllerTests
{

    @Autowired
    UserService userService;
    @MockBean
    AuthUserService authUserService;
    @Autowired
    private MockMvc mvc;
    @MockBean
    private UserRepository userRepository;
    @MockBean
    private DesignRepository designRepository;


    @Nested
    class AuthenticationTests
    {

        @Test
        @DisplayName("GET /designs endpoint returns 401 when user credentials are invalid")
        void getDesignsReturnsUnauthorizedOnInvalidCredentials() throws Exception
        {
            mvc.perform(get("/designs"))
                .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName(
            "GET /designs endpoint returns 401 when user without Developer or Admin role tries tto access it")
        @WithMockUser(username = "user@hotdeals.dev", password = "testPassword")
        void getDesignsReturnsForbiddenOnMIssingRole() throws Exception
        {
            mvc.perform(get("/designs"))
                .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName(
            "GET /designs/:userId endpoint returns 401 when user credentials are invalid")
        void getDesignsOfUserReturnsUnauthorizedOnInvalidCredentials() throws Exception
        {
            UUID uuid = new UUID(0, 0);
            mvc.perform(get("/designs/" + uuid))
                .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName(
            "GET /designs/:userId endpoint returns 403 when user without Developer or Admin role tries tto access it")
        @WithMockUser(username = "user@hotdeals.dev", password = "testPassword")
        void getDesignsOfUserReturnsForbiddenOnMissingRole() throws Exception
        {
            UUID uuid = new UUID(0, 0);
            mvc.perform(get("/designs/" + uuid))
                .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName(
            "POST /designs/:designId endpoint returns 401 when user credentials are invalid")
        void getDesignReturnsUnauthorizedOnInvalidCredentials() throws Exception
        {
            UUID uuid = new UUID(0, 0);
            mvc.perform(post("/designs/" + uuid))
                .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName(
            "POST /designs/:designId endpoint returns 403 when user without Developer or Admin role tries tto access it")
        @WithMockUser(username = "user@hotdeals.dev", password = "testPassword")
        void getDesignReturnsForbiddenOnMissingRole() throws Exception
        {
            UUID uuid = new UUID(0, 0);
            mvc.perform(post("/designs/" + uuid))
                .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("GET /designs/me endpoint returns 401 when user credentials are invalid")
        void getDesignsOfCurrentUserReturnsUnauthorizedOnInvalidCredentials() throws Exception
        {
            mvc.perform(get("/designs/me"))
                .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName(
            "GET /designs/me/:designId endpoint returns 401 when user credentials are invalid")
        void getSpecificDesignOfCurrentUserReturnsUnauthorizedOnInvalidCredentials()
            throws Exception
        {
            UUID uuid = new UUID(0, 0);
            mvc.perform(get("/designs/me/" + uuid))
                .andExpect(status().isUnauthorized());
        }


        @Test
        @DisplayName("POST /designs endpoint returns 401 when user credentials are invalid")
        void createReturnsUnauthorizedOnInvalidCredentials() throws Exception
        {
            UUID uuid = new UUID(0, 0);
            mvc.perform(post("/designs/" + uuid))
                .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName(
            "PUT /designs/:designId endpoint returns 401 when user credentials are invalid")
        void updateReturnsUnauthorizedOnInvalidCredentials() throws Exception
        {
            UUID uuid = new UUID(0, 0);
            mvc.perform(put("/designs/" + uuid))
                .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName(
            "DELETE /designs/:designId endpoint returns 401 when user credentials are invalid")
        void deleteReturnsUnauthorizedOnInvalidCredentials() throws Exception
        {
            UUID uuid = new UUID(0, 0);
            mvc.perform(delete("/designs/" + uuid))
                .andExpect(status().isUnauthorized());
        }
    }

    @Nested
    class GetDesignsTests
    {
        @Test
        @DisplayName("GET /designs endpoint returns 403: Forbidden when called by ROLE_USER")
        @WithMockUser(username = "user@hotdeals.dev", password = "testPassword")
        void getDesignsReturnsForbiddenToRoleUser() throws Exception
        {
            mvc.perform(get("/designs"))
                .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("GET /designs endpoint returns a list of designs")
        @WithMockUser(username = "user@hotdeals.dev", password = "testPassword",
            roles = {"DEVELOPER"})
        void getDesignsReturnsListOfDesigns() throws Exception
        {
            List<Design> list = new ArrayList<>();
            User user = new User();
            user.setEmail("user@hotdeals.dev");
            list.add(new Design());
            list.get(0).setUser(user);
            list.get(0).setDesignType(DesignType.FAMILY_TREE);
            list.get(0).setDesignProperties("");
            list.add(new Design());
            list.get(1).setUser(user);
            list.get(1).setDesignType(DesignType.FAMILY_TREE);
            list.get(1).setDesignProperties("");

            Mockito.when(designRepository.findAll()).thenReturn(list);

            mvc.perform(get("/designs"))
                .andExpect(status().isOk())
                .andExpect(content().json(TestUtilsService.asJsonString(list)));
        }
    }

    @Nested
    class GetDesignsOfCurrentUserTests
    {

        @Test
        @DisplayName("GET /designs/me endpoint returns a list of designs")
        @WithMockUser(username = "user@hotdeals.dev", password = "testPassword")
        void getDesignsOfCurrentUserReturnsDesigns() throws Exception
        {
            List<Design> list = new ArrayList<>();
            User user = new User();
            user.setEmail("user@hotdeals.dev");
            user.setUsername(user.getEmail());
            list.add(new Design());
            list.get(0).setUser(user);
            list.get(0).setDesignType(DesignType.FAMILY_TREE);
            list.get(0).setDesignProperties("");
            list.add(new Design());
            list.get(1).setUser(user);
            list.get(1).setDesignType(DesignType.FAMILY_TREE);
            list.get(1).setDesignProperties("");

            Mockito.when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
            Mockito.when(authUserService.getCurrentlyAuthenticatedUser())
                .thenReturn(user);
            Mockito.when(designRepository.findByUser(user)).thenReturn(list);

            mvc.perform(get("/designs/me"))
                .andExpect(status().isOk())
                .andExpect(content().json(TestUtilsService.asJsonString(list)));
        }
    }

    @Nested
    class GetDesignsOfUserTests
    {

        @Test
        @DisplayName(
            "GET /designs/:userId endpoint returns 403: Forbidden when called by ROLE_USER")
        @WithMockUser(username = "user@hotdeals.dev", password = "testPassword")
        void getDesignsOfUserReturnsForbiddenToRoleUser() throws Exception
        {
            mvc.perform(get("/designs/" + new UUID(0, 0)))
                .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("GET /designs/:userID endpoint returns a design")
        @WithMockUser(username = "user@hotdeals.dev", password = "testPassword",
            roles = {"DEVELOPER"})
        void getDesignsOfUserReturnsDesigns() throws Exception
        {
            UUID uuid = new UUID(0, 0);
            List<Design> list = new ArrayList<>();
            User user = new User();
            user.setEmail("user@hotdeals.dev");
            list.add(new Design());
            list.get(0).setUser(user);
            list.get(0).setDesignType(DesignType.FAMILY_TREE);
            list.get(0).setDesignProperties("");
            list.add(new Design());
            list.get(1).setUser(user);
            list.get(1).setDesignType(DesignType.FAMILY_TREE);
            list.get(1).setDesignProperties("");

            Mockito.when(userRepository.findByUserId(uuid)).thenReturn(Optional.of(user));
            Mockito.when(designRepository.findByUser(user)).thenReturn(list);

            mvc.perform(get("/designs/" + uuid))
                .andExpect(status().isOk())
                .andExpect(content().json(TestUtilsService.asJsonString(list)));
        }
    }

    @Nested
    class GetDesignTests
    {

        @Test
        @DisplayName(
            "POST /designs/:designId endpoint returns 403: Forbidden when called by ROLE_USER")
        @WithMockUser(username = "user@hotdeals.dev", password = "testPassword")
        void getDesignReturnsForbiddenToRoleUser() throws Exception
        {
            mvc.perform(get("/designs/" + new UUID(0, 0)))
                .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("POST /designs endpoint returns a design")
        @WithMockUser(username = "user@hotdeals.dev", password = "testPassword",
            roles = {"DEVELOPER"})
        void getDesignReturnsDesign() throws Exception
        {
            UUID uuid = new UUID(0, 0);
            User user = new User();
            user.setUserId(uuid);
            Design design = new Design();
            design.setUser(user);
            design.setDesignType(DesignType.FAMILY_TREE);
            design.setDesignProperties("");

            Mockito.when(userRepository.findByUserId(uuid)).thenReturn(Optional.of(user));
            Mockito.when(designRepository.findByDesignId(uuid)).thenReturn(Optional.of(design));

            mvc.perform(post("/designs/" + uuid))
                .andExpect(status().isOk())
                .andExpect(content().json(TestUtilsService.asJsonString(design)));
        }
    }

    @Nested
    class GetDesignOfCurrentUserTests
    {
        @Test
        @DisplayName(
            "GET /designs/me/:designId endpoint returns 403: Forbidden when trying access design of another user")
        @WithMockUser(username = "user@hotdeals.dev", password = "testPassword")
        void getDesignOfCurrentUserReturnsForbiddenWhenAccessingDesignOfAnotherUser()
            throws Exception
        {
            UUID uuid = new UUID(0, 0);
            User user = new User();
            user.setUserId(UUID.randomUUID());
            user.setEmail("user@hotdeals.dev");
            user.setUsername(user.getEmail());
            User secondUser = new User();
            secondUser.setEmail("user2@hotdeals.dev");
            secondUser.setUsername(secondUser.getEmail());
            Design design = new Design();
            design.setDesignId(uuid);
            design.setUser(secondUser);
            design.setDesignType(DesignType.FAMILY_TREE);
            design.setDesignProperties("");

            Mockito.when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
            Mockito.when(authUserService.getCurrentlyAuthenticatedUser())
                .thenReturn(user);
            Mockito.when(designRepository.findByDesignId(design.getDesignId()))
                .thenReturn(Optional.of(design));

            mvc.perform(get("/designs/me/" + uuid))
                .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("GET /designs/me/:designId endpoint returns a design")
        @WithMockUser(username = "user@hotdeals.dev", password = "testPassword")
        void getDesignOfCurrentUserReturnsDesign() throws Exception
        {
            UUID uuid = new UUID(0, 0);
            User user = new User();
            user.setEmail("user@hotdeals.dev");
            user.setUsername(user.getEmail());
            Design design = new Design();
            design.setDesignId(uuid);
            design.setUser(user);
            design.setDesignType(DesignType.FAMILY_TREE);
            design.setDesignProperties("");

            Mockito.when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
            Mockito.when(authUserService.getCurrentlyAuthenticatedUser())
                .thenReturn(user);
            Mockito.when(designRepository.findByDesignId(design.getDesignId()))
                .thenReturn(Optional.of(design));

            mvc.perform(get("/designs/me/" + uuid))
                .andExpect(status().isOk())
                .andExpect(content().json(TestUtilsService.asJsonString(design)));
        }
    }

    @Nested
    class CreateDesignTests
    {
        @Test
        @DisplayName("POST /designs endpoint returns an new design")
        @WithMockUser(username = "user@hotdeals.dev", password = "testPassword")
        void createDesignReturnsDesign() throws Exception
        {
            UUID uuid = new UUID(0, 0);
            User user = new User();
            user.setUserId(uuid);
            user.setEmail("user@hotdeals.dev");
            user.setUsername(user.getEmail());
            Design design = new Design();
            design.setUser(user);
            design.setDesignType(DesignType.FAMILY_TREE);
            design.setDesignProperties("");
            Design savedDesign = new Design();
            savedDesign.setDesignId(uuid);
            savedDesign.setUser(user);
            savedDesign.setDesignType(DesignType.FAMILY_TREE);
            savedDesign.setDesignProperties("");
            CreateDesignRequest createDesignRequest = new CreateDesignRequest();
            createDesignRequest.setDesignType(design.getDesignType());
            createDesignRequest.setDesignProperties(design.getDesignProperties());

            Mockito.when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
            Mockito.when(authUserService.getCurrentlyAuthenticatedUser())
                .thenReturn(user);
            Mockito.when(designRepository.save(savedDesign))
                .thenReturn(savedDesign);

            mvc.perform(post("/designs")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtilsService.asJsonString(createDesignRequest)))
                .andExpect(status().isOk());
        }
    }

    @Nested
    class UpdateDesignTests
    {
        @Test
        @DisplayName(
            "PUT /designs endpoint returns 403: Forbidden when trying update design of another user")
        @WithMockUser(username = "user@hotdeals.dev", password = "testPassword")
        void updateDesignReturnsForbiddenWhenAccessingDesignOfAnotherUser() throws Exception
        {
            UUID uuid = new UUID(0, 0);
            User user = new User();
            user.setUserId(UUID.randomUUID());
            user.setEmail("user@hotdeals.dev");
            user.setUsername(user.getEmail());
            User secondUser = new User();
            secondUser.setEmail("user2@hotdeals.dev");
            secondUser.setUsername(secondUser.getEmail());
            Design design = new Design();
            design.setDesignId(uuid);
            design.setUser(secondUser);
            design.setDesignType(DesignType.FAMILY_TREE);
            design.setDesignProperties("");
            UpdateDesignRequest updateDesignRequest = new UpdateDesignRequest();
            updateDesignRequest.setDesignId(design.getDesignId());
            updateDesignRequest.setDesignType(design.getDesignType());
            updateDesignRequest.setDesignProperties(design.getDesignProperties());

            Mockito.when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
            Mockito.when(authUserService.getCurrentlyAuthenticatedUser())
                .thenReturn(user);
            Mockito.when(designRepository.findByDesignId(design.getDesignId()))
                .thenReturn(Optional.of(design));

            mvc.perform(put("/designs")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtilsService.asJsonString(updateDesignRequest)))
                .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("PUT /designs endpoint returns an updated design")
        @WithMockUser(username = "user@hotdeals.dev", password = "testPassword")
        void updateDesignReturnsDesign() throws Exception
        {
            UUID uuid = new UUID(0, 0);
            User user = new User();
            user.setEmail("user@hotdeals.dev");
            user.setUsername(user.getEmail());
            Design design = new Design();
            design.setDesignId(uuid);
            design.setUser(user);
            design.setDesignType(DesignType.FAMILY_TREE);
            design.setDesignProperties("");
            Design updatedDesign = new Design();
            updatedDesign.setDesignId(uuid);
            updatedDesign.setUser(user);
            updatedDesign.setDesignType(DesignType.FAMILY_TREE);
            updatedDesign.setDesignProperties("updated");
            UpdateDesignRequest updateDesignRequest = new UpdateDesignRequest();
            updateDesignRequest.setDesignId(updatedDesign.getDesignId());
            updateDesignRequest.setDesignType(updatedDesign.getDesignType());
            updateDesignRequest.setDesignProperties(updatedDesign.getDesignProperties());

            Mockito.when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
            Mockito.when(authUserService.getCurrentlyAuthenticatedUser())
                .thenReturn(user);
            Mockito.when(designRepository.findByDesignId(design.getDesignId()))
                .thenReturn(Optional.of(design));
            Mockito.when(designRepository.save(design))
                .thenReturn(updatedDesign);

            mvc.perform(put("/designs")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtilsService.asJsonString(updateDesignRequest)))
                .andExpect(status().isOk())
                .andExpect(content().json(TestUtilsService.asJsonString(updatedDesign)));
        }
    }

    @Nested
    class DeleteDesignTests
    {
        @Test
        @DisplayName(
            "DELETE /designs/:designId endpoint returns 403: Forbidden when trying delete design of another user")
        @WithMockUser(username = "user@hotdeals.dev", password = "testPassword")
        void deleteDesignReturnsForbiddenWhenDeletingDesignOfAnotherUser() throws Exception
        {
            UUID uuid = new UUID(0, 0);
            User user = new User();
            user.setUserId(UUID.randomUUID());
            user.setEmail("user@hotdeals.dev");
            user.setUsername(user.getEmail());
            User secondUser = new User();
            secondUser.setEmail("user2@hotdeals.dev");
            secondUser.setUsername(secondUser.getEmail());
            Design design = new Design();
            design.setDesignId(uuid);
            design.setUser(secondUser);
            design.setDesignType(DesignType.FAMILY_TREE);
            design.setDesignProperties("");

            Mockito.when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
            Mockito.when(authUserService.getCurrentlyAuthenticatedUser())
                .thenReturn(user);
            Mockito.when(designRepository.findByDesignId(design.getDesignId()))
                .thenReturn(Optional.of(design));

            mvc.perform(delete("/designs/" + uuid))
                .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("DELETE /designs/:designId endpoint returns 204: No Content")
        @WithMockUser(username = "user@hotdeals.dev", password = "testPassword")
        void deleteDesignReturnsNoContent() throws Exception
        {
            UUID uuid = new UUID(0, 0);
            User user = new User();
            user.setEmail("user@hotdeals.dev");
            user.setUsername(user.getEmail());
            Design design = new Design();
            design.setDesignId(uuid);
            design.setUser(user);
            design.setDesignType(DesignType.FAMILY_TREE);
            design.setDesignProperties("");

            Mockito.when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
            Mockito.when(authUserService.getCurrentlyAuthenticatedUser())
                .thenReturn(user);
            Mockito.when(designRepository.findByDesignId(design.getDesignId()))
                .thenReturn(Optional.of(design));
            Mockito.doNothing().when(designRepository).delete(design);

            mvc.perform(delete("/designs/" + uuid))
                .andExpect(status().isNoContent());
        }
    }
}
