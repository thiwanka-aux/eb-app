const express = require('express');
const AWS = require('aws-sdk');
const xmlparser = require ('express-xml-bodyparser');
const xml = require ('xml2js');

// Set the region
AWS.config.update({region: 'eu-west-2'});

const xmlOptions = {
  charkey: 'value',
  trim: false,
  explicitRoot: false,
  explicitArray: false,
  normalizeTags: false,
  mergeAttrs: true,
};

// Create S3 service object
const s3 = new AWS.S3({apiVersion: '2006-03-01'});
const router = express.Router();

const bustHeaders = (request, response, next) => {
  request.app.isXml = false;

  if (request.headers['content-type'] === 'application/xml'
      || request.headers['accept'] === 'application/xml'
  ) {
    request.app.isXml = true;
  }

  next();
};

router.post('/', bustHeaders, async (req, res, next) => {
  try {
    console.log('req log >>>>>>>', req.body);
    res.send('respond with a resource');
  }catch ( e ) {
    res.send(e);
  }
});

module.exports = router;
