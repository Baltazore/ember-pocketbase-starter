import RequestManager from '@ember-data/request';
import Fetch from '@ember-data/request/fetch';
import { CacheHandler } from '@ember-data/store';
import config from 'ember-pocketbase-starter/config/environment';
import { setBuildURLConfig } from '@ember-data/request-utils';
import PocketBaseHandler from './pocketbase-handler';

setBuildURLConfig({
  host: config.api.host,
  namespace: config.api.namespace,
});

export default class extends RequestManager {
  constructor(args) {
    super(args);
    this.use([PocketBaseHandler, Fetch]);
    this.useCache(CacheHandler);
  }
}
