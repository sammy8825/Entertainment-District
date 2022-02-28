const express = require("express");
const path = require("path");
const ejs = require("ejs");
const bodyParser = require("body-parser");
let urlencodedParser = bodyParser.urlencoded({ extended: false });

const app = express();

const port = 8800;

app.use("/images", express.static("images"));
app.use("/css", express.static("css"));

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

app.get("/", (req, res) => {
  res.render("landing", { authenticated: false });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", urlencodedParser, (req, res) => {
  const creds = { email: req.body.email, password: req.body.password };
  const users = { email: "sb25112001@gmail.com", password: "Sammy@2511" };
  console.log(creds);

  if (creds.email === users.email && creds.password === users.password)
    res.render("landing", { authenticated: true });
  else res.send("Opps!!! Wrong credentials");
});

app.listen(port, () => {
  console.log(`Listening to post ${port}`);
});
