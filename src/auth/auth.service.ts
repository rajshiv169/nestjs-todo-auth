import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Session } from './entities/session.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(Session)
    private sessionsRepository: Repository<Session>,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    
    const user = await this.usersService.create(registerDto);
    
    // Automatically log in the user after registration
    const { password, ...result } = user;
    return result;
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    
    if (!user) {
      return null;
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return null;
    }
    
    const { password: _, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto, req: any) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const rememberMe = loginDto.rememberMe || false;
    
    // Create a session token
    const sessionToken = uuidv4();
    
    // Calculate expiration time based on rememberMe flag
    const expirationTime = rememberMe 
      ? this.configService.get('JWT_REMEMBER_ME_EXPIRATION')
      : this.configService.get('JWT_EXPIRATION_TIME');
    
    // Calculate future date for session expiration
    const expiresAt = new Date();
    const expiresInSeconds = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60; // 30 days or 1 day
    expiresAt.setSeconds(expiresAt.getSeconds() + expiresInSeconds);
    
    // Create session record
    const session = this.sessionsRepository.create({
      sessionToken,
      expiresAt,
      rememberMe,
      userId: user.id,
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip,
    });
    
    await this.sessionsRepository.save(session);
    
    // Create JWT payload
    const payload = { 
      sub: user.id, 
      email: user.email,
      sessionId: session.id
    };
    
    return {
      user,
      accessToken: this.jwtService.sign(payload, {
        expiresIn: expirationTime,
      }),
    };
  }

  async logout(sessionId: string) {
    await this.sessionsRepository.delete({ id: sessionId });
    return { message: 'Successfully logged out' };
  }

  async getSessionById(sessionId: string) {
    return this.sessionsRepository.findOne({ where: { id: sessionId } });
  }
}