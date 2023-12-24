import { createConnection } from 'typeorm';
const { v4: uuidv4 } = require('uuid');

// Your Cart entity definition
class Cart {
  id: string;
  constructor(public user_id: string, public status: 'ORDERED' | 'OPEN') {
    this.id = uuidv4();
    this.user_id = user_id;
    this.status = status;
  }
}

const generateTestData = async () => {
  // Create a TypeORM connection
  const connection = await createConnection();

  // Get the Cart repository
  const cartRepository = connection.getRepository(Cart);

  // Generate test data
  const testData = [
    new Cart(uuidv4(), 'OPEN'),
    new Cart(uuidv4(), 'ORDERED'),
    // Add more test data as needed
  ];

  // Save test data to the database
  await cartRepository.save(testData);

  // Close the connection
  await connection.close();
};

// Run the script
generateTestData().catch((error) => console.error(error));
