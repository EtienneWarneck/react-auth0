import React from 'react';
import { Route } from "react-router-dom";
import PropTypes from 'prop-types'
import AuthContext from './AuthContext';

function PrivateRoute({ component: Component, scopes, ...rest }) {
    return (
        <AuthContext.Consumer>
            {auth => (
                < Route
                    {...rest}
                    render={props => {
                        if (!auth.isAuthenticated()) return auth.login();
                        if (scopes.length > 0 && !auth.userHasScopes(scopes)) {
                            return (
                                <h1>
                                    Unhautorized You need scopes:
                                    {" "}
                                    {scopes.join(", ")}.
                                </h1>
                            );
                        }
                        return <Component auth={auth} {...props} />;
                    }}
                />
            )
            }
        </AuthContext.Consumer>
    )
}

PrivateRoute.propTypes = {
    scopes: PropTypes.array,
    auth: PropTypes.object.isRequired,
    component: PropTypes.func.isRequired
};

PrivateRoute.defaultProps = {
    scopes: []
};

export default PrivateRoute;