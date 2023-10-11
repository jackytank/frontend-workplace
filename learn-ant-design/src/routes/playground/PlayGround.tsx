import { Collapse, CollapseProps } from "antd";
import DemoSelectConfirm from "./components/demo-select-confirm";
import DemoIframePowerBI from "./components/demo-iframe-powerbi";

const items: CollapseProps['items'] = [
    {
        key: '1',
        label: 'Demo select confirm',
        children: <DemoSelectConfirm />,
    },
    {
        key: '2',
        label: 'Demo iframe PowerBI',
        children: <DemoIframePowerBI />,
    },
];

const PlayGround = () => {
    return (
        <>
            <Collapse items={items}/>;
        </>
    );

};

export default PlayGround;