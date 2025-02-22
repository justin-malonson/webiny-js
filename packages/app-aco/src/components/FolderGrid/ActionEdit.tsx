import React from "react";

import { ReactComponent as Edit } from "@material-design-icons/svg/outlined/edit.svg";
import { i18n } from "@webiny/app/i18n";
import { Icon } from "@webiny/ui/Icon";
import { MenuItem } from "@webiny/ui/Menu";

import { ListItemGraphic } from "./styled";

const t = i18n.ns("app-aco/folder-grid/action-edit");

interface ActionEditProps {
    onClick: () => void;
}
export const ActionEdit: React.VFC<ActionEditProps> = ({ onClick }) => {
    return (
        <MenuItem onClick={onClick}>
            <ListItemGraphic>
                <Icon icon={<Edit />} />
            </ListItemGraphic>
            {t`Edit`}
        </MenuItem>
    );
};
