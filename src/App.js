import React, { Component } from 'react';
import { Route } from "react-router-dom"
import Home from "./Home"
import Profile from "./Profile";
import Nav from './Nav'
import './index.css'
import Auth from './Auth/Auth';

class App extends Component {
  constructor(props) {
    super(props);
    this.auth = new Auth(this.props.history)
    // passing history object from react-router
  }
  render() {
    return (
      <>
        <Nav />
        <div className='body'>
          <Route
            path="/"
            exact
            render={props => <Home auth={this.auth} {...props} />} />
          <Route path="/" component={Profile} />
        </div>
      </>
    )
  }
}

export default App;
