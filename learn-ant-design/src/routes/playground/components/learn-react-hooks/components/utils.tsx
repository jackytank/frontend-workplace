import { InputNumber, Space } from "antd";
import { MousePosition } from "antd/es/modal/interface";
import { useEffect, useState } from "react";

export const MousePositionRenderProps = ({ render }) => {
    const [mousePosition, setMousePosition] = useState({
        x: 0,
        y: 0
    });
    const [rgbColor, setRgbColor] = useState({
        r: 0,
        g: 0,
        b: 0
    });
    useEffect(() => {
        const updateMousePosition = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
            setRgbColor({
                r: e.clientX > 255 ? 255 : e.clientX,
                g: e.clientY > 255 ? 255 : e.clientY,
                b: (e.clientX + e.clientY) / 2 > 255 ? 255 : (e.clientX + e.clientY) / 2
            });
        };
        document.addEventListener("mousemove", updateMousePosition);
        return () => document.removeEventListener("mousemove", updateMousePosition);
    });
    return render({ mousePosition, rgbColor });
};

export const PanelMouseLoggerUsingRenderProps = () => {
    return (
        <Space direction="vertical">
            <p>Mouse position: </p>
            <MousePositionRenderProps
                render={({ mousePosition, rgbColor }) => (
                    <p>
                        ({mousePosition.x}, {mousePosition.y})
                        <div style={{
                            backgroundColor: `rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`,
                            padding: '10px',
                        }}>
                            Color: {JSON.stringify(rgbColor)}
                        </div>
                    </p>
                )}
            />
        </Space>
    );
};

type TemperatureInputProps = {
    renderKelvin: (props: { value: number; }) => JSX.Element;
    renderFahrenheit: (props: { value: number; }) => JSX.Element;
};
export const TemperatureInput = (props: TemperatureInputProps) => {
    const [value, setValue] = useState<number>(0);

    return (
        <>
            <InputNumber
                defaultValue={0}
                value={value}
                onChange={e => setValue(e as number)}
            />
            {props.renderKelvin({ value: value + 273.15 })}
            {props.renderFahrenheit({ value: (value * 9) / 5 + 32 })}
        </>
    );
};

export const PanelMouseLoggerUsingHOC = ({
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


export const PointMouseLoggerUsingHOC = ({
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
