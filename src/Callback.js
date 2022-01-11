import React, { Component } from 'react';

class Callback extends Component {
    //read URL
    componentDidMount() {
        //Handle authetication if expected values are in URL.
        if (/acces_token|id_token|error/.test(this.props.location.hash)) {
            this.props.authCall.handleAuthentication();
        } else {
            throw new Error("invalid callback URL")
        }
    };
    render() {
         return <h1>Loading...</h1>
    }
}

export default Callback;