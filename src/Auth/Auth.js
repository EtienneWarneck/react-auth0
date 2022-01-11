import auth0 from "auth0-js";

export default class Auth {
    constructor(history) {
        this.history = history;
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
        const expiresAt = JSON.stringify(authResult.expiresIn * 1000 + new Date().getTime()
        );
        localStorage.setItem("access_token", authResult.accessToken)
        localStorage.setItem("id_token", authResult.idToken)
        localStorage.setItem("expires at", expiresAt)
    }
}