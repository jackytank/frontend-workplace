import { Router } from 'express';
import { UserController } from '@controllers/users.controller';
import { CreateUserDto, UpdateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { ScrapperController } from '@/controllers/puppeteer.controller';

export class UserRoute implements Routes {
  public path = '/users';
  public router = Router();
  public user = new UserController();
  public scrapper = new ScrapperController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // --USER--
    this.router.get(`${this.path}`, this.user.getUsers);
    this.router.get(`${this.path}/:id(\\d+)`, this.user.getUserById);
    this.router.post(`${this.path}`, ValidationMiddleware(CreateUserDto), this.user.createUser);
    this.router.put(`${this.path}/:id(\\d+)`, ValidationMiddleware(UpdateUserDto), this.user.updateUser);
    this.router.delete(`${this.path}/:id(\\d+)`, this.user.deleteUser);
    // --SCRAPPER--
    this.router.get('/crawl/table', this.scrapper.getScrapping);
  }
}
