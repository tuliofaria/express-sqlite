"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const faker_1 = require("@faker-js/faker");
// import sqlite from "sqlite3";
const uuid_1 = require("uuid");
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
//const db = new sqlite.Database("./prisma/data.db");
const db = new better_sqlite3_1.default("./prisma/data.db");
db.pragma("journal_mode = WAL");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.get("/", (req, res) => {
    res.send("Express + TypeScript Server");
});
app.get("/trackpoints", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const total = yield prisma.trackPoint.count();
    const trackPoints = yield prisma.trackPoint.findMany({ take: 100 });
    res.send({ total, trackPoints });
}));
app.post("/trackpoints", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.trackPoint.create({
        data: {
            name: faker_1.faker.company.name(),
        },
    });
    res.send({ ok: true });
}));
/*
app.post("/trackpoints-native", async (req, res) => {
  const stmt = db.prepare("insert into TrackPoint values(?, ?, ?);");
  stmt.run([uuid(), faker.company.name(), new Date().getTime()]);
  stmt.finalize();
  res.send({ ok: true });
});
*/
app.post("/trackpoints-better", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const stmt = db.prepare("insert into TrackPoint values(?, ?, ?);");
    stmt.run([(0, uuid_1.v4)(), faker_1.faker.company.name(), new Date().getTime()]);
    // stmt.finalize();
    res.send({ ok: true });
}));
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
