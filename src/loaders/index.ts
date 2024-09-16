import expressLoader from './express';
import express from 'express';
import sequelizeLoader from './sequelize';

export default async ({ expressApp }: { expressApp: express.Application }) => {
  await sequelizeLoader();
  console.info('✌️  Sequelize loaded');
  await expressLoader({ app: expressApp });
  console.info('✌️  Express loaded');
};
