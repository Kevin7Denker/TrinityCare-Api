import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateReceptionistDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  workShift: string;
}
