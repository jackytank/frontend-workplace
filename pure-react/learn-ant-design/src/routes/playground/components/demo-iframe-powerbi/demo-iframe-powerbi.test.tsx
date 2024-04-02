import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import DemoIframePowerBI, { powerBISrc } from './demo-iframe-powerbi';

test('renders without crashing', () => {
  render(<DemoIframePowerBI />);
});

test('iframe is in the document', () => {
  const { getByTitle } = render(<DemoIframePowerBI />);
  const iframe = getByTitle(/tri_visual/i);
  expect(iframe).toBeInTheDocument();
});

test('iframe has the correct width', () => {
  const { getByTitle } = render(<DemoIframePowerBI />);
  const iframe = getByTitle(/tri_visual/i);
  expect(iframe).toHaveAttribute('width', '1500');
});

test('iframe has the correct height', () => {
  const { getByTitle } = render(<DemoIframePowerBI />);
  const iframe = getByTitle(/tri_visual/i);
  expect(iframe).toHaveAttribute('height', '300');
});

test('iframe has the correct src', () => {
  const { getByTitle } = render(<DemoIframePowerBI />);
  const iframe = getByTitle(/tri_visual/i);
  expect(iframe).toHaveAttribute('src', powerBISrc);
});