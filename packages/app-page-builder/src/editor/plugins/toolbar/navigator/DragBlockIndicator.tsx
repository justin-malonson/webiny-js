import React from "react";
import { useDrag } from "react-dnd";
import { DraggableItem } from "~/editor/components/Draggable";
import { ReactComponent as DragIndicatorIcon } from "./assets/drag_indicator_24px.svg";

const BLOCK = "block";

type MoverProps = {
    type: string;
};
const DragBlockIndicator: React.FC<MoverProps> = ({ type }) => {
    const [, drag] = useDrag({
        item: { type } as DraggableItem,
        collect: monitor => ({
            isDragging: monitor.isDragging()
        }),
        canDrag: false
    });

    if (type !== BLOCK) {
        return null;
    }

    return (
        <div ref={drag}>
            <DragIndicatorIcon className={"drag-indicator"} />
        </div>
    );
};

export default DragBlockIndicator;
