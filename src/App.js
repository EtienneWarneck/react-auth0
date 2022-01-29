import React, { Component } from 'react';
import { Route } from "react-router-dom"
import Home from "./Home"
import Profile from "./Profile";
import Nav from './Nav'
import './index.css'
import Auth from './Auth/Auth';
import Callback from './Callback';
import Public from './Public';
import Private from './Private';
import Courses from './Courses';
import PrivateRoute from './PrivateRoute';
import AuthContext from './AuthContext';

class App extends Component {
  constructor(props) {
    super(props);
    // passing history object from react-router
    this.state = {
      auth: new Auth(this.props.history)
    };
  }
  render() {
    const { auth } = this.state;
    return (
      <AuthContext.Provider value={auth}>
        <Nav auth={auth} />
        <div className='body'>

          <Route
            path="/"
            exact
            render={props => <Home auth={auth} {...props} />} />
          <Route
            path="/callback"
            render={props => <Callback auth={auth} {...props} />} />
          {/* <Route path="/profile" render={props =>
            this.auth.isAuthenticated ? <Profile auth={this.auth} {...props} /> :
              <Link to="/" />} />
          <Route
            path="/public"
            component={Public} />
          <Route
            path="/private"
            render={props => this.auth.isAuthenticated ? <Private auth={this.auth} {...props} /> :
              this.auth} />
          <Route
            path="/course"
            render={props => this.auth.isAuthenticated && this.auth.userHasScopes(["read:courses"]) ? (<Courses auth={this.auth} {...props} />) : (
              this.auth.login()
            )} /> */}
          <PrivateRoute
            path="/profile"
            component={Profile} />
          <PrivateRoute
            path="/public"
            component={Public} />
          <PrivateRoute
            path="/private"
            component={Private} />
          <PrivateRoute
            path="/course"
            component={Courses}
            scopes={["read:courses"]} />
        </div>
      </AuthContext.Provider>
    )
  }
}

export default App;
