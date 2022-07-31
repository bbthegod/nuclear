const toString = Object.prototype.toString;

const kindOf = (cache => {
  return (thing: any) => {
    const str = toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
  };
})(Object.create(null));

function isArray(val: any) {
  return Array.isArray(val);
}
const isUndefined = (thing: any) => typeof thing === 'undefined';

const isFunction = (thing: any) => typeof thing === 'function';

function isFormData(thing: any) {
  const pattern = '[object FormData]';
  return (
    thing &&
    ((typeof FormData === 'function' && thing instanceof FormData) ||
      toString.call(thing) === pattern ||
      (isFunction(thing.toString) && thing.toString() === pattern))
  );
}

const isBoolean = (thing: any) => {
  return thing === true || thing === false;
};

function isPlainObject(val: any) {
  if (kindOf(val) !== 'object') {
    return false;
  }
  const prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

function trim(str: any) {
  return str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
}

function forEach(obj: any, fn: any, { allOwnKeys = false } = {}) {
  if (obj === null || typeof obj === 'undefined') {
    return;
  }
  let i;
  let l;
  if (typeof obj !== 'object') {
    obj = [obj];
  }
  if (isArray(obj)) {
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
    const len = keys.length;
    let key;
    for (i = 0; i < len; i++) {
      key = keys[i];
      fn.call(null, obj[key], key, obj);
    }
  }
}
function merge(target: any, source: any) {
  const result: any = {};
  function assignValue(val: any, key: any) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }
  for (let i = 0, l = arguments.length; i < l; i++) {
    arguments[i] && forEach(arguments[i], assignValue);
  }
  return result;
}
const isTypedArray = (TypedArray => {
  return (thing: any) => {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== 'undefined' && Object.getPrototypeOf(Uint8Array));
const hasOwnProperty = (function resolver(_hasOwnProperty) {
  return (obj: any, prop: any) => {
    return _hasOwnProperty.call(obj, prop);
  };
})(Object.prototype.hasOwnProperty);
function isAbsoluteURL(url: any) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}
function combineURLs(baseURL: string, relativeURL: string) {
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL;
}
function buildFullPath(baseURL: string, requestedURL: string) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
}

function mergeConfig(config1: any, config2: any) {
  config2 = config2 || {};
  const config: any = {};
  function getMergedValue(target: any, source: any) {
    if (isPlainObject(target) && isPlainObject(source)) {
      return merge(target, source);
    } else if (isPlainObject(source)) {
      return merge({}, source);
    } else if (isArray(source)) {
      return source.slice();
    }
    return source;
  }
  function mergeDeepProperties(prop: any) {
    if (!isUndefined(config2[prop])) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (!isUndefined(config1[prop])) {
      return getMergedValue(undefined, config1[prop]);
    }
  }
  function valueFromConfig2(prop: any) {
    if (!isUndefined(config2[prop])) {
      return getMergedValue(undefined, config2[prop]);
    }
  }
  function defaultToConfig2(prop: any) {
    if (!isUndefined(config2[prop])) {
      return getMergedValue(undefined, config2[prop]);
    } else if (!isUndefined(config1[prop])) {
      return getMergedValue(undefined, config1[prop]);
    }
  }
  function mergeDirectKeys(prop: any) {
    if (prop in config2) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      return getMergedValue(undefined, config1[prop]);
    }
  }
  const mergeMap: any = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
  };
  forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop: any) {
    const merge = mergeMap[prop] || mergeDeepProperties;
    const configValue = merge(prop);
    (isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
  });
  return config;
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  isArray,
  isBoolean,
  isFormData,
  isPlainObject,
  isTypedArray,
  isUndefined,
  forEach,
  merge,
  buildFullPath,
  trim,
  kindOf,
  hasOwnProperty,
  hasOwnProp: hasOwnProperty,
  mergeConfig,
};
