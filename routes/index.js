const express = require('express');
const AWS = require('aws-sdk');
// Set the region
AWS.config.update({region: 'eu-west-2'});

// Create S3 service object
const s3 = new AWS.S3({apiVersion: '2006-03-01'});
const router = express.Router();
const bucket = process.env.DOCUSIGN_BUCKET;

/* GET home page. */
router.get('/',async (req, res, next) => {
  try {
    res.json({title:'working', message: 'response from docusign testing server', bucket });
  }catch ( e ) {
    res.json({error: e});
  }
});

module.exports = router;
