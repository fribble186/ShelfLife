import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api");

  // 启用 CORS
  // app.enableCors();

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  );

  // Swagger 文档配置
  const config = new DocumentBuilder()
    .setTitle("ShelfLife API")
    .setDescription("ShelfLife 后端 API 文档")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 ShelfLife API 服务已启动，端口: ${port}`);
  console.log(`📚 API 文档地址: http://localhost:${port}/docs`);
}

bootstrap();
