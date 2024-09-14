import { Dialect, Sequelize } from 'sequelize';

/**
 * The Singleton class defines the `getInstance` method that lets clients access
 * the unique singleton instance.
 */
export class SequelizeConnection {
  // Connection instance
  private static instance: Sequelize;

  /**
   * The Singleton's constructor should always be private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor() {
    // Information needed to initialize database connection
    const dbName = process.env.DB_NAME as string;
    const dbUser = process.env.DB_USER as string;
    const dbHost = process.env.DB_HOST;
    const dbDriver = process.env.DB_DRIVER as Dialect;
    const dbPassword = process.env.DB_PASS;
    const dbPort = process.env.DB_PORT;

    // Initialize connection
    SequelizeConnection.instance = new Sequelize(dbName, dbUser, dbPassword, {
      host: dbHost,
      dialect: dbDriver,
      port: parseInt(dbPort as string),
      logging: false,
    });

    // Test connection
    SequelizeConnection.instance.authenticate().then(() => {
      console.log('Sequelize connected');
    });
  }

  /**
   * The static method that controls the access to the singleton instance.
   *
   */
  public static getInstance(): Sequelize {
    if (!SequelizeConnection.instance) {
      new SequelizeConnection();
    }

    return SequelizeConnection.instance;
  }
}
