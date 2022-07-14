import { CreateUserDto } from './create-user.dto';
import { IsUUID } from 'class-validator';

export class UpdateUserDto extends CreateUserDto {
  @IsUUID()
  id: string;
}
