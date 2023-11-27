import { Controller, Delete, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { Get, Param, Post, Body } from '@nestjs/common';
import { IUser } from '@pokemon/shared/api';
import { CreateUserDto } from '@pokemon/backend/dto';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('')
    getAll(): IUser[] {
        return this.userService.getAll();
    }

    @Get(':id')
    getOne(@Param('id') id: number): IUser {
        return this.userService.getOne(id);
    }

    @Post('')
    create(@Body() data: CreateUserDto): IUser {
        return this.userService.create(data);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() data: CreateUserDto): IUser {
        return this.userService.update(id, data);
    }
    
    @Delete(':id')
    delete(@Param('id') id: number): IUser {
        return this.userService.delete(id);
    }

}
