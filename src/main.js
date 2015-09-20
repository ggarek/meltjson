import jsonPath from 'JSONPath';

export default function melt(source, shape) {
  const shapeKeys = Object.keys(shape);

  return shapeKeys.reduce((result, key) => {
    let mapping = null;

    // Get mapping
    if(isString(shape[key])) {
      mapping = {
        path: shape[key]
      };
    } else if(isObject(shape[key])) {
      mapping = shape[key];
    } else {
      throw new Error('mapping should be String|Object');
    }

    let evalPathResults = null;
    if(isArray(mapping.path)) {
      evalPathResults = mapping.path.map(path => jsonPath.eval(source, path)[0]);
    } else {
      evalPathResults = jsonPath.eval(source, mapping.path)[0];
    }

    if(mapping.transform instanceof Function) {
      if(isArray(mapping.path)) {
        result[key] = mapping.transform(...evalPathResults);
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

function isObject(val) { return type(val) === '[object Object]'; }
function isString(val) { return type(val) === '[object String]'; }
function isArray(val) { return type(val) === '[object Array]'; }
function type(val) { return Object.prototype.toString.call(val); }