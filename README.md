# MOCK Server

MockServer is the easiest and quickest way to run mock APIs on server or locally and open source. Use any REST Client like postman with MOCK Server.

With MockServer, you can easily get started with the data that needs to fetched from server for your UI integrations and working. This helps you develop
your designs with almost real data while the Actual API are just being done.

Its designed for simplicity and immidiate actions. It does not need huge setup or anything. Just add few files into mockData folder with each path element being a folder, thats it and you are done.

### Features
+ Pre-flight mocking of APIs
+ HTTP response mocking, matchable on URL, header and body content patterns
+ Allow custom data scripting using JS
+ Configurable via a fluent Javascript API, JSON files and JSON over HTTP


### NockData Format
MockData folder can except 3 file in formats with JSON and JS file extensions.
+ JSON : Standard static JSON data files, this data is pushed out when requested
+ JS : Static JS Object or Array for modules.export, eg.
> module.exports = {
>    "msg":"ITS OK 1"
> }
+ JS : JS Function that receives that dataObject from and take returns JS Object or array
> modules.exports = function(dataObj) {
>   return {
>       "msg":"This is a message",
>   };
> }

### Debug
Sometimes you may not get the path correct or the data which you uploaded might not be coming back. Then please send debug=true as a GET request parameter.
This will expose more details for the request which will help you debug the request

### Managing MockData
You can manually upload the mock script/json datas into the mock data folder. The rules are pretty simple
+ Place the files in path wrt to request routing, ie
> for a/b/c request, place a c.json file in a folder mockData/a/b
+ for multiple request formats (get, put, post), please use _get, _put, _post, _delete, etc for the name of the final file, ie
> for a/b/c, a get request file is c_get.json at path mockData/a/b/
> for a/b/c, a post request file is c_post.json at path mockData/a/b/
+ Get is considered default for any request, and its used to handle any unhandled request types (if strict_request_type is not enabled)
> for a/b/c, a get request, if c_get.json is not found, c.json is used to handle the request
> for a/b/c, a post request, if c_post.json is not found, c.json is used to handle the request



Thank you
Bismay K