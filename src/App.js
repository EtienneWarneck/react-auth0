import React, { Component } from 'react';
import { Link, Route } from "react-router-dom"
import Home from "./Home"
import Profile from "./Profile";
import Nav from './Nav'
import './index.css'
import Auth from './Auth/Auth';
import Callback from './Callback';
import Public from './Public';

class App extends Component {
  constructor(props) {
    super(props);
    // passing history object from react-router
    this.auth = new Auth(this.props.history)
  }
  render() {
    return (
      <>
        <Nav authLogin={this.auth} />
        <div className='body'>

          <Route
            path="/"
            exact
            render={props => <Home authLogin={this.auth} {...props} />} />
          <Route
            path="/callback"
            render={props => <Callback authCall={this.auth} {...props} />} />
          <Route path="/profile" render={props =>
            this.auth.isAuthenticated ? <Profile authProfile={this.auth} {...props} /> :
              <Link to="/" />} />
          <Route
            path="/public"
            component={Public} />

        </div>
      </>
    )
  }
}

export default App;
