const express = require('express');
const AWS = require('aws-sdk');
// Set the region
AWS.config.update({region: 'REGION'});

// Create S3 service object
const s3 = new AWS.S3({apiVersion: '2006-03-01'});
const router = express.Router();


/* GET home page. */
router.get('/',async (req, res, next) => {
  try {
    const data  = await s3.listBuckets().promise();
    res.json({title:'working', message: 'response from docusign testing server', data});
  }catch ( e ) {
    res.json({error: e});
  }
});

module.exports = router;
