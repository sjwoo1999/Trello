import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../interfaces/jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        private readonly configService: ConfigService
        ){
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req) => {
                    const token = req.cookies['authorization'];
                    return token ? token.replace(/^Bearer\s/, '') : null;
                }
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET_KEY'),
        });
    }

    validate(payload: JwtPayload){
        return payload.id;
    }
}