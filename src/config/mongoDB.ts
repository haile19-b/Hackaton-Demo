import { MongoClient } from "mongodb";
import { env } from "../env";

const client = new MongoClient(env.DATABASE_URL!);
const db = client.db("hackathon");

export const embedded = db.collection("Chunk");