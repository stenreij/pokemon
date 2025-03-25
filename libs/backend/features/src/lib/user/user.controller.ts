import { Controller, Delete, HttpException, HttpStatus, Put, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Get, Param, Post, Body } from '@nestjs/common';
import { IUser } from '@pokemon/shared/api';
import { CreateUserDto, UpdateUserDto } from '@pokemon/backend/dto';
import { UserExistGuard } from './user-exists.guard';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @Get('')
    async findAll(): Promise<IUser[]> {
        return this.userService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<IUser | null> {
        const user = await this.userService.findOne(id);
        if (!user) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: 'Not Found',
                    message: `User with id: ${id} not found`
                },
                HttpStatus.NOT_FOUND
            );
        }
        return user;
    }

    @Post('')
    @UseGuards(UserExistGuard)
    async create(@Body() user: CreateUserDto): Promise<IUser> {
        return this.userService.create(user);
    }

    @Post('login')
    async login(@Body() user: CreateUserDto): Promise<IUser | null> {
        return this.userService.login(user.email, user.password);
    }

    @Post('logout/:id')
    async logout(@Param('id') id: number): Promise<void> {
        await this.userService.logout(id);
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() user: UpdateUserDto): Promise<IUser | null> {
        const updatedUser = await this.userService.update(id, user);
        if (!updatedUser) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: 'Not Found',
                    message: `User with id: ${id} not found`
                },
                HttpStatus.NOT_FOUND
            );
        }
        return updatedUser;
    }

@Delete(':id')
    async delete(@Param('id') id: number): Promise<{ message: string }> {
        const result = await this.userService.delete(id);
        if (!result) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: 'Not Found',
                    message: `Gebruiker with id ${id} not found`
                },
                HttpStatus.NOT_FOUND
            );
        }
        return { message: `Gebruiker with id ${id} deleted successfully` };
    }
}