import { camelize } from '@ember/string';
import { pluralize } from 'ember-inflector';
import { recordIdentifierFor } from '@ember-data/store';

import {
  findRecord as restFindRecord,
  query as restQuery,
  createRecord as restCreateRecord,
  updateRecord as restUpdateRecord,
  deleteRecord as restDeleteRecord,
} from '@ember-data/rest/request';

const _pocketBaseResourcePathFor = (identifierType) => {
  return `collections/${camelize(pluralize(identifierType))}/records`;
};

const findRecord = (identifier, id, options) => {
  options = {
    ...options,
    resourcePath: _pocketBaseResourcePathFor(identifier),
  };
  return restFindRecord(identifier, id, options);
};

const query = (identifier, query, options) => {
  options = {
    ...options,
    resourcePath: _pocketBaseResourcePathFor(identifier),
  };
  return restQuery(identifier, query, options);
};

const createRecord = (record, options) => {
  const identifier = recordIdentifierFor(record);
  options = {
    ...options,
    resourcePath: _pocketBaseResourcePathFor(identifier.type),
  };
  return restCreateRecord(record, options);
};

const updateRecord = (record, options) => {
  const identifier = recordIdentifierFor(record);
  options = {
    ...options,
    resourcePath: _pocketBaseResourcePathFor(identifier.type),
  };
  return restUpdateRecord(record, options);
};

const deleteRecord = (record, options) => {
  const identifier = recordIdentifierFor(record);
  options = {
    ...options,
    resourcePath: _pocketBaseResourcePathFor(identifier.type),
  };
  return restDeleteRecord(record, options);
};

export { findRecord, query, createRecord, updateRecord, deleteRecord };
