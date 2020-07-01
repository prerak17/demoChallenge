/* eslint-disable no-underscore-dangle */
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from './redux';
import AppRoutes from './routes';

const store = configureStore();

function App() {
  return (
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  );
}

export default App;