/* eslint-disable no-param-reassign */
import {
  combineReducers, createStore, applyMiddleware, compose,
} from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import accountReducer from './account/reducer';

/**
 * Root Reducer
 * where you combine all reducer as single object called redux state
 */
const appReducer = combineReducers({
  account: accountReducer,
});

/**
 * composeEnhancers
 * enhancer for redux dev tools (only in development mode)
 */

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = (state, action) => {
  return appReducer(state, action);
};

export default () => {
  const middleware = [thunk];
  if (process.env.REACT_APP_ENVIRONMENT === 'development' || process.env.REACT_APP_ENVIRONMENT === 'testing') {
    middleware.push(createLogger({ collapsed: true }));
  }
  return createStore(rootReducer, composeEnhancers(applyMiddleware(...middleware)));
};
