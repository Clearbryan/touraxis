import Joi from 'joi'
import { ObjectId } from 'mongodb';
import { IUser } from '../types/types';
import Jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
class Utils {

    public validateUserDetails(user: IUser) {
        const schema = Joi.object({
            username: Joi.string().min(3).max(30).required().error(new Error(`Username is required!`)),
            first_name: Joi.string().min(3).max(30).required().error(new Error(`First name is required!`)),
            last_name: Joi.string().min(3).max(30).required().error(new Error(`Last name is required!`)),
            password: Joi.string()
                .pattern(new RegExp(`^[a-zA-Z0-9]{3,30}$`))
                .min(8)
                .max(12)
                .required()
                .error(new Error(`Please enter a strong password`)),
        })
        return schema.validate(user)
    }

    public validateTaskDetails(task: Record<string, any>) {
        const schema = Joi.object({
            name: Joi.string().min(3).max(100).required().error(new Error(`Task name is required!`)),
            description: Joi.string().min(3).max(500).required().error(new Error(`Invalid task description`)),
            status: Joi.string().valid('To Do', 'Pending', 'Done').error(new Error(`Invalid status type!`)),
            next_execute_date_time: new Date(Date.now() + 12 * 60 * 60 * 1000) // 12 hours from creation
        })
        return schema.validate(task)
    }


    public isValidMongoId(id: string): boolean {
        return ObjectId.isValid(id);
    }

    public hashPassword(password: string) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    }

    // compare hash
    public async comparePassword(password: string, hash: string) {
        return await bcrypt.compare(password, hash);
    }

    // generate token
    public async generateToken(data: any) {
        return Jwt.sign({ data }, APP_SECRET, { expiresIn: `1h` });
    }

    stripUser(user: any) {
        const { password, __v, ...rest } = user._doc;
        return rest
    }

    compreIds(id1: ObjectId | string, id2: ObjectId | string) {
        return new ObjectId(id1).equals(new ObjectId(id2))
    }
}

export default new Utils()