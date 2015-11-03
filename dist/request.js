'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _defineProperty(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var http = require('superagent');
var qs = require('qs').stringify;
var merge = require('deepmerge');
var isBrowser = require('is-browser');

var Request = (function () {
  function Request(method, url, token) {
    var query = arguments[3] === undefined ? {} : arguments[3];

    _classCallCheck(this, Request);

    if (method === undefined || url === undefined || token === undefined) throw new Error('You must provide valid arguments');
    this.method = method;
    this.url = url;
    this.token = token;
    this.query(query);
  }

  _createClass(Request, [{
    key: 'query',
    value: function query(q) {
      if (q === undefined || q.toString() !== '[object Object]') throw new Error('You must provide a valid query');
      this.queryObj = merge(this.queryObj, q);
      return this;
    }
  }, {
    key: 'where',
    value: function where(key, op, value) {
      this.queryObj = appendQuery(this.queryObj, key, op, value);
      return this;
    }
  }, {
    key: 'limit',
    value: function limit(l) {
      if (l) this.queryObj.limit = l;
      return this;
    }
  }, {
    key: 'offset',
    value: function offset(o) {
      if (o) this.queryObj.offset = o;
      return this;
    }
  }, {
    key: 'nextPage',
    value: function nextPage() {
      if (this.queryObj && this.queryObj.limit) this.queryObj.offset = (this.queryObj.offset || 0) + this.queryObj.limit;
      return this;
    }
  }, {
    key: 'prevPage',
    value: function prevPage() {
      if (this.queryObj && this.queryObj.limit && this.queryObj.offset) {
        var l = this.queryObj.offset - this.queryObj.limit;
        this.queryObj.offset = l > 0 ? l : 0;
      }
      return this;
    }
  }, {
    key: 'get',
    value: function get(id, cb) {
      this.method = 'get';
      this.key = id;
      this.exec(cb);
      return this;
    }
  }, {
    key: 'getAll',
    value: function getAll() {
      var query = arguments[0] === undefined ? {} : arguments[0];
      var cb = arguments[1] === undefined ? function () {} : arguments[1];

      if (typeof query === 'function') {
        cb = query;
        query = {};
      }
      this.query(query);
      this.exec(cb);
      return this;
    }
  }, {
    key: 'findAll',
    value: function findAll(query, cb) {
      return getAll(query, cb);
    }
  }, {
    key: 'findOne',
    value: function findOne() {
      var query = arguments[0] === undefined ? {} : arguments[0];
      var cb = arguments[1] === undefined ? function () {} : arguments[1];

      this.queryObj.limit = 1;
      this.exec(function (err, res) {
        if (Array.isArray(res.body.bundle)) res.body.bundle = res.body.bundle[0];
        cb(err, res);
      });
    }
  }, {
    key: 'exec',
    value: function exec(cb) {
      var u = getURL(this.url, this.key, this.queryObj);
      var req = http(this.method.toUpperCase(), u).set('Authorization', 'Bearer ' + this.token);
      if (isBrowser) req.withCredentials();
      req.end(cb);
      this.key = undefined;
    }
  }]);

  return Request;
})();

function getURL(url, key) {
  var query = arguments[2] === undefined ? {} : arguments[2];

  var k = key ? key + '/' : '';
  return url + k + '?' + qs(query);
}

function appendQuery(queryObj, key, op, value) {
  var array = [];
  if (Array.isArray(key)) array = key;else if (key && op && value) array = [key, op, value];else if (key && op && value === undefined) array = [key, op];else if (key && op === undefined && value === undefined) array = key.split(/\s/);

  if (array.length === 2) return merge(queryObj, _defineProperty({}, array[0], { 'eq': array[1] }));else if (array.length === 3) return merge(queryObj, _defineProperty({}, array[0], _defineProperty({}, getOperator(array[1]), array[2])));else throw new Error('You must provide a valid query');
}

function getOperator(o) {
  if (o === '<' || o === 'lt') return 'lt';else if (o === '>' || o === 'gt') return 'gt';else if (o === '=' || o === 'eq') return 'eq';else if (o === '!=' || o === 'ne') return 'ne';else if (o === '<=' || o === 'lte') return 'lte';else if (o === '>=' || o === 'gte') return 'gte';else if (o === 'regex') return 'regex';else throw new Error('You must provide a valid operator');
}

module.exports = Request;