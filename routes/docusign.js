const express = require('express');
const AWS = require('aws-sdk');
const xmlparser = require ('express-xml-bodyparser');
const xml = require ('xml2js');
const uuid = require('uuid');

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

const verifyWebhook = async req => {
  const keys = [];
  keys.push(req.headers['x-docusign-signature-1']);
  keys.push(req.headers['x-docusign-signature-2']);

  console.log('expected_signature log >>>>>>>', keys);

  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha256', 'KpiiPykYOaJL/gVwKoMU1s5mhoBfAqOEzTJ/YYyKr5I=');
  console.log('req.body log >>>>>>>', req.body)
  hmac.write(req.body);
  hmac.end();
  const computedKey = hmac.read().toString('base64');
  console.log('computedKey log >>>>>>>', computedKey);
  if (!keys.includes(computedKey)) {
    console.log('webhook signature is not valid.');
    throw new Error('webhook authentication failed.');
  }
};

router.post('/', bustHeaders, xmlparser(xmlOptions), async (req, res, next) => {
  try {
    if (req.app.isXml) {
      res.setHeader('Content-Type', 'application/xml');
    }

    // validate webhook
    console.log('verifyWebhook called .....');
 //   await verifyWebhook(req);
    console.log('verifyWebhook end .....');

    const xmlParsedObj = builder.buildObject(req.body);
    const s3put = await s3.putObject({
      Bucket: 'docusign-temp',
      Key: `${uuid.v4()}.xml`,
      Body: xmlParsedObj,
      ContentType: 'application/xml'
    }).promise()
    res.status(200).send();
  }catch ( e ) {
    res.send(e);
  }
});

module.exports = router;
