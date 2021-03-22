const express = require('express');
const AWS = require('aws-sdk');
const xmlparser = require ('express-xml-bodyparser');
const xml = require ('xml2js');

// Set the region
AWS.config.update({region: 'eu-west-2'});

const xmlOptions = {
  charkey: 'value',
  trim: false,
  explicitArray: false,
  normalizeTags: false,
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

const builder = new xml.Builder({
  renderOpts: { 'pretty': false }
});

const buildResponse = (response, statusCode, data, preTag) => {
  response.format({
    'application/json': () => {
      response.status(statusCode).json(data);
    },
    'application/xml': () => {
      response.status(statusCode).send(builder.buildObject({ [preTag]: data }));
    },
    'default': () => {
      // log the request and respond with 406
      response.status(406).send('Not Acceptable');
    }
  });
};

router.post('/', bustHeaders, xmlparser(xmlOptions), async (req, res, next) => {
  try {
    if (req.app.isXml) {
      res.setHeader('Content-Type', 'application/xml');
    }

    const xmlParsedObj = builder.buildObject( req.body);
    console.log('xmlParsedObj log >>>>>>>', xmlParsedObj)
    const s3put = await s3.putObject({
      Bucket: 'docusign-temp',
      Key: '2asd23.xml',
      Body: xmlParsedObj,
      ContentType: 'application/xml'
    }).promise()
    res.status(200).send(xmlParsedObj);
  }catch ( e ) {
    res.send(e);
  }
});

module.exports = router;
