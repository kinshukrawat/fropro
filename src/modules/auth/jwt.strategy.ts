import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

type JwtPayload = {
  sub: string;
  email: string;
  role: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET'),
    });

    console.log(
      'JWT_SECRET =',
      config.get<string>('JWT_SECRET'),
    );
  }

  async validate(payload: JwtPayload) {
    console.log('==============================');
    console.log('JWT STRATEGY CALLED');
    console.log('Payload:', payload);

    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    console.log('DB User:', user);

    if (!user) {
      console.log('USER NOT FOUND');
      throw new UnauthorizedException('User not found');
    }

    if (!user.isActive) {
      console.log('USER INACTIVE');
      throw new UnauthorizedException('User inactive');
    }

    console.log('JWT SUCCESS');

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
