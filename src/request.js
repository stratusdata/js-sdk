let http = require('superagent');
let qs = require('qs').stringify;
let merge = require('deepmerge');
let isBrowser = require('is-browser');

class Request {
  constructor(method, url, token, query = {}) {
    if (method === undefined || url === undefined || token === undefined)
      throw new Error('You must provide valid arguments');
    this.method = method;
    this.url = url;
    this.token = token;
    this.query(query);
  }

  query(q) {
    if (q === undefined || q.toString() !== '[object Object]') throw new Error('You must provide a valid query');
    this.queryObj = merge(this.queryObj, q)
    return this;
  }

  where(key, op, value) {
    this.queryObj = appendQuery(this.queryObj, key, op, value);
    return this;
  }

  limit(l) {
    if (l) this.queryObj.limit = l;
    return this;
  }

  offset(o) {
    if (o) this.queryObj.offset = o;
    return this;
  }

  nextPage() {
    if (this.queryObj && this.queryObj.limit)
      this.queryObj.offset = (this.queryObj.offset || 0) + this.queryObj.limit;
    return this;
  }

  prevPage() {
    if (this.queryObj && this.queryObj.limit && this.queryObj.offset) {
      let l = this.queryObj.offset - this.queryObj.limit;
      this.queryObj.offset = (l > 0) ? l : 0;
    }
    return this;
  }

  get(id, cb) {
    this.method = 'get';
    this.key = id;
    this.exec(cb);
    return this;
  }

  getAll(query = {}, cb = function () {}) {
    if (typeof query === 'function') {
      cb = query;
      query = {};
    }
    this.query(query);
    this.exec(cb);
    return this;
  }

  findAll(query, cb) {
    return getAll(query, cb);
  }

  findOne(query = {}, cb = function () {}) {
    this.queryObj.limit = 1;
    this.exec((err, res) => {
      if (Array.isArray(res.body.bundle)) res.body.bundle = res.body.bundle[0];
      cb(err, res);
    })
  }

  exec(cb) {
    let u = getURL(this.url, this.key, this.queryObj);
    let req = http(this.method.toUpperCase(), u)
      .set('Authorization', 'Bearer ' + this.token);

    if(isBrowser) req.withCredentials();

    // return the response body to the callback
    req.end(function(err, response) {
      return cb(err, response.body);
    });

    this.key = undefined;
  }
}

function getURL(url, key, query = {}) {
  let k = key ? key + '/' : '';
  return url + k + '?' + qs(query);
}

function appendQuery(queryObj, key, op, value) {
  let array = [];
  if (Array.isArray(key)) array = key;
  else if (key && op && value) array = [key, op, value];
  else if (key && op && value === undefined) array = [key, op];
  else if (key && op === undefined && value === undefined) array = key.split(/\s/);

  if (array.length === 2) return merge(queryObj, {[array[0]]: {'eq': array[1]}});
  else if (array.length === 3) return merge(queryObj, {[array[0]]: {[getOperator(array[1])]: array[2]}});
  else throw new Error('You must provide a valid query');
}

function getOperator(o) {
  if (o === '<' || o === 'lt')  return 'lt';
  else if (o === '>' || o === 'gt') return 'gt';
  else if (o === '=' || o === 'eq') return 'eq';
  else if (o === '!=' || o === 'ne') return 'ne';
  else if (o === '<=' || o === 'lte') return 'lte';
  else if (o === '>=' || o === 'gte') return 'gte';
  else if (o === 'regex') return 'regex';
  else throw new Error('You must provide a valid operator');
}

module.exports = Request;
