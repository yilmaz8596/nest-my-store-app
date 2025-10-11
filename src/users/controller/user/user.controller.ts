import {
  Controller,
  Post,
  Body,
  Redirect,
  Req,
  Res,
  Get,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { UserService } from '../../service/user/user.service';
import { UserDTO } from '../../../DTO/user.dto';
import { UserLoginDTO } from '../../../DTO/user.login.dto';

@Controller('mystore')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @Redirect('/mystore/login')
  async signUp(@Body() newUser: UserDTO, @Req() req: Request) {
    return await this.userService.createUser(newUser);
  }

  @Post('login')
  async login(
    @Body() body: UserLoginDTO,
    @Res() res: Response,
    @Req() req: Request | any,
  ) {
    const { email, password } = body;

    const user = await this.userService.findUserByEmailWithPassword(email);
    if (!user) {
      return res.render('login', { error: 'User not found' });
    }

    const isPasswordValid = await this.userService.validatePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      return res.render('login', { error: 'Invalid credentials' });
    }

    req.session.userId = user.id;
    req.session.isLoggedIn = true;

    res.cookie('isLoggedIn', true, { httpOnly: true });
    res.cookie('userId', user.id, { httpOnly: true });

    return res.redirect('/mystore/home');
  }

  @Get('logout')
  logout(@Res() res: Response, @Req() req: Request | any) {
    res.clearCookie('isLoggedIn');
    res.clearCookie('userId');

    req.session.destroy((err: any) => {
      if (err) {
        console.error('Session destruction error:', err);
      }
      res.clearCookie('connect.sid');
      return res.redirect('/mystore/home');
    });
  }
}
