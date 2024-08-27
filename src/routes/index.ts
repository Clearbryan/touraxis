import { Request, Response, NextFunction, Router } from 'express';
import { AuthenticatedRequest, IUser, MongoDBError } from '../types/types';
import utils from '../utils';
import User from '../models/User';
import constants from '../constants';
import passport from 'passport';
import Task from '../models/Task';

let errorMessage: string | null = null;

const userProjection = {
    username: 1, first_name: 1, last_name: 1
}
const taskProjectin = {
    name: 1, description: 1, status: 1, user_id: 1, next_execute_date_time: 1, date_time: 1
}

export default class RouteController {
    public router: Router;
    constructor() {
        this.router = Router();
        this.routes();
    }

    private routes() {
        this.router.post('/', this.createUser);
        this.router.post('/login', this.login);
        this.router.get('/', passport.authenticate('jwt', { session: false }), this.listUser);
        this.router.get('/:user_id', passport.authenticate('jwt', { session: false }), this.listUser)
        this.router.put('/:user_id', passport.authenticate('jwt', { session: false }), this.updateUser)
        this.router.delete('/:user_id', passport.authenticate('jwt', { session: false }), this.deleteUser)
        this.router.post('/:user_id/tasks', passport.authenticate('jwt', { session: false }), this.createTask);
        this.router.put('/:user_id/tasks/:task_id', passport.authenticate('jwt', { session: false }), this.updateTask)
        this.router.get('/:user_id/tasks', passport.authenticate('jwt', { session: false }), this.listTask)
        this.router.get('/:user_id/tasks/:task_id', passport.authenticate('jwt', { session: false }), this.listTask)
        this.router.delete('/:user_id/tasks/:task_id', passport.authenticate('jwt', { session: false }), this.deleteTask)

    }

    /**
     * User routes
     * @param req 
     * @param res 
     * @returns 
     */

    private async createUser(req: AuthenticatedRequest, res: Response): Promise<Response<IUser>> {
        try {
            const { value, error } = utils.validateUserDetails(req.body)
            if (error) {
                return res.json({ success: false, message: error.message })
            } else {
                const hash = utils.hashPassword(value.password);
                const newUser: Record<string, any> = new User({ ...value, password: hash })
                await newUser.save()
                return res.json({ success: true, message: `User created successfully` })
            }

        } catch (error) {
            // Check if the error is a MongoDB error
            if ((error as MongoDBError).code === 11000) {
                const errorDetails = Object.entries((error as MongoDBError).keyValue).map(
                    ([key, value]) => { return { key, value }; }
                );
                errorMessage = `${errorDetails[0].value} already exists!`;
            }
            // Handle other types of errors
            return res.json({
                success: false,
                message: errorMessage || (error instanceof Error ? error.message : 'Unknown error occurred'),
            });
        }
    }

    async updateUser(req: Request, res: Response) {
        const { user_id } = req.params
        const isValidId = utils.isValidMongoId(user_id)
        if (!isValidId) return res.json({ success: false, message: `Invalid user Id` })
        try {
            const updated = await User.findByIdAndUpdate(user_id, req.body)
            if (updated) {
                return res.json({
                    success: true,
                    message: `User updated successfully`
                })
            } else {
                return res.json({
                    success: false,
                    message: `User update failure!`
                })
            }
        } catch (error) {
            return res.json({
                success: false,
                message: errorMessage || (error instanceof Error ? error.message : 'Unknown error occurred'),
            });
        }
    }

    private async listUser(req: Request, res: Response): Promise<Record<string, any>> {
        let data
        const { user_id } = req.params
        try {
            if (user_id) {
                const isValidId = utils.isValidMongoId(user_id)
                if (!isValidId) return res.json({ success: false, message: `Invalid user Id` })
                else data = await User.findById(user_id, userProjection)
            } else {
                data = await User.find().select(userProjection)
            }
            return res.json({ success: true, data })
        } catch (error) {
            return res.json({
                success: false,
                message: errorMessage || (error instanceof Error ? error.message : 'Unknown error occurred'),
            });
        }
    }

    private async deleteUser(req: Request, res: Response): Promise<Record<string, any>> {
        const { user_id, task_id } = req.params
        const isValidId = utils.isValidMongoId(user_id)
        if (!isValidId) return res.json({ success: false, message: `Invalid user Id` })
        try {
            const deleted = await User.findByIdAndDelete(user_id)
            if (deleted) {
                return res.json({
                    success: true,
                    message: `User deleted successfully`
                })
            } else {
                return res.json({
                    success: false,
                    message: `User deletion failure!`
                })
            }
        } catch (error) {
            return res.json({
                success: false,
                message: errorMessage || (error instanceof Error ? error.message : 'Unknown error occurred'),
            });
        }
    }

