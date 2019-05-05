"use strict";
const Router = require("express").Router;
const config = require("config.json");
const jwt = require("jsonwebtoken");
const router = Router();

var knex =
  process.env.NODE_ENV === "production"
    ? require("knex")({
        client: "mysql",
        connection: {
          socketPath: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`,
          user: process.env.SQL_USER,
          password: process.env.SQL_PASSWORD,
          database: process.env.SQL_DATABASE
        }
      })
    : require("knex")({
        client: "mysql",
        connection: {
          user: "a",
          password: "123456",
          database: "cs39"
        }
      });

router.post("/authenticate", (req, res, next) => {
  const { username, password } = req.body;
  knex
    .select("password", "level")
    .from("student")
    .where("studentid", username)
    .then(results => {
      if (results.length !== 0 && results[0].password === password) {
        const token = jwt.sign(
          { id: username, level: results[0].level },
          config.secret
        );
        res.json(token);
      } else {
        throw { code: "WRONG_INFO" };
      }
    })
    .catch(e => {
      next(e);
    });
});

router.post("/register", (req, res, next) => {
  const { username, password, level } = req.body;
  knex("student")
    .insert({ studentid: username, password, level })
    .then(() => res.send({}))
    .catch(e => {
      next(e);
    });
});

router.get("/courses/:id", (req, res, next) => {
  const { id } = req.params;
  knex
    .select(
      "course.coursename",
      "course.courseid",
      "course.semester",
      "areaofstudy.aosname"
    )
    .from("course")
    .leftJoin("areaofstudy", "course.aosid", "areaofstudy.aosid")
    .whereIn("course.courseid", function() {
      this.select("courseid")
        .from("studentcourses")
        .where("studentid", id);
    })
    .then(results => {
      if (results) {
        res.send(results);
      } else {
        throw { code: "WRONG_INFO" };
      }
    })
    .catch(e => {
      next(e);
    });
});

router.get("/info/:code", (req, res, next) => {
  const { code } = req.params;
  knex
    .select(
      "course.coursename",
      "course.courseid",
      "course.semester",
      "areaofstudy.aosname",
      knex.raw(
        "(select count(*) from studentcourses where courseid=course.courseid) as percentage"
      )
    )
    .from("course")
    .leftJoin("areaofstudy", "course.aosid", "areaofstudy.aosid")
    .whereIn("course.courseid", code.split(","))
    .orderBy("percentage", "desc")
    .then(results => {
      if (results) {
        res.send(results);
      } else {
        throw { code: "WRONG_INFO" };
      }
    })
    .catch(e => {
      next(e);
    });
});

router.get("/areainfo/:area", (req, res, next) => {
  const { area } = req.params;
  knex
    .select("course.courseid")
    .from("course")
    .limit(5)
    .leftJoin("areaofstudy", "course.aosid", "areaofstudy.aosid")
    .where("areaofstudy.aosid", area)
    .then(results => {
      if (results) {
        res.send(results);
      } else {
        throw { code: "WRONG_INFO" };
      }
    })
    .catch(e => {
      next(e);
    });
});

module.exports = router;

// ./cloud_sql_proxy -instances="courserecommender:australia-southeast1:cs392"=tcp:3306
