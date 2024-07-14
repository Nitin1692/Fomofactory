import { NextResponse } from "next/server";
import { connectToDatabase } from "@/libs/db";
import axios from "axios";
import { Timestamp, ObjectId } from "mongodb";

const api_key = 'cq9na4pr01qlu7f360rgcq9na4pr01qlu7f360s0';

export async function POST(request: Request) {
  try {
    const { _id, symbol } = await request.json();
    const client = await connectToDatabase();
    const db = client.db('fomofactory');
    const collection = db.collection('prices');
    const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${api_key}`);
    console.log(response.data);
    
    const timestamp = new Timestamp({ t: Math.floor(Date.now() / 1000), i: 1 });
    await collection.updateOne(
      { _id: ObjectId.createFromHexString(_id) },
      { $set: {  symbol: symbol, price: response.data.c, timestamp: timestamp } }
    );
    console.log(`Updated document with _id ${_id}`);
    return NextResponse.json({ message: "Inserted Successfully" });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({message: "Failed to insert data"});
  }
}
