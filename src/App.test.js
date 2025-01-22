import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';

test('renders App component without crashing', () => {
  render(
      <Router>
        <App />
      </Router>
  );

});
