import expressLoader from './express';
import express from 'express';

export default async ({ expressApp }: { expressApp: express.Application }) => {
  await expressLoader({ app: expressApp });
  console.info('✌️  Express loaded');
};
