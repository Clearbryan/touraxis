import { ExtractJwt, Strategy } from 'passport-jwt';
import passport from 'passport';
import User from '../models/User'

const APP_SECRET = process.env.APP_SECRET || 'touraxis'

export const Passport = (): void => {

    const opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: APP_SECRET,
    };

    passport.use(
        new Strategy(opts, async (jwtPayload, done: (error: any, user?: any) => void) => {
            try {
                const user: Record<string, any> | null = await User.findById(jwtPayload.data._id);

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
