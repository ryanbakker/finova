module.exports = {

"[project]/node_modules/.pnpm/@clerk+nextjs@6.30.2_next@15.4.6_react-dom@19.1.0_react@19.1.0__react@19.1.0__react-dom_3ff958a62ab96c8f1418931f065357e9/node_modules/@clerk/nextjs/dist/esm/server/keyless-log-cache.js [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "clerkDevelopmentCache": ()=>clerkDevelopmentCache,
    "createConfirmationMessage": ()=>createConfirmationMessage,
    "createKeylessModeMessage": ()=>createKeylessModeMessage
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/utils/index.mjs [app-rsc] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7HPDNZ3R$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-7HPDNZ3R.mjs [app-rsc] (ecmascript)");
;
;
const THROTTLE_DURATION_MS = 10 * 60 * 1e3;
function createClerkDevCache() {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7HPDNZ3R$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isDevelopmentEnvironment"])()) {
        return;
    }
    if (!("TURBOPACK ident replacement", globalThis).__clerk_internal_keyless_logger) {
        ("TURBOPACK ident replacement", globalThis).__clerk_internal_keyless_logger = {
            __cache: /* @__PURE__ */ new Map(),
            log: function({ cacheKey, msg }) {
                var _a;
                if (this.__cache.has(cacheKey) && Date.now() < (((_a = this.__cache.get(cacheKey)) == null ? void 0 : _a.expiresAt) || 0)) {
                    return;
                }
                console.log(msg);
                this.__cache.set(cacheKey, {
                    expiresAt: Date.now() + THROTTLE_DURATION_MS
                });
            },
            run: async function(callback, { cacheKey, onSuccessStale = THROTTLE_DURATION_MS, onErrorStale = THROTTLE_DURATION_MS }) {
                var _a, _b;
                if (this.__cache.has(cacheKey) && Date.now() < (((_a = this.__cache.get(cacheKey)) == null ? void 0 : _a.expiresAt) || 0)) {
                    return (_b = this.__cache.get(cacheKey)) == null ? void 0 : _b.data;
                }
                try {
                    const result = await callback();
                    this.__cache.set(cacheKey, {
                        expiresAt: Date.now() + onSuccessStale,
                        data: result
                    });
                    return result;
                } catch (e) {
                    this.__cache.set(cacheKey, {
                        expiresAt: Date.now() + onErrorStale
                    });
                    throw e;
                }
            }
        };
    }
    return globalThis.__clerk_internal_keyless_logger;
}
const createKeylessModeMessage = (keys)=>{
    return `
\x1B[35m
[Clerk]:\x1B[0m You are running in keyless mode.
You can \x1B[35mclaim your keys\x1B[0m by visiting ${keys.claimUrl}
`;
};
const createConfirmationMessage = ()=>{
    return `
\x1B[35m
[Clerk]:\x1B[0m Your application is running with your claimed keys.
You can safely remove the \x1B[35m.clerk/\x1B[0m from your project.
`;
};
const clerkDevelopmentCache = createClerkDevCache();
;
 //# sourceMappingURL=keyless-log-cache.js.map
}),

};

//# sourceMappingURL=f34d9_%40clerk_nextjs_dist_esm_server_keyless-log-cache_0828dfd4.js.map