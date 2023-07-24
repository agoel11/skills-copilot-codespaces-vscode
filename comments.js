// Create web server
// Start server: node comments.js
// Access to server: http://localhost:3000/
// Access to server: http://localhost:3000/comments

// Import modules
var http = require('http');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');
var comments = require('./comments');

// Create server
http.createServer(function (req, res) {
  // Get path
  var pathname = url.parse(req.url).pathname;
  // Get method
  var method = req.method;

  if (pathname === '/') {
    fs.readFile('./index.html', function (err, data) {
      if (err) {
        console.log(err);
      } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
      }
    });
  } else if (pathname === '/comments' && method === 'POST') {
    // Get data from request
    var postData = '';
    req.addListener('data', function (chunk) {
      postData += chunk;
    });
    req.addListener('end', function () {
      // Parse data to object
      var comment = qs.parse(postData);
      // Add comment to comments
      comments.push(comment);
      // Redirect to comments
      res.writeHead(302, {'Location': '/comments'});
      res.end();
    });
  } else if (pathname === '/comments' && method === 'GET') {
    var commentList = '';
    for (var i = 0; i < comments.length; i++) {
      commentList += '<li>' + comments[i].name + ': ' + comments[i].comment + '</li>';
    }

    fs.readFile('./comments.html', function (err, data) {
      if (err) {
        console.log(err);
      } else {
        data = data.toString().replace('<!--comments-->', commentList);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
      }
    });
  } else {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('404 Not Found');
  }
}).listen(3000);

console.log('Server running at http://localhost:3000/');