import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import MainPage from './PublicRoutes/MainPage';

//Main Routing File
const index = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={MainPage} />
    </Switch>
  </Router>
);


export default (index);
