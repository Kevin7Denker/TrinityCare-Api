import { NestFactory } from '@nestjs/core';
import { AppModule } from './App/Modules/app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);

  console.log('\n');
  console.log(`
████████╗██████╗ ██╗███╗   ██╗██╗████████╗██╗   ██╗ ██████╗ █████╗ ██████╗ ██████╗ ███████╗
╚══██╔══╝██╔══██╗██║████╗  ██║██║╚══██╔══╝╚██╗ ██╔╝██╔════╝██╔══██╗██╔══██╗██╔══██╗██╔════╝
   ██║   ██████╔╝██║██╔██╗ ██║██║   ██║    ╚████╔╝ ██║     ███████║██████╔╝██████╔╝█████╗  
   ██║   ██╔══██╗██║██║╚██╗██║██║   ██║     ╚██╔╝  ██║     ██╔══██║██╔══██╗██╔══██╗██╔══╝  
   ██║   ██║  ██║██║██║ ╚████║██║   ██║      ██║   ╚██████╗██║  ██║██║  ██║██║  ██║███████╗
   ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝╚═╝   ╚═╝      ╚═╝    ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝
`);

  console.table({
    STATUS: '200',
    MESSAGE: 'Server is running',
    PORT: process.env.PORT ?? 3000,
    ENV: process.env.NODE_ENV ?? 'development',
  });

  console.log('\n');

  console.dir(
    {
      developer: 'Kevin Denker da Silva',
      email: 'oficialdenker@gmail.com',
      github: 'github.com/Kevin7Denker/',
    },
    {
      colors: true,
      depth: null,
      maxArrayLength: null,
    },
  );
}
bootstrap();
