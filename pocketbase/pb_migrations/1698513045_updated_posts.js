/// <reference path="../pb_data/types.d.ts" />
migrate(
  (db) => {
    const dao = new Dao(db);
    const collection = dao.findCollectionByNameOrId('urw2kx0omtrhvao');

    collection.listRule = '';

    return dao.saveCollection(collection);
  },
  (db) => {
    const dao = new Dao(db);
    const collection = dao.findCollectionByNameOrId('urw2kx0omtrhvao');

    collection.listRule = null;

    return dao.saveCollection(collection);
  },
);
