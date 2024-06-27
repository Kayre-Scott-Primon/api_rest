const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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
};

app.get("/games", (req, res) => {
  res.statusCode = 200;
  res.json(DB.games);
});

app.get("/game/:id", (req, res) => {
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

app.post("/game", (req, res) => {
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

app.delete("/game/:id", (req, res) => {
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

app.put("/game/:id", (req, res) => {
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

app.listen(45678, () => {
  console.log("Server running on port 45678");
});
