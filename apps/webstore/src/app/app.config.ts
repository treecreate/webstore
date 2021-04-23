//const { CLIENT_ID, ISSUER, OKTA_TESTING_DISABLEHTTPSCHECK } = process.env;

export default {
  oidc: {
    clientId: `0oamnkb1cuWpU2TTh5d6`,
    issuer: `https://dev-81944821.okta.com/oauth2/default`,
    redirectUri: 'http://localhost:4200/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    testing: {
      disableHttpsCheck: `true`
    }
  },
  resourceServer: {
    messagesUrl: 'http://localhost:8000/api/messages',
  },
};
