import 'reflect-metadata';
import { Container } from 'inversify';
import UserService from '../../services/UserService';
import { UserController } from '../../controller/UserController';

const container = new Container();

// Servisleri tanımlıyoruz
container.bind<UserService>(UserService).to(UserService);

// Controller'ları tanımlıyoruz
container.bind<UserController>(UserController).to(UserController);

export default container;
