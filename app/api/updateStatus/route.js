import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const uri = `mongodb+srv://ayushgudu004:6LzvwmkVwbLa5WJR@interndata.yg4nqdi.mongodb.net/?retryWrites=true&w=majority&appName=internData`;
    const client = new MongoClient(uri);
    
    await client.connect();
    const db = client.db('internData');
    const collection = db.collection('internData');

    // 1. Find all documents
    const allDocuments = await collection.find({}).toArray();

    // Return early if no documents found
    if (allDocuments.length === 0) {
      await client.close();
      return NextResponse.json({
        success: true,
        message: 'No documents found to update',
        modifiedCount: 0,
        documents: []
      });
    }

    // 2. Prepare bulk operations only for documents that don't have status field
    const bulkOps = allDocuments
      .filter(doc => doc.status === undefined)
      .map(doc => ({
        updateOne: {
          filter: { _id: doc._id },
          update: { $set: { status: 1 } }
        }
      }));

    // Only perform bulk write if there are operations to perform
    let updateResult = { modifiedCount: 0 };
    if (bulkOps.length > 0) {
      updateResult = await collection.bulkWrite(bulkOps);
    }

    // 3. Get the updated documents
    const updatedDocuments = await collection.find({}).toArray();

    await client.close();

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${updateResult.modifiedCount} documents`,
      modifiedCount: updateResult.modifiedCount,
      documents: updatedDocuments
    });

  } catch (error) {
    console.error('Error updating documents:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update documents',
        error: error.message 
      },
      { status: 500 }
    );
  }
}