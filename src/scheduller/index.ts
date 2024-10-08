import { CronJob } from 'cron';
import Task from '../models/Task';
import constants from '../constants'
import { connect, projections } from '../database/db'
import { ITask } from '../types/types';

// Connect app to database
connect()

export function jobScheduller(name: string, interval: any, timezone: string): void {
    const query: Record<string, any> = {
        status: constants.TASK_STATUSES.PENDING,
        next_execute_date_time: { $lt: new Date().toISOString() }
    };
    new CronJob(`${interval.join(' ')}`, async () => {
        const pendingTasks: ITask[] = await Task.find(query, projections.task)
        console.log(`Running shedulled task: ${name}`, { pendingTasks });
        if (pendingTasks && pendingTasks.length) {
            const taskIds: ITask[] = pendingTasks.filter(task => task._id)
            try {
                await Task.updateMany({
                    _id: {
                        $in: taskIds
                    }
                }, { status: constants.TASK_STATUSES.Done })
                console.log(`Found and updated ${pendingTasks.length} task(s).`)
            } catch (error) {
                console.log(`Error updating pending task(s): `, { error });
            }
        } else console.log(`Found ${pendingTasks.length} task(s) in pending.`)
    }, null, true, timezone)
}

jobScheduller('Process Pending Tasks', [0, '*/30', '*', '*', '*', '*'], 'Africa/Johannesburg')


