import {
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
import { JwtAuthGuard } from '../guards/auth/jwt.auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegistrationDto } from './dto/registration.dto';
import { LocalAuthGuard } from '../guards/auth/local.auth.guard';
import { CurrentUserId } from '../decorators/http/param/currentUserId.param.decorator';

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
  async registration(@Res() res, @Body() registrationDto: RegistrationDto) {
    const emailInDB = await this.authService.findOneUserByEmail(
      registrationDto.email,
    );
    // if (emailInDB) throw new BadRequestException();
    if (emailInDB)
      return res.status(400).send(this.returnErrorMessage('email'));
    const loginInDB = await this.authService.findOneUserByLogin(
      registrationDto.login,
    );
    // if (loginInDB) throw new BadRequestException();
    if (loginInDB)
      return res.status(400).send(this.returnErrorMessage('login'));
    const user = await this.usersService.createUser(
      registrationDto.login,
      registrationDto.email,
      registrationDto.password,
    );
    // if (!user) throw new BadRequestException();
    if (!user) return res.sendStatus(400);
    return res.sendStatus(204);
  }

  @Post('registration-confirmation')
  async confirmEmail(@Body() code: string, @Res() res) {
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

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req, @Res() res, @Body() loginDto: LoginDto) {
    const tokens = await this.jwtService.createJWT(
      loginDto.login,
      loginDto.password,
    );
    if (!tokens) return res.sendStatus(401);
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
  async me(@CurrentUserId() currentUserId) {
    try {
      return await this.usersService.getUserInfoById(currentUserId);
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
