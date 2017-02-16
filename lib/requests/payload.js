'use strict';

module.exports = function (req, next) {
  var JSONAPIDeserializer = require('jsonapi-serializer').Deserializer;
  var modelUtils = require('../utils/model-utils');
  var pluralize = require('pluralize');

  var JSONAPIDocument = req.body;
  var options = {
    keyForAttribute: 'camelCase'
  };

  // returns ID from a resource identifier object
  var getIdFromResourceIdentifierObject = function (resourceIdentifierObject) {
    return resourceIdentifierObject.id;
  };

  // need to setup `valueForRelationship` for every relationship
  modelUtils.getRelationships(req).forEach(function (relationship) {
    var pluralModelName = pluralize(relationship.collection || relationship.model);
    options[pluralModelName] = {
      valueForRelationship: getIdFromResourceIdentifierObject
    };
  });
  console.lof('options');
  console.log(options);
  console.lof('JSONAPIDocument');
  console.log(JSONAPIDocument);
  new JSONAPIDeserializer(options).deserialize(JSONAPIDocument, function (err, normalizedObject) {
    if (err) {
      throw err;
    }

    req.body = normalizedObject;
    next();
  });
};
