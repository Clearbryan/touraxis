import Joi from 'joi'
import { ObjectId } from 'mongodb';
import { IUser } from '../interfaces';

class Utils {

    public validateUserDetails(user: IUser) {
        const schema = Joi.object({
            username: Joi.string().min(3).max(30).required().error(new Error(`Username is required!`)),
            first_name: Joi.string().min(3).max(30).required().error(new Error(`First name is required!`)),
            last_name: Joi.string().min(3).max(30).required().error(new Error(`Last name is required!`))
        })
        return schema.validate(user)
    }

    public isValidMongoId(id: string): boolean {
        return ObjectId.isValid(id);
    }
}

export default new Utils()