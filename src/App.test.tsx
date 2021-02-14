import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe("When the user isn't authenticated", () => {
  it('"get calls" button should be rendered on page load', () => {
    render(<App />);
    const button = screen.queryByText('Get List of Calls');
    expect(button).toBeInTheDocument();
  });

  it("pagination buttons should NOT be rendered", () => {
    render(<App />);
    const prevButton = screen.queryByText('PREV');
    const nextButton = screen.queryByText('NEXT');
    expect(prevButton).not.toBeInTheDocument();
    expect(nextButton).not.toBeInTheDocument();
  });
});
