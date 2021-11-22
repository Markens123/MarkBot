import { exec } from 'child_process';

export default identify = (url, callback, boat) => {
    let proc = exec(`python3 src/scripts/resnext.py ${url}`, { timeout: 20000 }, (error, stdout, stderr) => {
        if (!stdout) {
            exec(`kill ${proc.pid}`, (killError, killStdout, killStderr) => {

                if (error) {
                    boat.log.error('Image processing (Identify.ts)', `Failed to kill process ${proc.pid}`);
                }

                boat.log.error('Image processing (Identify.ts)', '[ERROR] %s', stderr);
            });

            proc.unref();

            return callback("PROCESS_TIMEOUT");
        }

        let output = stdout.replace(/(\r\n|\n|\r)/gm, "");
        callback(output);
    });
}