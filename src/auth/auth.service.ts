import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { Role, RolePermission, User, UserOverride } from 'generated/prisma';

type SafeUser = Omit<
  User & {
    role: Role & { permissions: RolePermission[] };
    overrides: UserOverride[];
  },
  'password'
>;

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<SafeUser> {
    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        roleId: dto.roleId,
      },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
        overrides: true,
      },
    });

    const { password: _, ...result } = user;
    return result;
  }

  async login(dto: LoginDto): Promise<SafeUser & { access_token: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
        overrides: true,
      },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    const { password: _, ...result } = user;
    return { ...result, access_token: token };
  }

  async validateUser(userId: string): Promise<SafeUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
        overrides: true,
      },
    });

    if (!user) return null;

    const { password: _, ...result } = user;
    return result;
  }
}
