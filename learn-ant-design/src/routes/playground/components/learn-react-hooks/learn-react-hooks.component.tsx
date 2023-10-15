import { Collapse, CollapseProps } from 'antd';
import UseRef from './components/use-ref.component';

const items: CollapseProps['items'] = [
    {
        key: '1',
        label: 'useRef',
        children: <UseRef />
    }
];

const LearnReactHooks = () => {
    return (
        <>
            <Collapse items={items} />
        </>
    );
};

export default LearnReactHooks;