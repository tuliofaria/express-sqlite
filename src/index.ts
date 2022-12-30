import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
// import sqlite from "sqlite3";
import { v4 as uuid } from "uuid";
import Database from "better-sqlite3";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

//const db = new sqlite.Database("./prisma/data.db");
const db = new Database("./prisma/data.db");
db.pragma("journal_mode = WAL");

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.get("/trackpoints", async (req, res) => {
  const total = await prisma.trackPoint.count();
  const trackPoints = await prisma.trackPoint.findMany({ take: 100 });
  res.send({ total, trackPoints });
});

app.post("/trackpoints", async (req, res) => {
  await prisma.trackPoint.create({
    data: {
      name: faker.company.name(),
    },
  });
  res.send({ ok: true });
});
/*
app.post("/trackpoints-native", async (req, res) => {
  const stmt = db.prepare("insert into TrackPoint values(?, ?, ?);");
  stmt.run([uuid(), faker.company.name(), new Date().getTime()]);
  stmt.finalize();
  res.send({ ok: true });
});
*/

app.post("/trackpoints-better", async (req, res) => {
  const stmt = db.prepare("insert into TrackPoint values(?, ?, ?);");
  stmt.run([uuid(), faker.company.name(), new Date().getTime()]);
  // stmt.finalize();
  res.send({ ok: true });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
