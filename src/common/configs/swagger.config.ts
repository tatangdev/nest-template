import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { convertCamelCaseToWords } from 'src/common/utils/string-transform.util';

export function setupSwagger(app: INestApplication) {
  const configService = app.get(ConfigService);
  const appName = convertCamelCaseToWords(
    configService.get<string>('appName') || 'Application',
  );
  const appDescription = convertCamelCaseToWords(
    configService.get<string>('appDescription') || appName,
  );

  const config = new DocumentBuilder()
    .setTitle(appName)
    .setDescription(appDescription)
    .setVersion('0.0.1')
    .addBearerAuth(
      {
        description: 'Enter your JWT token',
        type: 'http',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
}
