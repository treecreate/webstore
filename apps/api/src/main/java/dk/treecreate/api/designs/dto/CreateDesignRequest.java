package dk.treecreate.api.designs.dto;

import dk.treecreate.api.designs.DesignType;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotNull;
import java.util.Map;

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
    private Map<String, Object> designProperties;

    @NotNull
    @ApiModelProperty(example = "FAMILY_TREE", required = true)
    private DesignType designType;

    @ApiModelProperty(notes = "Can the design be changed", example = "true", required = true)
    private boolean mutable = true;

    public Map<String, Object> getDesignProperties()
    {
        return designProperties;
    }

    public void setDesignProperties(Map<String, Object> designProperties)
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

    public boolean isMutable()
    {
        return mutable;
    }

    public void setMutable(boolean mutable)
    {
        this.mutable = mutable;
    }
}
