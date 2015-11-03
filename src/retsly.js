let Request = require('./request');
const BASE_URL = "https://rets.io/api/v1/";

class Retsly {
  constructor(client, opts) {
    if (arguments.length === 1) opts = client;
    if (!opts || !opts.token || typeof opts.token !== 'string')
      throw new Error('You must provide a valid access token');

    this.token = opts.token;
    this.vendor = opts.vendor || 'test';
  }
  static create(token, vendor = 'test') {
    return new Retsly({token, vendor});
  }
  listings(query = {}) {
    let url = getURL('listings', this.vendor);
    return new Request('get', url, this.token, query);
  }
  agents(query = {}) {
    let url = getURL('agents', this.vendor);
    return new Request('get', url, this.token, query);
  }
  offices(query = {}) {
    let url = getURL('offices', this.vendor);
    return new Request('get', url, this.token, query);
  }
  openHouses(query = {}) {
    let url = getURL('openhouses', this.vendor);
    return new Request('get', url, this.token, query);
  }
  getRequest(method, url, query) {
    return new Request(method, url, this.token, query);
  }
}

function getURL(resource, vendor, id = '') {
  return BASE_URL + vendor + '/' + resource + '/' + id;
}

module.exports = Retsly;
