'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = melt;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _JSONPath = require('JSONPath');

var _JSONPath2 = _interopRequireDefault(_JSONPath);

function melt(source, shape) {
  var shapeKeys = Object.keys(shape);

  return shapeKeys.reduce(function (result, key) {
    var mapping = null;

    // Get mapping
    if (isString(shape[key])) {
      mapping = {
        path: shape[key]
      };
    } else if (isObject(shape[key])) {
      mapping = shape[key];
    } else {
      throw new Error('mapping should be String|Object');
    }

    var evalPathResults = null;
    if (isArray(mapping.path)) {
      evalPathResults = mapping.path.map(function (path) {
        return _JSONPath2['default'].eval(source, path)[0];
      });
    } else {
      evalPathResults = _JSONPath2['default'].eval(source, mapping.path)[0];
    }

    if (mapping.transform instanceof Function) {
      if (isArray(mapping.path)) {
        var _mapping;

        result[key] = (_mapping = mapping).transform.apply(_mapping, _toConsumableArray(evalPathResults));
      } else {
        result[key] = mapping.transform(evalPathResults);
      }
    } else {
      result[key] = evalPathResults;
    }

    return result;
  }, {});
}

/**
 * HELPERS
 */

function isObject(val) {
  return type(val) === '[object Object]';
}
function isString(val) {
  return type(val) === '[object String]';
}
function isArray(val) {
  return type(val) === '[object Array]';
}
function type(val) {
  return Object.prototype.toString.call(val);
}
module.exports = exports['default'];
