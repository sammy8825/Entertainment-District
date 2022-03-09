const express = require("express");
const path = require("path");
const ejs = require("ejs");
const bodyParser = require("body-parser");
let urlencodedParser = bodyParser.urlencoded({ extended: false });

const app = express();

const port = 8800;

let creds,
  users = [];

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
  res.render("login");
});

// Directing towards the signup Page
app.get("/signUp", (req, res) => {
  res.render("signUp");
});

app.post("/signUp", urlencodedParser, (req, res) => {
  creds = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    loggedIn: true,
  };

  let newUser = true;

  for (let i = 0; i < users.length; i++) {
    if (users[i].email === creds.email) {
      newUser = false;
      break;
    }
  }
  if (!newUser && !creds.loggedIn) {
    res.send("User Exists...");
  } else if (creds.password === creds.confirmPassword) {
    users.push({
      email: creds.email,
      password: creds.password,
      loggedIn: true,
    });
    console.log(users);
    res.render("home");
  } else {
    res.send("Passwords do no match....");
  }
});

// Directing to the home page
app.get("/home", (req, res) => {
  res.render("home", { creds });
});

// Checking the login credentials and redirecting accordingly
app.post("/login", urlencodedParser, (req, res) => {
  creds = { email: req.body.email, password: req.body.password };
  // console.log(creds);
  let flag = false;
  for (let i = 0; i < users.length; i++) {
    if (
      creds.email === users[i].email &&
      creds.password === users[i].password
    ) {
      creds.loggedIn = true;
      res.render("home", { creds });
      flag = true;
    } else flag = false;
  }
  if (!flag) res.send("Opps!!! Wrong credentials");
});

//Directing to the user profile page
app.get("/profile", (req, res) => {
  res.render("profile", { creds });
});
app.listen(port, () => {
  console.log(`Listening to post ${port}`);
});
