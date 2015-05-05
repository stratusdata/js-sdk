# JS SDK
 Retsly Core SDK Version 2. Useful for clientside and node integration with Retsly.

## Installation
```bash
$ npm install retsly/js-sdk
```

## Usage
```js
var Retsly = require('js-sdk')
var retsly = Retsly.create(ACCESS_TOKEN, [VENDOR]);
var request = retsly.listings()
                    .query({bedrooms: 3})
                    .getAll();
```

## API
### Retsly.create(token, [vendor])
Returns a new instance of `Retsly`. Requires an API token and optionally set the vendor (the MLS data source).

### retsly.listings([query])
Returns a new `Request` for the Listings resource.

### retsly.agents([query])
Returns a new `Request` for the Agents resource.

### retsly.offices([query])
Returns a new `Request` for the Offices resource.

### retsly.openHouses([query])
Returns a new `Request` for the Openhouses resource.

### request.query(query)
Appends the query to the querystring.
```js
request.query({bedrooms: 3})
       .query({bathrooms: {gt: 4});
```

### request.limit(n)
Alias for `request.query({limit: n})`;

### request.offset(n)
Alias for `request.query({offset: n})`;

### request.where(query)
Helper function for building queries, works with different signatures.
```js
request.where(['bedrooms', 'lt', 4])
       .where('livingArea', 'gt', 3000)
       .where('bathrooms', 3)
       .where('garageSpaces eq 2');
```
### request.get(id, [callback])
Gets a single document with id, optionally takes a callback

### request.getAll([query], [callback])
Gets an array of documents that match the optional query criteria, optionally takes a callback

### request.findOne([query], [callback])
Gets a single document that match the optional query criteria, and optionally takes a callback. It sets the limit to one and only return the first result and not an array.

### request.findAll([query], [callback])
Alias for `request.findAll(query, callback)`

### request.exec([callback])
Alias for `reqest.findAll({}, callback)`
