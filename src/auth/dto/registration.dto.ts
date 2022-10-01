import { IsEmail, IsString, Length, Max, Min } from 'class-validator';
import { CreateUserDto } from '../../user/dto/createUser.dto';

export class RegistrationDto extends CreateUserDto {
  // @IsString()
  // @Length(3, 10)
  // login: string;
  // @IsEmail()
  // email: string;
  // @IsString()
  // @Length(6, 20)
  // password: string;
}
