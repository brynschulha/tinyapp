const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')

const generateRandomString = function () {
  let possibleCharacters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "x", "w", "y", "z", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  let randomString = [];
  let count = 1;
  while (count < 7) {
    randomString.push(possibleCharacters[(Math.floor(Math.random() * 36))]);
    count += 1;
  }
  let finalString = randomString.join("");
  return finalString;
};

app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());

app.set("view engine", "ejs");

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

const getUserByEmail = function (usersdb, email) {
  for (let user in usersdb) {
    if (usersdb[user]["email"] === email) {
      return (usersdb[user]);
    } 
  }
  return null;
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/register", (req, res) => { 
  const userId = req.cookies.user_id;
  const user = users[userId];
  const templateVars = {user};
  res.render("register", templateVars);     
});

app.get("/login", (req, res) => { 
  const userId = req.cookies.user_id;
  const user = users[userId];
  const templateVars = {user};
  res.render("login", templateVars);     
});

app.get("/urls", (req, res) => {
  const userId = req.cookies.user_id;
  if (!userId) {
    res.redirect("/login");
    return;
  }
  const user = users[userId];
  const templateVars = { urls: urlDatabase, user};  
  res.render("urls_index", templateVars);     
});

app.get("/urls/new", (req, res) => {
  const userId = req.cookies.user_id;
  if (!userId) {
    res.redirect("/login");
    return;
  }
  const templateVars = { user: users[req.cookies.user_id] };
  res.render("urls_new", templateVars);   
});

app.post("/urls", (req, res) => {
  let randomString = generateRandomString();
  urlDatabase[randomString] = req.body.longURL;
  res.redirect(`/urls/${randomString}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  let shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect(`/urls`);
});

app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  urlDatabase[id] = req.body.longURL;
  res.redirect(`/urls`);
});

app.post("/login", (req, res) => {
  console.log(req.body);
  const user = getUserByEmail(users, req.body.email);
  if (!user) {
    res.status(403).send(`Invalid email. Error code ${res.statusCode} `);
    return;
  }  
  if (user.password !== req.body.password) {
    res.status(403).send(`Wrong Password. Error code ${res.statusCode} `);
    return;
  }
  //user is good, set cookie and redirect
  res.cookie("user_id", user.id);
  res.redirect(`/urls`);
});

app.post("/logout", (req, res) => {
  //clears existing cookie
  res.clearCookie("user_id", req.cookies.user_id);
  res.redirect(`/urls`);
});

app.post("/register", (req, res) => {
  console.log(req.body);
  const user = getUserByEmail(users, req.body.email);
  console.log(req.body.email);
  if ((!req.body.email) || (!req.body.password)) {
    res.status(400).send(`Invalid email or password. Error code ${res.statusCode} `);
  } 
  if (user !== null && user.email === req.body.email) {
    res.status(400).send(`Email already exits. Error code ${res.statusCode}`);
  } else {
    let randomString = generateRandomString();
    users[randomString] = {"id": randomString, "email": req.body.email, "password": req.body.password };
    res.cookie("user_id", randomString);
    res.redirect(`/urls`);
  }
});

app.get("/urls/:shortURL", (req, res) => {
  const userId = req.cookies.user_id;
  if (!userId) {
    res.redirect("/login");
    return;
  }
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: users[req.cookies.user_id] };  
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});