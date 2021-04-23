// This file is used by the dockerfile and replaces the normal env.js with values obtained from the environment
(function (window) {
  window['env'] = window['env'] || {};

  // Environment variables
  window['env']['apiUrl'] = 'http://localhost:5000';
  window['env']['gtag'] = 'G-4VY53TX2KS';

  window['env']['oktaDomain'] = '${OKTA_DOMAIN}';
  window['env']['oktaClientId'] = '${OKTA_CLIENT_ID}';
  window['env']['idpGoogle'] = '${IDP_GOOGLE}';
  window['env']['idpFacebook'] = '${IDP_FACEBOOK}';
  window['env']['idpLinkedIn'] = '${IDP_LINKEDIN}';
  window['env']['idpApple'] = '${IDP_APPLE}';
})(this);
