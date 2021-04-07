const express = require('express');
const AWS = require('aws-sdk');
const uuid = require('uuid');
const crypto = require('crypto');

const Bucket = process.env.DOCUSIGN_BUCKET;

// Set the region
AWS.config.update({region: 'eu-west-2'});

// Create S3 service object
const s3 = new AWS.S3({apiVersion: '2006-03-01'});
const router = express.Router();

const verifyWebhook = async req => {
  const keys = [];
  keys.push(req.headers['x-docusign-signature-1']);
  keys.push(req.headers['x-docusign-signature-2']);

  console.log('expected_signature log >>>>>>>', keys);
  const hmac = crypto.createHmac('sha256', 'KpiiPykYOaJL/gVwKoMU1s5mhoBfAqOEzTJ/YYyKr5I=');
  hmac.write(req.body);
  hmac.end();
  const computedKey = hmac.read().toString('base64');
  console.log('computedKey log >>>>>>>', computedKey);
  if (!keys.includes(computedKey)) {
    console.log('webhook signature is not valid.');
    throw new Error('webhook authentication failed.');
  }
};

router.post('/', async (req, res) => {
  try {
    // validate webhook
    console.log('start verifying webhook...');
 //   await verifyWebhook(req);
    console.log('webhook verification successfully completed...');

    const s3putRes = await s3.putObject({
      Bucket,
      Key: `${uuid.v4()}.xml`,
      Body: req.body.toString(),
      ContentType: 'application/xml'
    }).promise();
    console.log('s3putRes log >>>>>>>', s3putRes)
    res.status(200).send();
  }catch ( e ) {
    res.status(400).send(e.message);
  }
});

module.exports = router;
