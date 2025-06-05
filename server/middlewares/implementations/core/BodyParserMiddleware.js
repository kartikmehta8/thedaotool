const express = require('express');
const IMiddleware = require('@middlewares/IMiddleware');

class BodyParserMiddleware extends IMiddleware {
  apply(app) {
    app.use(express.json());
  }
}

module.exports = BodyParserMiddleware;
