import 'reflect-metadata';
import { Container } from 'inversify';
import UserService from '../../services/UserService';
import { UserController } from '../../controller/UserController';
import UserRepository from '../../repositories/UserRepository';
import PortfolioRepository from '../../repositories/PortfolioRepository';
import TransactionRepository from '../../repositories/TransactionRepository';
import OrderRepository from '../../repositories/OrderRepository';
import PriceRepository from '../../repositories/PriceRepository';
import TradeRepository from '../../repositories/TradeRepository';
import TransactionService from '../../services/TransactionService';
import TradeService from '../../services/TradeService';
import PortfolioService from '../../services/PortfolioService';
import OrderService from '../../services/OrderService';
import PriceService from '../../services/PriceService';
import { BaseService } from '../../services/BaseService';
import { Sequelize } from 'sequelize';
import { SequelizeConnection } from '../database/sequelizeInstance';
import { PortfolioController } from '../../controller/PortfolioController';
import { TradeController } from '../../controller/TradeController';
import { TransactionController } from '../../controller/TransactionController';
import OrderController from '../../controller/OrderController';
import { PriceController } from '../../controller/PriceController';
import AuthService from '../../services/AuthService';
import { AuthController } from '../../controller/AuthController';

const container = new Container({ autoBindInjectable: true });


// Determine the repositories
container.bind<UserRepository>(UserRepository).to(UserRepository);
container.bind<PortfolioRepository>(PortfolioRepository).to(PortfolioRepository);
container.bind<TransactionRepository>(TransactionRepository).to(TransactionRepository);
container.bind<OrderRepository>(OrderRepository).to(OrderRepository);
container.bind<PriceRepository>(PriceRepository).to(PriceRepository);
container.bind<TradeRepository>(TradeRepository).to(TradeRepository);

// Determine the services
container.bind<AuthService>(AuthService).to(AuthService);
container.bind<UserService>(UserService).to(UserService);
container.bind<TransactionService>(TransactionService).to(TransactionService);
container.bind<TradeService>(TradeService).to(TradeService);
container.bind<PortfolioService>(PortfolioService).to(PortfolioService);
container.bind<OrderService>(OrderService).to(OrderService);
container.bind<PriceService>(PriceService).to(PriceService);
container.bind<BaseService<any, any, any>>(BaseService);

container.bind<Sequelize>('SequelizeInstance').toConstantValue(SequelizeConnection.getInstance());
// Determine the controllers
container.bind<AuthController>(AuthController).to(AuthController);
container.bind<UserController>(UserController).to(UserController);
container.bind<PortfolioController>(PortfolioController).to(PortfolioController);
container.bind<TradeController>(TradeController).to(TradeController);
container.bind<PriceController>(PriceController).to(PriceController);
container.bind<TransactionController>(TransactionController).to(TransactionController);
container.bind<OrderController>(OrderController).to(OrderController);

export default container;
