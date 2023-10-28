import { singularize } from 'ember-inflector';
import { dasherize } from '@ember/string';

const MUTATION_OPS = new Set(['createRecord', 'updateRecord']);

const convertToPocketBase = (identifier, cache) => {
  const body = {};

  if (cache.hasChangedAttrs(identifier)) {
    const attrsChanges = cache.changedAttrs(identifier);

    Object.keys(attrsChanges).forEach((key) => {
      const newVal = attrsChanges[key][1];
      body[key] = newVal === undefined ? null : newVal;
    });
  }

  if (cache.hasChangedRelationships(identifier)) {
    const relsChanges = cache.changedRelationships(identifier);
    if (relsChanges.size) {
      relsChanges.forEach((diff, key) => {
        body[key] = diff.localState.id;
      });
    }
  }

  return body;
};

const convertToJSONAPI = (content, schema) => {
  if (content.items) {
    const data = content.items.map((item) => {
      return normalizeResource(item, schema);
    });

    return {
      data,
      meta: extractMetaData(content),
    };
  } else {
    const data = normalizeResource(content, schema);
    return {
      data,
    };
  }
};

const extractMetaData = (content) => {
  const { page, perPage, totalItems, totalPages } = content;
  return {
    page,
    perPage,
    totalItems,
    totalPages,
  };
};

const convertTypeToJSONAPI = (collectionName) => {
  return dasherize(singularize(collectionName));
};

const normalizeResource = (item, schema) => {
  const { id, collectionName } = item;
  const type = convertTypeToJSONAPI(collectionName);
  const attributesDefined = schema.attributesDefinitionFor({ type });
  const relationshipsDefined = schema.relationshipsDefinitionFor({ type });

  const data = { id, type, attributes: {} };

  for (const attr of Object.values(attributesDefined)) {
    data.attributes[attr.name] = item[attr.name];
  }

  for (const rel of Object.values(relationshipsDefined)) {
    if (Object.hasOwnProperty.call(item, rel.name)) {
      data.relationships ??= {};
      data.relationships[rel.name] = {
        data: {
          id: item[rel.name],
          type: convertTypeToJSONAPI(rel.type),
        },
      };
    }
  }

  return data;
};

// Main idea of this handler - serialize record from response to JSONAPI format for Store(Cache)
const PocketBaseHandler = {
  async request(context, next) {
    let formattedRequest = context.request;
    if (MUTATION_OPS.has(context.request.op)) {
      const {
        store: { cache },
        data: { record },
      } = context.request;

      const pocketBasePOJO = convertToPocketBase(record, cache);

      formattedRequest = Object.assign({}, context.request, {
        body: JSON.stringify(pocketBasePOJO),
      });
    }

    const { content, request } = await next(formattedRequest);
    // we covert to JSON:API because we are using the JSON:API Cache
    return convertToJSONAPI(content, request.store.schema);
  },
};

export default PocketBaseHandler;
