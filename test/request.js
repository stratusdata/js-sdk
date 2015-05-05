var assert = require('assert');
var Request = require('../dist/request');

describe('request', function () {
  describe('constructor', function () {
    it('should throw an error if it is missing any of the first three arguments', function () {
      assert.throws(
        function () {
          var request = new Request();
        },
        function (err) {
          return (err instanceof Error && /valid arguments/.test(err));
        }
      )
    })

    it('should properly instantiate a Request object', function () {
      var method = 'get';
      var url = 'http://rets.io';
      var token = '123456';
      var query = {key: 'value'};
      var request = new Request(method, url, token);
      assert(request instanceof Request, 'Request object was not properly instantiated');
      assert(request.method === method, 'method was not set properly');
      assert(request.url === url, 'url was not set properly');
      assert(request.token === token, 'token was not set properly');
      assert(request.queryObj.toString() === query.toString(), 'queryObj was not set properly');
    })

    it('should set queryObj to empty object by default', function () {
      var method = 'get';
      var url = 'http://rets.io';
      var token = '123456';
      var request = new Request(method, url, token);
      assert(request.queryObj.toString() === '[object Object]' && Object.keys(request.queryObj).length === 0,
        'queryObj is not set to empty object by default');
    })
  })

  describe('query', function () {
    var method = 'get';
    var url = 'http://rets.io';
    var token = '123456';
    var query = {a: 1};
    var request = new Request(method, url, token, query);

    it('should throw an error if argument is not an object', function () {
      assert.throws(
        function () {
          request.query();
        },
        error
      )
      assert.throws(
        function () {
          request.query('baths gt 3');
        },
        error
      )
      assert.throws(
        function () {
          request.query(['baths', 'gt', 3]);
        },
        error
      )

      function error(err) {
        return (err instanceof Error && /valid query/.test(err));
      }
    })

    it('should append query to queryObj if it is valid', function () {
      request.query({b: 2});
      assert(request.queryObj.a === 1, 'original query is removed');
      assert(request.queryObj.b === 2, 'new query is not appended');
      assert(Object.keys(request.queryObj).length === 2, 'query is not properly appended');
    })

    it('should be chainable', function () {
      request.query({c: 3}).query({d: 4});
      assert(request.queryObj.c === 3 && request.queryObj.d === 4, 'query function is not chainable');
    })
  })

  describe('limit', function () {
    var method = 'get';
    var url = 'http://rets.io';
    var token = '123456';
    var request = new Request(method, url, token);
    it('should set limit of queryObj', function () {
      request.limit(5);
      assert(request.queryObj.limit === 5, 'limit is not set properly on queryObj');
    })
  })

  describe('offset', function () {
    var method = 'get';
    var url = 'http://rets.io';
    var token = '123456';
    var request = new Request(method, url, token);
    it('should set offset of queryObj', function () {
      request.offset(3);
      assert(request.queryObj.offset === 3, 'offset is not set properly on queryObj');
    })
  })

  describe('nextPage', function () {
    var method = 'get';
    var url = 'http://rets.io';
    var token = '123456';
    var request = new Request(method, url, token);
    it('should not increment offset of queryObj if limit is not set', function () {
      request.offset(5).nextPage();
      assert(request.queryObj.offset === 5, 'offset should not be incremented');
    })
    it('should increment offset of queryObj by limit', function () {
      request.limit(6).offset(4).nextPage();
      assert(request.queryObj.offset === 10, 'offset is not incremented properly');
    })
  })

  describe('prevPage', function () {
    var method = 'get';
    var url = 'http://rets.io';
    var token = '123456';
    var request = new Request(method, url, token);
    it('should not decrement offset of queryObj if limit is not set', function () {
      request.offset(5).prevPage();
      assert(request.queryObj.offset === 5, 'offset should not be decremented');
    })
    it('should decrement offset of queryObj by limit', function () {
      request.limit(6).offset(10).prevPage();
      assert(request.queryObj.offset === 4, 'offset is not decremented properly');
    })
    it('should not go below zero when decrementing', function () {
      request.limit(10).offset(5).prevPage();
      assert(request.queryObj.offset === 0, 'offset is not decremented properly');
    })
  })

  describe('where', function () {
    var method = 'get';
    var url = 'http://rets.io';
    var token = '123456';
    it('should take in array query with different signatures as its first argument', function () {
      var request = new Request(method, url, token);
      request.where(['baths', 'gt', 3]);
      assert(request.queryObj['baths']['gt'] === 3, 'array query - 3 parameters - is not parsed correctly');
      request.where(['bedrooms', 2]);
      assert(request.queryObj['bedrooms']['eq'] === 2, 'array query - 2 parameters - is not parsed correctly');
      request.where(['livingArea', '>=', 2000]);
      assert(request.queryObj['livingArea']['gte'] === 2000, 'array query - 3 parameters with operators - is not parsed correctly');
    })
    it('should take in comma separated queries', function () {
      var request = new Request(method, url, token);
      request.where('baths', 'gt', 4);
      assert(request.queryObj['baths']['gt'] === 4, 'array query - 3 parameters - is not parsed correctly');
      request.where('bedrooms', 3);
      assert(request.queryObj['bedrooms']['eq'] === 3, 'array query - 2 parameters - is not parsed correctly');
      request.where('livingArea', '<=', 5000);
      assert(request.queryObj['livingArea']['lte'] === 5000, 'array query - 3 parameters with operators - is not parsed correctly');
    })
    it('should parse accepted operators', function () {
      var request = new Request(method, url, token);
      request.where('a', '>', 1);
      request.where('b', '<', 1);
      request.where('c', '>=', 1);
      request.where('d', '<=', 1);
      request.where('e', '!=', 1);
      request.where('f', '=', 1);
      request.where('g', 'regex', '1');
      assert(request.queryObj['a']['gt'] === 1, '> is not parsed correctly');
      assert(request.queryObj['b']['lt'] === 1, '< is not parsed correctly');
      assert(request.queryObj['c']['gte'] === 1, '>= is not parsed correctly');
      assert(request.queryObj['d']['lte'] === 1, '<= is not parsed correctly');
      assert(request.queryObj['e']['ne'] === 1, '!= is not parsed correctly');
      assert(request.queryObj['f']['eq'] === 1, '== is not parsed correctly');
      assert(request.queryObj['g']['regex'] === '1', 'regex is not parsed correctly');
    })
    it('should be chainable', function () {
      var request = new Request(method, url, token);
      request.where(['fireplaces', 'gt', 3]).where('garageSpaces', 3);
      assert(request.queryObj['fireplaces']['gt'] === 3, 'where query is not chainable');
      assert(request.queryObj['garageSpaces']['eq'] === 3, 'where query is not chainable');
    })
    it('should throw an error if query is not valid', function () {
      var request = new Request(method, url, token);
      assert.throws(
        function () {
          request.where('baths')
        },
        function error(err) {
          return (err instanceof Error && /valid query/.test(err));
        }
      )
      assert.throws(
        function () {
          request.where('stories', '<>', 2);
        },
        function error(err) {
          return (err instanceof Error && /valid operator/.test(err));
        }
      )
    })
  })
})