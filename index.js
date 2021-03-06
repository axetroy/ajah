let originOpen = XMLHttpRequest.prototype.open;
let originSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
let originSend = XMLHttpRequest.prototype.send;

let symbols = {
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
const ajah = {
  env: 'prod',
  /**
   * hook before call .open() method, and you can change the arguments
   * @param callback {openInterceptorCallback}
   * @returns {ajah}
   */
  openInterceptor(callback){
    ajah[symbols.fn.openInterceptor] = callback;
    return this;
  },
  /**
   * it should be hand-shake with serve or not
   * @param callback  {itShouldOpenCallback}
   * @returns {ajah}
   */
  itShouldOpen(callback){
    ajah[symbols.fn.shouldOpen] = callback;
    return this;
  },
  /**
   * this request should be send or not
   * @param callback {itShouldCallback}
   * @returns {ajah}
   */
  itShouldSend(callback){
    ajah[symbols.fn.shouldSend] = callback;
    return this;
  },
  /**
   * after the request was sent, this request should abort or not
   * @param callback  {itShouldCallback}
   * @returns {ajah}
   */
  itShouldAbort(callback){
    ajah[symbols.fn.itShouldAbort] = callback;
    return this;
  },
  /**
   * transform the request headers
   * @param callback {headerTransformCallback}
   * @returns {ajah}
   */
  transformHeaders(callback) {
    ajah[symbols.fn.transformHeaders] = callback;
    return this;
  },
  /**
   * transform the request body
   * @param callback {bodyTransformCallback}
   * @returns {ajah}
   */
  transformRequestBody(callback){
    ajah[symbols.fn.transformRequestBody] = callback;
    return this;
  },
  /**
   * transform the response body
   * @param callback {bodyTransformCallback}
   * @returns {ajah}
   */
  transformResponseBody(callback){
    ajah[symbols.fn.transformResponseBody] = callback;
    return this;
  },
  [symbols.fn.shouldSend]: function (method, url, body, headers) {
    return true;
  },
  [symbols.fn.openInterceptor]: function (method, url, isAsync) {
    return arguments;
  },
  [symbols.fn.itShouldAbort]: function (method, url, body, headers) {
    return false;
  },
  [symbols.fn.transformHeaders]: function (method, url, body, headers) {
    return headers;
  },
  [symbols.fn.transformRequestBody]: function (method, url, body, headers) {
    return body;
  },
  [symbols.fn.transformResponseBody]: function (method, url, body, headers, response) {
    return response;
  }
};

XMLHttpRequest.prototype.open = function () {
  let method = arguments[0];
  let url = arguments[1];
  let isAsync = arguments[2];

  if (ajah.env === 'dev') {
    console.log(`[${method}]: ${url}`);
  } else {

  }

  let openInterceptor = ajah[symbols.fn.openInterceptor];

  let [_method,_url,_isAsync] = (openInterceptor.call(this, method, url, isAsync) || []);

  this[symbols.method] = _method || method;
  this[symbols.url] = _url || url;
  this[symbols.isAsync] = _isAsync || isAsync;

  let itShouldOpenFn = ajah[symbols.fn.shouldOpen];

  let params = [this[symbols.method], this[symbols.url], this[symbols.isAsync]];

  try {
    let itShouldOpen = itShouldOpenFn.apply(this, params);
    if (itShouldOpen === false) throw new Error('it should not open the serve');

    originOpen.apply(this, params);
  } catch (err) {
    console.error(err);
  }

};

XMLHttpRequest.prototype.setRequestHeader = function () {
  let key = arguments[0];
  let value = arguments[1];
  if (!this[symbols.headers]) this[symbols.headers] = {};
  this[symbols.headers][key] = value;
  originSetRequestHeader.apply(this, arguments)
};

XMLHttpRequest.prototype.send = function () {

  this[symbols.body] = arguments[0];

  let params = [this[symbols.method], this[symbols.url], this[symbols.body], this[symbols.headers]];

  try {
    let itShouldSendFn = ajah[symbols.fn.shouldSend];                       // 判断是否可以发送请求
    let transformHeadersFn = ajah[symbols.fn.transformHeaders];             // 对于header变形
    let transformRequestBodyFn = ajah[symbols.fn.transformRequestBody];       // 对于request body变形
    let itShouldAbortFn = ajah[symbols.fn.itShouldAbort];       // 是否要取消请求

    let itShouldSend = itShouldSendFn.call(this, ...params);

    if (itShouldSend === false) {
      console.error(`Should Not Send: ${this[symbols.url]}`)
    } else {
      // transform headers start
      let headers = transformHeadersFn.call(this, ...params);
      for (let name in headers) {
        if (headers.hasOwnProperty(name)) {
          this.setRequestHeader(name, headers[name]);
        }
      }
      // transform request body start
      let body = transformRequestBodyFn.call(this, ...params) + '';

      originSend.apply(this, [body]);

      let itShouldAbort = itShouldAbortFn.call(this, ...params);

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


export default ajah;