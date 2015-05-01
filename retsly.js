let Request = require('./request');
const BASE_URL = "https://rets.io/api/v1/";

class Retsly {
  constructor({token, vendor = 'test'}) {
    this.token = token;
    this.vendor = vendor;
  }
  static create(token, vendor = 'test') {
    return new Retsly({token, vendor});
  }
  listings(query = {}) {
    let url = getURL('listing', this.vendor);
    return new Request('get', url, this.token, query);
  }
  agents(query = {}) {
    let url = getURL('agent', this.vendor);
    return new Request('get', url, this.token, query);
  }
  offices(query = {}) {
    let url = getURL('office', this.vendor);
    return new Request('get', url, this.token, query);
  }
  openHouses(query = {}) {
    let url = getURL('openhouse', this.vendor);
    return new Request('get', url, this.token, query);
  }
  getRequest(method, url, query) {
    return new Request(method, url, this.token, query);
  }
}

function getURL(resource, vendor, id = '') {
  return BASE_URL + resource + '/' + vendor + '/' + id;
}

module.exports = Retsly;
