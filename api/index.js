const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const router = express.Router();
require("dotenv").config();
const uriDb = process.env.DB_HOST;

router.get("/tasks", async (req, res, next) => {
  const client = await new MongoClient(uriDb, {
    useUnifiedTopology: true,
  }).connect();
  try {
    const results = await client.db().collection("todos").find().toArray();
    res.json({
      status: "success",
      code: 200,
      data: {
        tasks: results,
      },
    });
  } catch (e) {
    console.error(e);
    next(e);
  } finally {
    await client.close();
  }
});

router.get("/tasks/:id", async (req, res, next) => {
  const { id } = req.params;
  const client = await new MongoClient(uriDb, {
    useUnifiedTopology: true,
  }).connect();
  try {
    const objectId = new ObjectId(id);
    const [result] = await client
      .db()
      .collection("todos")
      .find({ _id: objectId })
      .toArray();
    res.json({
      status: "success",
      code: 200,
      data: { task: result },
    });
  } catch (e) {
    console.error(e);
    next(e);
  } finally {
    await client.close();
  }
});

router.post("/tasks", async (req, res, next) => {
  const { title, text } = req.body;
  const client = await new MongoClient(uriDb, {
    useUnifiedTopology: true,
  }).connect();
  try {
    const result = await client
      .db()
      .collection("todos")
      .insertOne({ title, text, isDone: false });

    res.status(201).json({
      status: "success",
      code: 201,
      data: { task: result },
    });
  } catch (e) {
    console.error(e);
    next(e);
  } finally {
    await client.close();
  }
});

router.put("/tasks/:id", async (req, res, next) => {
  const { id } = req.params;
  const { title, text } = req.body;
  const client = await new MongoClient(uriDb, {
    useUnifiedTopology: true,
  }).connect();
  try {
    const objectId = new ObjectId(id);
    const { value: result } = await client
      .db()
      .collection("todos")
      .findOneAndUpdate(
        { _id: objectId },
        { $set: { title, text } },
        { returnDocument: "after" }
      );

    res.json({
      status: "success",
      code: 200,
      data: { task: result },
    });
  } catch (e) {
    console.error(e);
    next(e);
  } finally {
    await client.close();
  }
});

router.patch("/tasks/:id/status", async (req, res, next) => {
  const { id } = req.params;
  const { isDone = false } = req.body;
  const client = await new MongoClient(uriDb, {
    useUnifiedTopology: true,
  }).connect();
  try {
    const objectId = new ObjectId(id);
    const { value: result } = await client
      .db()
      .collection("todos")
      .findOneAndUpdate(
        { _id: objectId },
        { $set: { isDone } },
        { returnDocument: "after" }
      );

    res.json({
      status: "success",
      code: 200,
      data: { task: result },
    });
  } catch (e) {
    console.error(e);
    next(e);
  } finally {
    await client.close();
  }
});

router.delete("/tasks/:id", async (req, res, next) => {
  const { id } = req.params;
  const client = await new MongoClient(uriDb, {
    useUnifiedTopology: true,
  }).connect();
  try {
    const objectId = new ObjectId(id);
    const { value: result } = await client
      .db()
      .collection("todos")
      .findOneAndDelete({ _id: objectId });
    res.json({
      status: "success",
      code: 200,
      data: { task: result },
    });
  } catch (e) {
    console.error(e);
    next(e);
  } finally {
    await client.close();
  }
});

module.exports = router;
