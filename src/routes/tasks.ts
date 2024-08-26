import { Request, Response, NextFunction, Router } from 'express'

export default class TaskController {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    private routes() {
        this.router.get('/', this.list)
        this.router.post('/', this.create)
    }

    create(req: Request, res: Response) {
        res.json({ success: true, message: 'Created' });
    }

    list(req: Request, res: Response) {
        res.json({ success: true, message: 'List' });
    }
}

export const taskController = new TaskController().router;