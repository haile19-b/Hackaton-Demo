import { MongoClient } from "mongodb";
import { env } from "../env";

const client = new MongoClient(env.DATABASE_URL!);
const db = client.db("rag-prep");

export const data = db.collection("Data");