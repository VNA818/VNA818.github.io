import 'dotenv/config';
import { spawnSync } from "child_process";

if(!process.env.SERVER_USER || !process.env.SERVER_IP) {
    console.log("Please set SERVER_USER and SERVER_IP environment variables");
}
const cpyCmd = `scp -r ./dist/* ${process.env.SERVER_USER}@${process.env.SERVER_IP}:~/documents/server/web/static`;
console.log("Executing", cpyCmd);
spawnSync(cpyCmd, { shell: true, stdio: "inherit" })