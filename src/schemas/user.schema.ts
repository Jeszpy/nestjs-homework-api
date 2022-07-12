import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { IsEmail } from 'validator'; //TODO: remove this dep
// import { IsEmail, IsString } from 'class-validator';

export type UserDocument = User & Document;

// TODO: совмещение валидации

@Schema()
export class User {
  @Prop({ type: String, required: true, unique: true })
  id: string;

  @Prop({ type: String, required: true, unique: true }) // unique not work
  // @IsString()
  login: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    // validate: [IsEmail, 'not email'], // validate not work
  })
  // @IsEmail()
  email: string;

  @Prop({ type: String, required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
