import { Controller, Get, Render, Redirect, Req } from '@nestjs/common';
import type { Request } from 'express';
import { UserService } from './users/service/user/user.service';

@Controller('mystore')
export class AppController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Redirect('/mystore/home', 302)
  redirectToStore() {
    // This will automatically redirect localhost:3000 to localhost:3000/mystore/home
  }

  @Get('welcome')
  @Render('welcome')
  getWelcome() {
    return {
      message: 'Welcome to My Store',
      description: 'Your one-stop shop for amazing products!',
    };
  }

  @Get('about')
  @Render('about')
  getAbout() {
    return {
      title: 'About My Store',
      description: 'Learn more about our company and mission.',
    };
  }

  @Get('contact')
  @Render('contact')
  getContact() {
    return {
      title: 'Contact Us',
      email: 'info@mystore.com',
      phone: '+1 (555) 123-4567',
    };
  }

  @Get('sign-up')
  @Render('sign-up')
  async getSignup(@Req() req: Request) {
    const userId = req.cookies?.userId;
    let user: Omit<import('./DTO/user.dto').UserDTO, 'password'> | null = null;

    if (userId) {
      user = await this.userService.findUserById(Number(userId));
    }

    return { user };
  }

  @Get('login')
  @Render('login')
  async getLogin(@Req() req: Request) {
    const userId = req.cookies?.userId;
    let user: Omit<import('./DTO/user.dto').UserDTO, 'password'> | null = null;

    if (userId) {
      user = await this.userService.findUserById(Number(userId));
    }

    return { user };
  }
}

// Root controller for handling / route
@Controller()
export class RootController {
  @Get()
  @Redirect('/mystore/home', 302)
  redirectToStore() {
    return { url: '/mystore/home' };
  }
}
