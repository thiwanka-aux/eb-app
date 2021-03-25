const createError = require('http-errors');
const express = require('express');

const indexRouter = require('./routes/index');
const docusignRouter = require('./routes/docusign');

const app = express();
console.log('start urlencoded =============================================');
app.use(express.urlencoded({limit: '50mb', extended: false }));
console.log('end urlencoded =============================================');
app.use('/',express.json(), indexRouter);

app.use('/docusign', (req, _, next)=>{
  console.log('incoming request')

console.log(req.headers);
  console.log('========================================================================');
  console.log(req.body);
  next()}, express.raw({ type: 'text/xml',limit: '50mb'}), docusignRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err);
});

module.exports = app;
