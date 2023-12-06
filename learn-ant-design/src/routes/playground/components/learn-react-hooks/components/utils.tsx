import { MousePosition } from "antd/es/modal/interface";

export const PanelMouseLogger = ({
    mousePosition
}: {
    mousePosition: MousePosition;
}) => {
    return (
        <div>
            Mouse position: {JSON.stringify(mousePosition)}
        </div>
    );
};


export const PointMouseLogger = ({
    mousePosition
}: {
    mousePosition: MousePosition;
}) => {
    if (!mousePosition) {
        return null;
    }
    return (
        <p>
            ({mousePosition.x}, {mousePosition.y})
        </p>
    );
};
