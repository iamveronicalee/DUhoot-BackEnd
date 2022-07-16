import "reflect-metadata";
import "dotenv/config";
import express from "express";
import path from "path";
import cors from "cors";
import http from "http";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { buildSchema } from "type-graphql";
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var indexRouter = require("../routes/index");
var usersRouter = require("../routes/users");
var authRouter = require("../routes/auth");

import { UserResolver } from "./resolvers/UserResolver";
import { createConnection } from "typeorm";
import { AppDataSource } from "./data-source";
import { QuizResolver } from "./resolvers/QuizResolver";

var app = express();

const httpServer = http.createServer(app);

(async () => {
  var corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  };
  app.use(cors(corsOptions));

  AppDataSource.initialize()
    .then(() => {
      // here you can start to work with your database
    })
    .catch((error) => console.log(error));

  app.use(cookieParser());

  // view engine setup
  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "jade");
  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use(express.static(path.join(__dirname, "public")));

  app.get("/", (_req, res) => res.send("hello"));
  app.use("/", indexRouter);
  app.use("/users", usersRouter);
  app.use("/auth", authRouter);

  await createConnection();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, QuizResolver],
    }),
    context: ({ req, res }) => ({ req, res }),
    csrfPrevention: true,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: corsOptions});

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 9000 }, resolve)
  );
  console.log(
    `🚀 Server ready at http://localhost:9000${apolloServer.graphqlPath}`
  );
})();

module.exports = app;
