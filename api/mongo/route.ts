import { NextResponse } from "next/server";
import { Timestamp } from "mongodb";
import { connectToDatabase } from "@/libs/db";
import Price from "@/models/price";
import axios from "axios";

const api_key = 'cq9na4pr01qlu7f360rgcq9na4pr01qlu7f360s0'
const symbols = ['AAPL', 'GOOG', 'TSLA', 'GRYRF', 'THO', 'SGSOY', 'MSMGF', 'SWVL', 'UTAWF', 'BEPC', 'PAHGF', 'TNSMF', 'OCTX', 'QTTB', 'APELF', 'PDEC', 'WTFCP', 'EMGE', 'SMCDF', 'DCCPF'];


export async function GET(request: Request) {
  try {
    const client = await connectToDatabase();
    const db = client.db('fomofactory');
    const collection = db.collection('prices');

    const fetchData = async () => {
      for (const symbol of symbols) {
        const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${api_key}`);
        const { c: price } = response.data;
        const timestamp = new Timestamp({ t: Math.floor(Date.now() / 1000), i: 1 });

        const priceData = new Price(symbol, price, timestamp);
        await collection.insertOne(priceData);
      }
    };
    fetchData();
    const intervalId = setInterval(fetchData, 60000);
  } catch (error) {
    console.error("API Error:", error);
  }

  return NextResponse.json({ message: "Inserted Successfully" });
}
