import { LoggerInterface } from "@george_freeman/genetic-portrait-generator/dist/services";
export default class WindowsLogger implements LoggerInterface {
    debug(msg: string): void;
    error(msg: string): void;
    loading(msg: string): void;
    log(msg: string): void;
    warn(msg: string): void;
}
//# sourceMappingURL=WindowsLogger.d.ts.map