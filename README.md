# ajah.js

### Description

a lib hook into XMLHttpRequest

### Usage

```bash
npm install https://github.com/axetroy/ajah.git --save
```

```javascript
var ajah = require('ajah');
// or use in global
var ajah = window.ajah.default;

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

```

### [Documentation](https://axetroy.github.io/ajah);

### Contribution

```bash
git clone https://github.com/axetroy/ajah.git
cd ajah

yarn

yarn run build
```

### Test:TODO

```bash
yarn run test
// or
yarn run test:watch
```

### Contributors

[](#contributors)

- @axetroy --- ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇
  - 100.00%
  - +8629
  - -2

[](#contributors-end)

### License

The MIT License (MIT)

Copyright (c) 2016 axetroy

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
