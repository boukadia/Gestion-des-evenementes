import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';


@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ){}
  //login

  async register(data:RegisterDto){
    const user=await this.prisma.user.findUnique({
      where:{email:data.email}
    })
    if(user){
      throw new UnauthorizedException('Email already in use');
    }
    const hashedPassword=await bcrypt.hash(data.password,10)
    const newUser=await this.prisma.user.create({
      data:{
        name:data.name,
        email:data.email,
        password:hashedPassword
      }
    })
    return {
      message:'User registered successfully',
      userId:newUser.id
    }
  }
  
  // create(createAuthDto: CreateAuthDto) {
  //   return 'This action adds a new auth';
  // }

  // findAll() {
  //   return `This action returns all auth`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} auth`;
  // }

  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} auth`;
  // }
}
