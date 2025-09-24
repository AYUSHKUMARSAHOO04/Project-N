import { MongoClient, Db, Collection, InsertOneResult } from 'mongodb';
import { NextResponse, NextRequest } from 'next/server';
import cloudinary, { UploadApiResponse } from 'cloudinary';

// Configure Cloudinary
cloudinary.v2.config({
    cloud_name: 'dnfq7ty1x',
    api_key: '397512375918657',
    api_secret: 'Ai66Wdrm39vGnT4rv_vXttAxeHU'
});

interface TeamMember {
    id: string;
    name: string | null;
    role: string | null;
    category: string | null;
    education: string | null;
    avatar: string;
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const name = formData.get('name') as string | null;
        const role = formData.get('role') as string | null;
        const category = formData.get('category') as string | null;
        const education = formData.get('education') as string | null;
        const avatarFile = formData.get('avatar') as File | null;

        if (!avatarFile || !role) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Connect to MongoDB first to check for duplicates
        const uri = `mongodb+srv://ayushgudu004:6LzvwmkVwbLa5WJR@interndata.yg4nqdi.mongodb.net/?retryWrites=true&w=majority&appName=internData`;
        const client = new MongoClient(uri);
        await client.connect();

        const db: Db = client.db('internData');
        const collection: Collection<TeamMember> = db.collection('internData');

        

        // Check for duplicate entry based on all fields (excluding avatar)
        const duplicateQuery = {
            name: name,
            role: role,
            category: category,
            education: education
        };

        const existingMember = await collection.findOne(duplicateQuery);

        if (existingMember) {
            await client.close();
            return NextResponse.json(
                { success: false, message: 'You have already entered' },
                { status: 409 } // 409 Conflict status code for duplicate
            );
        }

        // Upload image to Cloudinary only if no duplicate found
        const avatarBuffer = await avatarFile.arrayBuffer();
        const avatarUpload: UploadApiResponse = await new Promise((resolve, reject) => {
            cloudinary.v2.uploader.upload_stream(
                { resource_type: 'auto' },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result as UploadApiResponse);
                }
            ).end(Buffer.from(avatarBuffer));
        });

        // Create new team member object
        const newMember: TeamMember = {
            id: (formData.get('id') as string) || role.toLowerCase().replace(/\s+/g, '-'),
            name,
            role,
            category,
            education,
            avatar: avatarUpload.secure_url
        };

        // Insert new member
        const result: InsertOneResult<TeamMember> = await collection.insertOne(newMember);

        await client.close();

        return NextResponse.json({
            success: true,
            message: 'Team member added successfully',
            data: {
                insertedId: result.insertedId,
                ...newMember
            }
        });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to add team member' },
            { status: 500 }
        );
    }
}

export async function GET() {
  try {
    const uri = `mongodb+srv://ayushgudu004:6LzvwmkVwbLa5WJR@interndata.yg4nqdi.mongodb.net/?retryWrites=true&w=majority&appName=internData`;
    const client = new MongoClient(uri);
    await client.connect();

    const db: Db = client.db("internData");
    const collection: Collection<TeamMember> = db.collection("internData");
 

    const teamMembers = await collection
      .aggregate([
        {
          $addFields: {
            sortPriority: {
              $switch: {
                branches: [
                  { case: { $eq: ["$name", "Nikhil Sanka"] }, then: 1 },
                  {case:{$eq: ["$name", "Vishal Kavali "]}, then: 2},
                  { case: { $eq: ["$name", "Kavali Deekshith"] }, then: 3 },
                  { case: { $eq: ["$name", "Ayush Kumar Sahoo"] }, then: 4}, // Removed trailing space
                  // { case: { $eq: ["$name", "Ashwani Senapati"] }, then: 4 },
                  { case: { $eq: ["$name", "Sumedha Musunuri"] }, then: 5 }, 
                  {case:{$eq: ["$name", "Saumik Chakraborty"]}, then: 6},
                  // {case: {$eq: ["$name", "Sanjana Chaudhary"]}, then: 7},
                  {case:{$eq: ["$name", "Deepti Manjari Nayak"]}, then: 7},
                  {case:{$eq: ["$name", "Lochan Kumar Chalamalla"]}, then: 8},
                  

                ],
                default: 99,
              },
            },
            originalOrder: "$_id"
          },
        },
        { $sort: { sortPriority: 1, originalOrder: 1 } },
        { $project: { sortPriority: 0, originalOrder: 0 } }
      ])
      .toArray();
      // console.log(teamMembers);

    await client.close();

    return NextResponse.json({
      success: true,
      data: teamMembers,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch team members" },
      { status: 500 }
    );
  }
}