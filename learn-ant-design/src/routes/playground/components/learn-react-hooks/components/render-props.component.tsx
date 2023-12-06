import { Space } from "antd";
import { TemperatureInput } from "./utils";


const RenderProps = () => {
  return (
    <Space>
      <TemperatureInput
        renderKelvin={({ value }) => <p>kelvin: {value}</p>}
        renderFahrenheit={({ value }) => <p>fahrenheit: {value}</p>}
      />
    </Space>
  );
};

export default RenderProps;