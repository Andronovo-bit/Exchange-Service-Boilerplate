import { Dialect, Sequelize } from 'sequelize';
import config from '../config';

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
    const dbName = config.database.name as string;
    const dbUser = config.database.username as string;
    const dbHost = config.database.host as string;
    const dbDriver = config.database.dialect as Dialect;
    const dbPassword = config.database.password as string;
    const dbPort = config.database.port as number;

    // Initialize connection
    SequelizeConnection.instance = new Sequelize(dbName, dbUser, dbPassword, {
      host: dbHost,
      dialect: dbDriver,
      port: dbPort,
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
