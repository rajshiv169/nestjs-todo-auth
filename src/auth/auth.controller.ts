import { Controller, Post, Body, UseGuards, Request, Response, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiCookieAuth, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ 
    status: 201, 
    description: 'User has been successfully registered'
  })
  @ApiResponse({ 
    status: 409, 
    description: 'User with this email already exists'
  })
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: 'Login a user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ 
    status: 200, 
    description: 'User has been successfully logged in' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Invalid credentials' 
  })
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Request() req, @Response({ passthrough: true }) res) {
    const { user, accessToken } = await this.authService.login(loginDto, req);
    
    // Set the JWT as a cookie
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: loginDto.rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000, // 30 days or 1 day
    });
    
    return user;
  }

  @ApiOperation({ summary: 'Logout a user' })
  @ApiResponse({ 
    status: 200, 
    description: 'User has been successfully logged out' 
  })
  @ApiCookieAuth('access_token')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req, @Response({ passthrough: true }) res) {
    await this.authService.logout(req.user.sessionId);
    
    // Clear the cookie
    res.clearCookie('access_token');
    
    return { message: 'Successfully logged out' };
  }

  @ApiOperation({ summary: 'Get current user information' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns the current user information' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized' 
  })
  @ApiCookieAuth('access_token')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }
}