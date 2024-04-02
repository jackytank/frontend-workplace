import { Collapse, CollapseProps } from "antd";
import LearnSWR from "./components/learn-swr.component";

const items: CollapseProps['items'] = [
    {
        key: '1',
        label: 'SWR',
        children: <LearnSWR />,
    },
];

const LearnFetching = () => {
    return (
        <>
            <Collapse items={items} />
        </>
    );
};

export default LearnFetching;