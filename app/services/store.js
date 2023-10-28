import BaseStore from '@ember-data/store';
import { service } from '@ember/service';
import JSONAPICache from '@ember-data/json-api';

import {
  buildSchema,
  instantiateRecord,
  modelFor,
  teardownRecord,
} from '@ember-data/model/hooks';

export default class StoreService extends BaseStore {
  @service requestManager;

  constructor(args) {
    super(args);

    this.registerSchema(buildSchema(this));
  }

  createCache(capabilities) {
    return new JSONAPICache(capabilities);
  }

  instantiateRecord(identifier, createRecordArgs) {
    return instantiateRecord.call(this, identifier, createRecordArgs);
  }

  teardownRecord(record) {
    teardownRecord.call(this, record);
  }

  modelFor(type) {
    return modelFor.call(this, type) || super.modelFor(type);
  }
}
