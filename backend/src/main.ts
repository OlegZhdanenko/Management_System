import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());

  // // ---- Swagger config ----
  // const config = new DocumentBuilder()
  //   .setTitle('Library API')
  //   .setDescription('API pour gérer Books, Authors et Categories')
  //   .setVersion('v1') // ← visible uniquement dans Swagger
  //   .addBearerAuth()
  //   .build();

  // const document = SwaggerModule.createDocument(app, config);

  // // ---- Versionning uniquement pour Swagger ----
  // Object.keys(document.paths).forEach((path) => {
  //   const newPath = `/v1${path}`; // préfixe /v1
  //   document.paths[newPath] = document.paths[path];
  //   delete document.paths[path];
  // });

  // SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `Application is running on: http://localhost:${process.env.PORT ?? 3000}`,
  );
  // console.log(
  //   `Swagger docs available at: http://localhost:${process.env.PORT ?? 3000}/api`,
  // );
}
bootstrap().catch((err) => console.log(err));
