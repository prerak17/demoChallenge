import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LandingPage from './PublicRoutes/LandingPage';

const index = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={LandingPage} />
    </Switch>
  </Router>
);


export default (index);
