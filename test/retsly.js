var assert = require('assert');
var Retsly = require('../build/retsly');
var Request = require('../build/request');

describe('retsly', function () {
  describe('constructor', function () {
    it('should throw an error if access token is not provided', function () {
      assert.throws(
        function () {
          var retsly = new Retsly();
        },
        function (err) {
          return (err instanceof Error && /valid access token/.test(err));
        }
      )
    })

    it('should optionally takes a reference to a httpClient as its first parameter', function () {
      var mockClient = {};
      var token = 'testToken';
      var retsly = new Retsly(mockClient, {token: token});
      assert(retsly.token === token, 'Token is not set properly if client is passed in');
    })

    it('should set default vendor if not provided', function () {
      var retsly = new Retsly({token: 'testToken'});
      assert(retsly.vendor === 'test', 'Vendor is not set to test by default if not provided');
    })
  })

  describe('create static function', function () {
    it('should throw an error if access token is not provided', function () {
      assert.throws(
        function () {
          var retsly = Retsly.create();
        },
        function (err) {
          return (err instanceof Error && /valid access token/.test(err));
        }
      )
    })
    it('should set default vendor if not provided', function () {
      var retsly = Retsly.create('testToken');
      assert(retsly.token === 'testToken', 'Token is not set properly');
      assert(retsly.vendor === 'test', 'Vendor is not set to test by default if not provided');
    })
    it('should throw an error if token is not a string', function () {
      assert.throws(
        function () {
          var retsly = Retsly.create({token: 'testToken'});
        },
        function (err) {
          return (err instanceof Error && /valid access token/.test(err));
        }
      )
    })
  })

  describe('listings request', function () {
    it('should return a properly initialized request', function () {
      var request = Retsly.create('testToken').listings();
      assert(request instanceof Request, 'listing function does not return a new request object');
      assert(request.token === 'testToken', 'request\'s token is not set properly');
      assert(/rets.io\/api\/v1\/listing\/test/.test(request.url), 'request\'s url is not set properly');
      assert(request.method === 'get', 'request\'s default method is not set to GET')
      assert(request.queryObj.toString() === '[object Object]', 'request\'s default query is not an object')
    })
    it('should set query if passed in', function () {
      var query = {'key': 'value'};
      var request = Retsly.create('testToken').listings(query);
      assert(request.queryObj.key === 'value', 'request\'s queryObj is not set properly')
    })
    it('should throw an error if query is not an object', function () {
      assert.throws(
        function () {
          var query = 'key lt value';
          var request = Retsly.create('testToken').listings(query);
        },
        function (err) {
          return (err instanceof Error && /valid query/.test(err));
        }
      )
    })
  })
})
