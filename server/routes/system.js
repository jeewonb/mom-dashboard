var express = require("express");
var router = express.Router();
var _ = require("underscore");
var config = require("../serverconfig.js");
const mysql = require("mysql");

const connection = mysql.createConnection(config);

connection.connect(function(err) {
  if (err) throw err;
});

/* GET systemss listing. */
router.get("/", function(req, res, next) {
  connection.query("SELECT * FROM systems", function(err, results, fields) {
    if (!err) {
      res.send(JSON.stringify(results));
    } else {
      console.log("Error while performing Query.");
    }
  });
});

router.post("/edit", function(req, res, next) {
  // execute the UPDATE statement
  connection.query(
    "UPDATE systems SET NAME = ?, DESCRIPTION = ? WHERE ID = ?",
    [req.body.NAME, req.body.DESCRIPTION, req.body.ID],
    function(error, results, fields) {
      if (!error) {
        res.send(JSON.stringify(results));
        console.log("Rows affected:", results.affectedRows);
      } else {
        console.log(error);
      }
    }
  );
});

router.post("/add", function(req, res, next) {
  connection.query(
    "INSERT INTO systems (ID, NAME, DESCRIPTION) VALUES (?, ?, ?)",
    [req.body.ID, req.body.NAME, req.body.DESCRIPTION],
    function(err, results, fields) {
      if (!err) {
        res.send(JSON.stringify(results));
        console.log(results);
      } else {
        console.log(err);
      }
    }
  );
});

router.post("/delete", function(req, res, next) {
  connection.query("DELETE FROM systems WHERE ID = ?", req.body.ID, function(
    error,
    results,
    fields
  ) {
    if (!error) {
      res.send(JSON.stringify(results));
      console.log(results);
    } else {
      console.log(error);
    }
  });
});

module.exports = router;
