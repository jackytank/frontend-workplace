import { CollapseProps, Collapse } from "antd";
import LearnSASS from "./components/learn-sass/learn-sass.component";
import LearnStyleComponents from "./components/style-components/style-components";
import LearnCSS from "./components/learn-css/learn-css";

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
    {
        key: '3',
        label: 'Advanced CSS (and SCSS)',
        children: <LearnCSS />,
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