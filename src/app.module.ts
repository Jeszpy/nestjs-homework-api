import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseDatabaseModule } from './database/mongoose.database.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { EmailModule } from './email/email.module';
import configuration from './config/configuration';
import { ScheduleModule } from '@nestjs/schedule';
import { TestingModule } from './testing/testing.module';
import { BloggerModule } from './blogger/blogger.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    ScheduleModule.forRoot(),
    MongooseDatabaseModule,
    UserModule,
    EmailModule,
    AuthModule,
    TestingModule,
    BloggerModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
