const mysql = require("mysql");
const express = require("express");
var app = express();
const bodyparser = require("body-parser");

app.use(bodyparser.json);
//Establishing connection
var mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "User",
  multipleStatements: true,
});

//connecting to database

mysqlConnection.connect((err) => {
  if (!err) {
    console.log("db connection connected");
  } else {
    console.log(
      "db connection failed \n Error:" + JSON.stringify(err, undefined, 2)
    );
  }
});

//start the server
app.listen(3000, () =>
  console.log("Express server is running at port no: 3000")
);

//to fetch the All data from database
app.get("/users", (req, res) => {
  mysqlConnection.query("SELECT * FROM User", (err, rows, fields) => {
    if (!err) {
      res.send(rows);
    } else {
      res.send(err);
    }
  });
});

//get data with from given id
app.get("/users/:id", (req, res) => {
  mysqlConnection.query(
    "SELECT * FROM Users WHERE Eid=?",
    [req.params.id],
    (err, rows, fields) => {
      if (!err) {
        res.send(rows);
      } else {
        res.send(err);
      }
    }
  );
});

//inserting data
app.post("/users/:id", (req, res) => {
  let emp = req.body;
  var sql =
    "SET @Userid=?;SET @UserName=?;SET @Salary=?;\
    CALL UsersAddOrEdit(@Userid,@UserName,@salary);";
  mysqlConnection.query(
    sql,
    [emp.Userid, emp.UserName, emp.Salary],
    (err, rows, fields) => {
      if (!err) {
        res.send(rows);
      } else {
        res.send(err);
      }
    }
  );
});

//update
app.put("/users/:id", (req, res) => {
  let emp = req.body;
  var sql =
    "SET @Userid=?;SET @UserName=?;SET @Salry=?;\
    CALL UserAddOrEdit(@Userid,@UserName,@salary);";
  mysqlConnection.query(
    sql,
    [emp.Eid, emp.Name, emp.Salary],
    (err, rows, fields) => {
      if (!err) {
        res.send("updated");
      } else {
        res.send(err);
      }
    }
  );
});


//delete data with from given id
app.delete("/users/:id", (req, res) => {
  mysqlConnection.query(
    "DELETE User WHERE Userid=?",
    [req.params.id],
    (err, rows, fields) => {
      if (!err) {
        res.send("Deleted Successfully");
      } else {
        res.send(err);
      }
    }
  );
});

