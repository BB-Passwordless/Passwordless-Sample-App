const express = require("express");
const app = express();
const path = require("path");
const serveIndex=require('serve-index')
app.use(express.static(path.join(__dirname, "build")));
app.use('/.well-known', express.static('.well-known'), serveIndex('.well-known'));
  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "build", "index.html"));
  });
app.listen(3013,() =>{console.log("Sonic Sample App Running on 3013")})