"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WindowsLogger {
    debug(msg) {
        console.log(msg);
    }
    error(msg) {
        console.error(msg);
    }
    loading(msg) {
        const percentage = Number.parseInt(msg);
        console.clear();
        let loadingBar = "";
        loadingBar += createString("-", Math.round(percentage));
        loadingBar += createString("_", 100 - Math.round(percentage));
        loadingBar += " | " + Math.round(percentage * 100) / 100 + "%";
        console.debug(loadingBar);
        console.log();
        function createString(char, len) {
            let str = "";
            for (let i = 0; i < len; i++) {
                str += char;
            }
            return str;
        }
    }
    log(msg) {
        console.log(msg);
    }
    warn(msg) {
        console.warn(msg);
    }
}
exports.default = WindowsLogger;
//# sourceMappingURL=WindowsLogger.js.map