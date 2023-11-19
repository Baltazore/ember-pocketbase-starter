// Derived from https://github.com/mainmatter/ember-simple-auth/blob/master/packages/ember-simple-auth/addon/authenticators/devise.js
import Base from 'ember-simple-auth/authenticators/base';

import { run } from '@ember/runloop';
import { isEmpty } from '@ember/utils';
import fetch from 'fetch';
import { Promise } from 'rsvp';
import config from 'ember-pocketbase-starter/config/environment';

const JSON_CONTENT_TYPE = 'application/json';

/**
  Authenticator that works with the Ruby gem
  [devise](https://github.com/plataformatec/devise).
  __As token authentication is not actually part of devise anymore, the server
  needs to implement some customizations__ to work with this authenticator -
  see [this gist](https://gist.github.com/josevalim/fb706b1e933ef01e4fb6).
  @class DeviseAuthenticator
  @module ember-simple-auth/authenticators/devise
  @extends BaseAuthenticator
  @public
*/
export default class PocketbaseAuthenticator extends Base {
  /**
    The endpoint on the server that the authentication request is sent to.

    @property serverTokenEndpoint
    @type String
    @default '/api/collections/users/auth-with-password'
    @public
  */
  serverTokenEndpoint = `/api/collections/users/auth-with-password`;

  /**
    The token attribute name. __This will be expected in the server's response.__

    @property tokenAttributeName
    @type String
    @default 'token'
    @public
  */
  tokenAttributeName = 'token';

  /**
    The identification attribute name. __This will be used in the request.__

    @property identificationAttributeName
    @type String
    @default 'identity'
    @public
  */
  identificationAttributeName = 'identity';

  /**
  The password attribute name. __This will be used in the request.__

  @property passwordAttributeName
  @type String
  @default 'password'
  @public
*/
  passwordAttributeName = 'password';

  /**
    Restores the session from a session data object; __returns a resolving
    promise when there are non-empty
    {{#crossLink "DeviseAuthenticator/tokenAttributeName:property"}}token{{/crossLink}}
    and
    {{#crossLink "DeviseAuthenticator/identificationAttributeName:property"}}identification{{/crossLink}}
    values in `data`__ and a rejecting promise otherwise.
    @method restore
    @param {Object} data The data to restore the session from
    @return {Ember.RSVP.Promise} A promise that when it resolves results in the session becoming or remaining authenticated
    @public
  */
  restore(data) {
    // eslint-disable-next-line prefer-promise-reject-errors
    return this._validate(data) ? Promise.resolve(data) : Promise.reject();
  }

  /**
    Authenticates the session with the specified `email`
    the credentials are `POST`ed to the server.
    @method authenticate
    @param {String} identity The user's identification
    @param {String} password The user's password
    @return {Ember.RSVP.Promise} A promise that when it resolves results in the session becoming authenticated. If authentication fails, the promise will reject with the server response; however, the authenticator reads that response already so if you need to read it again you need to clone the response object first
    @public
  */
  authenticate(identity, password) {
    return new Promise((resolve, reject) => {
      const data = {};
      data[this.identificationAttributeName] = identity;
      data[this.passwordAttributeName] = password;

      this.makeRequest(data)
        .then((response) => {
          if (response.ok) {
            response.json().then((json) => {
              if (this._validate(json)) {
                run(null, resolve, json);
              } else {
                run(
                  null,
                  reject,
                  `Check that server response includes ${this.tokenAttributeName}.`,
                );
              }
            });
          } else {
            run(null, reject, response);
          }
        })
        .catch((error) => run(null, reject, error));
    });
  }

  /**
    Does nothing
    @method invalidate
    @return {Ember.RSVP.Promise} A resolving promise
    @public
  */
  invalidate() {
    return Promise.resolve();
  }

  /**
    Makes a request to the server using [ember-fetch](https://github.com/stefanpenner/ember-fetch).
    @method makeRequest
    @param {Object} data The request data
    @param {Object} options request options that are passed to `fetch`
    @return {Promise} The promise returned by `fetch`
    @protected
  */
  makeRequest(data, options = {}) {
    let url = options.url || this.serverTokenEndpoint;
    let requestOptions = {};
    let body = JSON.stringify(data);
    Object.assign(requestOptions, {
      body,
      method: 'POST',
      headers: {
        accept: JSON_CONTENT_TYPE,
        'content-type': JSON_CONTENT_TYPE,
      },
    });
    Object.assign(requestOptions, options || {});

    return fetch(`${config.api.host}${url}`, requestOptions);
  }

  _validate(data) {
    return !isEmpty(data[this.tokenAttributeName]);
  }
}
