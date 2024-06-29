const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const JWTSecret = "ldjfnnd2i40845ut8n583nvnmlndfln";

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function auth(req, res, next) {
  const authToken = req.headers["authorization"];

  if (authToken != undefined) {
    const bearer = authToken.split(" ");

    var token = bearer[1];

    jwt.verify(token, JWTSecret, (err, data) => {
      if (err) {
        res.status(401);
        res.json({ err: "Invalid token" });
      } else {
        req.token = token;
        req.loggedUser = { id: data.id, email: data.email };
        next();
      }
    });
  } else {
    res.status(401);
    res.json({ err: "Invalid token" });
    return;
  }

  next();
}

// false databse
var DB = {
  games: [
    {
      id: 23,
      title: "Call of Duty",
      year: 2019,
      price: 60,
    },
    {
      id: 65,
      title: "Sea of Thieves",
      year: 2018,
      price: 40,
    },
    {
      id: 2,
      title: "Minecraft",
      year: 2012,
      price: 20,
    },
  ],
  users: [
    {
      id: 1,
      name: "Lucas",
      email: "lucas@email.com",
      password: "123",
    },
    {
      id: 2,
      name: "João",
      email: "joao@email.com",
      password: "456",
    },
  ],
};

app.get("/games", auth, (req, res) => {
  res.statusCode = 200;
  res.json(DB.games);
});

app.get("/game/:id", auth, (req, res) => {
  if (isNaN(req.params.id)) {
    res.statusCode = 400;
  } else {
    var id = parseInt(req.params.id);
    var game = DB.games.find((game) => game.id == id);
    if (game != undefined) {
      res.statusCode = 200;
      res.json(game);
    } else {
      res.statusCode = 404;
      res.send("Game not found");
    }
  }
});

app.post("/game", auth, (req, res) => {
  var { title, price, year } = req.body;

  DB.games.push({
    id: 232,
    title,
    price,
    year,
  });

  res.statusCode = 200;
  res.sendStatus(201);
});

app.delete("/game/:id", auth, (req, res) => {
  if (isNaN(req.params.id)) {
    res.statusCode = 400;
  } else {
    var id = parseInt(req.params.id);
    var gameIndex = DB.games.findIndex((game) => game.id == id);
    if (gameIndex == -1) {
      res.statusCode = 404;
      res.send("Game not found");
    } else {
      DB.games.splice(gameIndex, 1);
      res.statusCode = 200;
      res.sendStatus(200);
    }
  }
});

app.put("/game/:id", auth, (req, res) => {
  if (isNaN(req.params.id)) {
    res.statusCode = 400;
    res.send("Invalid ID");
  } else {
    var id = parseInt(req.params.id);
    var game = DB.games.find((game) => game.id == id);

    if (game != undefined) {
      var { title, price, year } = req.body;

      if (title != undefined) {
        game.title = title;
      }

      if (price != undefined) {
        game.price = price;
      }

      if (year != undefined) {
        game.year = year;
      }

      res.statusCode = 200;
      res.sendStatus(200);
    } else {
      res.statusCode = 404;
      res.send("Game not found");
    }
  }
});

app.post("/auth", (req, res) => {
  var { email, password } = req.body;

  if (email != undefined) {
    var user = DB.users.find((user) => user.email == email);
    if (user != undefined) {
      if (user.password == password) {
        res.statusCode = 200;
        jwt.sign(
          { id: user.id, email: user.email },
          JWTSecret,
          { expiresIn: "48h" },
          (err, token) => {
            if (err) {
              res.statusCode = 500;
              res.json({ err: "Failed to authenticate" });
            } else {
              res.statusCode = 200;
              res.json({ token: token });
            }
          }
        );
      } else {
        res.statusCode = 401;
        res.send("Invalid password");
      }
    } else {
      res.statusCode = 404;
      res.send("User not found");
    }
  } else {
    res.statusCode = 400;
    res.send("Invalid email");
  }
});

app.listen(45678, () => {
  console.log("Server running on port 45678");
});
