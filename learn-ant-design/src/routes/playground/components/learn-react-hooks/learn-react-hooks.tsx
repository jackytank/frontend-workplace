import { Collapse, CollapseProps } from 'antd';
import UseRef from './components/use-ref.component';
import HigherOrderComponent from './components/hoc.component';
import UserReducer from './components/use-reducer.component';
import RenderProps from './components/render-props.component';

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
    {
        key: '3',
        label: 'useReducer',
        children: <UserReducer />
    },
    {
        key: '4',
        label: 'RenderProps',
        children: <RenderProps />
    },
];

const LearnReactHooks = () => {
    return (
        <Collapse items={items} />
    );
};

export default LearnReactHooks;