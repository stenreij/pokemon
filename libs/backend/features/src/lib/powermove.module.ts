import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PowermoveController } from "./powermove/powermove.controller";
import { Powermove, PowermoveSchema } from "./powermove/powermove.schema";
import { PowermoveService } from "./powermove/powermove.service";


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Powermove.name, schema: PowermoveSchema }
    ])
  ],
  controllers: [PowermoveController],
  providers: [PowermoveService],
  exports: [PowermoveService],
})

export class PowermoveModule {}
