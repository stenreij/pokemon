import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PowermoveController } from "./powermove/powermove.controller";
import { Powermove, PowermoveSchema } from "./powermove/powermove.schema";
import { PowermoveService } from "./powermove/powermove.service";
import { UserModule } from "./user.module";
import { TokenBlacklistService } from "./user/blacklist.service";


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Powermove.name, schema: PowermoveSchema }
    ]),
    UserModule
  ],
  controllers: [PowermoveController],
  providers: [PowermoveService, TokenBlacklistService],
  exports: [PowermoveService],
})

export class PowermoveModule {}
