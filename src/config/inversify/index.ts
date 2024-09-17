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

const container = new Container();

// Determine the repositories
container.bind<UserRepository>(UserRepository).to(UserRepository);
container.bind<PortfolioRepository>(PortfolioRepository).to(PortfolioRepository);
container.bind<TransactionRepository>(TransactionRepository).to(TransactionRepository);
container.bind<OrderRepository>(OrderRepository).to(OrderRepository);
container.bind<PriceRepository>(PriceRepository).to(PriceRepository);
container.bind<TradeRepository>(TradeRepository).to(TradeRepository);

// Determine the services
container.bind<UserService>(UserService).to(UserService);

// Determine the controllers
container.bind<UserController>(UserController).to(UserController);

export default container;
