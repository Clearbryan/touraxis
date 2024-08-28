/**
 * This file contains various helper functions used across the application
 */

import Joi, { ValidationResult } from 'joi'
import { ObjectId } from 'mongodb';
import { ITask, IUser } from '../types/types';
import Jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import constants from '../constants';

const APP_SECRET = process.env.APP_SECRET || 'touraxis'
class Utils {

    // Validate user details input
    public validateUserDetails(user: IUser): ValidationResult<IUser> {

        const schema = Joi.object({
            username: Joi.string().min(3).max(30).required().error(new Error(`Username is required!`)),
            first_name: Joi.string().min(3).max(30).required().error(new Error(`First name is required!`)),
            last_name: Joi.string().min(3).max(30).required().error(new Error(`Last name is required!`)),
            password: Joi.string()
                .pattern(new RegExp(constants.REGEX))
                .min(8)
                .max(12)
                .required()
                .error(new Error(`Please enter a strong password`)),
        })
        return schema.validate(user)
    }

    // Validate task details input
    public validateTaskDetails(task: Record<string, any>): ValidationResult<ITask> {
        const schema = Joi.object({
            name: Joi.string().min(3).max(100).required().error(new Error(`Task name is required!`)),
            description: Joi.string().min(3).max(500).required().error(new Error(`Invalid task description`)),
            status: Joi.string().valid('To Do', 'Pending', 'Done').error(new Error(`Invalid status type!`)),
            next_execute_date_time: new Date(Date.now() + 12 * 60 * 60 * 1000) // 12 hours from creation
        })
        return schema.validate(task)
    }

    // check if a given Id is valid in mongo
    public isValidMongoId = (id: string): boolean => ObjectId.isValid(id);

    // encrypt user password
    public hashPassword = (password: string): string => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    // compare hash
    public comparePassword = async (password: string, hash: string): Promise<boolean> => {
        return await bcrypt.compare(password, hash);
    };

    // generate token
    public generateToken = async (data: any): Promise<string> => Jwt.sign({ data }, APP_SECRET, { expiresIn: `1h` })

    // compare Ids
    compreIds = (id1: ObjectId | string, id2: ObjectId | string): boolean => new ObjectId(id1).equals(new ObjectId(id2))
}

export default new Utils()