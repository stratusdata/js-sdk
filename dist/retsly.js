'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Request = require('./request');
var BASE_URL = 'https://rets.io/api/v1/';

var Retsly = (function () {
  function Retsly(client, opts) {
    _classCallCheck(this, Retsly);

    if (arguments.length === 1) opts = client;
    if (!opts || !opts.token || typeof opts.token !== 'string') throw new Error('You must provide a valid access token');

    this.token = opts.token;
    this.vendor = opts.vendor || 'test';
  }

  _createClass(Retsly, [{
    key: 'listings',
    value: function listings() {
      var query = arguments[0] === undefined ? {} : arguments[0];

      var url = getURL('listings', this.vendor);
      return new Request('get', url, this.token, query);
    }
  }, {
    key: 'agents',
    value: function agents() {
      var query = arguments[0] === undefined ? {} : arguments[0];

      var url = getURL('agents', this.vendor);
      return new Request('get', url, this.token, query);
    }
  }, {
    key: 'offices',
    value: function offices() {
      var query = arguments[0] === undefined ? {} : arguments[0];

      var url = getURL('offices', this.vendor);
      return new Request('get', url, this.token, query);
    }
  }, {
    key: 'openHouses',
    value: function openHouses() {
      var query = arguments[0] === undefined ? {} : arguments[0];

      var url = getURL('openhouses', this.vendor);
      return new Request('get', url, this.token, query);
    }
  }, {
    key: 'getRequest',
    value: function getRequest(method, url, query) {
      return new Request(method, url, this.token, query);
    }
  }], [{
    key: 'create',
    value: function create(token) {
      var vendor = arguments[1] === undefined ? 'test' : arguments[1];

      return new Retsly({ token: token, vendor: vendor });
    }
  }]);

  return Retsly;
})();

function getURL(resource, vendor) {
  var id = arguments[2] === undefined ? '' : arguments[2];

  return BASE_URL + vendor + '/' + resource + '/' + id;
}

module.exports = Retsly;