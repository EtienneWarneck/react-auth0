import auth0 from "auth0-js";

export default class Auth {
    constructor(history) {
        this.history = history;
        this.userProfile = null;
        this.auth0 = new auth0.WebAuth({
            domain: process.env.REACT_APP_AUTH0_DOMAIN,
            clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
            redirectUri: process.env.REACT_APP_AUTH0_CALLBACK_URL,
            responseType: "token id_token",
            scope: "openid profile email"
        })
    }
    login = () => {
        this.auth0.authorize(); //redirects browser to Auth 0 login page
};
    handleAuthentication = () => {
        //get and parse data from url into indivudual pieces and write them to the session.
        this.auth0.parseHash((err, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                this.setSession(authResult);
                this.history.push("/"); //redirect to homepage
            } else if (err) {
                this.history.push("/");
                alert(`Error: $(err.error}. Check console for details.`);
                console.log("ERROR HERE", err);
            }
        })
    };
    setSession = authResult => {
        // set expiration of token
        console.log(authResult);
        const expiresAt = JSON.stringify(authResult.expiresIn * 1000 + new Date().getTime());
        localStorage.setItem("access_token", authResult.accessToken);
        localStorage.setItem("id_token", authResult.idToken);
        localStorage.setItem("expires_at", expiresAt)
    };

    isAuthenticated() {
        const expiresAt = JSON.parse(localStorage.getItem("expires_at"));
        return new Date().getTime() < expiresAt;
    }

    logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("id_token");
        localStorage.removeItem("expires_at")
        //soft logout
        //this.history.push("/")
        this.userProfile = null;
        this.auth0.logout({
            clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
            returnTo:"http://localhost:3000"
        })
    }
    getAccessToken = () => {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
            throw new Error("No access token found.");
        }
        return accessToken;
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

}