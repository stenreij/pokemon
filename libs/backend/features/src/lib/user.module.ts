import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenBlacklistService } from './user/blacklist.service';
import { UserController } from './user/user.controller';
import { User, UserSchema } from './user/user.schema';
import { UserService } from './user/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }
    ])
  ],
  controllers: [UserController],
  providers: [UserService, TokenBlacklistService],
  exports: [UserService, TokenBlacklistService],
})

export class UserModule {}
