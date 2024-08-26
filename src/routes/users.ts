import { Request, Response, NextFunction, Router } from 'express';
import { IUser, MongoDBError } from '../interfaces';
import utils from '../utils';
import User from '../models/User';

let errorMessage: string | null = null;

export default class UserController {
    public router: Router;
    constructor() {
        this.router = Router();
        this.routes();
    }

    private routes() {
        this.router.get('/', this.list);
        this.router.post('/', this.create);
        this.router.get('/:id', this.list)
        this.router.put('/:id', this.update)
    }

    /**
    * Retrieve user(s)
    */
    private async list(req: Request, res: Response): Promise<Record<string, any>> {
        let data
        const { id } = req.params
        try {
            if (id) {
                const isValidId = utils.isValidMongoId(id)
                if (!isValidId) return res.json({ success: false, message: `Invalid user Id` })
                else data = await User.findById(id)
            } else {
                data = await User.find()
            }
            return res.json({ success: true, data })
        } catch (error) {
            return res.json({
                success: false,
                message: errorMessage || (error instanceof Error ? error.message : 'Unknown error occurred'),
            });
        }

    }


    private async create(req: Request, res: Response): Promise<Response<IUser>> {
        try {
            const { value, error } = utils.validateUserDetails(req.body)
            if (error) {
                return res.json({ success: false, message: error.message })
            } else {
                const newUser = new User(value)
                await newUser.save()
                return res.json({ success: true, message: `User created successfully` })
            }

        } catch (error) {

            // Check if the error is a MongoDB error
            if ((error as MongoDBError).code === 11000) {
                const errorDetails = Object.entries((error as MongoDBError).keyValue).map(
                    ([key, value]) => { return { key, value }; }
                );
                errorMessage = `${errorDetails[0].value} is already exists!`;
            }
            // Handle other types of errors
            return res.json({
                success: false,
                message: errorMessage || (error instanceof Error ? error.message : 'Unknown error occurred'),
            });
        }
    }

    async update(req: Request, res: Response) {
        const isValidId = utils.isValidMongoId(req.params.id)
        if (!isValidId) return res.json({ success: false, message: `Invalid user Id` })
        try {
            const updated = await User.findByIdAndUpdate(req.params.id, req.body)
            if (updated) {
                return res.json({
                    success: true,
                    message: `User updated successfully`
                })
            } else {
                return res.json({
                    success: false,
                    message: `User updated failure!`
                })
            }
        } catch (error) {
            return res.json({
                success: false,
                message: errorMessage || (error instanceof Error ? error.message : 'Unknown error occurred'),
            });
        }
    }
}

export const userController = new UserController().router;

