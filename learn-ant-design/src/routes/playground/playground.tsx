import { Collapse, CollapseProps } from "antd";
import DemoSelectConfirm from "./components/demo-select-confirm.component";
import DemoIframePowerBI from "./components/demo-iframe-powerbi.component";
import LearnFetching from "./components/learn-fetching/learn-fetching.component";
import EmployeeList from "../employee/employee-list/employee-list.component";
import LearnReactHooks from "./components/learn-react-hooks/learn-react-hooks.component";
import LearnStyling from "./components/learn-styling/learn-styling";
import Other from "./components/other/other.component";

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
        label: 'Demo search advanced 2 styles',
        children: <EmployeeList />,
    },
    {
        key: '4',
        label: 'Learn Fetching REST',
        children: <LearnFetching />,
    },
    {
        key: '5',
        label: 'React hooks',
        children: <LearnReactHooks />,
    },
    {
        key: '6',
        label: 'Styling',
        children: <LearnStyling />,
    },
    {
        key: '7',
        label: 'Other...',
        children: <Other />,
    },
];

const PlayGround = () => {
    return (
        <Collapse items={items} />
    );
};

export default PlayGround;