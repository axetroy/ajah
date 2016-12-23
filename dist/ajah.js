(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ajah"] = factory();
	else
		root["ajah"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _ajah;

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	var originOpen = XMLHttpRequest.prototype.open;
	var originSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
	var originSend = XMLHttpRequest.prototype.send;

	var symbols = {
	  method: Symbol('method'),
	  url: Symbol('url'),
	  isAsync: Symbol('isAsync'),
	  body: Symbol('body'),
	  headers: Symbol('headers'),
	  fn: {
	    openInterceptor: Symbol('openInterceptor'),
	    shouldOpen: Symbol('itShouldOpen'),
	    shouldSend: Symbol('itShouldSend'),
	    ShouldAbort: Symbol('itShouldAbort'),
	    transformHeaders: Symbol('transformHeaders'),
	    transformRequestBody: Symbol('transformRequestBody')
	  }
	};

	/**
	 * handler the callback.
	 * @callback itShouldCallback
	 * @param method  {string}    request method
	 * @param url     {string}    request url
	 * @param body    {string}    request body
	 * @param headers {Object}    request headers
	 * @returns {Boolean}
	 */

	/**
	 * handler the callback.
	 * @callback headerTransformCallback
	 * @param method  {string}    request method
	 * @param url     {string}    request url
	 * @param body    {string}    request body
	 * @param headers {Object}    request headers
	 * @returns {Object}
	 */

	/**
	 * handler the callback.
	 * @callback bodyTransformCallback
	 * @param method  {string}    request method
	 * @param url     {string}    request url
	 * @param body    {string}    request body
	 * @param headers {Object}    request headers
	 * @param [response]  {any}   response
	 * @returns {String}
	 */

	/**
	 * handler the callback.
	 * @callback openInterceptorCallback
	 * @param method      {string}    request method
	 * @param url         {string}    request url
	 * @param isAsync     {Boolean}   async or not
	 * @returns {Arguments}
	 */

	/**
	 * handler the callback.
	 * @callback itShouldOpenCallback
	 * @param method      {string}    request method
	 * @param url         {string}    request url
	 * @param isAsync     {Boolean}   async or not
	 * @returns {Boolean}
	 */

	/**
	 * @namespace ajah
	 * @property env {String} the Javascript run-time, it should be 'dev' or 'prod'
	 * @example
	 ajah
	 .openInterceptor(function (method, url, isAsync) {
	    method = method === 'DELETE' ? 'GET' : method;    // change the http method
	    return [method, url, isAsync];
	  })
	 .itShouldOpen(function (method, url, isAsync) {
	    if (method === 'DELETE') return false;            // if the method is DELETE, the it will not hand shake with the serve
	    return true;
	  })
	 .itShouldSend(function (method, url, body, headers) {
	    if (!headers.Authorization) return false;         // if this request without token field, so don't send thi request
	    return true;
	  })
	 .transformHeaders(function (method, url, body, headers) {
	    headers['Authorization'] = 'this is a mock token';    // add a headers field for this request
	    return headers;
	  })
	 .transformRequestBody(function (method, url, body, headers) {
	    if (method === 'GET') return null;                    // if method is GET, then it should not send any body.
	    return body;
	  })
	 .transformResponseBody(function (method, url, body, headers, response) {
	    // TODO
	    return response;
	  })
	 .itShouldAbort(function (method, url, body, headers) {
	    if (url.indexOf('https://') < 0) return true;         // if this request is not https, then abort this request.
	    return false;
	  });
	 */
	var ajah = (_ajah = {
	  env: 'prod',
	  /**
	   * hook before call .open() method, and you can change the arguments
	   * @param callback {openInterceptorCallback}
	   * @returns {ajah}
	   */
	  openInterceptor: function openInterceptor(callback) {
	    ajah[symbols.fn.openInterceptor] = callback;
	    return this;
	  },

	  /**
	   * it should be hand-shake with serve or not
	   * @param callback  {itShouldOpenCallback}
	   * @returns {ajah}
	   */
	  itShouldOpen: function itShouldOpen(callback) {
	    ajah[symbols.fn.shouldOpen] = callback;
	    return this;
	  },

	  /**
	   * this request should be send or not
	   * @param callback {itShouldCallback}
	   * @returns {ajah}
	   */
	  itShouldSend: function itShouldSend(callback) {
	    ajah[symbols.fn.shouldSend] = callback;
	    return this;
	  },

	  /**
	   * after the request was sent, this request should abort or not
	   * @param callback  {itShouldCallback}
	   * @returns {ajah}
	   */
	  itShouldAbort: function itShouldAbort(callback) {
	    ajah[symbols.fn.itShouldAbort] = callback;
	    return this;
	  },

	  /**
	   * transform the request headers
	   * @param callback {headerTransformCallback}
	   * @returns {ajah}
	   */
	  transformHeaders: function transformHeaders(callback) {
	    ajah[symbols.fn.transformHeaders] = callback;
	    return this;
	  },

	  /**
	   * transform the request body
	   * @param callback {bodyTransformCallback}
	   * @returns {ajah}
	   */
	  transformRequestBody: function transformRequestBody(callback) {
	    ajah[symbols.fn.transformRequestBody] = callback;
	    return this;
	  },

	  /**
	   * transform the response body
	   * @param callback {bodyTransformCallback}
	   * @returns {ajah}
	   */
	  transformResponseBody: function transformResponseBody(callback) {
	    ajah[symbols.fn.transformResponseBody] = callback;
	    return this;
	  }
	}, _defineProperty(_ajah, symbols.fn.shouldSend, function (method, url, body, headers) {
	  return true;
	}), _defineProperty(_ajah, symbols.fn.openInterceptor, function (method, url, isAsync) {
	  return arguments;
	}), _defineProperty(_ajah, symbols.fn.itShouldAbort, function (method, url, body, headers) {
	  return false;
	}), _defineProperty(_ajah, symbols.fn.transformHeaders, function (method, url, body, headers) {
	  return headers;
	}), _defineProperty(_ajah, symbols.fn.transformRequestBody, function (method, url, body, headers) {
	  return body;
	}), _defineProperty(_ajah, symbols.fn.transformResponseBody, function (method, url, body, headers, response) {
	  return response;
	}), _ajah);

	XMLHttpRequest.prototype.open = function () {
	  var method = arguments[0];
	  var url = arguments[1];
	  var isAsync = arguments[2];

	  if (ajah.env === 'dev') {
	    console.log('[' + method + ']: ' + url);
	  } else {}

	  var openInterceptor = ajah[symbols.fn.openInterceptor];

	  var _ref = openInterceptor.call(this, method, url, isAsync) || [],
	      _ref2 = _slicedToArray(_ref, 3),
	      _method = _ref2[0],
	      _url = _ref2[1],
	      _isAsync = _ref2[2];

	  this[symbols.method] = _method || method;
	  this[symbols.url] = _url || url;
	  this[symbols.isAsync] = _isAsync || isAsync;

	  var itShouldOpenFn = ajah[symbols.fn.shouldOpen];

	  var params = [this[symbols.method], this[symbols.url], this[symbols.isAsync]];

	  try {
	    var itShouldOpen = itShouldOpenFn.apply(this, params);
	    if (itShouldOpen === false) throw new Error('it should not open the serve');

	    originOpen.apply(this, params);
	  } catch (err) {
	    console.error(err);
	  }
	};

	XMLHttpRequest.prototype.setRequestHeader = function () {
	  var key = arguments[0];
	  var value = arguments[1];
	  if (!this[symbols.headers]) this[symbols.headers] = {};
	  this[symbols.headers][key] = value;
	  originSetRequestHeader.apply(this, arguments);
	};

	XMLHttpRequest.prototype.send = function () {

	  this[symbols.body] = arguments[0];

	  var params = [this[symbols.method], this[symbols.url], this[symbols.body], this[symbols.headers]];

	  try {
	    var itShouldSendFn = ajah[symbols.fn.shouldSend]; // 判断是否可以发送请求
	    var transformHeadersFn = ajah[symbols.fn.transformHeaders]; // 对于header变形
	    var transformRequestBodyFn = ajah[symbols.fn.transformRequestBody]; // 对于request body变形
	    var itShouldAbortFn = ajah[symbols.fn.itShouldAbort]; // 是否要取消请求

	    var itShouldSend = itShouldSendFn.call.apply(itShouldSendFn, [this].concat(params));

	    if (itShouldSend === false) {
	      console.error('Should Not Send: ' + this[symbols.url]);
	    } else {
	      // transform headers start
	      var headers = transformHeadersFn.call.apply(transformHeadersFn, [this].concat(params));
	      for (var name in headers) {
	        if (headers.hasOwnProperty(name)) {
	          this.setRequestHeader(name, headers[name]);
	        }
	      }
	      // transform request body start
	      var body = transformRequestBodyFn.call.apply(transformRequestBodyFn, [this].concat(params)) + '';

	      originSend.apply(this, [body]);

	      var itShouldAbort = itShouldAbortFn.call.apply(itShouldAbortFn, [this].concat(params));

	      itShouldAbort === true && this.abort();
	    }
	  } catch (err) {
	    console.error(err);
	  }
	};

	/*ajah
	  .openInterceptor(function (method, url, isAsync) {
	    method = method === 'DELETE' ? 'GET' : method;    // change the http method
	    return [method, url, isAsync];
	  })
	  .itShouldOpen(function (method, url, isAsync) {
	    if (method === 'DELETE') return false;            // if the method is DELETE, the it will not hand shake with the serve
	    return true;
	  })
	  .itShouldSend(function (method, url, body, headers) {
	    if (!headers.Authorization) return false;         // if this request without token field, so don't send thi request
	    return true;
	  })
	  .transformHeaders(function (method, url, body, headers) {
	    headers['Authorization'] = 'this is a mock token';    // add a headers field for this request
	    return headers;
	  })
	  .transformRequestBody(function (method, url, body, headers) {
	    if (method === 'GET') return null;                    // if method is GET, then it should not send any body.
	    return body;
	  })
	  .transformResponseBody(function (method, url, body, headers, response) {
	    // TODO
	    return response;
	  })
	  .itShouldAbort(function (method, url, body, headers) {
	    if (url.indexOf('https://') < 0) return true;         // if this request is not https, then abort this request.
	    return false;
	  });*/

	exports.default = ajah;

/***/ }
/******/ ])
});
;