    /**
     * Tast routes
     * @param req 
     * @param res 
     * @returns 
     */

    private async createTask(req: AuthenticatedRequest, res: Response): Promise<Response<IUser>> {
        const { user_id } = req.params
        try {
            const isValidId = utils.isValidMongoId(user_id)
            if (!isValidId) return res.json({ success: false, message: `Invalid user Id` })
            else {
                const { value, error } = utils.validateTaskDetails(req.body)
                if (error) {
                    return res.json({ success: false, message: error.message })
                } else {
                    const newTask = new Task({ ...value, user_id: req.user?._id })
                    await newTask.save()
                    return res.json({ success: true, message: `Task created successfully` })
                }
            }
        } catch (error) {
            // Check if the error is a MongoDB error
            if ((error as MongoDBError).code === 11000) {
                const errorDetails = Object.entries((error as MongoDBError).keyValue).map(
                    ([key, value]) => { return { key, value }; }
                );
                errorMessage = `${errorDetails[0].value} already exists!`;
            }
            // Handle other types of errors
            return res.json({
                success: false,
                message: errorMessage || (error instanceof Error ? error.message : 'Unknown error occurred'),
            });
        }
    }

    private async updateTask(req: AuthenticatedRequest, res: Response): Promise<Response<IUser>> {
        const { task_id } = req.params
        const isValidId = utils.isValidMongoId(task_id)
        if (!isValidId) return res.json({ success: false, message: `Invalid task Id` })
        else {
            try {
                const updated = await Task.findByIdAndUpdate(task_id, req.body)
                if (updated) {
                    return res.json({
                        success: true,
                        message: `Taks updated successfully`
                    })
                } else {
                    return res.json({
                        success: false,
                        message: `Taks update failure!`
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

    private async listTask(req: Request, res: Response): Promise<Record<string, any>> {
        let data
        const { user_id, task_id } = req.params

        const isValidId = utils.isValidMongoId(user_id)
        if (!isValidId) return res.json({ success: false, message: `Invalid user Id` })
        try {
            if (!task_id) {
                data = await Task.find({ user_id }, taskProjectin)
            } else {
                const isValidId = utils.isValidMongoId(task_id)
                if (!isValidId) return res.json({ success: false, message: `Invalid task Id` })
                data = await Task.findById(task_id).select(taskProjectin)
            }
            return res.json({ success: true, data })
        } catch (error) {
            return res.json({
                success: false,
                message: errorMessage || (error instanceof Error ? error.message : 'Unknown error occurred'),
            });
        }
    }

    private async deleteTask(req: Request, res: Response): Promise<Record<string, any>> {
        const { user_id, task_id } = req.params
        const isValidId = utils.isValidMongoId(task_id)
        if (!isValidId) return res.json({ success: false, message: `Invalid task Id` })
        try {
            const deleted = await Task.findByIdAndDelete(task_id)
            if (deleted) {
                return res.json({
                    success: true,
                    message: `Task deleted successfully`
                })
            } else {
                return res.json({
                    success: false,
                    message: `Task deletion failure!`
                })
            }
        } catch (error) {
            return res.json({
                success: false,
                message: errorMessage || (error instanceof Error ? error.message : 'Unknown error occurred'),
            });
        }
    }

    async login(req: Request, res: Response) {
        const { username, password } = req.body
        try {
            const user: IUser | null = await User.findOne({ username });
            if (!user) {
                return res.status(constants.NOT_FOUND_CODE).json({
                    success: false,
                    message: `User not found`,
                });
            }

            const passwordsMatch = await utils.comparePassword(password, user.password);
            if (!passwordsMatch) {
                return res.status(constants.BAD_REQUEST_CODE).json({
                    success: false,
                    message: `Incorrect password`,
                });
            }
            const strippedUser = utils.stripUser(user)
            const token = await utils.generateToken(strippedUser);
            if (!token) {
                return res.status(constants.INTERNAL_SERVER_CODE).json({
                    success: false,
                    message: `Internal server error.`,
                });
            }
            return res.json({
                success: true,
                token,
            });

        }
        catch (error) {
            return res.json({
                success: false,
                message: errorMessage || (error instanceof Error ? error.message : 'Unknown error occurred'),
            });
        }
    }
}

export const routeController = new RouteController().router;


