function include(filename) {
  return HtmlService.createTemplateFromFile(filename).evaluate().getContent();
}

/**
 * used to expose memebers of a namespace
 * @param {string} namespace name
 * @param {method} method name
 */
function exposeRun(namespace, method, argArray) {
  Logger.log(argArray);
  var func = namespace ? this[namespace][method] : this[method];
  if (argArray && argArray.length) {
    return func.apply(this, argArray);
  } else {
    return func();
  }
}
/*
function auth() {
  var service = getOAuthService();
  Logger.log('Authorization URL: ' + service.getAuthorizationUrl());

  if (service.hasAccess()) {
    if (service.getAccessToken() == null) {
      Logger.log('Token expired');
      service.refresh();
    }
    var accessToken = service.getAccessToken();
    PropertiesService.getUserProperties().setProperty('token', accessToken)
    Logger.log('Access token: ' + accessToken);
  } else {
    var authorizationUrl = service.getAuthorizationUrl();
    Logger.log('Authorization required. Redirecting to authorization URL...' + authorizationUrl);
  }
  return service;
}

function getOAuthService() {
  var scriptProperties = PropertiesService.getScriptProperties();
  var clientId = scriptProperties.getProperty('OAUTH2_CLIENT_ID');
  var clientSecret = scriptProperties.getProperty('OAUTH2_CLIENT_SECRET');
  var service = OAuth2.createService('Qualifica Web App')
    .setAuthorizationBaseUrl('https://accounts.google.com/o/oauth2/auth')
    .setTokenUrl('https://accounts.google.com/o/oauth2/token')
    .setClientId(clientId)
    .setClientSecret(clientSecret)
    .setCallbackFunction('authCallback')
    .setPropertyStore(PropertiesService.getUserProperties())
    .setScope('https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive');
  return service;
}
function authCallback(request) {
  try {
    var service = getOAuthService();
    var authorized = service.handleCallback(request);
    if (authorized) {
      var accessToken = service.getAccessToken();
      PropertiesService.getUserProperties().setProperty('accessToken', accessToken);
      return HtmlService.createHtmlOutput('Authorization successful! ' + accessToken);
    } else {
      return HtmlService.createHtmlOutput('Authorization denied.');
    }
  } catch (ex) {
    Logger.log(ex)
  }
}*/
