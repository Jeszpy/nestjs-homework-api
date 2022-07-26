import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserAccountDBType } from '../types/user';
import { JWTService } from '../jwt/jwt.service';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/createUser.dto';
import { JwtAuthGuard } from '../guards/jwt.auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly jwtService: JWTService,
    private readonly usersService: UserService,
    private readonly authService: AuthService,
  ) {}

  private registrationEmailResendingErrorMessage = () => {
    return {
      errorsMessages: [
        {
          message: 'user with this email was not found',
          field: 'email',
        },
      ],
    };
  };

  private codeAlreadyConfirmedError = () => {
    return {
      errorsMessages: [
        {
          message: 'this confirmation code has already been confirmed',
          field: 'code',
        },
      ],
    };
  };

  private invalidConfirmationCodeError = () => {
    return {
      errorsMessages: [
        {
          message: 'this confirmation code invalid',
          field: 'code',
        },
      ],
    };
  };

  private returnErrorMessage = (field: string) => {
    return {
      errorsMessages: [
        {
          message: `this ${field} has already been created`,
          field: field,
        },
      ],
    };
  };

  private registrationCodeConfirmErrorMessage = () => {
    return {
      errorsMessages: [
        {
          message: 'this email has already been confirmed',
          field: 'email',
        },
      ],
    };
  };

  @Post('registration-email-resending')
  async registrationEmailResending(@Req() req, @Res() res) {
    const { email } = req.body;
    const emailInDB = await this.authService.findOneUserByEmail(email);
    if (!emailInDB) {
      return res
        .status(400)
        .send(this.registrationEmailResendingErrorMessage());
    }
    const isResend = await this.authService.registrationEmailResending(email);
    return isResend
      ? res.sendStatus(204)
      : res.status(400).send(this.registrationCodeConfirmErrorMessage());
  }

  @HttpCode(204)
  @Post('registration')
  async registration(
    @Req() req,
    @Res() res,
    @Body() createUserDto: CreateUserDto,
  ) {
    const emailInDB = await this.authService.findOneUserByEmail(
      createUserDto.email,
    );
    // if (emailInDB) throw new BadRequestException();
    if (emailInDB)
      return res.status(400).send(this.returnErrorMessage('email'));
    const loginInDB = await this.authService.findOneUserByLogin(
      createUserDto.login,
    );
    // if (loginInDB) throw new BadRequestException();
    if (loginInDB)
      return res.status(400).send(this.returnErrorMessage('login'));
    const user = await this.usersService.createUser(
      createUserDto.login,
      createUserDto.email,
      createUserDto.password,
    );
    // if (!user) throw new BadRequestException();
    if (!user) return res.sendStatus(400);
    return res.sendStatus(204);
  }

  @Post('registration-confirmation')
  async confirmEmail(@Req() req, @Res() res) {
    const { code } = req.body;
    const codeInDB = await this.authService.findCodeInDB(code);
    if (!codeInDB) {
      return res.status(400).send(this.invalidConfirmationCodeError());
    }
    if (codeInDB.emailConfirmation.isConfirmed) {
      return res.status(400).send(this.codeAlreadyConfirmedError());
    }
    const confirm = await this.authService.confirmEmail(code);
    return confirm ? res.sendStatus(204) : res.sendStatus(400);
  }

  @Post('login')
  async login(@Req() req, @Res() res) {
    const { login, password } = req.body;
    const tokens = await this.jwtService.createJWT(login, password);
    if (!tokens) {
      return res.sendStatus(401);
    }
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return res.send({ accessToken: tokens.accessToken });
  }

  @Post('refresh-token')
  async refreshToken(@Req() req, @Res() res) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.sendStatus(401);
      }
      const newTokens = await this.jwtService.getNewRefreshToken(refreshToken);
      if (!newTokens) {
        return res.sendStatus(401);
      }
      res.cookie('refreshToken', newTokens.refreshToken, {
        httpOnly: true,
        secure: true,
      });
      return res.send({ accessToken: newTokens.accessToken });
    } catch (e) {
      console.error(e);
    }
  }

  @Post('logout')
  async logout(@Req() req, @Res() res) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.sendStatus(401);
      }
      const result = await this.jwtService.blockOldRefreshToken(refreshToken);
      return result ? res.sendStatus(204) : res.sendStatus(401);
    } catch (e) {
      console.error(e);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req, @Res() res) {
    try {
      const userId = req.user!.id;
      const userInfo = await this.usersService.getUserInfoById(userId);
      return res.send(userInfo);
    } catch (e) {
      console.error(e);
    }
  }
}

export interface IAuthService {
  confirmEmail(code: string): Promise<boolean | null>;

  findOneUserByLogin(login: string): Promise<boolean>;

  findOneUserByEmail(email: string): Promise<boolean>;

  registrationEmailResending(email: string): Promise<boolean>;

  isCodeConfirmed(code: string): Promise<boolean>;

  findCodeInDB(code: string): Promise<UserAccountDBType | null>;
}
