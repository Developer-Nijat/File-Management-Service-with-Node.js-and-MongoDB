const morgan = require("morgan");
const rfs = require("rotating-file-stream");

const accessLogStream = rfs.createStream("access.log", {
  interval: "1d", // rotate daily
  path: "./logs",
});

const errorLogStream = rfs.createStream("error.log", {
  interval: "1d", // rotate daily
  path: "./logs",
});

morgan.token("body", (req, res) => JSON.stringify(req.body));
morgan.token("reqUrl", (req, res) =>
  req.url ? req.url.split("?")[0] : req.url
);
morgan.token("reqParams", (req, res) => JSON.stringify(req.params));
morgan.token("reqQuery", (req, res) => JSON.stringify(req.query));

const accessLogger = morgan(
  ":remote-addr | :date[iso] | :method | ':reqUrl' | ':reqQuery' | :reqParams | :body | HTTP/:http-version | :status | :referrer | ':user-agent'",
  {
    skip: function (req, res) {
      return res.statusCode > 399; // only log access
    },
    stream: accessLogStream,
  }
);

const errorLogger = morgan(
  ":remote-addr | :date[iso] | :method | ':reqUrl' | ':reqQuery' | :reqParams | :body | HTTP/:http-version | :status | :referrer | ':user-agent'",
  {
    skip: function (req, res) {
      return res.statusCode < 400; // only log errors
    },
    stream: errorLogStream,
  }
);

module.exports = {
  accessLogger,
  errorLogger,
};
