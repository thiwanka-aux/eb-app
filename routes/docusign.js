const express = require('express');
const AWS = require('aws-sdk');
// Set the region
AWS.config.update({region: 'eu-west-2'});

// Create S3 service object
const s3 = new AWS.S3({apiVersion: '2006-03-01'});
const router = express.Router();
/* GET users listing. */
router.post('/', async (req, res, next) => {
  try {
    console.log('req log >>>>>>>', JSON.stringify(req.body));
    res.send('respond with a resource');
  }catch ( e ) {
    res.send(e);
  }

});

module.exports = router;
