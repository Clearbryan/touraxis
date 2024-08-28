import e, { Request, Response, Router } from 'express';
import { AuthenticatedRequest, IUser, MongoDBError } from '../types/types';
import { projections } from '../database/db';
import utils from '../utils';
import User from '../models/User';
import constants from '../constants';
import passport from 'passport';
import Task from '../models/Task';


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
            const result = handleMongoDBError(error);
            return res.json(result);
        }
    }

    async updateUser(req: AuthenticatedRequest, res: Response) {
        const { user_id } = req.params
        const isValidId = utils.isValidMongoId(user_id)
        const idMatch = utils.compreIds(user_id, req.user?._id)
        if (!isValidId) {
            return res.json({ success: false, message: `Invalid user Id` })
        } else if (!idMatch) {
            return res.json({ success: false, message: `Not authorized to perfom user update!` })
        } else try {
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
            return res.json(createErrorResponse(error, `Unknown error occurred`));
        }
    }

    private async listUser(req: AuthenticatedRequest, res: Response): Promise<Record<string, any>> {
        let data
        const { user_id } = req.params
        try {
            if (user_id) {
                const isValidId = utils.isValidMongoId(user_id)
                if (!isValidId) return res.json({ success: false, message: `Invalid user Id` })
                else data = await User.findById(user_id, projections.user)
            } else {
                data = await User.find().select(projections.user)
            }
            return res.json({ success: true, data })
        } catch (error) {
            return res.json(createErrorResponse(error, `Unknown error occurred`));
        }
    }

    private async deleteUser(req: AuthenticatedRequest, res: Response): Promise<Record<string, any>> {
        const { user_id } = req.params
        const isValidId = utils.isValidMongoId(user_id)
        const idMatch = utils.compreIds(user_id, req.user?._id)
        if (!isValidId) {
            return res.json({ success: false, message: `Invalid user Id` })
        } else if (!idMatch) {
            return res.json({ success: false, message: `Not authorized to delete user` })
        }
        else try {
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
            return res.json(createErrorResponse(error, `Unknown error occurred`));
        }
    }

    private async createTask(req: AuthenticatedRequest, res: Response): Promise<Response<IUser>> {
        const { user_id } = req.params
        try {
            const isValidId = utils.isValidMongoId(user_id)
            const idMatch = utils.compreIds(user_id, req.user?._id)
            if (!isValidId) {
                return res.json({ success: false, message: `Invalid user Id` })
            } else if (!idMatch) {
                return res.json({ success: false, message: `Not authorized to create task` })
            }
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
            const result = handleMongoDBError(error);
            return res.json(result);
        }
    }

    private async updateTask(req: AuthenticatedRequest, res: Response): Promise<Response<IUser>> {
        const { task_id, user_id } = req.params
        const isValidId = utils.isValidMongoId(task_id)
        const idMatch = utils.compreIds(user_id, req.user?._id)
        if (!isValidId) {
            return res.json({ success: false, message: `Invalid task Id` })
        } else if (!idMatch) {
            return res.json({ success: false, message: `Not authorized to update task` })
        }
        else {
            try {
                const updated = await Task.findByIdAndUpdate(task_id, req.body)
                if (updated) {
                    return res.json({
                        success: true,
                        message: `Task updated successfully`
                    })
                } else {
                    return res.json({
                        success: false,
                        message: `Task update failure!`
                    })
                }
            } catch (error) {
                return res.json(createErrorResponse(error, `Unknown error occurred`));
            }
        }

    }

    private async listTask(req: AuthenticatedRequest, res: Response): Promise<Record<string, any>> {
        let data
        const { user_id, task_id } = req.params
        const isValidId = utils.isValidMongoId(user_id)
        if (!isValidId) return res.json({ success: false, message: `Invalid user Id` })
        try {
            if (!task_id) {
                data = await Task.find({ user_id }, projections.task)
            } else {
                const isValidId = utils.isValidMongoId(task_id)
                if (!isValidId) return res.json({ success: false, message: `Invalid task Id` })
                data = await Task.findById(task_id).select(projections.task)
            }
            return res.json({ success: true, data })
        } catch (error) {
            return res.json(createErrorResponse(error, `Unknown error occurred`));
        }
    }

    private async deleteTask(req: AuthenticatedRequest, res: Response): Promise<Record<string, any>> {
        const { task_id, user_id } = req.params
        const isValidId = utils.isValidMongoId(task_id)
        const idMatch = utils.compreIds(user_id, req.user?._id)
        if (!isValidId) {
            return res.json({ success: false, message: `Invalid task Id` })
        } else if (!idMatch) {
            return res.json({ success: false, message: `Unauthorized to delete task` })
        }
        else try {
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
            return res.json(createErrorResponse(error, `Unknown error occurred`));
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
            const token = await utils.generateToken(user);
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
            return res.json(createErrorResponse(error, `Unknown error occurred`));
        }
    }
}

export const routeController = new RouteController().router;

// handle mongo error
function handleMongoDBError(error: unknown): { success: boolean; message: string } {
    let errorMessage: string = '';

    // Check if the error is a MongoDB error
    if ((error as MongoDBError).code === 11000) {
        const errorDetails = Object.entries((error as MongoDBError).keyValue).map(
            ([key, value]) => { return { key, value }; }
        );
        errorMessage = `${errorDetails[0].value} already exists!`;
    }
    // Handle other types of errors
    return {
        success: false,
        message: errorMessage || (error instanceof Error ? error.message : 'Unknown error occurred'),
    };
}

// utility function for generic error response
function createErrorResponse(error: unknown, errorMessage?: string): { success: boolean; message: string } {
    return {
        success: false,
        message: errorMessage || (error instanceof Error ? error.message : 'Unknown error occurred'),
    };
}