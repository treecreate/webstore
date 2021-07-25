package dk.treecreate.api.user.dto;

import dk.treecreate.api.user.User;
import io.swagger.annotations.ApiModelProperty;

import java.util.List;

public class GetUsersResponse
{
    @ApiModelProperty( notes = "A list of users")
    List<User> users;
}
