import { ExtractJwt, Strategy } from 'passport-jwt';
import passport from 'passport';
import User from '../models/User'
import { IUser } from '../types/types';
import { APP_SECRET } from '../main';

export const Passport = (): void => {
    const opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: APP_SECRET,
    };

    passport.use(
        new Strategy(opts, async (jwtPayload: { data: { _id: any; }; }, done: (error: any, user?: IUser | boolean) => void) => {
            try {
                const user: IUser | null = await User.findById(jwtPayload.data._id);

                if (!user) {
                    return done(null, false);
                } else {
                    return done(null, user);
                }
            } catch (error) {
                return done(error, false);
            }
        })
    );
};
