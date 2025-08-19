module.exports = {

"[externals]/fs [external] (fs, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}}),
"[project]/node_modules/.pnpm/@clerk+nextjs@6.30.2_next@15.4.6_react-dom@19.1.0_react@19.1.0__react@19.1.0__react-dom_3ff958a62ab96c8f1418931f065357e9/node_modules/@clerk/nextjs/dist/esm/server/keyless-telemetry.js [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "detectKeylessEnvDrift": ()=>detectKeylessEnvDrift
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$nextjs$40$6$2e$30$2e$2_next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$react$2d$dom_3ff958a62ab96c8f1418931f065357e9$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$createClerkClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+nextjs@6.30.2_next@15.4.6_react-dom@19.1.0_react@19.1.0__react@19.1.0__react-dom_3ff958a62ab96c8f1418931f065357e9/node_modules/@clerk/nextjs/dist/esm/server/createClerkClient.js [app-rsc] (ecmascript)");
;
;
;
;
const EVENT_KEYLESS_ENV_DRIFT_DETECTED = "KEYLESS_ENV_DRIFT_DETECTED";
const EVENT_SAMPLING_RATE = 1;
const TELEMETRY_FLAG_FILE = ".clerk/.tmp/telemetry.json";
function getTelemetryFlagFilePath() {
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"])(process.cwd(), TELEMETRY_FLAG_FILE);
}
async function tryMarkTelemetryEventAsFired() {
    try {
        const flagFilePath = getTelemetryFlagFilePath();
        const flagDirectory = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["dirname"])(flagFilePath);
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].mkdir(flagDirectory, {
            recursive: true
        });
        const flagData = {
            firedAt: /* @__PURE__ */ new Date().toISOString(),
            event: EVENT_KEYLESS_ENV_DRIFT_DETECTED
        };
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(flagFilePath, JSON.stringify(flagData, null, 2), {
            flag: "wx"
        });
        return true;
    } catch (error) {
        if ((error == null ? void 0 : error.code) === "EEXIST") {
            return false;
        }
        console.warn("Failed to create telemetry flag file:", error);
        return false;
    }
}
async function detectKeylessEnvDrift() {
    var _a, _b;
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const { safeParseClerkFile } = await __turbopack_context__.r("[project]/node_modules/.pnpm/@clerk+nextjs@6.30.2_next@15.4.6_react-dom@19.1.0_react@19.1.0__react@19.1.0__react-dom_3ff958a62ab96c8f1418931f065357e9/node_modules/@clerk/nextjs/dist/esm/server/keyless-node.js [app-rsc] (ecmascript, async loader)")(__turbopack_context__.i);
        const keylessFile = safeParseClerkFile();
        if (!keylessFile) {
            return;
        }
        const envPublishableKey = ("TURBOPACK compile-time value", "pk_test_YWN0aXZlLXVuaWNvcm4tMTEuY2xlcmsuYWNjb3VudHMuZGV2JA");
        const envSecretKey = process.env.CLERK_SECRET_KEY;
        const hasEnvVars = Boolean(envPublishableKey || envSecretKey);
        const keylessFileHasKeys = Boolean((keylessFile == null ? void 0 : keylessFile.publishableKey) && (keylessFile == null ? void 0 : keylessFile.secretKey));
        const envVarsMissing = !envPublishableKey && !envSecretKey;
        if (!hasEnvVars && !keylessFileHasKeys) {
            return;
        }
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        if (!keylessFileHasKeys) {
            return;
        }
        if (!hasEnvVars) {
            return;
        }
        const publicKeyMatch = Boolean(envPublishableKey && keylessFile.publishableKey && envPublishableKey === keylessFile.publishableKey);
        const secretKeyMatch = Boolean(envSecretKey && keylessFile.secretKey && envSecretKey === keylessFile.secretKey);
        const hasActualDrift = envPublishableKey && keylessFile.publishableKey && !publicKeyMatch || envSecretKey && keylessFile.secretKey && !secretKeyMatch;
        if (!hasActualDrift) {
            return;
        }
        const payload = {
            publicKeyMatch,
            secretKeyMatch,
            envVarsMissing,
            keylessFileHasKeys,
            keylessPublishableKey: (_a = keylessFile.publishableKey) != null ? _a : "",
            envPublishableKey: envPublishableKey != null ? envPublishableKey : ""
        };
        const clerkClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$nextjs$40$6$2e$30$2e$2_next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$react$2d$dom_3ff958a62ab96c8f1418931f065357e9$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$createClerkClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClerkClientWithOptions"])({
            publishableKey: keylessFile.publishableKey,
            secretKey: keylessFile.secretKey
        });
        const shouldFireEvent = await tryMarkTelemetryEventAsFired();
        if (shouldFireEvent) {
            const driftDetectedEvent = {
                event: EVENT_KEYLESS_ENV_DRIFT_DETECTED,
                eventSamplingRate: EVENT_SAMPLING_RATE,
                payload
            };
            (_b = clerkClient.telemetry) == null ? void 0 : _b.record(driftDetectedEvent);
        }
    } catch (error) {
        console.warn("Failed to detect keyless environment drift:", error);
    }
}
;
 //# sourceMappingURL=keyless-telemetry.js.map
}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__e6d84160._.js.map