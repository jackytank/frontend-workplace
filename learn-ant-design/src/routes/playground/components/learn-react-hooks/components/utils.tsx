import { InputNumber } from "antd";
import { MousePosition } from "antd/es/modal/interface";
import { useState } from "react";

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
