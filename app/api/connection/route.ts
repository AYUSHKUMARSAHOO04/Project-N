import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET() {
    try{
        const uri = `mongodb+srv://ayushgudu004:6LzvwmkVwbLa5WJR@interndata.yg4nqdi.mongodb.net/?retryWrites=true&w=majority&appName=internData`;
        const client =new MongoClient(uri);
        await client.connect();
    }catch(error){
        console.error('Error connecting to MongoDB:', error);
        return NextResponse.json({ success: false, message: 'Failed to connect to database' }, { status: 500 });
    }
    return NextResponse.json({ success: true, message: 'Connected to MongoDB successfully' });

}