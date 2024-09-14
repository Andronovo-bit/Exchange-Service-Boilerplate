// src/initDatabase.ts
import { connectDatabase } from './database';
import dbInit from './dbInit';

// Function to initialize the database connection and models
const initialize = async (): Promise<void> => {
  try {
    await connectDatabase(); // Connect to the database
    await dbInit(); // Initialize the database models
    console.log('Database connection and initialization complete.');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1); // Exit the process with an error code
  }
};

export default initialize;