import { Controller, Delete, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Get, Param, Post, Body } from '@nestjs/common';
import { IUserInfo, IUser } from '@pokemon/shared/api';
import { CreateUserDto, UpdateUserDto } from '@pokemon/backend/dto';
import { UserExistGuard } from './user-exists.guard';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('')
    async findAll(): Promise<IUserInfo[]> {
        return this.userService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<IUser | null> {
        return this.userService.findOne(id);
    }

    @Post('')
    @UseGuards(UserExistGuard)
    async create(@Body() user: CreateUserDto): Promise<IUserInfo> {
        return this.userService.create(user);
    }

    @Put(':id')
    update(
        @Param('id') id: number,
        @Body() data: UpdateUserDto
    ): Promise<IUserInfo | null> {
        return this.userService.update(id, data);
    }
}
