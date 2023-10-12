import { Collapse, CollapseProps } from "antd";
import DemoSelectConfirm from "./components/demo-select-confirm";
import DemoIframePowerBI from "./components/demo-iframe-powerbi";
import LearnFetching from "./components/learn-fetching/learn-fetching";

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
    {
        key: '3',
        label: 'Learn Fetching REST',
        children: <LearnFetching />,
    },
];

const PlayGround = () => {
    return (
        <>
            <Collapse items={items} />
        </>
    );
};

export default PlayGround;