import { CollapseProps, Collapse } from "antd";
import LearnSASS from "./components/learn-sass/learn-sass.component";
import LearnStyleComponents from "./components/style-components/style-components";

const items: CollapseProps['items'] = [
    {
        key: '1',
        label: 'SCSS',
        children: <LearnSASS />,
    },
    {
        key: '2',
        label: 'Styled Components',
        children: <LearnStyleComponents />,
    },
];

const LearnStyling = () => {
    return (
        <>
            <Collapse items={items} />
        </>
    );
};

export default LearnStyling;