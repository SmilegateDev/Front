const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    proxy("/post", { target: "http://117.17.196.142:3003" }),
    proxy("/auth", { target: "http://117.17.196.142:8002" }),
    proxy("/feed", { target: "http://117.17.196.142:3002" }),
    proxy("/follow", { target: "http://117.17.196.142:3005" }),
    proxy("/noti", { target: "http://117.17.196.142:3006" })
  );
};