import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../libs/db";

export async function GET(request: Request) {
    try {
        const client = await connectToDatabase();
        const db = client.db('fomofactory');
        const collection = db.collection('prices');
        const query = { }
        const movie = await collection.find(query).toArray();
        return NextResponse.json({ movie });
    } catch (error) {
        console.error("API Error:", error);
    }
}