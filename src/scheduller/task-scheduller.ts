import { spawn } from "child_process";

export function runSchedulledTask(filePath: string) {
    const task = spawn('node', [`${filePath}`])

    task.stdout.on('data', (data) => {
        console.log(`${data}`);
    });

    task.stderr.on('data', (data) => {
        console.error(`${data}`);
    });

    task.on('close', (code) => {
        console.log(`Shedulled task process exited with ${code}`);
    });
}


