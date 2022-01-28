import React from 'react';
import { Route } from "react-router-dom";
import PropTypes from 'prop-types'


function PrivateRoute({ component: Component, auth, scopes, ...rest }) {
    return (
        <Route
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
    );
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