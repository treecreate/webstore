package dk.treecreate.api.designs.dto;

import dk.treecreate.api.designs.DesignType;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotNull;

public class CreateDesignRequest
{
    @NotNull
    @ApiModelProperty(example = "{ title: 'Example design'," +
        "  font: 'Roboto'," +
        "  design: 'first'," +
        "  boxSize: 10," +
        "  banner: false," +
        "  largeFont: true," +
        "  boxes: []}", required = true)
    private String designProperties;

    @NotNull
    @ApiModelProperty(example = "FAMILY_TREE", required = true)
    private DesignType designType;

    public String getDesignProperties()
    {
        return designProperties;
    }

    public void setDesignProperties(String designProperties)
    {
        this.designProperties = designProperties;
    }

    public DesignType getDesignType()
    {
        return designType;
    }

    public void setDesignType(DesignType designType)
    {
        this.designType = designType;
    }
}
