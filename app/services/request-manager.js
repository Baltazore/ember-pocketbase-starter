import RequestManager from '@ember-data/request';
import { setBuildURLConfig } from '@ember-data/request-utils';
import Fetch from '@ember-data/request/fetch';
import { CacheHandler } from '@ember-data/store';
import { getOwner, setOwner } from '@ember/application';
import config from 'ember-pocketbase-starter/config/environment';
import AuthHandler from './auth-handler';
import PocketBaseHandler from './pocketbase-handler';

setBuildURLConfig({
  host: config.api.host,
  namespace: config.api.namespace,
});

export default class extends RequestManager {
  constructor(args) {
    super(args);

    const authHandler = new AuthHandler();
    setOwner(authHandler, getOwner(this));

    this.use([authHandler, PocketBaseHandler, Fetch]);
    this.useCache(CacheHandler);
  }
}
