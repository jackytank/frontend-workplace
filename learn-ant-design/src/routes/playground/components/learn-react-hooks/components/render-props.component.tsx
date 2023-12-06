import { Divider } from "antd";
import { PanelMouseLoggerUsingRenderProps, TemperatureInput } from "./utils";


const RenderProps = () => {
  return (
    <div >
      <TemperatureInput
        renderKelvin={({ value }) => <p>kelvin: {value}</p>}
        renderFahrenheit={({ value }) => <p>fahrenheit: {value}</p>}
      />
      <Divider />
      <PanelMouseLoggerUsingRenderProps />
    </div>
  );
};

export default RenderProps;