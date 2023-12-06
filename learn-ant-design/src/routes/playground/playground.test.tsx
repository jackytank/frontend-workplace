import { render } from '@testing-library/react';
import Playground from './playground';

// start testing playground.tsx
describe('Playground', () => {
  test('renders Playground component', () => {
    render(<Playground />);
    // assert something to make sure jest is working
    expect(true).toBeTruthy();
  });
});
