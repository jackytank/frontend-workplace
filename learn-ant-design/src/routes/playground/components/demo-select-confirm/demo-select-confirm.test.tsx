import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Select } from 'antd';
import DemoSelectConfirm from './demo-select-confirm';

describe('Select', () => {
    const onChange = jest.fn();
    const handleDeselect = jest.fn();

    test('renders without crashing', () => {
        render(<Select onChange={onChange} onDeselect={handleDeselect} />);
    });

    test('DemoSelectConfirm have correct placeholder', async () => {
        const { findByText } = render(<Select onChange={onChange} onDeselect={handleDeselect} placeholder="Please select" />);
        const placeholder = await findByText(/Please select/i);
        expect(placeholder).toBeInTheDocument();
    });

    test('should add selected Employee to the list when confirmed', async () => {
        const { findByText } = render(<DemoSelectConfirm />);
        const selectInput = await findByText(/Please select/i);

        fireEvent.mouseDown(selectInput);
        fireEvent.click(screen.getByText('Employee 1'));
        fireEvent.click(screen.getByText('Employee 2'));
        fireEvent.click(screen.getByText('Employee 3'));

        expect(screen.getByText('Employee 1')).toBeInTheDocument();
        expect(screen.getByText('Employee 2')).toBeInTheDocument();
        expect(screen.getByText('Employee 3')).toBeInTheDocument();
    });

});