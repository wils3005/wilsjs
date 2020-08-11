// import "./webSocketServer";
import * as z from "zod";
import express, { RequestHandler } from "express";
import User from "./models/user";
import logger from "./logger";
import middleware from "./middleware";
import passport from "passport";

const port = z.number().parse(Number(process.env.PORT));
const app = express();

const zRequestHandler = z.function(
  z.tuple([z.unknown(), z.unknown(), z.function()]),
  z.void()
);

const handleAuthentication: RequestHandler = zRequestHandler.parse(
  passport.authenticate("local", {
    successRedirect: "/success",
    failWithError: true,
    failureRedirect: "/failure",
  })
);

app.use(middleware.before);

app.get("/healthz", (_req, res, next) => {
  res.sendStatus(204);
  next();
});

app.post("/login", handleAuthentication, (_req, res, next) => {
  res.redirect("/users");
  next();
});

app.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/");
  next();
});

app.get("/users", async (_req, res, next) => {
  const users = await User.query();
  res.json(users);
  next();
});

app.use(middleware.after);

app.listen(port, () => {
  logger.info(`Listening at http://localhost:${port}`);
});
