/// <reference path="../pb_data/types.d.ts" />
migrate(
  (db) => {
    const dao = new Dao(db);
    const collection = dao.findCollectionByNameOrId('urw2kx0omtrhvao');

    collection.viewRule = '';

    return dao.saveCollection(collection);
  },
  (db) => {
    const dao = new Dao(db);
    const collection = dao.findCollectionByNameOrId('urw2kx0omtrhvao');

    collection.viewRule = null;

    return dao.saveCollection(collection);
  },
);
