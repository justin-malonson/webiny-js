import * as React from "react";
import styled from "@emotion/styled";
import { css } from "emotion";
import { Typography } from "@webiny/ui/Typography";
import { Elevation } from "@webiny/ui/Elevation";

const BlockWrapper = styled("div")({
    padding: "0 0 25px 0"
});

const titleStyle = css({
    display: "flex",
    alignItems: "center",
    color: "var(--mdc-theme-on-surface)",
    ".tooltip-content-wrapper": {
        lineHeight: "100%",
        svg: {
            height: 13,
            color: "var(--mdc-theme-on-surface)"
        }
    }
});

const ElevationContent = styled("div")({
    padding: 20
});

interface BlockProps {
    title: string;
    className?: string;
}
const Block: React.FC<BlockProps> = ({ children, title, ...props }) => {
    return (
        <BlockWrapper {...props}>
            <h4>
                <Typography className={titleStyle} use={"overline"}>
                    {title}
                </Typography>
            </h4>

            <Elevation z={2}>
                <ElevationContent>{children}</ElevationContent>
            </Elevation>
        </BlockWrapper>
    );
};

export default Block;
