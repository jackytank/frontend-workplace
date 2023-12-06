import { Collapse, CollapseProps } from 'antd';
import UseRef from './components/use-ref.component';
import HigherOrderComponent from './components/hoc.component';

const items: CollapseProps['items'] = [
    {
        key: '1',
        label: 'useRef',
        children: <UseRef />
    },
    {
        key: '2',
        label: 'HigherOrderComponent',
        children: <HigherOrderComponent />
    },
];

const LearnReactHooks = () => {
    return (
        <Collapse items={items} />
    );
};

export default LearnReactHooks;