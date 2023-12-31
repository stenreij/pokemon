import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
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
  providers: [UserService],
  exports: [UserService],
})

export class UserModule {}
