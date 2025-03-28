import { Controller, Delete, HttpException, HttpStatus, Logger, Put, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Get, Param, Post, Body } from '@nestjs/common';
import { IUser } from '@pokemon/shared/api';
import { CreateUserDto, UpdateUserDto } from '@pokemon/backend/dto';
import { UserExistGuard } from './user-exists.guard';
import { CustomRequest } from '../auth/custom-request.interface';
import { AuthGuard } from '../auth/authguard';

@Controller('user')
export class UserController {
    private readonly logger: Logger = new Logger(UserController.name);
    constructor(private userService: UserService) { }

    @Get('')
    @UseGuards(AuthGuard)
    async findAll(@Req() request: CustomRequest): Promise<IUser[]> {
        const userId = request.userId;
        if (!userId) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Bad Request',
                    message: 'userId is required',
                },
                HttpStatus.BAD_REQUEST,
            );
        }
        return this.userService.findAll(userId);
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    async findOne(@Req() request: CustomRequest, @Param('id') id: string): Promise<IUser | null> {
        const userId = request.userId as string;
        const user = await this.userService.findOne(userId, id);
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
    @UseGuards(AuthGuard)
    @UseGuards(UserExistGuard)
    async create(@Body() user: CreateUserDto): Promise<IUser> {
        return this.userService.create(user);
    }

    @Post('login')
    async login(@Body() body: { email: string, password: string }): Promise<IUser> {
        const user = await this.userService.login(body.email, body.password);
        if (!user) {
            throw new HttpException(
                {
                    status: HttpStatus.UNAUTHORIZED,
                    error: 'Unauthorized',
                    message: 'Invalid credentials'
                },
                HttpStatus.UNAUTHORIZED
            );
        }
        return user;
    }

    @Post('logout')
    @UseGuards(AuthGuard)
    async logout(@Req() request: CustomRequest): Promise<{ message: string }> {
        const userId = request.userId;
        const authorizationHeader = request.headers.authorization;

        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            throw new HttpException(
                {
                    status: HttpStatus.UNAUTHORIZED,
                    error: 'Unauthorized',
                    message: 'No valid token provided',
                },
                HttpStatus.UNAUTHORIZED,
            );
        }

        const token = authorizationHeader.split(' ')[1];

        if (!userId) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Bad Request',
                    message: 'gebruikerId is required',
                },
                HttpStatus.BAD_REQUEST,
            );
        }
        const success = await this.userService.logout(userId, token);
        if (!success) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: 'Not Found',
                    message: `User with id ${userId} not found`,
                },
                HttpStatus.NOT_FOUND,
            );
        }
        return { message: 'Successfully logged out' };
    }

    @Put(':id')
    @UseGuards(AuthGuard)
    @UseGuards(UserExistGuard)
    async update(@Req() request: CustomRequest, @Param('id') id: number, @Body() user: UpdateUserDto): Promise<IUser | null> {
        const userId = request.userId as string;
        const updatedUser = await this.userService.update(userId, id, user);
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
    @UseGuards(AuthGuard)
    async delete(@Req() request: CustomRequest, @Param('id') id: number): Promise<{ message: string }> {
        const loggedInUserId = request.userId as string;
        const result = await this.userService.delete(loggedInUserId, id);
        if (!result) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: 'Not Found',
                    message: `User with id ${id} not found`
                },
                HttpStatus.NOT_FOUND
            );
        }
        return { message: `User with id ${id} deleted successfully` };
    }
}