import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Playground from './playground';

test('renders Playground component', () => {
  render(<Playground />);
});

test('"Demo select confirm" is in the document', () => {
  const { getByText } = render(<Playground />);
  const label = getByText(/Demo select confirm/i);
  expect(label).toBeInTheDocument();
});

test('"Demo iframe PowerBI" is in the document', () => {
  const { getByText } = render(<Playground />);
  const label = getByText(/Demo iframe PowerBI/i);
  expect(label).toBeInTheDocument();
});

test('"Demo search advanced 2 styles" is in the document', () => {
  const { getByText } = render(<Playground />);
  const label = getByText(/Demo search advanced 2 styles/i);
  expect(label).toBeInTheDocument();
});

test('"Learn Fetching REST" is in the document', () => {
  const { getByText } = render(<Playground />);
  const label = getByText(/Learn Fetching REST/i);
  expect(label).toBeInTheDocument();
});

test('"React hooks" is in the document', () => {
  const { getByText } = render(<Playground />);
  const label = getByText(/React hooks/i);
  expect(label).toBeInTheDocument();
});

test('"Styling" is in the document', () => {
  const { getByText } = render(<Playground />);
  const label = getByText(/Styling/i);
  expect(label).toBeInTheDocument();
});

test('"Other" is in the document', () => {
  const { getByText } = render(<Playground />);
  const label = getByText(/Other/i);
  expect(label).toBeInTheDocument();
});