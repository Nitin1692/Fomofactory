import { MongoClient } from 'mongodb';

let client: MongoClient;

const uri = 'mongodb+srv://nj5930595:YCORpV7AMRZF3soD@fomofactory.kas6lb3.mongodb.net/';

async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri);

    try {
      await client.connect();
      console.log('MongoDB connected successfully');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error;
    }
  }

  return client;
}


export { connectToDatabase };
