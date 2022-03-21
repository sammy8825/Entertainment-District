const express = require("express");
const path = require("path");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const axios = require("axios").default;

const urlencodedParser = bodyParser.urlencoded({ extended: false });
const User = require("./js/userSchemaFile");
const app = express();
const port = 8800;

let creds, cred;

app.use("/images", express.static("images"));
app.use("/css", express.static("css"));
app.use("/js", express.static("js"));

// For Bootstrap
app.use(
  "/css",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/jquery/dist"))
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Going to the landing page
app.get("/", (req, res) => {
  res.render("landing", { creds });
});

// Directing to the login page
app.get("/login", (req, res) => {
  res.render("login", { message: "" });
});

// For forgot password section
app.post("/forgot", urlencodedParser, (req, res) => {
  console.log(` The email id is : ${req.body.forgotMail}`);
  res.render("login", { message: "Password reset mail has been sent!!" });
});

// Directing towards the signup Page
app.get("/signUp", (req, res) => {
  res.render("signUp", { message: "" });
});

app.post("/signUp", urlencodedParser, (req, res) => {
  creds = {
    username: req.body.username,
    email: req.body.email,
  };

  if (req.body.password === req.body.confirmPassword) {
    let newUser = new User({
      username: creds.username,
      email: creds.email,
      password: req.body.password,
      loggedIn: true,
    });
    newUser.save((err, result) => {
      if (err) {
        res.render("signup", { message: "User Exists!!!!" });
      } else {
        // console.log(result);
        User.findOneAndUpdate(
          { username: creds.username },
          { loggedIn: true },
          (err, data) => {
            if (err) {
              console.log(err);
            } else {
              cred = {
                username: data.username,
                email: data.email,
              };
              res.render("home", { cred });
            }
          }
        );
      }
    });
  } else {
    res.render("signup", { message: "Passwords do no match...." });
  }
});

// Directing to the home page
app.get("/home", (req, res) => {
  res.render("home", { cred });
});

// Checking the login credentials and redirecting accordingly
app.post("/login", urlencodedParser, (req, res) => {
  creds = { username: req.body.user, password: req.body.password };
  // console.log(creds);

  User.find({ username: creds.username }, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      if (result.length == 0) {
        res.render("login", { message: "No such user found!!!!" });
      } else if (result[0].password === creds.password) {
        User.findOneAndUpdate(
          { username: creds.username },
          { loggedIn: true },
          (err, data) => {
            if (err) {
              console.log(err);
            } else {
              cred = {
                username: data.username,
                email: data.email,
              };
              res.render("home", { cred });
            }
          }
        );
      } else {
        res.render("login", { message: "Wrong Password !! Try Again" });
      }
    }
  });
});

//Directing to the user profile page
app.get("/profile", (req, res) => {
  res.render("profile", { cred });
});

// For Changing the password of the website
app.post("/profile", urlencodedParser, (req, res) => {
  if (req.body.newPass === req.body.confNewPass) {
    User.findOneAndUpdate(
      { username: creds.username },
      { password: req.body.newPass, loggedIn: false },
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.render("login", {
            message: "Your password was changed successfully!!!",
          });
        }
      }
    );
  }
});

// Logging out of the website 
app.get("/logout", (req, res) => {
  User.findOneAndUpdate(
    { username: creds.username },
    { loggedIn: false },
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.render("landing");
      }
    }
  );
});


// Directing to Movie Page
app.get("/movie", (req, res) => {
  let movieData = {
    name: "Title",
    year: "Year",
    rated: "Rated",
    runTime: "Runtime",
    genre: "Genre",
    director: "Director",
    poster: "/images/movies.jpg",
    rating: "0.0",
    plot: "Plot",
  };
  res.render("movie", { cred, movieData, message: "" });
});

app.post("/movie", urlencodedParser, (req, res) => {
  let movieName = req.body.movieName;
  let options = {
    method: "GET",
    url: "https://imdb-data-searching.p.rapidapi.com/om",
    params: { t: movieName },
    headers: {
      "x-rapidapi-host": "imdb-data-searching.p.rapidapi.com",
      "x-rapidapi-key": "29369dc035msha2998b688575b98p18c8fbjsncd0930f90cac",
    },
  };

  axios
    .request(options)
    .then(function (response) {
      if (response.data.Type === "movie") {
        // console.log(response.data);
        let movieData = {
          name: response.data.Title,
          year: response.data.Year,
          rated: response.data.Rated,
          runTime: response.data.Runtime,
          genre: response.data.Genre,
          director: response.data.Director,
          poster: response.data.Poster,
          rating: response.data.imdbRating,
          plot: response.data.Plot,
        };
        res.render("movie", {
          cred,
          movieData,
          message: "",
        });
      } else {
        res.render("movie", {
          cred,
          message: "No such movie found!!!",
        });
      }
    })
    .catch(function (error) {
      console.error(error);
    });
});

// Directing to Series Page
app.get("/series", (req, res) => {
  let seriesData = {
    name: "Title",
    year: "Year",
    rated: "Rated",
    runTime: "Runtime",
    genre: "Genre",
    director: "Director",
    poster: "/images/series.jpg",
    rating: "0.0",
    plot: "Plot",
  };
  res.render("series", { cred, seriesData, message: "" });
});

app.post("/series", urlencodedParser, (req, res) => {
  let seriesName = req.body.seriesName;
  let options = {
    method: "GET",
    url: "https://imdb-data-searching.p.rapidapi.com/om",
    params: { t: seriesName },
    headers: {
      "x-rapidapi-host": "imdb-data-searching.p.rapidapi.com",
      "x-rapidapi-key": "29369dc035msha2998b688575b98p18c8fbjsncd0930f90cac",
    },
  };

  axios
    .request(options)
    .then(function (response) {
      if (response.data.Type === "series") {
        // console.log(response.data);
        let seriesData = {
          name: response.data.Title,
          year: response.data.Year,
          rated: response.data.Rated,
          runTime: response.data.Runtime,
          genre: response.data.Genre,
          director: response.data.Director,
          poster: response.data.Poster,
          rating: response.data.imdbRating,
          plot: response.data.Plot,
        };
        res.render("series", {
          cred,
          seriesData,
          message: "",
        });
      } else {
        res.render("series", {
          cred,
          message: "No such series found!!!",
        });
      }
    })
    .catch(function (error) {
      console.error(error);
    });
});

// Connecting to the database
mongoose.connect(
  "mongodb://localhost/mydb",
  () => {
    console.log("Connected!!!");
  },
  (e) => console.log(e)
);

// Starting a server
app.listen(port, () => {
  console.log(`Listening to post ${port}`);
});
