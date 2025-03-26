import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TodosModule } from './todos/todos.module';
import { User } from './users/entities/user.entity';
import { Todo } from './todos/entities/todo.entity';
import { Session } from './auth/entities/session.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [User, Todo, Session],
        synchronize: configService.get('NODE_ENV') !== 'production',
      }),
    }),
    AuthModule,
    UsersModule,
    TodosModule,
  ],
})
export class AppModule {}