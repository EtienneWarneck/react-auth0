import auth0 from "auth0-js";

const REDIRECT_ON_LOGIN = "redirect_on_login"

//Removing localStorage to save Auth0 values in memory to private tokens 
//eslint-disable-next-line
let _idToken = null;
let _accessToken = null;
let _scopes = null;
let _expiresAt = null;
export default class Auth {
    constructor(history) {
        this.history = history;
        this.userProfile = null;
        this.requestedScopes = "openid profile email read:courses" //scopes
        this.auth0 = new auth0.WebAuth({
            domain: process.env.REACT_APP_AUTH0_DOMAIN,
            clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
            redirectUri: process.env.REACT_APP_AUTH0_CALLBACK_URL,
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            responseType: "token id_token", //id_token : give us JWT token to authenticate the user //token : acces token so user can make API calls
            scope: this.requestedScopes
        })
    }
    login = () => {
        localStorage.setItem("redirect_on_login", JSON.stringify(this.history.location)) //
        this.auth0.authorize(); //redirects browser to Auth 0 login page
    };
    handleAuthentication = () => {
        //get and parse data from url into individual pieces and write them to the session.
        this.auth0.parseHash((err, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                debugger;
                this.setSession(authResult);
                const redirectLocation = localStorage.getItem(REDIRECT_ON_LOGIN) === "undefined" ? "/" : JSON.parse(localStorage.getItem(REDIRECT_ON_LOGIN))
                this.history.push(redirectLocation);
            } else if (err) {
                this.history.push("/");
                alert(`Error: $(err.error}. Check console for details.`);
                console.log("ERROR HERE !!", err);
            }
            localStorage.removeItem(REDIRECT_ON_LOGIN)
        })
    };
    setSession = authResult => {
        console.log("authResult", authResult);

        _accessToken = authResult.accessToken;
        _idToken = authResult.idToken;
        // const expiresAt = JSON.stringify(authResult.expiresIn * 1000 + new Date().getTime());
        _expiresAt = authResult.expiresIn * 1000 + new Date().getTime();

        //if there's a scope param in authResult use it, else  use scopes as
        // requested, If no scopes were requested, set it to nothing.
        // const scopes = authResult.scope || this.requestedScopes || '';
        _scopes = authResult.scope || this.requestedScopes || '';

        // localStorage.setItem("scopes", JSON.stringify(scopes))
        // localStorage.setItem("access_token", authResult.accessToken);
        // localStorage.setItem("id_token", authResult.idToken);
        // localStorage.setItem("expires_at", expiresAt)

        this.scheduleTokenRenewal();
    };

    isAuthenticated() {
        // const expiresAt = JSON.parse(localStorage.getItem("expires_at"));
        return new Date().getTime() < _expiresAt;

    }

    logout = () => {
        // localStorage.removeItem("access_token");
        // localStorage.removeItem("id_token");
        // localStorage.removeItem("expires_at")
        // localStorage.removeItem("scopes")
        //soft logout
        //this.history.push("/")
        this.auth0.logout({
            clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
            returnTo: "http://localhost:3000"
        })
    }
    getAccessToken = () => {
        // const accessToken = localStorage.getItem("access_token");
        if (!_accessToken) {
            throw new Error("No access token found.");
        }
        return _accessToken;
    }

    //this function will expect a callback
    getProfile = callback => {
        if (this.userProfile) return callback(this.userProfile);
        //if no userProfile call endpoint Auth0 and pass it the access token
        this.auth0.client.userInfo(this.getAccessToken(), (err, profile) => {
            if (profile) this.userProfile = profile;
            callback(profile, err)
        })
    }

    userHasScopes(x) {
        //every() returns true if all elements in an array pass a test.
        //includes() method returns true if an array contains a specified value.
        // const grantedScopes = (
        //     JSON.parse(localStorage.getItem("scopes")) || "").split(" ");
        // return x.every(x => grantedScopes.includes(x))
        const grantedScopes = (_scopes || "").split(" ");
        return x.every(x => grantedScopes.includes(x))
    }


    //we need to call this before the app is dislayed so we know if the user eis logged in:
    renewToken(cb) {
        this.auth0.checkSession({}, (err, result) => {
            if (err) {
                console.log(`Error: ${err.error} - ${err.error_description}.`);
            } else {
                this.setSession(result)
            }
            if (cb) cb(err, result)
        })
    }

    scheduleTokenRenewal() {
        const delay = _expiresAt - Date.now();
        if (delay > 0) setTimeout(() => this.renewToken(), delay)
    }
}