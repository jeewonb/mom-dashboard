var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var path = require('path');

var indexRouter = require('./routes/index');
var systemsRouter = require('./routes/systems');
var testAPIRouter = require("./routes/testAPI");

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use("/systems", systemsRouter);
app.use("/testAPI", testAPIRouter);

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
  res.render('error');
});

// app.get('/', (req, res) => {
//   res.send('user list');
// })

// app.get('/users', function (req, res) {
//   // connection.query('SELECT * FROM USERS', function (error, results, fields) {
//   //   if (error) {
//   //       console.log(error);
//   //   }
//   //   console.log(results);
//   // });
//   connection.query('SELECT * from users', function(err, rows, fields) {
//     if (!err) {
//         res.send(JSON.stringify(rows));
//         console.log(rows);
//     } else {
//         console.log('Error while performing Query.');
//     }
// });
// connection.end();
// });

// app.get('/users/add', (req, res) => {
//   const{ id, name, bloodGroup, email, phone_number } = req.query
//   const INSERT_USER_QUERY = `INSERT INTO MEMBERS(id, name, bloodGroup, email, phone_number) VALUES('${id}', '${name}', '${bloodGroup}', '${email}', '${phone_number}')`
//   connection.query(INSERT_USER_QUERY, (err, results) => {
//       if(err) {
//           return res.send(err)
//       } else {
//           return res.send('Successfully Inserted')
//       }
//   })
// })

module.exports = app;