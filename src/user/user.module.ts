import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User, UserSchema } from 'src/schema/user.schema';
import { UserController } from './user.controller';
import { News, NewsSchema } from 'src/schema/news.schema';
import { ENV_VARS, SERVICES } from 'src/const';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  imports: [
  //  SharedModule,
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: News.name,
        schema: NewsSchema,
      }
    ])
  ],
  providers: [UserService,
    {
      provide: SERVICES.SVC_EMAIL,
      useFactory: (configService: ConfigService) => {
        const user = configService.get(ENV_VARS.RMQ.USERNAME);
        const password = configService.get(ENV_VARS.RMQ.PASSWORD);
        const host = configService.get(ENV_VARS.RMQ.HOST);
        const queueName = configService.get(ENV_VARS.SVC_QUEUES.SVC_EMAIL);

        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${user}:${password}@${host}`],
            queue: queueName,
            queueOptions: {
              durable: true,
            },
          },
        });
      },
      inject: [ConfigService],
    },],
  controllers:[UserController]
})
export class UserModule {}
