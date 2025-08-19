(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-35WGBVWP.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

// src/error.ts
__turbopack_context__.s({
    "ClerkAPIResponseError": ()=>ClerkAPIResponseError,
    "ClerkRuntimeError": ()=>ClerkRuntimeError,
    "ClerkWebAuthnError": ()=>ClerkWebAuthnError,
    "EmailLinkError": ()=>EmailLinkError,
    "EmailLinkErrorCode": ()=>EmailLinkErrorCode,
    "EmailLinkErrorCodeStatus": ()=>EmailLinkErrorCodeStatus,
    "buildErrorThrower": ()=>buildErrorThrower,
    "errorToJSON": ()=>errorToJSON,
    "is4xxError": ()=>is4xxError,
    "isCaptchaError": ()=>isCaptchaError,
    "isClerkAPIResponseError": ()=>isClerkAPIResponseError,
    "isClerkRuntimeError": ()=>isClerkRuntimeError,
    "isEmailLinkError": ()=>isEmailLinkError,
    "isKnownError": ()=>isKnownError,
    "isMetamaskError": ()=>isMetamaskError,
    "isNetworkError": ()=>isNetworkError,
    "isPasswordPwnedError": ()=>isPasswordPwnedError,
    "isReverificationCancelledError": ()=>isReverificationCancelledError,
    "isUnauthorizedError": ()=>isUnauthorizedError,
    "isUserLockedError": ()=>isUserLockedError,
    "parseError": ()=>parseError,
    "parseErrors": ()=>parseErrors
});
function isUnauthorizedError(e) {
    var _e_errors_, _e_errors;
    const status = e === null || e === void 0 ? void 0 : e.status;
    const code = e === null || e === void 0 ? void 0 : (_e_errors = e.errors) === null || _e_errors === void 0 ? void 0 : (_e_errors_ = _e_errors[0]) === null || _e_errors_ === void 0 ? void 0 : _e_errors_.code;
    return code === "authentication_invalid" && status === 401;
}
function isCaptchaError(e) {
    return [
        "captcha_invalid",
        "captcha_not_enabled",
        "captcha_missing_token"
    ].includes(e.errors[0].code);
}
function is4xxError(e) {
    const status = e === null || e === void 0 ? void 0 : e.status;
    return !!status && status >= 400 && status < 500;
}
function isNetworkError(e) {
    const message = ("".concat(e.message).concat(e.name) || "").toLowerCase().replace(/\s+/g, "");
    return message.includes("networkerror");
}
function isKnownError(error) {
    return isClerkAPIResponseError(error) || isMetamaskError(error) || isClerkRuntimeError(error);
}
function isClerkAPIResponseError(err) {
    return "clerkError" in err;
}
function isClerkRuntimeError(err) {
    return "clerkRuntimeError" in err;
}
function isReverificationCancelledError(err) {
    return isClerkRuntimeError(err) && err.code === "reverification_cancelled";
}
function isMetamaskError(err) {
    return "code" in err && [
        4001,
        32602,
        32603
    ].includes(err.code) && "message" in err;
}
function isUserLockedError(err) {
    var _err_errors_, _err_errors;
    return isClerkAPIResponseError(err) && ((_err_errors = err.errors) === null || _err_errors === void 0 ? void 0 : (_err_errors_ = _err_errors[0]) === null || _err_errors_ === void 0 ? void 0 : _err_errors_.code) === "user_locked";
}
function isPasswordPwnedError(err) {
    var _err_errors_, _err_errors;
    return isClerkAPIResponseError(err) && ((_err_errors = err.errors) === null || _err_errors === void 0 ? void 0 : (_err_errors_ = _err_errors[0]) === null || _err_errors_ === void 0 ? void 0 : _err_errors_.code) === "form_password_pwned";
}
function parseErrors() {
    let data = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    return data.length > 0 ? data.map(parseError) : [];
}
function parseError(error) {
    var _error_meta, _error_meta1, _error_meta2, _error_meta3, _error_meta4, _error_meta5, _error_meta6;
    return {
        code: error.code,
        message: error.message,
        longMessage: error.long_message,
        meta: {
            paramName: error === null || error === void 0 ? void 0 : (_error_meta = error.meta) === null || _error_meta === void 0 ? void 0 : _error_meta.param_name,
            sessionId: error === null || error === void 0 ? void 0 : (_error_meta1 = error.meta) === null || _error_meta1 === void 0 ? void 0 : _error_meta1.session_id,
            emailAddresses: error === null || error === void 0 ? void 0 : (_error_meta2 = error.meta) === null || _error_meta2 === void 0 ? void 0 : _error_meta2.email_addresses,
            identifiers: error === null || error === void 0 ? void 0 : (_error_meta3 = error.meta) === null || _error_meta3 === void 0 ? void 0 : _error_meta3.identifiers,
            zxcvbn: error === null || error === void 0 ? void 0 : (_error_meta4 = error.meta) === null || _error_meta4 === void 0 ? void 0 : _error_meta4.zxcvbn,
            plan: error === null || error === void 0 ? void 0 : (_error_meta5 = error.meta) === null || _error_meta5 === void 0 ? void 0 : _error_meta5.plan,
            isPlanUpgradePossible: error === null || error === void 0 ? void 0 : (_error_meta6 = error.meta) === null || _error_meta6 === void 0 ? void 0 : _error_meta6.is_plan_upgrade_possible
        }
    };
}
function errorToJSON(error) {
    var _error_meta, _error_meta1, _error_meta2, _error_meta3, _error_meta4, _error_meta5, _error_meta6;
    return {
        code: (error === null || error === void 0 ? void 0 : error.code) || "",
        message: (error === null || error === void 0 ? void 0 : error.message) || "",
        long_message: error === null || error === void 0 ? void 0 : error.longMessage,
        meta: {
            param_name: error === null || error === void 0 ? void 0 : (_error_meta = error.meta) === null || _error_meta === void 0 ? void 0 : _error_meta.paramName,
            session_id: error === null || error === void 0 ? void 0 : (_error_meta1 = error.meta) === null || _error_meta1 === void 0 ? void 0 : _error_meta1.sessionId,
            email_addresses: error === null || error === void 0 ? void 0 : (_error_meta2 = error.meta) === null || _error_meta2 === void 0 ? void 0 : _error_meta2.emailAddresses,
            identifiers: error === null || error === void 0 ? void 0 : (_error_meta3 = error.meta) === null || _error_meta3 === void 0 ? void 0 : _error_meta3.identifiers,
            zxcvbn: error === null || error === void 0 ? void 0 : (_error_meta4 = error.meta) === null || _error_meta4 === void 0 ? void 0 : _error_meta4.zxcvbn,
            plan: error === null || error === void 0 ? void 0 : (_error_meta5 = error.meta) === null || _error_meta5 === void 0 ? void 0 : _error_meta5.plan,
            is_plan_upgrade_possible: error === null || error === void 0 ? void 0 : (_error_meta6 = error.meta) === null || _error_meta6 === void 0 ? void 0 : _error_meta6.isPlanUpgradePossible
        }
    };
}
var ClerkAPIResponseError = class _ClerkAPIResponseError extends Error {
    constructor(message, { data, status, clerkTraceId, retryAfter }){
        super(message);
        this.toString = ()=>{
            let message = "[".concat(this.name, "]\nMessage:").concat(this.message, "\nStatus:").concat(this.status, "\nSerialized errors: ").concat(this.errors.map((e)=>JSON.stringify(e)));
            if (this.clerkTraceId) {
                message += "\nClerk Trace ID: ".concat(this.clerkTraceId);
            }
            return message;
        };
        Object.setPrototypeOf(this, _ClerkAPIResponseError.prototype);
        this.status = status;
        this.message = message;
        this.clerkTraceId = clerkTraceId;
        this.retryAfter = retryAfter;
        this.clerkError = true;
        this.errors = parseErrors(data);
    }
};
var ClerkRuntimeError = class _ClerkRuntimeError extends Error {
    constructor(message, { code }){
        const prefix = "\u{1F512} Clerk:";
        const regex = new RegExp(prefix.replace(" ", "\\s*"), "i");
        const sanitized = message.replace(regex, "");
        const _message = "".concat(prefix, " ").concat(sanitized.trim(), '\n\n(code="').concat(code, '")\n');
        super(_message);
        /**
     * Returns a string representation of the error.
     *
     * @returns A formatted string with the error name and message.
     */ this.toString = ()=>{
            return "[".concat(this.name, "]\nMessage:").concat(this.message);
        };
        Object.setPrototypeOf(this, _ClerkRuntimeError.prototype);
        this.code = code;
        this.message = _message;
        this.clerkRuntimeError = true;
        this.name = "ClerkRuntimeError";
    }
};
var EmailLinkError = class _EmailLinkError extends Error {
    constructor(code){
        super(code);
        this.code = code;
        this.name = "EmailLinkError";
        Object.setPrototypeOf(this, _EmailLinkError.prototype);
    }
};
function isEmailLinkError(err) {
    return err.name === "EmailLinkError";
}
var EmailLinkErrorCode = {
    Expired: "expired",
    Failed: "failed",
    ClientMismatch: "client_mismatch"
};
var EmailLinkErrorCodeStatus = {
    Expired: "expired",
    Failed: "failed",
    ClientMismatch: "client_mismatch"
};
var DefaultMessages = Object.freeze({
    InvalidProxyUrlErrorMessage: "The proxyUrl passed to Clerk is invalid. The expected value for proxyUrl is an absolute URL or a relative path with a leading '/'. (key={{url}})",
    InvalidPublishableKeyErrorMessage: "The publishableKey passed to Clerk is invalid. You can get your Publishable key at https://dashboard.clerk.com/last-active?path=api-keys. (key={{key}})",
    MissingPublishableKeyErrorMessage: "Missing publishableKey. You can get your key at https://dashboard.clerk.com/last-active?path=api-keys.",
    MissingSecretKeyErrorMessage: "Missing secretKey. You can get your key at https://dashboard.clerk.com/last-active?path=api-keys.",
    MissingClerkProvider: "{{source}} can only be used within the <ClerkProvider /> component. Learn more: https://clerk.com/docs/components/clerk-provider"
});
function buildErrorThrower(param) {
    let { packageName, customMessages } = param;
    let pkg = packageName;
    function buildMessage(rawMessage, replacements) {
        if (!replacements) {
            return "".concat(pkg, ": ").concat(rawMessage);
        }
        let msg = rawMessage;
        const matches = rawMessage.matchAll(/{{([a-zA-Z0-9-_]+)}}/g);
        for (const match of matches){
            const replacement = (replacements[match[1]] || "").toString();
            msg = msg.replace("{{".concat(match[1], "}}"), replacement);
        }
        return "".concat(pkg, ": ").concat(msg);
    }
    const messages = {
        ...DefaultMessages,
        ...customMessages
    };
    return {
        setPackageName (param) {
            let { packageName: packageName2 } = param;
            if (typeof packageName2 === "string") {
                pkg = packageName2;
            }
            return this;
        },
        setMessages (param) {
            let { customMessages: customMessages2 } = param;
            Object.assign(messages, customMessages2 || {});
            return this;
        },
        throwInvalidPublishableKeyError (params) {
            throw new Error(buildMessage(messages.InvalidPublishableKeyErrorMessage, params));
        },
        throwInvalidProxyUrl (params) {
            throw new Error(buildMessage(messages.InvalidProxyUrlErrorMessage, params));
        },
        throwMissingPublishableKeyError () {
            throw new Error(buildMessage(messages.MissingPublishableKeyErrorMessage));
        },
        throwMissingSecretKeyError () {
            throw new Error(buildMessage(messages.MissingSecretKeyErrorMessage));
        },
        throwMissingClerkProviderError (params) {
            throw new Error(buildMessage(messages.MissingClerkProvider, params));
        },
        throw (message) {
            throw new Error(buildMessage(message));
        }
    };
}
var ClerkWebAuthnError = class extends ClerkRuntimeError {
    constructor(message, { code }){
        super(message, {
            code
        });
        this.code = code;
    }
};
;
 //# sourceMappingURL=chunk-35WGBVWP.mjs.map
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-7ELT755Q.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "__export": ()=>__export,
    "__privateAdd": ()=>__privateAdd,
    "__privateGet": ()=>__privateGet,
    "__privateMethod": ()=>__privateMethod,
    "__privateSet": ()=>__privateSet,
    "__reExport": ()=>__reExport
});
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __typeError = (msg)=>{
    throw TypeError(msg);
};
var __export = (target, all)=>{
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
var __copyProps = (to, from, except, desc)=>{
    if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
            get: ()=>from[key],
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
    }
    return to;
};
var __reExport = (target, mod, secondTarget)=>(__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __accessCheck = (obj, member, msg)=>member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter)=>(__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value)=>member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter)=>(__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method)=>(__accessCheck(obj, member, "access private method"), method);
;
 //# sourceMappingURL=chunk-7ELT755Q.mjs.map
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/error.mjs [app-client] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$35WGBVWP$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-35WGBVWP.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-7ELT755Q.mjs [app-client] (ecmascript)");
;
;
;
 //# sourceMappingURL=error.mjs.map
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/error.mjs [app-client] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$35WGBVWP$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-35WGBVWP.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-7ELT755Q.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$error$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/error.mjs [app-client] (ecmascript) <locals>");
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-3CN5LOSN.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

// src/authorization.ts
__turbopack_context__.s({
    "createCheckAuthorization": ()=>createCheckAuthorization,
    "resolveAuthState": ()=>resolveAuthState,
    "splitByScope": ()=>splitByScope,
    "validateReverificationConfig": ()=>validateReverificationConfig
});
var TYPES_TO_OBJECTS = {
    strict_mfa: {
        afterMinutes: 10,
        level: "multi_factor"
    },
    strict: {
        afterMinutes: 10,
        level: "second_factor"
    },
    moderate: {
        afterMinutes: 60,
        level: "second_factor"
    },
    lax: {
        afterMinutes: 1440,
        level: "second_factor"
    }
};
var ALLOWED_LEVELS = /* @__PURE__ */ new Set([
    "first_factor",
    "second_factor",
    "multi_factor"
]);
var ALLOWED_TYPES = /* @__PURE__ */ new Set([
    "strict_mfa",
    "strict",
    "moderate",
    "lax"
]);
var isValidMaxAge = (maxAge)=>typeof maxAge === "number" && maxAge > 0;
var isValidLevel = (level)=>ALLOWED_LEVELS.has(level);
var isValidVerificationType = (type)=>ALLOWED_TYPES.has(type);
var prefixWithOrg = (value)=>value.replace(/^(org:)*/, "org:");
var checkOrgAuthorization = (params, options)=>{
    const { orgId, orgRole, orgPermissions } = options;
    if (!params.role && !params.permission) {
        return null;
    }
    if (!orgId || !orgRole || !orgPermissions) {
        return null;
    }
    if (params.permission) {
        return orgPermissions.includes(prefixWithOrg(params.permission));
    }
    if (params.role) {
        return prefixWithOrg(orgRole) === prefixWithOrg(params.role);
    }
    return null;
};
var checkForFeatureOrPlan = (claim, featureOrPlan)=>{
    const { org: orgFeatures, user: userFeatures } = splitByScope(claim);
    const [scope, _id] = featureOrPlan.split(":");
    const id = _id || scope;
    if (scope === "org") {
        return orgFeatures.includes(id);
    } else if (scope === "user") {
        return userFeatures.includes(id);
    } else {
        return [
            ...orgFeatures,
            ...userFeatures
        ].includes(id);
    }
};
var checkBillingAuthorization = (params, options)=>{
    const { features, plans } = options;
    if (params.feature && features) {
        return checkForFeatureOrPlan(features, params.feature);
    }
    if (params.plan && plans) {
        return checkForFeatureOrPlan(plans, params.plan);
    }
    return null;
};
var splitByScope = (fea)=>{
    const features = fea ? fea.split(",").map((f)=>f.trim()) : [];
    return {
        org: features.filter((f)=>f.split(":")[0].includes("o")).map((f)=>f.split(":")[1]),
        user: features.filter((f)=>f.split(":")[0].includes("u")).map((f)=>f.split(":")[1])
    };
};
var validateReverificationConfig = (config)=>{
    if (!config) {
        return false;
    }
    const convertConfigToObject = (config2)=>{
        if (typeof config2 === "string") {
            return TYPES_TO_OBJECTS[config2];
        }
        return config2;
    };
    const isValidStringValue = typeof config === "string" && isValidVerificationType(config);
    const isValidObjectValue = typeof config === "object" && isValidLevel(config.level) && isValidMaxAge(config.afterMinutes);
    if (isValidStringValue || isValidObjectValue) {
        return convertConfigToObject.bind(null, config);
    }
    return false;
};
var checkReverificationAuthorization = (params, param)=>{
    let { factorVerificationAge } = param;
    if (!params.reverification || !factorVerificationAge) {
        return null;
    }
    const isValidReverification = validateReverificationConfig(params.reverification);
    if (!isValidReverification) {
        return null;
    }
    const { level, afterMinutes } = isValidReverification();
    const [factor1Age, factor2Age] = factorVerificationAge;
    const isValidFactor1 = factor1Age !== -1 ? afterMinutes > factor1Age : null;
    const isValidFactor2 = factor2Age !== -1 ? afterMinutes > factor2Age : null;
    switch(level){
        case "first_factor":
            return isValidFactor1;
        case "second_factor":
            return factor2Age !== -1 ? isValidFactor2 : isValidFactor1;
        case "multi_factor":
            return factor2Age === -1 ? isValidFactor1 : isValidFactor1 && isValidFactor2;
    }
};
var createCheckAuthorization = (options)=>{
    return (params)=>{
        if (!options.userId) {
            return false;
        }
        const billingAuthorization = checkBillingAuthorization(params, options);
        const orgAuthorization = checkOrgAuthorization(params, options);
        const reverificationAuthorization = checkReverificationAuthorization(params, options);
        if ([
            billingAuthorization || orgAuthorization,
            reverificationAuthorization
        ].some((a)=>a === null)) {
            return [
                billingAuthorization || orgAuthorization,
                reverificationAuthorization
            ].some((a)=>a === true);
        }
        return [
            billingAuthorization || orgAuthorization,
            reverificationAuthorization
        ].every((a)=>a === true);
    };
};
var resolveAuthState = (param)=>{
    let { authObject: { sessionId, sessionStatus, userId, actor, orgId, orgRole, orgSlug, signOut, getToken, has, sessionClaims }, options: { treatPendingAsSignedOut = true } } = param;
    if (sessionId === void 0 && userId === void 0) {
        return {
            isLoaded: false,
            isSignedIn: void 0,
            sessionId,
            sessionClaims: void 0,
            userId,
            actor: void 0,
            orgId: void 0,
            orgRole: void 0,
            orgSlug: void 0,
            has: void 0,
            signOut,
            getToken
        };
    }
    if (sessionId === null && userId === null) {
        return {
            isLoaded: true,
            isSignedIn: false,
            sessionId,
            userId,
            sessionClaims: null,
            actor: null,
            orgId: null,
            orgRole: null,
            orgSlug: null,
            has: ()=>false,
            signOut,
            getToken
        };
    }
    if (treatPendingAsSignedOut && sessionStatus === "pending") {
        return {
            isLoaded: true,
            isSignedIn: false,
            sessionId: null,
            userId: null,
            sessionClaims: null,
            actor: null,
            orgId: null,
            orgRole: null,
            orgSlug: null,
            has: ()=>false,
            signOut,
            getToken
        };
    }
    if (!!sessionId && !!sessionClaims && !!userId && !!orgId && !!orgRole) {
        return {
            isLoaded: true,
            isSignedIn: true,
            sessionId,
            sessionClaims,
            userId,
            actor: actor || null,
            orgId,
            orgRole,
            orgSlug: orgSlug || null,
            has,
            signOut,
            getToken
        };
    }
    if (!!sessionId && !!sessionClaims && !!userId && !orgId) {
        return {
            isLoaded: true,
            isSignedIn: true,
            sessionId,
            sessionClaims,
            userId,
            actor: actor || null,
            orgId: null,
            orgRole: null,
            orgSlug: null,
            has,
            signOut,
            getToken
        };
    }
};
;
 //# sourceMappingURL=chunk-3CN5LOSN.mjs.map
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/authorization.mjs [app-client] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$3CN5LOSN$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-3CN5LOSN.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-7ELT755Q.mjs [app-client] (ecmascript)");
;
;
;
 //# sourceMappingURL=authorization.mjs.map
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/authorization.mjs [app-client] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$3CN5LOSN$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-3CN5LOSN.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-7ELT755Q.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$authorization$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/authorization.mjs [app-client] (ecmascript) <locals>");
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-GGFRMWFO.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

// src/underscore.ts
__turbopack_context__.s({
    "camelToSnake": ()=>camelToSnake,
    "deepCamelToSnake": ()=>deepCamelToSnake,
    "deepSnakeToCamel": ()=>deepSnakeToCamel,
    "getNonUndefinedValues": ()=>getNonUndefinedValues,
    "isIPV4Address": ()=>isIPV4Address,
    "isTruthy": ()=>isTruthy,
    "snakeToCamel": ()=>snakeToCamel,
    "titleize": ()=>titleize,
    "toSentence": ()=>toSentence
});
var toSentence = (items)=>{
    if (items.length == 0) {
        return "";
    }
    if (items.length == 1) {
        return items[0];
    }
    let sentence = items.slice(0, -1).join(", ");
    sentence += ", or ".concat(items.slice(-1));
    return sentence;
};
var IP_V4_ADDRESS_REGEX = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
function isIPV4Address(str) {
    return IP_V4_ADDRESS_REGEX.test(str || "");
}
function titleize(str) {
    const s = str || "";
    return s.charAt(0).toUpperCase() + s.slice(1);
}
function snakeToCamel(str) {
    return str ? str.replace(/([-_][a-z])/g, (match)=>match.toUpperCase().replace(/-|_/, "")) : "";
}
function camelToSnake(str) {
    return str ? str.replace(/[A-Z]/g, (letter)=>"_".concat(letter.toLowerCase())) : "";
}
var createDeepObjectTransformer = (transform)=>{
    const deepTransform = (obj)=>{
        if (!obj) {
            return obj;
        }
        if (Array.isArray(obj)) {
            return obj.map((el)=>{
                if (typeof el === "object" || Array.isArray(el)) {
                    return deepTransform(el);
                }
                return el;
            });
        }
        const copy = {
            ...obj
        };
        const keys = Object.keys(copy);
        for (const oldName of keys){
            const newName = transform(oldName.toString());
            if (newName !== oldName) {
                copy[newName] = copy[oldName];
                delete copy[oldName];
            }
            if (typeof copy[newName] === "object") {
                copy[newName] = deepTransform(copy[newName]);
            }
        }
        return copy;
    };
    return deepTransform;
};
var deepCamelToSnake = createDeepObjectTransformer(camelToSnake);
var deepSnakeToCamel = createDeepObjectTransformer(snakeToCamel);
function isTruthy(value) {
    if (typeof value === "boolean") {
        return value;
    }
    if (value === void 0 || value === null) {
        return false;
    }
    if (typeof value === "string") {
        if (value.toLowerCase() === "true") {
            return true;
        }
        if (value.toLowerCase() === "false") {
            return false;
        }
    }
    const number = parseInt(value, 10);
    if (isNaN(number)) {
        return false;
    }
    if (number > 0) {
        return true;
    }
    return false;
}
function getNonUndefinedValues(obj) {
    return Object.entries(obj).reduce((acc, param)=>{
        let [key, value] = param;
        if (value !== void 0) {
            acc[key] = value;
        }
        return acc;
    }, {});
}
;
 //# sourceMappingURL=chunk-GGFRMWFO.mjs.map
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-TETGTEI2.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

// src/isomorphicAtob.ts
__turbopack_context__.s({
    "isomorphicAtob": ()=>isomorphicAtob
});
var isomorphicAtob = (data)=>{
    if (typeof atob !== "undefined" && typeof atob === "function") {
        return atob(data);
    } else if (("TURBOPACK compile-time value", "object") !== "undefined" && ("TURBOPACK ident replacement", globalThis).Buffer) {
        return new ("TURBOPACK ident replacement", globalThis).Buffer(data, "base64").toString();
    }
    return data;
};
;
 //# sourceMappingURL=chunk-TETGTEI2.mjs.map
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-KOH7GTJO.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

// src/isomorphicBtoa.ts
__turbopack_context__.s({
    "isomorphicBtoa": ()=>isomorphicBtoa
});
var isomorphicBtoa = (data)=>{
    if (typeof btoa !== "undefined" && typeof btoa === "function") {
        return btoa(data);
    } else if (("TURBOPACK compile-time value", "object") !== "undefined" && ("TURBOPACK ident replacement", globalThis).Buffer) {
        return new ("TURBOPACK ident replacement", globalThis).Buffer(data).toString("base64");
    }
    return data;
};
;
 //# sourceMappingURL=chunk-KOH7GTJO.mjs.map
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-I6MTSTOF.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

// src/constants.ts
__turbopack_context__.s({
    "CURRENT_DEV_INSTANCE_SUFFIXES": ()=>CURRENT_DEV_INSTANCE_SUFFIXES,
    "DEV_OR_STAGING_SUFFIXES": ()=>DEV_OR_STAGING_SUFFIXES,
    "LEGACY_DEV_INSTANCE_SUFFIXES": ()=>LEGACY_DEV_INSTANCE_SUFFIXES,
    "LOCAL_API_URL": ()=>LOCAL_API_URL,
    "LOCAL_ENV_SUFFIXES": ()=>LOCAL_ENV_SUFFIXES,
    "PROD_API_URL": ()=>PROD_API_URL,
    "STAGING_API_URL": ()=>STAGING_API_URL,
    "STAGING_ENV_SUFFIXES": ()=>STAGING_ENV_SUFFIXES,
    "iconImageUrl": ()=>iconImageUrl
});
var LEGACY_DEV_INSTANCE_SUFFIXES = [
    ".lcl.dev",
    ".lclstage.dev",
    ".lclclerk.com"
];
var CURRENT_DEV_INSTANCE_SUFFIXES = [
    ".accounts.dev",
    ".accountsstage.dev",
    ".accounts.lclclerk.com"
];
var DEV_OR_STAGING_SUFFIXES = [
    ".lcl.dev",
    ".stg.dev",
    ".lclstage.dev",
    ".stgstage.dev",
    ".dev.lclclerk.com",
    ".stg.lclclerk.com",
    ".accounts.lclclerk.com",
    "accountsstage.dev",
    "accounts.dev"
];
var LOCAL_ENV_SUFFIXES = [
    ".lcl.dev",
    "lclstage.dev",
    ".lclclerk.com",
    ".accounts.lclclerk.com"
];
var STAGING_ENV_SUFFIXES = [
    ".accountsstage.dev"
];
var LOCAL_API_URL = "https://api.lclclerk.com";
var STAGING_API_URL = "https://api.clerkstage.dev";
var PROD_API_URL = "https://api.clerk.com";
function iconImageUrl(id) {
    let format = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "svg";
    return "https://img.clerk.com/static/".concat(id, ".").concat(format);
}
;
 //# sourceMappingURL=chunk-I6MTSTOF.mjs.map
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-IV7BOO4U.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "buildPublishableKey": ()=>buildPublishableKey,
    "createDevOrStagingUrlCache": ()=>createDevOrStagingUrlCache,
    "getCookieSuffix": ()=>getCookieSuffix,
    "getSuffixedCookieName": ()=>getSuffixedCookieName,
    "isDevelopmentFromPublishableKey": ()=>isDevelopmentFromPublishableKey,
    "isDevelopmentFromSecretKey": ()=>isDevelopmentFromSecretKey,
    "isProductionFromPublishableKey": ()=>isProductionFromPublishableKey,
    "isProductionFromSecretKey": ()=>isProductionFromSecretKey,
    "isPublishableKey": ()=>isPublishableKey,
    "parsePublishableKey": ()=>parsePublishableKey
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$TETGTEI2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-TETGTEI2.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$KOH7GTJO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-KOH7GTJO.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$I6MTSTOF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-I6MTSTOF.mjs [app-client] (ecmascript)");
;
;
;
// src/keys.ts
var PUBLISHABLE_KEY_LIVE_PREFIX = "pk_live_";
var PUBLISHABLE_KEY_TEST_PREFIX = "pk_test_";
var PUBLISHABLE_FRONTEND_API_DEV_REGEX = /^(([a-z]+)-){2}([0-9]{1,2})\.clerk\.accounts([a-z.]*)(dev|com)$/i;
function buildPublishableKey(frontendApi) {
    const isDevKey = PUBLISHABLE_FRONTEND_API_DEV_REGEX.test(frontendApi) || frontendApi.startsWith("clerk.") && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$I6MTSTOF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LEGACY_DEV_INSTANCE_SUFFIXES"].some((s)=>frontendApi.endsWith(s));
    const keyPrefix = isDevKey ? PUBLISHABLE_KEY_TEST_PREFIX : PUBLISHABLE_KEY_LIVE_PREFIX;
    return "".concat(keyPrefix).concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$KOH7GTJO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isomorphicBtoa"])("".concat(frontendApi, "$")));
}
function isValidDecodedPublishableKey(decoded) {
    if (!decoded.endsWith("$")) {
        return false;
    }
    const withoutTrailing = decoded.slice(0, -1);
    if (withoutTrailing.includes("$")) {
        return false;
    }
    return withoutTrailing.includes(".");
}
function parsePublishableKey(key) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    key = key || "";
    if (!key || !isPublishableKey(key)) {
        if (options.fatal && !key) {
            throw new Error("Publishable key is missing. Ensure that your publishable key is correctly configured. Double-check your environment configuration for your keys, or access them here: https://dashboard.clerk.com/last-active?path=api-keys");
        }
        if (options.fatal && !isPublishableKey(key)) {
            throw new Error("Publishable key not valid.");
        }
        return null;
    }
    const instanceType = key.startsWith(PUBLISHABLE_KEY_LIVE_PREFIX) ? "production" : "development";
    let decodedFrontendApi;
    try {
        decodedFrontendApi = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$TETGTEI2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isomorphicAtob"])(key.split("_")[2]);
    } catch (e) {
        if (options.fatal) {
            throw new Error("Publishable key not valid: Failed to decode key.");
        }
        return null;
    }
    if (!isValidDecodedPublishableKey(decodedFrontendApi)) {
        if (options.fatal) {
            throw new Error("Publishable key not valid: Decoded key has invalid format.");
        }
        return null;
    }
    let frontendApi = decodedFrontendApi.slice(0, -1);
    if (options.proxyUrl) {
        frontendApi = options.proxyUrl;
    } else if (instanceType !== "development" && options.domain && options.isSatellite) {
        frontendApi = "clerk.".concat(options.domain);
    }
    return {
        instanceType,
        frontendApi
    };
}
function isPublishableKey() {
    let key = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
    try {
        const hasValidPrefix = key.startsWith(PUBLISHABLE_KEY_LIVE_PREFIX) || key.startsWith(PUBLISHABLE_KEY_TEST_PREFIX);
        if (!hasValidPrefix) {
            return false;
        }
        const parts = key.split("_");
        if (parts.length !== 3) {
            return false;
        }
        const encodedPart = parts[2];
        if (!encodedPart) {
            return false;
        }
        const decoded = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$TETGTEI2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isomorphicAtob"])(encodedPart);
        return isValidDecodedPublishableKey(decoded);
    } catch (e) {
        return false;
    }
}
function createDevOrStagingUrlCache() {
    const devOrStagingUrlCache = /* @__PURE__ */ new Map();
    return {
        /**
     * Checks if a URL is a development or staging environment.
     *
     * @param url - The URL to check (string or URL object).
     * @returns `true` if the URL is a development or staging environment, `false` otherwise.
     */ isDevOrStagingUrl: (url)=>{
            if (!url) {
                return false;
            }
            const hostname = typeof url === "string" ? url : url.hostname;
            let res = devOrStagingUrlCache.get(hostname);
            if (res === void 0) {
                res = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$I6MTSTOF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEV_OR_STAGING_SUFFIXES"].some((s)=>hostname.endsWith(s));
                devOrStagingUrlCache.set(hostname, res);
            }
            return res;
        }
    };
}
function isDevelopmentFromPublishableKey(apiKey) {
    return apiKey.startsWith("test_") || apiKey.startsWith("pk_test_");
}
function isProductionFromPublishableKey(apiKey) {
    return apiKey.startsWith("live_") || apiKey.startsWith("pk_live_");
}
function isDevelopmentFromSecretKey(apiKey) {
    return apiKey.startsWith("test_") || apiKey.startsWith("sk_test_");
}
function isProductionFromSecretKey(apiKey) {
    return apiKey.startsWith("live_") || apiKey.startsWith("sk_live_");
}
async function getCookieSuffix(publishableKey) {
    let subtle = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : globalThis.crypto.subtle;
    const data = new TextEncoder().encode(publishableKey);
    const digest = await subtle.digest("sha-1", data);
    const stringDigest = String.fromCharCode(...new Uint8Array(digest));
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$KOH7GTJO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isomorphicBtoa"])(stringDigest).replace(/\+/gi, "-").replace(/\//gi, "_").substring(0, 8);
}
var getSuffixedCookieName = (cookieName, cookieSuffix)=>{
    return "".concat(cookieName, "_").concat(cookieSuffix);
};
;
 //# sourceMappingURL=chunk-IV7BOO4U.mjs.map
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-CEMKEFAA.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "TelemetryCollector": ()=>TelemetryCollector,
    "eventComponentMounted": ()=>eventComponentMounted,
    "eventFrameworkMetadata": ()=>eventFrameworkMetadata,
    "eventMethodCalled": ()=>eventMethodCalled,
    "eventPrebuiltComponentMounted": ()=>eventPrebuiltComponentMounted,
    "eventPrebuiltComponentOpened": ()=>eventPrebuiltComponentOpened
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.4.6_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$GGFRMWFO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-GGFRMWFO.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$IV7BOO4U$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-IV7BOO4U.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-7ELT755Q.mjs [app-client] (ecmascript)");
;
;
;
// src/telemetry/throttler.ts
var DEFAULT_CACHE_TTL_MS = 864e5;
var _storageKey, _cacheTtl, _TelemetryEventThrottler_instances, generateKey_fn, cache_get, isValidBrowser_get;
var TelemetryEventThrottler = class {
    isEventThrottled(payload) {
        var __privateGet;
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateGet"])(this, _TelemetryEventThrottler_instances, isValidBrowser_get)) {
            return false;
        }
        const now = Date.now();
        const key = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateMethod"])(this, _TelemetryEventThrottler_instances, generateKey_fn).call(this, payload);
        const entry = (__privateGet = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateGet"])(this, _TelemetryEventThrottler_instances, cache_get)) === null || __privateGet === void 0 ? void 0 : __privateGet[key];
        if (!entry) {
            const updatedCache = {
                ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateGet"])(this, _TelemetryEventThrottler_instances, cache_get),
                [key]: now
            };
            localStorage.setItem((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateGet"])(this, _storageKey), JSON.stringify(updatedCache));
        }
        const shouldInvalidate = entry && now - entry > (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateGet"])(this, _cacheTtl);
        if (shouldInvalidate) {
            const updatedCache = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateGet"])(this, _TelemetryEventThrottler_instances, cache_get);
            delete updatedCache[key];
            localStorage.setItem((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateGet"])(this, _storageKey), JSON.stringify(updatedCache));
        }
        return !!entry;
    }
    constructor(){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateAdd"])(this, _TelemetryEventThrottler_instances);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateAdd"])(this, _storageKey, "clerk_telemetry_throttler");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateAdd"])(this, _cacheTtl, DEFAULT_CACHE_TTL_MS);
    }
};
_storageKey = new WeakMap();
_cacheTtl = new WeakMap();
_TelemetryEventThrottler_instances = new WeakSet();
/**
 * Generates a consistent unique key for telemetry events by sorting payload properties.
 * This ensures that payloads with identical content in different orders produce the same key.
 */ generateKey_fn = function(event) {
    const { sk: _sk, pk: _pk, payload, ...rest } = event;
    const sanitizedEvent = {
        ...payload,
        ...rest
    };
    return JSON.stringify(Object.keys({
        ...payload,
        ...rest
    }).sort().map((key)=>sanitizedEvent[key]));
};
cache_get = function() {
    const cacheString = localStorage.getItem((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateGet"])(this, _storageKey));
    if (!cacheString) {
        return {};
    }
    return JSON.parse(cacheString);
};
isValidBrowser_get = function() {
    if (typeof window === "undefined") {
        return false;
    }
    const storage = window.localStorage;
    if (!storage) {
        return false;
    }
    try {
        const testKey = "test";
        storage.setItem(testKey, testKey);
        storage.removeItem(testKey);
        return true;
    } catch (err) {
        const isQuotaExceededError = err instanceof DOMException && // Check error names for different browsers
        (err.name === "QuotaExceededError" || err.name === "NS_ERROR_DOM_QUOTA_REACHED");
        if (isQuotaExceededError && storage.length > 0) {
            storage.removeItem((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateGet"])(this, _storageKey));
        }
        return false;
    }
};
// src/telemetry/collector.ts
function isWindowClerkWithMetadata(clerk) {
    return typeof clerk === "object" && clerk !== null && "constructor" in clerk && typeof clerk.constructor === "function";
}
var DEFAULT_CONFIG = {
    samplingRate: 1,
    maxBufferSize: 5,
    // Production endpoint: https://clerk-telemetry.com
    // Staging endpoint: https://staging.clerk-telemetry.com
    // Local: http://localhost:8787
    endpoint: "https://clerk-telemetry.com"
};
var _config, _eventThrottler, _metadata, _buffer, _pendingFlush, _TelemetryCollector_instances, shouldRecord_fn, shouldBeSampled_fn, scheduleFlush_fn, flush_fn, logEvent_fn, getSDKMetadata_fn, preparePayload_fn;
var TelemetryCollector = class {
    get isEnabled() {
        var _window_navigator, _window;
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateGet"])(this, _metadata).instanceType !== "development") {
            return false;
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateGet"])(this, _config).disabled || typeof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] !== "undefined" && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$GGFRMWFO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isTruthy"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.CLERK_TELEMETRY_DISABLED)) {
            return false;
        }
        if (typeof window !== "undefined" && !!((_window = window) === null || _window === void 0 ? void 0 : (_window_navigator = _window.navigator) === null || _window_navigator === void 0 ? void 0 : _window_navigator.webdriver)) {
            return false;
        }
        return true;
    }
    get isDebug() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateGet"])(this, _config).debug || typeof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] !== "undefined" && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$GGFRMWFO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isTruthy"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.CLERK_TELEMETRY_DEBUG);
    }
    record(event) {
        const preparedPayload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateMethod"])(this, _TelemetryCollector_instances, preparePayload_fn).call(this, event.event, event.payload);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateMethod"])(this, _TelemetryCollector_instances, logEvent_fn).call(this, preparedPayload.event, preparedPayload);
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateMethod"])(this, _TelemetryCollector_instances, shouldRecord_fn).call(this, preparedPayload, event.eventSamplingRate)) {
            return;
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateGet"])(this, _buffer).push(preparedPayload);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateMethod"])(this, _TelemetryCollector_instances, scheduleFlush_fn).call(this);
    }
    constructor(options){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateAdd"])(this, _TelemetryCollector_instances);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateAdd"])(this, _config);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateAdd"])(this, _eventThrottler);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateAdd"])(this, _metadata, {});
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateAdd"])(this, _buffer, []);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateAdd"])(this, _pendingFlush);
        var _options_maxBufferSize, _options_samplingRate, _options_perEventSampling, _options_disabled, _options_debug;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateSet"])(this, _config, {
            maxBufferSize: (_options_maxBufferSize = options.maxBufferSize) !== null && _options_maxBufferSize !== void 0 ? _options_maxBufferSize : DEFAULT_CONFIG.maxBufferSize,
            samplingRate: (_options_samplingRate = options.samplingRate) !== null && _options_samplingRate !== void 0 ? _options_samplingRate : DEFAULT_CONFIG.samplingRate,
            perEventSampling: (_options_perEventSampling = options.perEventSampling) !== null && _options_perEventSampling !== void 0 ? _options_perEventSampling : true,
            disabled: (_options_disabled = options.disabled) !== null && _options_disabled !== void 0 ? _options_disabled : false,
            debug: (_options_debug = options.debug) !== null && _options_debug !== void 0 ? _options_debug : false,
            endpoint: DEFAULT_CONFIG.endpoint
        });
        if (!options.clerkVersion && typeof window === "undefined") {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateGet"])(this, _metadata).clerkVersion = "";
        } else {
            var _options_clerkVersion;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateGet"])(this, _metadata).clerkVersion = (_options_clerkVersion = options.clerkVersion) !== null && _options_clerkVersion !== void 0 ? _options_clerkVersion : "";
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateGet"])(this, _metadata).sdk = options.sdk;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateGet"])(this, _metadata).sdkVersion = options.sdkVersion;
        var _options_publishableKey;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateGet"])(this, _metadata).publishableKey = (_options_publishableKey = options.publishableKey) !== null && _options_publishableKey !== void 0 ? _options_publishableKey : "";
        const parsedKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$IV7BOO4U$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePublishableKey"])(options.publishableKey);
        if (parsedKey) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateGet"])(this, _metadata).instanceType = parsedKey.instanceType;
        }
        if (options.secretKey) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateGet"])(this, _metadata).secretKey = options.secretKey.substring(0, 16);
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateSet"])(this, _eventThrottler, new TelemetryEventThrottler());
    }
};
_config = new WeakMap();
_eventThrottler = new WeakMap();
_metadata = new WeakMap();
_buffer = new WeakMap();
_pendingFlush = new WeakMap();
_TelemetryCollector_instances = new WeakSet();
shouldRecord_fn = function(preparedPayload, eventSamplingRate) {
    return this.isEnabled && !this.isDebug && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateMethod"])(this, _TelemetryCollector_instances, shouldBeSampled_fn).call(this, preparedPayload, eventSamplingRate);
};
shouldBeSampled_fn = function(preparedPayload, eventSamplingRate) {
    const randomSeed = Math.random();
    const toBeSampled = randomSeed <= (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateGet"])(this, _config).samplingRate && ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateGet"])(this, _config).perEventSampling === false || typeof eventSamplingRate === "undefined" || randomSeed <= eventSamplingRate);
    if (!toBeSampled) {
        return false;
    }
    return !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateGet"])(this, _eventThrottler).isEventThrottled(preparedPayload);
};
scheduleFlush_fn = function() {
    if (typeof window === "undefined") {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateMethod"])(this, _TelemetryCollector_instances, flush_fn).call(this);
        return;
    }
    const isBufferFull = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateGet"])(this, _buffer).length >= (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateGet"])(this, _config).maxBufferSize;
    if (isBufferFull) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateGet"])(this, _pendingFlush)) {
            const cancel = typeof cancelIdleCallback !== "undefined" ? cancelIdleCallback : clearTimeout;
            cancel((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateGet"])(this, _pendingFlush));
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateMethod"])(this, _TelemetryCollector_instances, flush_fn).call(this);
        return;
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateGet"])(this, _pendingFlush)) {
        return;
    }
    if ("requestIdleCallback" in window) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateSet"])(this, _pendingFlush, requestIdleCallback(()=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateMethod"])(this, _TelemetryCollector_instances, flush_fn).call(this);
        }));
    } else {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateSet"])(this, _pendingFlush, setTimeout(()=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateMethod"])(this, _TelemetryCollector_instances, flush_fn).call(this);
        }, 0));
    }
};
flush_fn = function() {
    const eventsToSend = [
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateGet"])(this, _buffer)
    ];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateSet"])(this, _buffer, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateSet"])(this, _pendingFlush, null);
    if (eventsToSend.length === 0) {
        return;
    }
    fetch(new URL("/v1/event", (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateGet"])(this, _config).endpoint), {
        method: "POST",
        // TODO: We send an array here with that idea that we can eventually send multiple events.
        body: JSON.stringify({
            events: eventsToSend
        }),
        keepalive: true,
        headers: {
            "Content-Type": "application/json"
        }
    }).catch(()=>void 0);
};
/**
 * If running in debug mode, log the event and its payload to the console.
 */ logEvent_fn = function(event, payload) {
    if (!this.isDebug) {
        return;
    }
    if (typeof console.groupCollapsed !== "undefined") {
        console.groupCollapsed("[clerk/telemetry]", event);
        console.log(payload);
        console.groupEnd();
    } else {
        console.log("[clerk/telemetry]", event, payload);
    }
};
/**
 * If in browser, attempt to lazily grab the SDK metadata from the Clerk singleton, otherwise fallback to the initially passed in values.
 *
 * This is necessary because the sdkMetadata can be set by the host SDK after the TelemetryCollector is instantiated.
 */ getSDKMetadata_fn = function() {
    const sdkMetadata = {
        name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateGet"])(this, _metadata).sdk,
        version: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateGet"])(this, _metadata).sdkVersion
    };
    if (typeof window !== "undefined") {
        const windowWithClerk = window;
        if (windowWithClerk.Clerk) {
            const windowClerk = windowWithClerk.Clerk;
            if (isWindowClerkWithMetadata(windowClerk) && windowClerk.constructor.sdkMetadata) {
                const { name, version } = windowClerk.constructor.sdkMetadata;
                if (name !== void 0) {
                    sdkMetadata.name = name;
                }
                if (version !== void 0) {
                    sdkMetadata.version = version;
                }
            }
        }
    }
    return sdkMetadata;
};
/**
 * Append relevant metadata from the Clerk singleton to the event payload.
 */ preparePayload_fn = function(event, payload) {
    const sdkMetadata = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateMethod"])(this, _TelemetryCollector_instances, getSDKMetadata_fn).call(this);
    var __privateGet_clerkVersion, __privateGet_instanceType;
    return {
        event,
        cv: (__privateGet_clerkVersion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateGet"])(this, _metadata).clerkVersion) !== null && __privateGet_clerkVersion !== void 0 ? __privateGet_clerkVersion : "",
        it: (__privateGet_instanceType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateGet"])(this, _metadata).instanceType) !== null && __privateGet_instanceType !== void 0 ? __privateGet_instanceType : "",
        sdk: sdkMetadata.name,
        sdkv: sdkMetadata.version,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateGet"])(this, _metadata).publishableKey ? {
            pk: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateGet"])(this, _metadata).publishableKey
        } : {},
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateGet"])(this, _metadata).secretKey ? {
            sk: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__privateGet"])(this, _metadata).secretKey
        } : {},
        payload
    };
};
// src/telemetry/events/component-mounted.ts
var EVENT_COMPONENT_MOUNTED = "COMPONENT_MOUNTED";
var EVENT_COMPONENT_OPENED = "COMPONENT_OPENED";
var EVENT_SAMPLING_RATE = 0.1;
function createPrebuiltComponentEvent(event) {
    return function(component, props, additionalPayload) {
        var _props_appearance, _props_appearance1, _props_appearance2;
        return {
            event,
            eventSamplingRate: EVENT_SAMPLING_RATE,
            payload: {
                component,
                appearanceProp: Boolean(props === null || props === void 0 ? void 0 : props.appearance),
                baseTheme: Boolean(props === null || props === void 0 ? void 0 : (_props_appearance = props.appearance) === null || _props_appearance === void 0 ? void 0 : _props_appearance.baseTheme),
                elements: Boolean(props === null || props === void 0 ? void 0 : (_props_appearance1 = props.appearance) === null || _props_appearance1 === void 0 ? void 0 : _props_appearance1.elements),
                variables: Boolean(props === null || props === void 0 ? void 0 : (_props_appearance2 = props.appearance) === null || _props_appearance2 === void 0 ? void 0 : _props_appearance2.variables),
                ...additionalPayload
            }
        };
    };
}
function eventPrebuiltComponentMounted(component, props, additionalPayload) {
    return createPrebuiltComponentEvent(EVENT_COMPONENT_MOUNTED)(component, props, additionalPayload);
}
function eventPrebuiltComponentOpened(component, props, additionalPayload) {
    return createPrebuiltComponentEvent(EVENT_COMPONENT_OPENED)(component, props, additionalPayload);
}
function eventComponentMounted(component) {
    let props = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return {
        event: EVENT_COMPONENT_MOUNTED,
        eventSamplingRate: EVENT_SAMPLING_RATE,
        payload: {
            component,
            ...props
        }
    };
}
// src/telemetry/events/method-called.ts
var EVENT_METHOD_CALLED = "METHOD_CALLED";
var EVENT_SAMPLING_RATE2 = 0.1;
function eventMethodCalled(method, payload) {
    return {
        event: EVENT_METHOD_CALLED,
        eventSamplingRate: EVENT_SAMPLING_RATE2,
        payload: {
            method,
            ...payload
        }
    };
}
// src/telemetry/events/framework-metadata.ts
var EVENT_FRAMEWORK_METADATA = "FRAMEWORK_METADATA";
var EVENT_SAMPLING_RATE3 = 0.1;
function eventFrameworkMetadata(payload) {
    return {
        event: EVENT_FRAMEWORK_METADATA,
        eventSamplingRate: EVENT_SAMPLING_RATE3,
        payload
    };
}
;
 //# sourceMappingURL=chunk-CEMKEFAA.mjs.map
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/telemetry.mjs [app-client] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$CEMKEFAA$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-CEMKEFAA.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$GGFRMWFO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-GGFRMWFO.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$IV7BOO4U$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-IV7BOO4U.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$TETGTEI2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-TETGTEI2.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$KOH7GTJO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-KOH7GTJO.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$I6MTSTOF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-I6MTSTOF.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-7ELT755Q.mjs [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
 //# sourceMappingURL=telemetry.mjs.map
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/telemetry.mjs [app-client] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$CEMKEFAA$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-CEMKEFAA.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$GGFRMWFO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-GGFRMWFO.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$IV7BOO4U$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-IV7BOO4U.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$TETGTEI2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-TETGTEI2.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$KOH7GTJO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-KOH7GTJO.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$I6MTSTOF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-I6MTSTOF.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-7ELT755Q.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$telemetry$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/telemetry.mjs [app-client] (ecmascript) <locals>");
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-IBXKDGSZ.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

// src/organization.ts
__turbopack_context__.s({
    "getCurrentOrganizationMembership": ()=>getCurrentOrganizationMembership
});
function getCurrentOrganizationMembership(organizationMemberships, organizationId) {
    return organizationMemberships.find((organizationMembership)=>organizationMembership.organization.id === organizationId);
}
;
 //# sourceMappingURL=chunk-IBXKDGSZ.mjs.map
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-7FNX7RWY.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

// src/utils/noop.ts
__turbopack_context__.s({
    "noop": ()=>noop
});
var noop = function() {
    for(var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++){
        _args[_key] = arguments[_key];
    }
};
;
 //# sourceMappingURL=chunk-7FNX7RWY.mjs.map
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-7QJ2QTJL.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "createDeferredPromise": ()=>createDeferredPromise
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7FNX7RWY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-7FNX7RWY.mjs [app-client] (ecmascript)");
;
// src/utils/createDeferredPromise.ts
var createDeferredPromise = ()=>{
    let resolve = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7FNX7RWY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noop"];
    let reject = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7FNX7RWY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noop"];
    const promise = new Promise((res, rej)=>{
        resolve = res;
        reject = rej;
    });
    return {
        promise,
        resolve,
        reject
    };
};
;
 //# sourceMappingURL=chunk-7QJ2QTJL.mjs.map
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-43A5F2IE.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

// src/authorization-errors.ts
__turbopack_context__.s({
    "isReverificationHint": ()=>isReverificationHint,
    "reverificationError": ()=>reverificationError,
    "reverificationErrorResponse": ()=>reverificationErrorResponse
});
var REVERIFICATION_REASON = "reverification-error";
var reverificationError = (missingConfig)=>({
        clerk_error: {
            type: "forbidden",
            reason: REVERIFICATION_REASON,
            metadata: {
                reverification: missingConfig
            }
        }
    });
var reverificationErrorResponse = function() {
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    return new Response(JSON.stringify(reverificationError(...args)), {
        status: 403
    });
};
var isReverificationHint = (result)=>{
    var _result_clerk_error, _result_clerk_error1;
    return result && typeof result === "object" && "clerk_error" in result && ((_result_clerk_error = result.clerk_error) === null || _result_clerk_error === void 0 ? void 0 : _result_clerk_error.type) === "forbidden" && ((_result_clerk_error1 = result.clerk_error) === null || _result_clerk_error1 === void 0 ? void 0 : _result_clerk_error1.reason) === REVERIFICATION_REASON;
};
;
 //# sourceMappingURL=chunk-43A5F2IE.mjs.map
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/react/index.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "ClerkInstanceContext": ()=>ClerkInstanceContext,
    "ClientContext": ()=>ClientContext,
    "OptionsContext": ()=>OptionsContext,
    "OrganizationProvider": ()=>OrganizationProvider,
    "SessionContext": ()=>SessionContext,
    "UserContext": ()=>UserContext,
    "__experimental_CheckoutProvider": ()=>__experimental_CheckoutProvider,
    "__experimental_PaymentElement": ()=>PaymentElement2,
    "__experimental_PaymentElementProvider": ()=>PaymentElementProvider,
    "__experimental_useCheckout": ()=>useCheckout,
    "__experimental_usePaymentAttempts": ()=>usePaymentAttempts,
    "__experimental_usePaymentElement": ()=>usePaymentElement,
    "__experimental_usePaymentMethods": ()=>usePaymentMethods,
    "__experimental_usePlans": ()=>usePlans,
    "__experimental_useStatements": ()=>useStatements,
    "__experimental_useSubscription": ()=>useSubscription,
    "assertContextExists": ()=>assertContextExists,
    "createContextAndHook": ()=>createContextAndHook,
    "isDeeplyEqual": ()=>isDeeplyEqual,
    "useAssertWrappedByClerkProvider": ()=>useAssertWrappedByClerkProvider,
    "useClerk": ()=>useClerk,
    "useClerkInstanceContext": ()=>useClerkInstanceContext,
    "useClientContext": ()=>useClientContext,
    "useDeepEqualMemo": ()=>useDeepEqualMemo,
    "useOptionsContext": ()=>useOptionsContext,
    "useOrganization": ()=>useOrganization,
    "useOrganizationContext": ()=>useOrganizationContext,
    "useOrganizationList": ()=>useOrganizationList,
    "useReverification": ()=>useReverification,
    "useSafeLayoutEffect": ()=>useSafeLayoutEffect,
    "useSession": ()=>useSession,
    "useSessionContext": ()=>useSessionContext,
    "useSessionList": ()=>useSessionList,
    "useUser": ()=>useUser,
    "useUserContext": ()=>useUserContext
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$IBXKDGSZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-IBXKDGSZ.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$CEMKEFAA$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-CEMKEFAA.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7QJ2QTJL$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-7QJ2QTJL.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7FNX7RWY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-7FNX7RWY.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$GGFRMWFO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-GGFRMWFO.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$35WGBVWP$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-35WGBVWP.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$IV7BOO4U$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-IV7BOO4U.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$TETGTEI2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-TETGTEI2.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$KOH7GTJO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-KOH7GTJO.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$I6MTSTOF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-I6MTSTOF.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$43A5F2IE$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-43A5F2IE.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$3CN5LOSN$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-3CN5LOSN.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-7ELT755Q.mjs [app-client] (ecmascript)");
// src/react/hooks/createContextAndHook.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.4.6_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$swr$40$2$2e$3$2e$4_react$40$19$2e$1$2e$0$2f$node_modules$2f$swr$2f$dist$2f$index$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/swr@2.3.4_react@19.1.0/node_modules/swr/dist/index/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$swr$40$2$2e$3$2e$4_react$40$19$2e$1$2e$0$2f$node_modules$2f$swr$2f$dist$2f$index$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/swr@2.3.4_react@19.1.0/node_modules/swr/dist/index/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$swr$40$2$2e$3$2e$4_react$40$19$2e$1$2e$0$2f$node_modules$2f$swr$2f$dist$2f$infinite$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/swr@2.3.4_react@19.1.0/node_modules/swr/dist/infinite/index.mjs [app-client] (ecmascript)");
// src/react/hooks/useDeepEqualMemo.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$dequal$40$2$2e$0$2e$3$2f$node_modules$2f$dequal$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/dequal@2.0.3/node_modules/dequal/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$swr$40$2$2e$3$2e$4_react$40$19$2e$1$2e$0$2f$node_modules$2f$swr$2f$dist$2f$mutation$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/swr@2.3.4_react@19.1.0/node_modules/swr/dist/mutation/index.mjs [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
function assertContextExists(contextVal, msgOrCtx) {
    if (!contextVal) {
        throw typeof msgOrCtx === "string" ? new Error(msgOrCtx) : new Error("".concat(msgOrCtx.displayName, " not found"));
    }
}
var createContextAndHook = (displayName, options)=>{
    const { assertCtxFn = assertContextExists } = options || {};
    const Ctx = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createContext(void 0);
    Ctx.displayName = displayName;
    const useCtx = ()=>{
        const ctx = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useContext(Ctx);
        assertCtxFn(ctx, "".concat(displayName, " not found"));
        return ctx.value;
    };
    const useCtxWithoutGuarantee = ()=>{
        const ctx = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useContext(Ctx);
        return ctx ? ctx.value : {};
    };
    return [
        Ctx,
        useCtx,
        useCtxWithoutGuarantee
    ];
};
;
// src/react/clerk-swr.ts
var clerk_swr_exports = {};
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__export"])(clerk_swr_exports, {
    useSWR: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$swr$40$2$2e$3$2e$4_react$40$19$2e$1$2e$0$2f$node_modules$2f$swr$2f$dist$2f$index$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"],
    useSWRInfinite: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$swr$40$2$2e$3$2e$4_react$40$19$2e$1$2e$0$2f$node_modules$2f$swr$2f$dist$2f$infinite$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
});
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__reExport"])(clerk_swr_exports, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$swr$40$2$2e$3$2e$4_react$40$19$2e$1$2e$0$2f$node_modules$2f$swr$2f$dist$2f$index$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__);
;
;
;
// src/react/contexts.tsx
var [ClerkInstanceContext, useClerkInstanceContext] = createContextAndHook("ClerkInstanceContext");
var [UserContext, useUserContext] = createContextAndHook("UserContext");
var [ClientContext, useClientContext] = createContextAndHook("ClientContext");
var [SessionContext, useSessionContext] = createContextAndHook("SessionContext");
var OptionsContext = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createContext({});
var [CheckoutContext, useCheckoutContext] = createContextAndHook("CheckoutContext");
var __experimental_CheckoutProvider = (param)=>{
    let { children, ...rest } = param;
    return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(CheckoutContext.Provider, {
        value: {
            value: rest
        }
    }, children);
};
function useOptionsContext() {
    const context = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useContext(OptionsContext);
    if (context === void 0) {
        throw new Error("useOptions must be used within an OptionsContext");
    }
    return context;
}
var [OrganizationContextInternal, useOrganizationContext] = createContextAndHook("OrganizationContext");
var OrganizationProvider = (param)=>{
    let { children, organization, swrConfig } = param;
    return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(clerk_swr_exports.SWRConfig, {
        value: swrConfig
    }, /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(OrganizationContextInternal.Provider, {
        value: {
            value: {
                organization
            }
        }
    }, children));
};
function useAssertWrappedByClerkProvider(displayNameOrFn) {
    const ctx = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useContext(ClerkInstanceContext);
    if (!ctx) {
        if (typeof displayNameOrFn === "function") {
            displayNameOrFn();
            return;
        }
        throw new Error("".concat(displayNameOrFn, " can only be used within the <ClerkProvider /> component.\n\nPossible fixes:\n1. Ensure that the <ClerkProvider /> is correctly wrapping your application where this component is used.\n2. Check for multiple versions of the `@clerk/shared` package in your project. Use a tool like `npm ls @clerk/shared` to identify multiple versions, and update your dependencies to only rely on one.\n\nLearn more: https://clerk.com/docs/components/clerk-provider").trim());
    }
}
;
function getDifferentKeys(obj1, obj2) {
    const keysSet = new Set(Object.keys(obj2));
    const differentKeysObject = {};
    for (const key1 of Object.keys(obj1)){
        if (!keysSet.has(key1)) {
            differentKeysObject[key1] = obj1[key1];
        }
    }
    return differentKeysObject;
}
var useWithSafeValues = (params, defaultValues)=>{
    const shouldUseDefaults = typeof params === "boolean" && params;
    var _params_initialPage;
    const initialPageRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(shouldUseDefaults ? defaultValues.initialPage : (_params_initialPage = params === null || params === void 0 ? void 0 : params.initialPage) !== null && _params_initialPage !== void 0 ? _params_initialPage : defaultValues.initialPage);
    var _params_pageSize;
    const pageSizeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(shouldUseDefaults ? defaultValues.pageSize : (_params_pageSize = params === null || params === void 0 ? void 0 : params.pageSize) !== null && _params_pageSize !== void 0 ? _params_pageSize : defaultValues.pageSize);
    const newObj = {};
    for (const key of Object.keys(defaultValues)){
        var _params_key;
        newObj[key] = shouldUseDefaults ? defaultValues[key] : (_params_key = params === null || params === void 0 ? void 0 : params[key]) !== null && _params_key !== void 0 ? _params_key : defaultValues[key];
    }
    return {
        ...newObj,
        initialPage: initialPageRef.current,
        pageSize: pageSizeRef.current
    };
};
var cachingSWROptions = {
    dedupingInterval: 1e3 * 60,
    focusThrottleInterval: 1e3 * 60 * 2
};
var usePagesOrInfinite = (params, fetcher, config, cacheKeys)=>{
    var _params_initialPage;
    const [paginatedPage, setPaginatedPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])((_params_initialPage = params.initialPage) !== null && _params_initialPage !== void 0 ? _params_initialPage : 1);
    var _params_initialPage1;
    const initialPageRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])((_params_initialPage1 = params.initialPage) !== null && _params_initialPage1 !== void 0 ? _params_initialPage1 : 1);
    var _params_pageSize;
    const pageSizeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])((_params_pageSize = params.pageSize) !== null && _params_pageSize !== void 0 ? _params_pageSize : 10);
    var _config_enabled;
    const enabled = (_config_enabled = config.enabled) !== null && _config_enabled !== void 0 ? _config_enabled : true;
    const cacheMode = config.__experimental_mode === "cache";
    var _config_infinite;
    const triggerInfinite = (_config_infinite = config.infinite) !== null && _config_infinite !== void 0 ? _config_infinite : false;
    var _config_keepPreviousData;
    const keepPreviousData = (_config_keepPreviousData = config.keepPreviousData) !== null && _config_keepPreviousData !== void 0 ? _config_keepPreviousData : false;
    const pagesCacheKey = {
        ...cacheKeys,
        ...params,
        initialPage: paginatedPage,
        pageSize: pageSizeRef.current
    };
    const shouldFetch = !triggerInfinite && enabled && (!cacheMode ? !!fetcher : true);
    const swrKey = shouldFetch ? pagesCacheKey : null;
    const swrFetcher = !cacheMode && !!fetcher ? (cacheKeyParams)=>{
        const requestParams = getDifferentKeys(cacheKeyParams, cacheKeys);
        return fetcher({
            ...params,
            ...requestParams
        });
    } : null;
    const { data: swrData, isValidating: swrIsValidating, isLoading: swrIsLoading, error: swrError, mutate: swrMutate } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$swr$40$2$2e$3$2e$4_react$40$19$2e$1$2e$0$2f$node_modules$2f$swr$2f$dist$2f$index$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"])(swrKey, swrFetcher, {
        keepPreviousData,
        ...cachingSWROptions
    });
    const { data: swrInfiniteData, isLoading: swrInfiniteIsLoading, isValidating: swrInfiniteIsValidating, error: swrInfiniteError, size, setSize, mutate: swrInfiniteMutate } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$swr$40$2$2e$3$2e$4_react$40$19$2e$1$2e$0$2f$node_modules$2f$swr$2f$dist$2f$infinite$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])((pageIndex)=>{
        if (!triggerInfinite || !enabled) {
            return null;
        }
        return {
            ...params,
            ...cacheKeys,
            initialPage: initialPageRef.current + pageIndex,
            pageSize: pageSizeRef.current
        };
    }, (cacheKeyParams)=>{
        const requestParams = getDifferentKeys(cacheKeyParams, cacheKeys);
        return fetcher === null || fetcher === void 0 ? void 0 : fetcher(requestParams);
    }, cachingSWROptions);
    const page = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "usePagesOrInfinite.useMemo[page]": ()=>{
            if (triggerInfinite) {
                return size;
            }
            return paginatedPage;
        }
    }["usePagesOrInfinite.useMemo[page]"], [
        triggerInfinite,
        size,
        paginatedPage
    ]);
    const fetchPage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePagesOrInfinite.useCallback[fetchPage]": (numberOrgFn)=>{
            if (triggerInfinite) {
                void setSize(numberOrgFn);
                return;
            }
            return setPaginatedPage(numberOrgFn);
        }
    }["usePagesOrInfinite.useCallback[fetchPage]"], [
        setSize
    ]);
    const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "usePagesOrInfinite.useMemo[data]": ()=>{
            if (triggerInfinite) {
                var _swrInfiniteData_map_flat;
                return (_swrInfiniteData_map_flat = swrInfiniteData === null || swrInfiniteData === void 0 ? void 0 : swrInfiniteData.map({
                    "usePagesOrInfinite.useMemo[data]": (a)=>a === null || a === void 0 ? void 0 : a.data
                }["usePagesOrInfinite.useMemo[data]"]).flat()) !== null && _swrInfiniteData_map_flat !== void 0 ? _swrInfiniteData_map_flat : [];
            }
            var _swrData_data;
            return (_swrData_data = swrData === null || swrData === void 0 ? void 0 : swrData.data) !== null && _swrData_data !== void 0 ? _swrData_data : [];
        }
    }["usePagesOrInfinite.useMemo[data]"], [
        triggerInfinite,
        swrData,
        swrInfiniteData
    ]);
    const count = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "usePagesOrInfinite.useMemo[count]": ()=>{
            if (triggerInfinite) {
                var _swrInfiniteData_;
                return (swrInfiniteData === null || swrInfiniteData === void 0 ? void 0 : (_swrInfiniteData_ = swrInfiniteData[(swrInfiniteData === null || swrInfiniteData === void 0 ? void 0 : swrInfiniteData.length) - 1]) === null || _swrInfiniteData_ === void 0 ? void 0 : _swrInfiniteData_.total_count) || 0;
            }
            var _swrData_total_count;
            return (_swrData_total_count = swrData === null || swrData === void 0 ? void 0 : swrData.total_count) !== null && _swrData_total_count !== void 0 ? _swrData_total_count : 0;
        }
    }["usePagesOrInfinite.useMemo[count]"], [
        triggerInfinite,
        swrData,
        swrInfiniteData
    ]);
    const isLoading = triggerInfinite ? swrInfiniteIsLoading : swrIsLoading;
    const isFetching = triggerInfinite ? swrInfiniteIsValidating : swrIsValidating;
    var _ref;
    const error = (_ref = triggerInfinite ? swrInfiniteError : swrError) !== null && _ref !== void 0 ? _ref : null;
    const isError = !!error;
    const fetchNext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePagesOrInfinite.useCallback[fetchNext]": ()=>{
            fetchPage({
                "usePagesOrInfinite.useCallback[fetchNext]": (n)=>Math.max(0, n + 1)
            }["usePagesOrInfinite.useCallback[fetchNext]"]);
        }
    }["usePagesOrInfinite.useCallback[fetchNext]"], [
        fetchPage
    ]);
    const fetchPrevious = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePagesOrInfinite.useCallback[fetchPrevious]": ()=>{
            fetchPage({
                "usePagesOrInfinite.useCallback[fetchPrevious]": (n)=>Math.max(0, n - 1)
            }["usePagesOrInfinite.useCallback[fetchPrevious]"]);
        }
    }["usePagesOrInfinite.useCallback[fetchPrevious]"], [
        fetchPage
    ]);
    const offsetCount = (initialPageRef.current - 1) * pageSizeRef.current;
    const pageCount = Math.ceil((count - offsetCount) / pageSizeRef.current);
    const hasNextPage = count - offsetCount * pageSizeRef.current > page * pageSizeRef.current;
    const hasPreviousPage = (page - 1) * pageSizeRef.current > offsetCount * pageSizeRef.current;
    const setData = triggerInfinite ? (value)=>swrInfiniteMutate(value, {
            revalidate: false
        }) : (value)=>swrMutate(value, {
            revalidate: false
        });
    const revalidate = triggerInfinite ? ()=>swrInfiniteMutate() : ()=>swrMutate();
    return {
        data,
        count,
        error,
        isLoading,
        isFetching,
        isError,
        page,
        pageCount,
        fetchPage,
        fetchNext,
        fetchPrevious,
        hasNextPage,
        hasPreviousPage,
        // Let the hook return type define this type
        revalidate,
        // Let the hook return type define this type
        setData
    };
};
// src/react/hooks/useOrganization.tsx
var undefinedPaginatedResource = {
    data: void 0,
    count: void 0,
    error: void 0,
    isLoading: false,
    isFetching: false,
    isError: false,
    page: void 0,
    pageCount: void 0,
    fetchPage: void 0,
    fetchNext: void 0,
    fetchPrevious: void 0,
    hasNextPage: false,
    hasPreviousPage: false,
    revalidate: void 0,
    setData: void 0
};
function useOrganization(params) {
    var _clerk_telemetry;
    const { domains: domainListParams, membershipRequests: membershipRequestsListParams, memberships: membersListParams, invitations: invitationsListParams, subscriptions: subscriptionsListParams } = params || {};
    useAssertWrappedByClerkProvider("useOrganization");
    const { organization } = useOrganizationContext();
    const session = useSessionContext();
    const domainSafeValues = useWithSafeValues(domainListParams, {
        initialPage: 1,
        pageSize: 10,
        keepPreviousData: false,
        infinite: false,
        enrollmentMode: void 0
    });
    const membershipRequestSafeValues = useWithSafeValues(membershipRequestsListParams, {
        initialPage: 1,
        pageSize: 10,
        status: "pending",
        keepPreviousData: false,
        infinite: false
    });
    const membersSafeValues = useWithSafeValues(membersListParams, {
        initialPage: 1,
        pageSize: 10,
        role: void 0,
        keepPreviousData: false,
        infinite: false,
        query: void 0
    });
    const invitationsSafeValues = useWithSafeValues(invitationsListParams, {
        initialPage: 1,
        pageSize: 10,
        status: [
            "pending"
        ],
        keepPreviousData: false,
        infinite: false
    });
    const subscriptionsSafeValues = useWithSafeValues(subscriptionsListParams, {
        initialPage: 1,
        pageSize: 10,
        keepPreviousData: false,
        infinite: false
    });
    const clerk = useClerkInstanceContext();
    (_clerk_telemetry = clerk.telemetry) === null || _clerk_telemetry === void 0 ? void 0 : _clerk_telemetry.record((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$CEMKEFAA$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["eventMethodCalled"])("useOrganization"));
    const domainParams = typeof domainListParams === "undefined" ? void 0 : {
        initialPage: domainSafeValues.initialPage,
        pageSize: domainSafeValues.pageSize,
        enrollmentMode: domainSafeValues.enrollmentMode
    };
    const membershipRequestParams = typeof membershipRequestsListParams === "undefined" ? void 0 : {
        initialPage: membershipRequestSafeValues.initialPage,
        pageSize: membershipRequestSafeValues.pageSize,
        status: membershipRequestSafeValues.status
    };
    const membersParams = typeof membersListParams === "undefined" ? void 0 : {
        initialPage: membersSafeValues.initialPage,
        pageSize: membersSafeValues.pageSize,
        role: membersSafeValues.role,
        query: membersSafeValues.query
    };
    const invitationsParams = typeof invitationsListParams === "undefined" ? void 0 : {
        initialPage: invitationsSafeValues.initialPage,
        pageSize: invitationsSafeValues.pageSize,
        status: invitationsSafeValues.status
    };
    const subscriptionsParams = typeof subscriptionsListParams === "undefined" ? void 0 : {
        initialPage: subscriptionsSafeValues.initialPage,
        pageSize: subscriptionsSafeValues.pageSize,
        orgId: organization === null || organization === void 0 ? void 0 : organization.id
    };
    const domains = usePagesOrInfinite({
        ...domainParams
    }, organization === null || organization === void 0 ? void 0 : organization.getDomains, {
        keepPreviousData: domainSafeValues.keepPreviousData,
        infinite: domainSafeValues.infinite,
        enabled: !!domainParams
    }, {
        type: "domains",
        organizationId: organization === null || organization === void 0 ? void 0 : organization.id
    });
    const membershipRequests = usePagesOrInfinite({
        ...membershipRequestParams
    }, organization === null || organization === void 0 ? void 0 : organization.getMembershipRequests, {
        keepPreviousData: membershipRequestSafeValues.keepPreviousData,
        infinite: membershipRequestSafeValues.infinite,
        enabled: !!membershipRequestParams
    }, {
        type: "membershipRequests",
        organizationId: organization === null || organization === void 0 ? void 0 : organization.id
    });
    const memberships = usePagesOrInfinite(membersParams || {}, organization === null || organization === void 0 ? void 0 : organization.getMemberships, {
        keepPreviousData: membersSafeValues.keepPreviousData,
        infinite: membersSafeValues.infinite,
        enabled: !!membersParams
    }, {
        type: "members",
        organizationId: organization === null || organization === void 0 ? void 0 : organization.id
    });
    const invitations = usePagesOrInfinite({
        ...invitationsParams
    }, organization === null || organization === void 0 ? void 0 : organization.getInvitations, {
        keepPreviousData: invitationsSafeValues.keepPreviousData,
        infinite: invitationsSafeValues.infinite,
        enabled: !!invitationsParams
    }, {
        type: "invitations",
        organizationId: organization === null || organization === void 0 ? void 0 : organization.id
    });
    const subscriptions = usePagesOrInfinite({
        ...subscriptionsParams
    }, organization === null || organization === void 0 ? void 0 : organization.getSubscriptions, {
        keepPreviousData: subscriptionsSafeValues.keepPreviousData,
        infinite: subscriptionsSafeValues.infinite,
        enabled: !!subscriptionsParams
    }, {
        type: "subscriptions",
        organizationId: organization === null || organization === void 0 ? void 0 : organization.id
    });
    if (organization === void 0) {
        return {
            isLoaded: false,
            organization: void 0,
            membership: void 0,
            domains: undefinedPaginatedResource,
            membershipRequests: undefinedPaginatedResource,
            memberships: undefinedPaginatedResource,
            invitations: undefinedPaginatedResource,
            subscriptions: undefinedPaginatedResource
        };
    }
    if (organization === null) {
        return {
            isLoaded: true,
            organization: null,
            membership: null,
            domains: null,
            membershipRequests: null,
            memberships: null,
            invitations: null,
            subscriptions: null
        };
    }
    if (!clerk.loaded && organization) {
        return {
            isLoaded: true,
            organization,
            membership: void 0,
            domains: undefinedPaginatedResource,
            membershipRequests: undefinedPaginatedResource,
            memberships: undefinedPaginatedResource,
            invitations: undefinedPaginatedResource,
            subscriptions: undefinedPaginatedResource
        };
    }
    return {
        isLoaded: clerk.loaded,
        organization,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        membership: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$IBXKDGSZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentOrganizationMembership"])(session.user.organizationMemberships, organization.id),
        // your membership in the current org
        domains,
        membershipRequests,
        memberships,
        invitations,
        subscriptions
    };
}
// src/react/hooks/useOrganizationList.tsx
var undefinedPaginatedResource2 = {
    data: void 0,
    count: void 0,
    error: void 0,
    isLoading: false,
    isFetching: false,
    isError: false,
    page: void 0,
    pageCount: void 0,
    fetchPage: void 0,
    fetchNext: void 0,
    fetchPrevious: void 0,
    hasNextPage: false,
    hasPreviousPage: false,
    revalidate: void 0,
    setData: void 0
};
function useOrganizationList(params) {
    var _clerk_telemetry;
    const { userMemberships, userInvitations, userSuggestions } = params || {};
    useAssertWrappedByClerkProvider("useOrganizationList");
    const userMembershipsSafeValues = useWithSafeValues(userMemberships, {
        initialPage: 1,
        pageSize: 10,
        keepPreviousData: false,
        infinite: false
    });
    const userInvitationsSafeValues = useWithSafeValues(userInvitations, {
        initialPage: 1,
        pageSize: 10,
        status: "pending",
        keepPreviousData: false,
        infinite: false
    });
    const userSuggestionsSafeValues = useWithSafeValues(userSuggestions, {
        initialPage: 1,
        pageSize: 10,
        status: "pending",
        keepPreviousData: false,
        infinite: false
    });
    const clerk = useClerkInstanceContext();
    const user = useUserContext();
    (_clerk_telemetry = clerk.telemetry) === null || _clerk_telemetry === void 0 ? void 0 : _clerk_telemetry.record((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$CEMKEFAA$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["eventMethodCalled"])("useOrganizationList"));
    const userMembershipsParams = typeof userMemberships === "undefined" ? void 0 : {
        initialPage: userMembershipsSafeValues.initialPage,
        pageSize: userMembershipsSafeValues.pageSize
    };
    const userInvitationsParams = typeof userInvitations === "undefined" ? void 0 : {
        initialPage: userInvitationsSafeValues.initialPage,
        pageSize: userInvitationsSafeValues.pageSize,
        status: userInvitationsSafeValues.status
    };
    const userSuggestionsParams = typeof userSuggestions === "undefined" ? void 0 : {
        initialPage: userSuggestionsSafeValues.initialPage,
        pageSize: userSuggestionsSafeValues.pageSize,
        status: userSuggestionsSafeValues.status
    };
    const isClerkLoaded = !!(clerk.loaded && user);
    const memberships = usePagesOrInfinite(userMembershipsParams || {}, user === null || user === void 0 ? void 0 : user.getOrganizationMemberships, {
        keepPreviousData: userMembershipsSafeValues.keepPreviousData,
        infinite: userMembershipsSafeValues.infinite,
        enabled: !!userMembershipsParams
    }, {
        type: "userMemberships",
        userId: user === null || user === void 0 ? void 0 : user.id
    });
    const invitations = usePagesOrInfinite({
        ...userInvitationsParams
    }, user === null || user === void 0 ? void 0 : user.getOrganizationInvitations, {
        keepPreviousData: userInvitationsSafeValues.keepPreviousData,
        infinite: userInvitationsSafeValues.infinite,
        enabled: !!userInvitationsParams
    }, {
        type: "userInvitations",
        userId: user === null || user === void 0 ? void 0 : user.id
    });
    const suggestions = usePagesOrInfinite({
        ...userSuggestionsParams
    }, user === null || user === void 0 ? void 0 : user.getOrganizationSuggestions, {
        keepPreviousData: userSuggestionsSafeValues.keepPreviousData,
        infinite: userSuggestionsSafeValues.infinite,
        enabled: !!userSuggestionsParams
    }, {
        type: "userSuggestions",
        userId: user === null || user === void 0 ? void 0 : user.id
    });
    if (!isClerkLoaded) {
        return {
            isLoaded: false,
            createOrganization: void 0,
            setActive: void 0,
            userMemberships: undefinedPaginatedResource2,
            userInvitations: undefinedPaginatedResource2,
            userSuggestions: undefinedPaginatedResource2
        };
    }
    return {
        isLoaded: isClerkLoaded,
        setActive: clerk.setActive,
        createOrganization: clerk.createOrganization,
        userMemberships: memberships,
        userInvitations: invitations,
        userSuggestions: suggestions
    };
}
;
var useSafeLayoutEffect = typeof window !== "undefined" ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useLayoutEffect : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect;
// src/react/hooks/useSession.ts
var hookName = "useSession";
var useSession = ()=>{
    var _clerk_telemetry;
    useAssertWrappedByClerkProvider(hookName);
    const session = useSessionContext();
    const clerk = useClerkInstanceContext();
    (_clerk_telemetry = clerk.telemetry) === null || _clerk_telemetry === void 0 ? void 0 : _clerk_telemetry.record((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$CEMKEFAA$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["eventMethodCalled"])(hookName));
    if (session === void 0) {
        return {
            isLoaded: false,
            isSignedIn: void 0,
            session: void 0
        };
    }
    if (session === null) {
        return {
            isLoaded: true,
            isSignedIn: false,
            session: null
        };
    }
    return {
        isLoaded: true,
        isSignedIn: clerk.isSignedIn,
        session
    };
};
// src/react/hooks/useSessionList.ts
var hookName2 = "useSessionList";
var useSessionList = ()=>{
    var _clerk_telemetry;
    useAssertWrappedByClerkProvider(hookName2);
    const isomorphicClerk = useClerkInstanceContext();
    const client = useClientContext();
    const clerk = useClerkInstanceContext();
    (_clerk_telemetry = clerk.telemetry) === null || _clerk_telemetry === void 0 ? void 0 : _clerk_telemetry.record((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$CEMKEFAA$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["eventMethodCalled"])(hookName2));
    if (!client) {
        return {
            isLoaded: false,
            sessions: void 0,
            setActive: void 0
        };
    }
    return {
        isLoaded: true,
        sessions: client.sessions,
        setActive: isomorphicClerk.setActive
    };
};
// src/react/hooks/useUser.ts
var hookName3 = "useUser";
function useUser() {
    var _clerk_telemetry;
    useAssertWrappedByClerkProvider(hookName3);
    const user = useUserContext();
    const clerk = useClerkInstanceContext();
    (_clerk_telemetry = clerk.telemetry) === null || _clerk_telemetry === void 0 ? void 0 : _clerk_telemetry.record((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$CEMKEFAA$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["eventMethodCalled"])(hookName3));
    if (user === void 0) {
        return {
            isLoaded: false,
            isSignedIn: void 0,
            user: void 0
        };
    }
    if (user === null) {
        return {
            isLoaded: true,
            isSignedIn: false,
            user: null
        };
    }
    return {
        isLoaded: true,
        isSignedIn: true,
        user
    };
}
// src/react/hooks/useClerk.ts
var useClerk = ()=>{
    useAssertWrappedByClerkProvider("useClerk");
    return useClerkInstanceContext();
};
;
;
var useDeepEqualMemoize = (value)=>{
    const ref = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useRef(value);
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$dequal$40$2$2e$0$2e$3$2f$node_modules$2f$dequal$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dequal"])(value, ref.current)) {
        ref.current = value;
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useMemo({
        "useDeepEqualMemoize.useMemo": ()=>ref.current
    }["useDeepEqualMemoize.useMemo"], [
        ref.current
    ]);
};
var useDeepEqualMemo = (factory, dependencyArray)=>{
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useMemo(factory, useDeepEqualMemoize(dependencyArray));
};
var isDeeplyEqual = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$dequal$40$2$2e$0$2e$3$2f$node_modules$2f$dequal$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dequal"];
;
var CLERK_API_REVERIFICATION_ERROR_CODE = "session_reverification_required";
async function resolveResult(result) {
    try {
        const r = await result;
        if (r instanceof Response) {
            return r.json();
        }
        return r;
    } catch (e) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$35WGBVWP$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isClerkAPIResponseError"])(e) && e.errors.find((param)=>{
            let { code } = param;
            return code === CLERK_API_REVERIFICATION_ERROR_CODE;
        })) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$43A5F2IE$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["reverificationError"])();
        }
        throw e;
    }
}
function createReverificationHandler(params) {
    function assertReverification(fetcher) {
        return async function() {
            for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                args[_key] = arguments[_key];
            }
            let result = await resolveResult(fetcher(...args));
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$43A5F2IE$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isReverificationHint"])(result)) {
                var _result_clerk_error_metadata;
                const resolvers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7QJ2QTJL$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createDeferredPromise"])();
                const isValidMetadata = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$3CN5LOSN$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateReverificationConfig"])((_result_clerk_error_metadata = result.clerk_error.metadata) === null || _result_clerk_error_metadata === void 0 ? void 0 : _result_clerk_error_metadata.reverification);
                const level = isValidMetadata ? isValidMetadata().level : void 0;
                const cancel = ()=>{
                    resolvers.reject(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$35WGBVWP$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ClerkRuntimeError"]("User cancelled attempted verification", {
                        code: "reverification_cancelled"
                    }));
                };
                const complete = ()=>{
                    resolvers.resolve(true);
                };
                if (params.onNeedsReverification === void 0) {
                    var _params_openUIComponent;
                    (_params_openUIComponent = params.openUIComponent) === null || _params_openUIComponent === void 0 ? void 0 : _params_openUIComponent.call(params, {
                        level,
                        afterVerification: complete,
                        afterVerificationCancelled: cancel
                    });
                } else {
                    params.onNeedsReverification({
                        cancel,
                        complete,
                        level
                    });
                }
                await resolvers.promise;
                result = await resolveResult(fetcher(...args));
            }
            return result;
        };
    }
    return assertReverification;
}
var useReverification = (fetcher, options)=>{
    const { __internal_openReverification, telemetry } = useClerk();
    const fetcherRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(fetcher);
    const optionsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(options);
    telemetry === null || telemetry === void 0 ? void 0 : telemetry.record((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$CEMKEFAA$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["eventMethodCalled"])("useReverification", {
        onNeedsReverification: Boolean(options === null || options === void 0 ? void 0 : options.onNeedsReverification)
    }));
    useSafeLayoutEffect({
        "useReverification.useSafeLayoutEffect": ()=>{
            fetcherRef.current = fetcher;
            optionsRef.current = options;
        }
    }["useReverification.useSafeLayoutEffect"]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useReverification.useCallback2": function() {
            for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                args[_key] = arguments[_key];
            }
            const handler = createReverificationHandler({
                openUIComponent: __internal_openReverification,
                telemetry,
                ...optionsRef.current
            })(fetcherRef.current);
            return handler(...args);
        }
    }["useReverification.useCallback2"], [
        __internal_openReverification,
        telemetry
    ]);
};
// src/react/hooks/createCommerceHook.tsx
function createCommercePaginatedHook(param) {
    let { hookName: hookName5, resourceType, useFetcher, options } = param;
    return function useCommerceHook(params) {
        var _clerk_telemetry;
        const { for: _for, ...paginationParams } = params || {
            for: "user"
        };
        useAssertWrappedByClerkProvider(hookName5);
        const fetchFn = useFetcher(_for);
        const safeValues = useWithSafeValues(paginationParams, {
            initialPage: 1,
            pageSize: 10,
            keepPreviousData: false,
            infinite: false,
            __experimental_mode: void 0
        });
        const clerk = useClerkInstanceContext();
        const user = useUserContext();
        const { organization } = useOrganizationContext();
        (_clerk_telemetry = clerk.telemetry) === null || _clerk_telemetry === void 0 ? void 0 : _clerk_telemetry.record((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$CEMKEFAA$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["eventMethodCalled"])(hookName5));
        const hookParams = typeof paginationParams === "undefined" ? void 0 : {
            initialPage: safeValues.initialPage,
            pageSize: safeValues.pageSize,
            ..._for === "organization" ? {
                orgId: organization === null || organization === void 0 ? void 0 : organization.id
            } : {}
        };
        const isClerkLoaded = !!(clerk.loaded && ((options === null || options === void 0 ? void 0 : options.unauthenticated) ? true : user));
        const isEnabled = !!hookParams && isClerkLoaded;
        const result = usePagesOrInfinite(hookParams || {}, fetchFn, {
            keepPreviousData: safeValues.keepPreviousData,
            infinite: safeValues.infinite,
            enabled: isEnabled,
            __experimental_mode: safeValues.__experimental_mode
        }, {
            type: resourceType,
            userId: user === null || user === void 0 ? void 0 : user.id,
            ..._for === "organization" ? {
                orgId: organization === null || organization === void 0 ? void 0 : organization.id
            } : {}
        });
        return result;
    };
}
// src/react/hooks/useStatements.tsx
var useStatements = createCommercePaginatedHook({
    hookName: "useStatements",
    resourceType: "commerce-statements",
    useFetcher: ()=>{
        const clerk = useClerkInstanceContext();
        return clerk.billing.getStatements;
    }
});
// src/react/hooks/usePaymentAttempts.tsx
var usePaymentAttempts = createCommercePaginatedHook({
    hookName: "usePaymentAttempts",
    resourceType: "commerce-payment-attempts",
    useFetcher: ()=>{
        const clerk = useClerkInstanceContext();
        return clerk.billing.getPaymentAttempts;
    }
});
// src/react/hooks/usePaymentMethods.tsx
var usePaymentMethods = createCommercePaginatedHook({
    hookName: "usePaymentMethods",
    resourceType: "commerce-payment-methods",
    useFetcher: (resource)=>{
        const { organization } = useOrganizationContext();
        const user = useUserContext();
        if (resource === "organization") {
            return organization === null || organization === void 0 ? void 0 : organization.getPaymentSources;
        }
        return user === null || user === void 0 ? void 0 : user.getPaymentSources;
    }
});
// src/react/hooks/usePlans.tsx
var usePlans = createCommercePaginatedHook({
    hookName: "usePlans",
    resourceType: "commerce-plans",
    useFetcher: (_for)=>{
        const clerk = useClerkInstanceContext();
        return (param)=>{
            let { orgId, ...rest } = param;
            return clerk.billing.getPlans({
                ...rest,
                for: _for
            });
        };
    },
    options: {
        unauthenticated: true
    }
});
;
var hookName4 = "useSubscription";
var useSubscription = (params)=>{
    var _clerk_telemetry;
    useAssertWrappedByClerkProvider(hookName4);
    const clerk = useClerkInstanceContext();
    const user = useUserContext();
    const { organization } = useOrganizationContext();
    (_clerk_telemetry = clerk.telemetry) === null || _clerk_telemetry === void 0 ? void 0 : _clerk_telemetry.record((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$CEMKEFAA$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["eventMethodCalled"])(hookName4));
    const swr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$swr$40$2$2e$3$2e$4_react$40$19$2e$1$2e$0$2f$node_modules$2f$swr$2f$dist$2f$index$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"])((user === null || user === void 0 ? void 0 : user.id) ? {
        type: "commerce-subscription",
        userId: user.id,
        args: {
            orgId: (params === null || params === void 0 ? void 0 : params.for) === "organization" ? organization === null || organization === void 0 ? void 0 : organization.id : void 0
        }
    } : null, (param)=>{
        let { args } = param;
        return clerk.billing.getSubscription(args);
    }, {
        dedupingInterval: 1e3 * 60,
        keepPreviousData: params === null || params === void 0 ? void 0 : params.keepPreviousData
    });
    const revalidate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSubscription.useCallback3[revalidate]": ()=>swr.mutate()
    }["useSubscription.useCallback3[revalidate]"], [
        swr.mutate
    ]);
    return {
        data: swr.data,
        error: swr.error,
        isLoading: swr.isLoading,
        isFetching: swr.isValidating,
        revalidate
    };
};
;
var useCheckout = (options)=>{
    const contextOptions = useCheckoutContext();
    const { for: forOrganization, planId, planPeriod } = options || contextOptions;
    const clerk = useClerk();
    const { organization } = useOrganization();
    const { isLoaded, user } = useUser();
    if (!isLoaded) {
        throw new Error("Clerk: Ensure that `useCheckout` is inside a component wrapped with `<ClerkLoaded />`.");
    }
    if (!user) {
        throw new Error("Clerk: Ensure that `useCheckout` is inside a component wrapped with `<SignedIn />`.");
    }
    if (forOrganization === "organization" && !organization) {
        throw new Error("Clerk: Wrap your flow with a check for an active organization");
    }
    const manager = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useCheckout.useMemo2[manager]": ()=>clerk.__experimental_checkout({
                planId,
                planPeriod,
                for: forOrganization
            })
    }["useCheckout.useMemo2[manager]"], [
        user.id,
        organization === null || organization === void 0 ? void 0 : organization.id,
        planId,
        planPeriod,
        forOrganization
    ]);
    const managerProperties = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"])({
        "useCheckout.useSyncExternalStore[managerProperties]": (cb)=>manager.subscribe(cb)
    }["useCheckout.useSyncExternalStore[managerProperties]"], {
        "useCheckout.useSyncExternalStore[managerProperties]": ()=>manager.getState()
    }["useCheckout.useSyncExternalStore[managerProperties]"], {
        "useCheckout.useSyncExternalStore[managerProperties]": ()=>manager.getState()
    }["useCheckout.useSyncExternalStore[managerProperties]"]);
    const properties = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useCheckout.useMemo2[properties]": ()=>{
            if (!managerProperties.checkout) {
                return {
                    id: null,
                    externalClientSecret: null,
                    externalGatewayId: null,
                    status: null,
                    totals: null,
                    isImmediatePlanChange: null,
                    planPeriod: null,
                    plan: null,
                    paymentSource: null,
                    freeTrialEndsAt: null
                };
            }
            const { // eslint-disable-next-line @typescript-eslint/unbound-method
            reload, confirm, pathRoot, // All the above need to be removed from the properties
            ...rest } = managerProperties.checkout;
            return rest;
        }
    }["useCheckout.useMemo2[properties]"], [
        managerProperties.checkout
    ]);
    const checkout = {
        ...properties,
        getState: manager.getState,
        start: manager.start,
        confirm: manager.confirm,
        clear: manager.clear,
        finalize: manager.finalize,
        isStarting: managerProperties.isStarting,
        isConfirming: managerProperties.isConfirming,
        error: managerProperties.error,
        status: managerProperties.status,
        fetchStatus: managerProperties.fetchStatus
    };
    return {
        checkout
    };
};
;
;
;
;
;
;
var usePrevious = (value)=>{
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(value);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePrevious.useEffect": ()=>{
            ref.current = value;
        }
    }["usePrevious.useEffect"], [
        value
    ]);
    return ref.current;
};
var useAttachEvent = (element, event, cb)=>{
    const cbDefined = !!cb;
    const cbRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(cb);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useAttachEvent.useEffect": ()=>{
            cbRef.current = cb;
        }
    }["useAttachEvent.useEffect"], [
        cb
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useAttachEvent.useEffect": ()=>{
            if (!cbDefined || !element) {
                return ({
                    "useAttachEvent.useEffect": ()=>{}
                })["useAttachEvent.useEffect"];
            }
            const decoratedCb = {
                "useAttachEvent.useEffect.decoratedCb": function() {
                    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                        args[_key] = arguments[_key];
                    }
                    if (cbRef.current) {
                        cbRef.current(...args);
                    }
                }
            }["useAttachEvent.useEffect.decoratedCb"];
            element.on(event, decoratedCb);
            return ({
                "useAttachEvent.useEffect": ()=>{
                    element.off(event, decoratedCb);
                }
            })["useAttachEvent.useEffect"];
        }
    }["useAttachEvent.useEffect"], [
        cbDefined,
        event,
        element,
        cbRef
    ]);
};
// src/react/stripe-react/index.tsx
var ElementsContext = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createContext(null);
ElementsContext.displayName = "ElementsContext";
var parseElementsContext = (ctx, useCase)=>{
    if (!ctx) {
        throw new Error("Could not find Elements context; You need to wrap the part of your app that ".concat(useCase, " in an <Elements> provider."));
    }
    return ctx;
};
var Elements = (param)=>{
    let { stripe: rawStripeProp, options, children } = param;
    const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useMemo({
        "Elements.useMemo[parsed]": ()=>parseStripeProp(rawStripeProp)
    }["Elements.useMemo[parsed]"], [
        rawStripeProp
    ]);
    const [ctx, setContext] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState({
        "Elements.useState": ()=>({
                stripe: parsed.tag === "sync" ? parsed.stripe : null,
                elements: parsed.tag === "sync" ? parsed.stripe.elements(options) : null
            })
    }["Elements.useState"]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "Elements.useEffect": ()=>{
            let isMounted = true;
            const safeSetContext = {
                "Elements.useEffect.safeSetContext": (stripe)=>{
                    setContext({
                        "Elements.useEffect.safeSetContext": (ctx2)=>{
                            if (ctx2.stripe) return ctx2;
                            return {
                                stripe,
                                elements: stripe.elements(options)
                            };
                        }
                    }["Elements.useEffect.safeSetContext"]);
                }
            }["Elements.useEffect.safeSetContext"];
            if (parsed.tag === "async" && !ctx.stripe) {
                parsed.stripePromise.then({
                    "Elements.useEffect": (stripe)=>{
                        if (stripe && isMounted) {
                            safeSetContext(stripe);
                        }
                    }
                }["Elements.useEffect"]);
            } else if (parsed.tag === "sync" && !ctx.stripe) {
                safeSetContext(parsed.stripe);
            }
            return ({
                "Elements.useEffect": ()=>{
                    isMounted = false;
                }
            })["Elements.useEffect"];
        }
    }["Elements.useEffect"], [
        parsed,
        ctx,
        options
    ]);
    const prevStripe = usePrevious(rawStripeProp);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "Elements.useEffect": ()=>{
            if (prevStripe !== null && prevStripe !== rawStripeProp) {
                console.warn("Unsupported prop change on Elements: You cannot change the `stripe` prop after setting it.");
            }
        }
    }["Elements.useEffect"], [
        prevStripe,
        rawStripeProp
    ]);
    const prevOptions = usePrevious(options);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "Elements.useEffect": ()=>{
            if (!ctx.elements) {
                return;
            }
            const updates = extractAllowedOptionsUpdates(options, prevOptions, [
                "clientSecret",
                "fonts"
            ]);
            if (updates) {
                ctx.elements.update(updates);
            }
        }
    }["Elements.useEffect"], [
        options,
        prevOptions,
        ctx.elements
    ]);
    return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(ElementsContext.Provider, {
        value: ctx
    }, children);
};
var useElementsContextWithUseCase = (useCaseMessage)=>{
    const ctx = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useContext(ElementsContext);
    return parseElementsContext(ctx, useCaseMessage);
};
var useElements = ()=>{
    const { elements } = useElementsContextWithUseCase("calls useElements()");
    return elements;
};
var INVALID_STRIPE_ERROR = "Invalid prop `stripe` supplied to `Elements`. We recommend using the `loadStripe` utility from `@stripe/stripe-js`. See https://stripe.com/docs/stripe-js/react#elements-props-stripe for details.";
var validateStripe = function(maybeStripe) {
    let errorMsg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : INVALID_STRIPE_ERROR;
    if (maybeStripe === null || isStripe(maybeStripe)) {
        return maybeStripe;
    }
    throw new Error(errorMsg);
};
var parseStripeProp = function(raw) {
    let errorMsg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : INVALID_STRIPE_ERROR;
    if (isPromise(raw)) {
        return {
            tag: "async",
            stripePromise: Promise.resolve(raw).then((result)=>validateStripe(result, errorMsg))
        };
    }
    const stripe = validateStripe(raw, errorMsg);
    if (stripe === null) {
        return {
            tag: "empty"
        };
    }
    return {
        tag: "sync",
        stripe
    };
};
var isUnknownObject = (raw)=>{
    return raw !== null && typeof raw === "object";
};
var isPromise = (raw)=>{
    return isUnknownObject(raw) && typeof raw.then === "function";
};
var isStripe = (raw)=>{
    return isUnknownObject(raw) && typeof raw.elements === "function" && typeof raw.createToken === "function" && typeof raw.createPaymentMethod === "function" && typeof raw.confirmCardPayment === "function";
};
var extractAllowedOptionsUpdates = (options, prevOptions, immutableKeys)=>{
    if (!isUnknownObject(options)) {
        return null;
    }
    return Object.keys(options).reduce((newOptions, key)=>{
        const isUpdated = !isUnknownObject(prevOptions) || !isEqual(options[key], prevOptions[key]);
        if (immutableKeys.includes(key)) {
            if (isUpdated) {
                console.warn("Unsupported prop change: options.".concat(key, " is not a mutable property."));
            }
            return newOptions;
        }
        if (!isUpdated) {
            return newOptions;
        }
        return {
            ...newOptions || {},
            [key]: options[key]
        };
    }, null);
};
var PLAIN_OBJECT_STR = "[object Object]";
var isEqual = (left, right)=>{
    if (!isUnknownObject(left) || !isUnknownObject(right)) {
        return left === right;
    }
    const leftArray = Array.isArray(left);
    const rightArray = Array.isArray(right);
    if (leftArray !== rightArray) return false;
    const leftPlainObject = Object.prototype.toString.call(left) === PLAIN_OBJECT_STR;
    const rightPlainObject = Object.prototype.toString.call(right) === PLAIN_OBJECT_STR;
    if (leftPlainObject !== rightPlainObject) return false;
    if (!leftPlainObject && !leftArray) return left === right;
    const leftKeys = Object.keys(left);
    const rightKeys = Object.keys(right);
    if (leftKeys.length !== rightKeys.length) return false;
    const keySet = {};
    for(let i = 0; i < leftKeys.length; i += 1){
        keySet[leftKeys[i]] = true;
    }
    for(let i = 0; i < rightKeys.length; i += 1){
        keySet[rightKeys[i]] = true;
    }
    const allKeys = Object.keys(keySet);
    if (allKeys.length !== leftKeys.length) {
        return false;
    }
    const l = left;
    const r = right;
    const pred = (key)=>{
        return isEqual(l[key], r[key]);
    };
    return allKeys.every(pred);
};
var useStripe = ()=>{
    const { stripe } = useElementsOrCheckoutSdkContextWithUseCase("calls useStripe()");
    return stripe;
};
var useElementsOrCheckoutSdkContextWithUseCase = (useCaseString)=>{
    const elementsContext = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useContext(ElementsContext);
    return parseElementsContext(elementsContext, useCaseString);
};
var capitalized = (str)=>str.charAt(0).toUpperCase() + str.slice(1);
var createElementComponent = (type, isServer2)=>{
    const displayName = "".concat(capitalized(type), "Element");
    const ClientElement = (param)=>{
        let { id, className, fallback, options = {}, onBlur, onFocus, onReady, onChange, onEscape, onClick, onLoadError, onLoaderStart, onNetworksChange, onConfirm, onCancel, onShippingAddressChange, onShippingRateChange } = param;
        const ctx = useElementsOrCheckoutSdkContextWithUseCase("mounts <".concat(displayName, ">"));
        const elements = "elements" in ctx ? ctx.elements : null;
        const [element, setElement] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(null);
        const elementRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useRef(null);
        const domNode = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useRef(null);
        const [isReady, setReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
        useAttachEvent(element, "blur", onBlur);
        useAttachEvent(element, "focus", onFocus);
        useAttachEvent(element, "escape", onEscape);
        useAttachEvent(element, "click", onClick);
        useAttachEvent(element, "loaderror", onLoadError);
        useAttachEvent(element, "loaderstart", onLoaderStart);
        useAttachEvent(element, "networkschange", onNetworksChange);
        useAttachEvent(element, "confirm", onConfirm);
        useAttachEvent(element, "cancel", onCancel);
        useAttachEvent(element, "shippingaddresschange", onShippingAddressChange);
        useAttachEvent(element, "shippingratechange", onShippingRateChange);
        useAttachEvent(element, "change", onChange);
        let readyCallback;
        if (onReady) {
            readyCallback = ()=>{
                setReady(true);
                onReady(element);
            };
        }
        useAttachEvent(element, "ready", readyCallback);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useLayoutEffect({
            "createElementComponent.ClientElement.useLayoutEffect": ()=>{
                if (elementRef.current === null && domNode.current !== null && elements) {
                    let newElement = null;
                    if (elements) {
                        newElement = elements.create(type, options);
                    }
                    elementRef.current = newElement;
                    setElement(newElement);
                    if (newElement) {
                        newElement.mount(domNode.current);
                    }
                }
            }
        }["createElementComponent.ClientElement.useLayoutEffect"], [
            elements,
            options
        ]);
        const prevOptions = usePrevious(options);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
            "createElementComponent.ClientElement.useEffect": ()=>{
                if (!elementRef.current) {
                    return;
                }
                const updates = extractAllowedOptionsUpdates(options, prevOptions, [
                    "paymentRequest"
                ]);
                if (updates && "update" in elementRef.current) {
                    elementRef.current.update(updates);
                }
            }
        }["createElementComponent.ClientElement.useEffect"], [
            options,
            prevOptions
        ]);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useLayoutEffect({
            "createElementComponent.ClientElement.useLayoutEffect": ()=>{
                return ({
                    "createElementComponent.ClientElement.useLayoutEffect": ()=>{
                        if (elementRef.current && typeof elementRef.current.destroy === "function") {
                            try {
                                elementRef.current.destroy();
                                elementRef.current = null;
                            } catch (e) {}
                        }
                    }
                })["createElementComponent.ClientElement.useLayoutEffect"];
            }
        }["createElementComponent.ClientElement.useLayoutEffect"], []);
        return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Fragment, null, !isReady && fallback, /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement("div", {
            id,
            style: {
                height: isReady ? "unset" : "0px",
                visibility: isReady ? "visible" : "hidden"
            },
            className,
            ref: domNode
        }));
    };
    const ServerElement = (props)=>{
        useElementsOrCheckoutSdkContextWithUseCase("mounts <".concat(displayName, ">"));
        const { id, className } = props;
        return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement("div", {
            id,
            className
        });
    };
    const Element = isServer2 ? ServerElement : ClientElement;
    Element.displayName = displayName;
    Element.__elementType = type;
    return Element;
};
var isServer = typeof window === "undefined";
var PaymentElement = createElementComponent("payment", isServer);
// src/react/commerce.tsx
var [StripeLibsContext, useStripeLibsContext] = createContextAndHook("StripeLibsContext");
var StripeLibsProvider = (param)=>{
    let { children } = param;
    const clerk = useClerk();
    const { data: stripeClerkLibs } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$swr$40$2$2e$3$2e$4_react$40$19$2e$1$2e$0$2f$node_modules$2f$swr$2f$dist$2f$index$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"])("clerk-stripe-sdk", {
        "StripeLibsProvider.useSWR": async ()=>{
            const loadStripe = await clerk.__internal_loadStripeJs();
            return {
                loadStripe
            };
        }
    }["StripeLibsProvider.useSWR"], {
        keepPreviousData: true,
        revalidateOnFocus: false,
        dedupingInterval: Infinity
    });
    return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(StripeLibsContext.Provider, {
        value: {
            value: stripeClerkLibs || null
        }
    }, children);
};
var useInternalEnvironment = ()=>{
    const clerk = useClerk();
    return clerk.__unstable__environment;
};
var usePaymentSourceUtils = function() {
    let forResource = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "user";
    const { organization } = useOrganization();
    const { user } = useUser();
    const resource = forResource === "organization" ? organization : user;
    const stripeClerkLibs = useStripeLibsContext();
    const { data: initializedPaymentSource, trigger: initializePaymentSource } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$swr$40$2$2e$3$2e$4_react$40$19$2e$1$2e$0$2f$node_modules$2f$swr$2f$dist$2f$mutation$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
        key: "commerce-payment-source-initialize",
        resourceId: resource === null || resource === void 0 ? void 0 : resource.id
    }, {
        "usePaymentSourceUtils.useSWRMutation": ()=>{
            return resource === null || resource === void 0 ? void 0 : resource.initializePaymentSource({
                gateway: "stripe"
            });
        }
    }["usePaymentSourceUtils.useSWRMutation"]);
    const environment = useInternalEnvironment();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePaymentSourceUtils.useEffect2": ()=>{
            if (!(resource === null || resource === void 0 ? void 0 : resource.id)) return;
            initializePaymentSource().catch({
                "usePaymentSourceUtils.useEffect2": ()=>{}
            }["usePaymentSourceUtils.useEffect2"]);
        }
    }["usePaymentSourceUtils.useEffect2"], [
        resource === null || resource === void 0 ? void 0 : resource.id
    ]);
    const externalGatewayId = initializedPaymentSource === null || initializedPaymentSource === void 0 ? void 0 : initializedPaymentSource.externalGatewayId;
    const externalClientSecret = initializedPaymentSource === null || initializedPaymentSource === void 0 ? void 0 : initializedPaymentSource.externalClientSecret;
    const paymentMethodOrder = initializedPaymentSource === null || initializedPaymentSource === void 0 ? void 0 : initializedPaymentSource.paymentMethodOrder;
    const stripePublishableKey = environment === null || environment === void 0 ? void 0 : environment.commerceSettings.billing.stripePublishableKey;
    const { data: stripe } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$swr$40$2$2e$3$2e$4_react$40$19$2e$1$2e$0$2f$node_modules$2f$swr$2f$dist$2f$index$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"])(stripeClerkLibs && externalGatewayId && stripePublishableKey ? {
        key: "stripe-sdk",
        externalGatewayId,
        stripePublishableKey
    } : null, {
        "usePaymentSourceUtils.useSWR": (param)=>{
            let { stripePublishableKey: stripePublishableKey2, externalGatewayId: externalGatewayId2 } = param;
            return stripeClerkLibs === null || stripeClerkLibs === void 0 ? void 0 : stripeClerkLibs.loadStripe(stripePublishableKey2, {
                stripeAccount: externalGatewayId2
            });
        }
    }["usePaymentSourceUtils.useSWR"], {
        keepPreviousData: true,
        revalidateOnFocus: false,
        dedupingInterval: 1e3 * 60
    });
    return {
        stripe,
        initializePaymentSource,
        externalClientSecret,
        paymentMethodOrder
    };
};
var [PaymentElementContext, usePaymentElementContext] = createContextAndHook("PaymentElementContext");
var [StripeUtilsContext, useStripeUtilsContext] = createContextAndHook("StripeUtilsContext");
var ValidateStripeUtils = (param)=>{
    let { children } = param;
    const stripe = useStripe();
    const elements = useElements();
    return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(StripeUtilsContext.Provider, {
        value: {
            value: {
                stripe,
                elements
            }
        }
    }, children);
};
var DummyStripeUtils = (param)=>{
    let { children } = param;
    return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(StripeUtilsContext.Provider, {
        value: {
            value: {}
        }
    }, children);
};
var PropsProvider = (param)=>{
    let { children, ...props } = param;
    const utils = usePaymentSourceUtils(props.for);
    const [isPaymentElementReady, setIsPaymentElementReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(PaymentElementContext.Provider, {
        value: {
            value: {
                ...props,
                ...utils,
                setIsPaymentElementReady,
                isPaymentElementReady
            }
        }
    }, children);
};
var PaymentElementProvider = (param)=>{
    let { children, ...props } = param;
    return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(StripeLibsProvider, null, /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(PropsProvider, {
        ...props
    }, /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(PaymentElementInternalRoot, null, children)));
};
var PaymentElementInternalRoot = (props)=>{
    const { stripe, externalClientSecret, stripeAppearance } = usePaymentElementContext();
    if (stripe && externalClientSecret) {
        return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(Elements, {
            key: externalClientSecret,
            stripe,
            options: {
                loader: "never",
                clientSecret: externalClientSecret,
                appearance: {
                    variables: stripeAppearance
                }
            }
        }, /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(ValidateStripeUtils, null, props.children));
    }
    return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(DummyStripeUtils, null, props.children);
};
var PaymentElement2 = (param)=>{
    let { fallback } = param;
    const { setIsPaymentElementReady, paymentMethodOrder, checkout, stripe, externalClientSecret, paymentDescription, for: _for } = usePaymentElementContext();
    const environment = useInternalEnvironment();
    const applePay = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PaymentElement2.useMemo3[applePay]": ()=>{
            var _checkout_totals_totalDueNow;
            if (!checkout || !checkout.totals || !checkout.plan) {
                return void 0;
            }
            return {
                recurringPaymentRequest: {
                    paymentDescription: paymentDescription || "",
                    managementURL: _for === "organization" ? (environment === null || environment === void 0 ? void 0 : environment.displayConfig.organizationProfileUrl) || "" : (environment === null || environment === void 0 ? void 0 : environment.displayConfig.userProfileUrl) || "",
                    regularBilling: {
                        amount: ((_checkout_totals_totalDueNow = checkout.totals.totalDueNow) === null || _checkout_totals_totalDueNow === void 0 ? void 0 : _checkout_totals_totalDueNow.amount) || checkout.totals.grandTotal.amount,
                        label: checkout.plan.name,
                        recurringPaymentIntervalUnit: checkout.planPeriod === "annual" ? "year" : "month"
                    }
                }
            };
        }
    }["PaymentElement2.useMemo3[applePay]"], [
        checkout,
        paymentDescription,
        _for,
        environment
    ]);
    const options = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PaymentElement2.useMemo3[options]": ()=>{
            return {
                layout: {
                    type: "tabs",
                    defaultCollapsed: false
                },
                paymentMethodOrder,
                applePay
            };
        }
    }["PaymentElement2.useMemo3[options]"], [
        applePay,
        paymentMethodOrder
    ]);
    const onReady = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PaymentElement2.useCallback4[onReady]": ()=>{
            setIsPaymentElementReady(true);
        }
    }["PaymentElement2.useCallback4[onReady]"], [
        setIsPaymentElementReady
    ]);
    if (!stripe || !externalClientSecret) {
        return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Fragment, null, fallback);
    }
    return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(PaymentElement, {
        fallback,
        onReady,
        options
    });
};
var throwLibsMissingError = ()=>{
    throw new Error("Clerk: Unable to submit, Stripe libraries are not yet loaded. Be sure to check `isFormReady` before calling `submit`.");
};
var usePaymentElement = ()=>{
    const { isPaymentElementReady, initializePaymentSource } = usePaymentElementContext();
    const { stripe, elements } = useStripeUtilsContext();
    const { externalClientSecret } = usePaymentElementContext();
    const submit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePaymentElement.useCallback4[submit]": async ()=>{
            if (!stripe || !elements) {
                return throwLibsMissingError();
            }
            const { setupIntent, error } = await stripe.confirmSetup({
                elements,
                confirmParams: {
                    return_url: window.location.href
                },
                redirect: "if_required"
            });
            if (error) {
                return {
                    data: null,
                    error: {
                        gateway: "stripe",
                        error: {
                            code: error.code,
                            message: error.message,
                            type: error.type
                        }
                    }
                };
            }
            return {
                data: {
                    gateway: "stripe",
                    paymentToken: setupIntent.payment_method
                },
                error: null
            };
        }
    }["usePaymentElement.useCallback4[submit]"], [
        stripe,
        elements
    ]);
    const reset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePaymentElement.useCallback4[reset]": async ()=>{
            if (!stripe || !elements) {
                return throwLibsMissingError();
            }
            await initializePaymentSource();
        }
    }["usePaymentElement.useCallback4[reset]"], [
        stripe,
        elements,
        initializePaymentSource
    ]);
    const isProviderReady = Boolean(stripe && externalClientSecret);
    if (!isProviderReady) {
        return {
            submit: throwLibsMissingError,
            reset: throwLibsMissingError,
            isFormReady: false,
            provider: void 0,
            isProviderReady: false
        };
    }
    return {
        submit,
        reset,
        isFormReady: isPaymentElementReady,
        provider: {
            name: "stripe"
        },
        isProviderReady
    };
};
;
 //# sourceMappingURL=index.mjs.map
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-7HPDNZ3R.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

// src/utils/runtimeEnvironment.ts
__turbopack_context__.s({
    "isDevelopmentEnvironment": ()=>isDevelopmentEnvironment,
    "isProductionEnvironment": ()=>isProductionEnvironment,
    "isTestEnvironment": ()=>isTestEnvironment
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.4.6_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var isDevelopmentEnvironment = ()=>{
    try {
        return ("TURBOPACK compile-time value", "development") === "development";
    } catch (e) {}
    return false;
};
var isTestEnvironment = ()=>{
    try {
        return ("TURBOPACK compile-time value", "development") === "test";
    } catch (e) {}
    return false;
};
var isProductionEnvironment = ()=>{
    try {
        return ("TURBOPACK compile-time value", "development") === "production";
    } catch (e) {}
    return false;
};
;
 //# sourceMappingURL=chunk-7HPDNZ3R.mjs.map
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-UEY4AZIP.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "deprecated": ()=>deprecated,
    "deprecatedObjectProperty": ()=>deprecatedObjectProperty,
    "deprecatedProperty": ()=>deprecatedProperty
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7HPDNZ3R$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-7HPDNZ3R.mjs [app-client] (ecmascript)");
;
// src/deprecated.ts
var displayedWarnings = /* @__PURE__ */ new Set();
var deprecated = (fnName, warning, key)=>{
    const hideWarning = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7HPDNZ3R$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isTestEnvironment"])() || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7HPDNZ3R$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isProductionEnvironment"])();
    const messageId = key !== null && key !== void 0 ? key : fnName;
    if (displayedWarnings.has(messageId) || hideWarning) {
        return;
    }
    displayedWarnings.add(messageId);
    console.warn('Clerk - DEPRECATION WARNING: "'.concat(fnName, '" is deprecated and will be removed in the next major release.\n').concat(warning));
};
var deprecatedProperty = function(cls, propName, warning) {
    let isStatic = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
    const target = isStatic ? cls : cls.prototype;
    let value = target[propName];
    Object.defineProperty(target, propName, {
        get () {
            deprecated(propName, warning, "".concat(cls.name, ":").concat(propName));
            return value;
        },
        set (v) {
            value = v;
        }
    });
};
var deprecatedObjectProperty = (obj, propName, warning, key)=>{
    let value = obj[propName];
    Object.defineProperty(obj, propName, {
        get () {
            deprecated(propName, warning, key);
            return value;
        },
        set (v) {
            value = v;
        }
    });
};
;
 //# sourceMappingURL=chunk-UEY4AZIP.mjs.map
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/deprecated.mjs [app-client] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$UEY4AZIP$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-UEY4AZIP.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7HPDNZ3R$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-7HPDNZ3R.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-7ELT755Q.mjs [app-client] (ecmascript)");
;
;
;
;
 //# sourceMappingURL=deprecated.mjs.map
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/deprecated.mjs [app-client] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$UEY4AZIP$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-UEY4AZIP.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7HPDNZ3R$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-7HPDNZ3R.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-7ELT755Q.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$deprecated$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/deprecated.mjs [app-client] (ecmascript) <locals>");
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-ARQUL5DC.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "allSettled": ()=>allSettled,
    "fastDeepMergeAndKeep": ()=>fastDeepMergeAndKeep,
    "fastDeepMergeAndReplace": ()=>fastDeepMergeAndReplace,
    "logErrorInDevMode": ()=>logErrorInDevMode
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7HPDNZ3R$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-7HPDNZ3R.mjs [app-client] (ecmascript)");
;
// src/utils/allSettled.ts
function allSettled(iterable) {
    const promises = Array.from(iterable).map((p)=>p.then((value)=>({
                status: "fulfilled",
                value
            }), (reason)=>({
                status: "rejected",
                reason
            })));
    return Promise.all(promises);
}
// src/utils/logErrorInDevMode.ts
var logErrorInDevMode = (message)=>{
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7HPDNZ3R$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDevelopmentEnvironment"])()) {
        console.error("Clerk: ".concat(message));
    }
};
// src/utils/fastDeepMerge.ts
var fastDeepMergeAndReplace = (source, target)=>{
    if (!source || !target) {
        return;
    }
    for(const key in source){
        if (Object.prototype.hasOwnProperty.call(source, key) && source[key] !== null && typeof source[key] === "object") {
            if (target[key] === void 0) {
                target[key] = new (Object.getPrototypeOf(source[key])).constructor();
            }
            fastDeepMergeAndReplace(source[key], target[key]);
        } else if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
        }
    }
};
var fastDeepMergeAndKeep = (source, target)=>{
    if (!source || !target) {
        return;
    }
    for(const key in source){
        if (Object.prototype.hasOwnProperty.call(source, key) && source[key] !== null && typeof source[key] === "object") {
            if (target[key] === void 0) {
                target[key] = new (Object.getPrototypeOf(source[key])).constructor();
            }
            fastDeepMergeAndKeep(source[key], target[key]);
        } else if (Object.prototype.hasOwnProperty.call(source, key) && target[key] === void 0) {
            target[key] = source[key];
        }
    }
};
;
 //# sourceMappingURL=chunk-ARQUL5DC.mjs.map
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-3TMSNP4L.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

// src/utils/instance.ts
__turbopack_context__.s({
    "isStaging": ()=>isStaging
});
function isStaging(frontendApi) {
    return frontendApi.endsWith(".lclstage.dev") || frontendApi.endsWith(".stgstage.dev") || frontendApi.endsWith(".clerkstage.dev") || frontendApi.endsWith(".accountsstage.dev");
}
;
 //# sourceMappingURL=chunk-3TMSNP4L.mjs.map
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-O32JQBM6.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

// src/utils/handleValueOrFn.ts
__turbopack_context__.s({
    "handleValueOrFn": ()=>handleValueOrFn
});
function handleValueOrFn(value, url, defaultValue) {
    if (typeof value === "function") {
        return value(url);
    }
    if (typeof value !== "undefined") {
        return value;
    }
    if (typeof defaultValue !== "undefined") {
        return defaultValue;
    }
    return void 0;
}
;
 //# sourceMappingURL=chunk-O32JQBM6.mjs.map
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/utils/index.mjs [app-client] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$ARQUL5DC$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-ARQUL5DC.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7QJ2QTJL$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-7QJ2QTJL.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7FNX7RWY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-7FNX7RWY.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$3TMSNP4L$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-3TMSNP4L.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$O32JQBM6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-O32JQBM6.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7HPDNZ3R$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-7HPDNZ3R.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-7ELT755Q.mjs [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
 //# sourceMappingURL=index.mjs.map
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/utils/index.mjs [app-client] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$ARQUL5DC$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-ARQUL5DC.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7QJ2QTJL$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-7QJ2QTJL.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7FNX7RWY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-7FNX7RWY.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$3TMSNP4L$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-3TMSNP4L.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$O32JQBM6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-O32JQBM6.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7HPDNZ3R$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-7HPDNZ3R.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-7ELT755Q.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/utils/index.mjs [app-client] (ecmascript) <locals>");
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-CFXQSUF6.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

// src/object.ts
__turbopack_context__.s({
    "applyFunctionToObj": ()=>applyFunctionToObj,
    "filterProps": ()=>filterProps,
    "removeUndefined": ()=>removeUndefined,
    "without": ()=>without
});
var without = function(obj) {
    for(var _len = arguments.length, props = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        props[_key - 1] = arguments[_key];
    }
    const copy = {
        ...obj
    };
    for (const prop of props){
        delete copy[prop];
    }
    return copy;
};
var removeUndefined = (obj)=>{
    return Object.entries(obj).reduce((acc, param)=>{
        let [key, value] = param;
        if (value !== void 0 && value !== null) {
            acc[key] = value;
        }
        return acc;
    }, {});
};
var applyFunctionToObj = (obj, fn)=>{
    const result = {};
    for(const key in obj){
        result[key] = fn(obj[key], key);
    }
    return result;
};
var filterProps = (obj, filter)=>{
    const result = {};
    for(const key in obj){
        if (obj[key] && filter(obj[key])) {
            result[key] = obj[key];
        }
    }
    return result;
};
;
 //# sourceMappingURL=chunk-CFXQSUF6.mjs.map
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/object.mjs [app-client] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$CFXQSUF6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-CFXQSUF6.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-7ELT755Q.mjs [app-client] (ecmascript)");
;
;
;
 //# sourceMappingURL=object.mjs.map
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/object.mjs [app-client] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$CFXQSUF6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-CFXQSUF6.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-7ELT755Q.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$object$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/object.mjs [app-client] (ecmascript) <locals>");
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-UK3BQ2MJ.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

// src/versionSelector.ts
__turbopack_context__.s({
    "getMajorVersion": ()=>getMajorVersion,
    "versionSelector": ()=>versionSelector
});
var versionSelector = function(clerkJSVersion) {
    let packageVersion = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "5.83.0";
    if (clerkJSVersion) {
        return clerkJSVersion;
    }
    const prereleaseTag = getPrereleaseTag(packageVersion);
    if (prereleaseTag) {
        if (prereleaseTag === "snapshot") {
            return "5.83.0";
        }
        return prereleaseTag;
    }
    return getMajorVersion(packageVersion);
};
var getPrereleaseTag = (packageVersion)=>{
    var _packageVersion_trim_replace_match;
    return (_packageVersion_trim_replace_match = packageVersion.trim().replace(/^v/, "").match(/-(.+?)(\.|$)/)) === null || _packageVersion_trim_replace_match === void 0 ? void 0 : _packageVersion_trim_replace_match[1];
};
var getMajorVersion = (packageVersion)=>packageVersion.trim().replace(/^v/, "").split(".")[0];
;
 //# sourceMappingURL=chunk-UK3BQ2MJ.mjs.map
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-6NDGN2IU.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

// src/proxy.ts
__turbopack_context__.s({
    "isHttpOrHttps": ()=>isHttpOrHttps,
    "isProxyUrlRelative": ()=>isProxyUrlRelative,
    "isValidProxyUrl": ()=>isValidProxyUrl,
    "proxyUrlToAbsoluteURL": ()=>proxyUrlToAbsoluteURL
});
function isValidProxyUrl(key) {
    if (!key) {
        return true;
    }
    return isHttpOrHttps(key) || isProxyUrlRelative(key);
}
function isHttpOrHttps(key) {
    return /^http(s)?:\/\//.test(key || "");
}
function isProxyUrlRelative(key) {
    return key.startsWith("/");
}
function proxyUrlToAbsoluteURL(url) {
    if (!url) {
        return "";
    }
    return isProxyUrlRelative(url) ? new URL(url, window.location.origin).toString() : url;
}
;
 //# sourceMappingURL=chunk-6NDGN2IU.mjs.map
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-IFTVZ2LQ.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "addClerkPrefix": ()=>addClerkPrefix,
    "cleanDoubleSlashes": ()=>cleanDoubleSlashes,
    "getClerkJsMajorVersionOrTag": ()=>getClerkJsMajorVersionOrTag,
    "getScriptUrl": ()=>getScriptUrl,
    "hasLeadingSlash": ()=>hasLeadingSlash,
    "hasTrailingSlash": ()=>hasTrailingSlash,
    "isAbsoluteUrl": ()=>isAbsoluteUrl,
    "isCurrentDevAccountPortalOrigin": ()=>isCurrentDevAccountPortalOrigin,
    "isLegacyDevAccountPortalOrigin": ()=>isLegacyDevAccountPortalOrigin,
    "isNonEmptyURL": ()=>isNonEmptyURL,
    "joinURL": ()=>joinURL,
    "parseSearchParams": ()=>parseSearchParams,
    "stripScheme": ()=>stripScheme,
    "withLeadingSlash": ()=>withLeadingSlash,
    "withTrailingSlash": ()=>withTrailingSlash,
    "withoutLeadingSlash": ()=>withoutLeadingSlash,
    "withoutTrailingSlash": ()=>withoutTrailingSlash
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$3TMSNP4L$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-3TMSNP4L.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$I6MTSTOF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-I6MTSTOF.mjs [app-client] (ecmascript)");
;
;
// src/url.ts
function parseSearchParams() {
    let queryString = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
    if (queryString.startsWith("?")) {
        queryString = queryString.slice(1);
    }
    return new URLSearchParams(queryString);
}
function stripScheme() {
    let url = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
    return (url || "").replace(/^.+:\/\//, "");
}
function addClerkPrefix(str) {
    if (!str) {
        return "";
    }
    let regex;
    if (str.match(/^(clerk\.)+\w*$/)) {
        regex = /(clerk\.)*(?=clerk\.)/;
    } else if (str.match(/\.clerk.accounts/)) {
        return str;
    } else {
        regex = /^(clerk\.)*/gi;
    }
    const stripped = str.replace(regex, "");
    return "clerk.".concat(stripped);
}
var getClerkJsMajorVersionOrTag = (frontendApi, version)=>{
    if (!version && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$3TMSNP4L$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isStaging"])(frontendApi)) {
        return "canary";
    }
    if (!version) {
        return "latest";
    }
    return version.split(".")[0] || "latest";
};
var getScriptUrl = (frontendApi, param)=>{
    let { clerkJSVersion } = param;
    const noSchemeFrontendApi = frontendApi.replace(/http(s)?:\/\//, "");
    const major = getClerkJsMajorVersionOrTag(frontendApi, clerkJSVersion);
    return "https://".concat(noSchemeFrontendApi, "/npm/@clerk/clerk-js@").concat(clerkJSVersion || major, "/dist/clerk.browser.js");
};
function isLegacyDevAccountPortalOrigin(host) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$I6MTSTOF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LEGACY_DEV_INSTANCE_SUFFIXES"].some((legacyDevSuffix)=>{
        return host.startsWith("accounts.") && host.endsWith(legacyDevSuffix);
    });
}
function isCurrentDevAccountPortalOrigin(host) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$I6MTSTOF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CURRENT_DEV_INSTANCE_SUFFIXES"].some((currentDevSuffix)=>{
        return host.endsWith(currentDevSuffix) && !host.endsWith(".clerk" + currentDevSuffix);
    });
}
var TRAILING_SLASH_RE = /\/$|\/\?|\/#/;
function hasTrailingSlash() {
    let input = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", respectQueryAndFragment = arguments.length > 1 ? arguments[1] : void 0;
    if (!respectQueryAndFragment) {
        return input.endsWith("/");
    }
    return TRAILING_SLASH_RE.test(input);
}
function withTrailingSlash() {
    let input = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", respectQueryAndFragment = arguments.length > 1 ? arguments[1] : void 0;
    if (!respectQueryAndFragment) {
        return input.endsWith("/") ? input : input + "/";
    }
    if (hasTrailingSlash(input, true)) {
        return input || "/";
    }
    let path = input;
    let fragment = "";
    const fragmentIndex = input.indexOf("#");
    if (fragmentIndex >= 0) {
        path = input.slice(0, fragmentIndex);
        fragment = input.slice(fragmentIndex);
        if (!path) {
            return fragment;
        }
    }
    const [s0, ...s] = path.split("?");
    return s0 + "/" + (s.length > 0 ? "?".concat(s.join("?")) : "") + fragment;
}
function withoutTrailingSlash() {
    let input = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", respectQueryAndFragment = arguments.length > 1 ? arguments[1] : void 0;
    if (!respectQueryAndFragment) {
        return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
    }
    if (!hasTrailingSlash(input, true)) {
        return input || "/";
    }
    let path = input;
    let fragment = "";
    const fragmentIndex = input.indexOf("#");
    if (fragmentIndex >= 0) {
        path = input.slice(0, fragmentIndex);
        fragment = input.slice(fragmentIndex);
    }
    const [s0, ...s] = path.split("?");
    return (s0.slice(0, -1) || "/") + (s.length > 0 ? "?".concat(s.join("?")) : "") + fragment;
}
function hasLeadingSlash() {
    let input = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
    return input.startsWith("/");
}
function withoutLeadingSlash() {
    let input = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
    return (hasLeadingSlash(input) ? input.slice(1) : input) || "/";
}
function withLeadingSlash() {
    let input = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
    return hasLeadingSlash(input) ? input : "/" + input;
}
function cleanDoubleSlashes() {
    let input = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
    return input.split("://").map((string_)=>string_.replace(/\/{2,}/g, "/")).join("://");
}
function isNonEmptyURL(url) {
    return url && url !== "/";
}
var JOIN_LEADING_SLASH_RE = /^\.?\//;
function joinURL(base) {
    for(var _len = arguments.length, input = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        input[_key - 1] = arguments[_key];
    }
    let url = base || "";
    for (const segment of input.filter((url2)=>isNonEmptyURL(url2))){
        if (url) {
            const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
            url = withTrailingSlash(url) + _segment;
        } else {
            url = segment;
        }
    }
    return url;
}
var ABSOLUTE_URL_REGEX = /^[a-zA-Z][a-zA-Z\d+\-.]*?:/;
var isAbsoluteUrl = (url)=>ABSOLUTE_URL_REGEX.test(url);
;
 //# sourceMappingURL=chunk-IFTVZ2LQ.mjs.map
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-N2V3PKFE.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

// src/retry.ts
__turbopack_context__.s({
    "retry": ()=>retry
});
var defaultOptions = {
    initialDelay: 125,
    maxDelayBetweenRetries: 0,
    factor: 2,
    shouldRetry: (_, iteration)=>iteration < 5,
    retryImmediately: false,
    jitter: true
};
var RETRY_IMMEDIATELY_DELAY = 100;
var sleep = async (ms)=>new Promise((s)=>setTimeout(s, ms));
var applyJitter = (delay, jitter)=>{
    return jitter ? delay * (1 + Math.random()) : delay;
};
var createExponentialDelayAsyncFn = (opts)=>{
    let timesCalled = 0;
    const calculateDelayInMs = ()=>{
        const constant = opts.initialDelay;
        const base = opts.factor;
        let delay = constant * Math.pow(base, timesCalled);
        delay = applyJitter(delay, opts.jitter);
        return Math.min(opts.maxDelayBetweenRetries || delay, delay);
    };
    return async ()=>{
        await sleep(calculateDelayInMs());
        timesCalled++;
    };
};
var retry = async function(callback) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    let iterations = 0;
    const { shouldRetry, initialDelay, maxDelayBetweenRetries, factor, retryImmediately, jitter } = {
        ...defaultOptions,
        ...options
    };
    const delay = createExponentialDelayAsyncFn({
        initialDelay,
        maxDelayBetweenRetries,
        factor,
        jitter
    });
    while(true){
        try {
            return await callback();
        } catch (e) {
            iterations++;
            if (!shouldRetry(e, iterations)) {
                throw e;
            }
            if (retryImmediately && iterations === 1) {
                await sleep(applyJitter(RETRY_IMMEDIATELY_DELAY, jitter));
            } else {
                await delay();
            }
        }
    }
};
;
 //# sourceMappingURL=chunk-N2V3PKFE.mjs.map
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-E3R3SJ7O.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "loadScript": ()=>loadScript
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$N2V3PKFE$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-N2V3PKFE.mjs [app-client] (ecmascript)");
;
// src/loadScript.ts
var NO_DOCUMENT_ERROR = "loadScript cannot be called when document does not exist";
var NO_SRC_ERROR = "loadScript cannot be called without a src";
async function loadScript() {
    let src = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", opts = arguments.length > 1 ? arguments[1] : void 0;
    const { async, defer, beforeLoad, crossOrigin, nonce } = opts || {};
    const load = ()=>{
        return new Promise((resolve, reject)=>{
            if (!src) {
                reject(new Error(NO_SRC_ERROR));
            }
            if (!document || !document.body) {
                reject(NO_DOCUMENT_ERROR);
            }
            const script = document.createElement("script");
            if (crossOrigin) script.setAttribute("crossorigin", crossOrigin);
            script.async = async || false;
            script.defer = defer || false;
            script.addEventListener("load", ()=>{
                script.remove();
                resolve(script);
            });
            script.addEventListener("error", ()=>{
                script.remove();
                reject();
            });
            script.src = src;
            script.nonce = nonce;
            beforeLoad === null || beforeLoad === void 0 ? void 0 : beforeLoad(script);
            document.body.appendChild(script);
        });
    };
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$N2V3PKFE$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["retry"])(load, {
        shouldRetry: (_, iterations)=>iterations <= 5
    });
}
;
 //# sourceMappingURL=chunk-E3R3SJ7O.mjs.map
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-WP3JQYFQ.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "buildClerkJsScriptAttributes": ()=>buildClerkJsScriptAttributes,
    "clerkJsScriptUrl": ()=>clerkJsScriptUrl,
    "loadClerkJsScript": ()=>loadClerkJsScript,
    "setClerkJsLoadingErrorPackageName": ()=>setClerkJsLoadingErrorPackageName
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$UK3BQ2MJ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-UK3BQ2MJ.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$6NDGN2IU$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-6NDGN2IU.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$IFTVZ2LQ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-IFTVZ2LQ.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$E3R3SJ7O$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-E3R3SJ7O.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$35WGBVWP$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-35WGBVWP.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$IV7BOO4U$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-IV7BOO4U.mjs [app-client] (ecmascript)");
;
;
;
;
;
;
// src/loadClerkJsScript.ts
var FAILED_TO_LOAD_ERROR = "Clerk: Failed to load Clerk";
var { isDevOrStagingUrl } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$IV7BOO4U$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createDevOrStagingUrlCache"])();
var errorThrower = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$35WGBVWP$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildErrorThrower"])({
    packageName: "@clerk/shared"
});
function setClerkJsLoadingErrorPackageName(packageName) {
    errorThrower.setPackageName({
        packageName
    });
}
function isClerkProperlyLoaded() {
    if (typeof window === "undefined" || !window.Clerk) {
        return false;
    }
    const clerk = window.Clerk;
    return typeof clerk === "object" && typeof clerk.load === "function";
}
function waitForClerkWithTimeout(timeoutMs) {
    return new Promise((resolve, reject)=>{
        let resolved = false;
        const cleanup = (timeoutId2, pollInterval2)=>{
            clearTimeout(timeoutId2);
            clearInterval(pollInterval2);
        };
        const checkAndResolve = ()=>{
            if (resolved) return;
            if (isClerkProperlyLoaded()) {
                resolved = true;
                cleanup(timeoutId, pollInterval);
                resolve(null);
            }
        };
        const handleTimeout = ()=>{
            if (resolved) return;
            resolved = true;
            cleanup(timeoutId, pollInterval);
            if (!isClerkProperlyLoaded()) {
                reject(new Error(FAILED_TO_LOAD_ERROR));
            } else {
                resolve(null);
            }
        };
        const timeoutId = setTimeout(handleTimeout, timeoutMs);
        checkAndResolve();
        const pollInterval = setInterval(()=>{
            if (resolved) {
                clearInterval(pollInterval);
                return;
            }
            checkAndResolve();
        }, 100);
    });
}
var loadClerkJsScript = async (opts)=>{
    var _opts_scriptLoadTimeout;
    const timeout = (_opts_scriptLoadTimeout = opts === null || opts === void 0 ? void 0 : opts.scriptLoadTimeout) !== null && _opts_scriptLoadTimeout !== void 0 ? _opts_scriptLoadTimeout : 15e3;
    if (isClerkProperlyLoaded()) {
        return null;
    }
    const existingScript = document.querySelector("script[data-clerk-js-script]");
    if (existingScript) {
        return waitForClerkWithTimeout(timeout);
    }
    if (!(opts === null || opts === void 0 ? void 0 : opts.publishableKey)) {
        errorThrower.throwMissingPublishableKeyError();
        return null;
    }
    const loadPromise = waitForClerkWithTimeout(timeout);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$E3R3SJ7O$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadScript"])(clerkJsScriptUrl(opts), {
        async: true,
        crossOrigin: "anonymous",
        nonce: opts.nonce,
        beforeLoad: applyClerkJsScriptAttributes(opts)
    }).catch(()=>{
        throw new Error(FAILED_TO_LOAD_ERROR);
    });
    return loadPromise;
};
var clerkJsScriptUrl = (opts)=>{
    var _parsePublishableKey;
    const { clerkJSUrl, clerkJSVariant, clerkJSVersion, proxyUrl, domain, publishableKey } = opts;
    if (clerkJSUrl) {
        return clerkJSUrl;
    }
    let scriptHost = "";
    if (!!proxyUrl && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$6NDGN2IU$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidProxyUrl"])(proxyUrl)) {
        scriptHost = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$6NDGN2IU$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["proxyUrlToAbsoluteURL"])(proxyUrl).replace(/http(s)?:\/\//, "");
    } else if (domain && !isDevOrStagingUrl(((_parsePublishableKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$IV7BOO4U$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePublishableKey"])(publishableKey)) === null || _parsePublishableKey === void 0 ? void 0 : _parsePublishableKey.frontendApi) || "")) {
        scriptHost = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$IFTVZ2LQ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addClerkPrefix"])(domain);
    } else {
        var _parsePublishableKey1;
        scriptHost = ((_parsePublishableKey1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$IV7BOO4U$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePublishableKey"])(publishableKey)) === null || _parsePublishableKey1 === void 0 ? void 0 : _parsePublishableKey1.frontendApi) || "";
    }
    const variant = clerkJSVariant ? "".concat(clerkJSVariant.replace(/\.+$/, ""), ".") : "";
    const version = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$UK3BQ2MJ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["versionSelector"])(clerkJSVersion);
    return "https://".concat(scriptHost, "/npm/@clerk/clerk-js@").concat(version, "/dist/clerk.").concat(variant, "browser.js");
};
var buildClerkJsScriptAttributes = (options)=>{
    const obj = {};
    if (options.publishableKey) {
        obj["data-clerk-publishable-key"] = options.publishableKey;
    }
    if (options.proxyUrl) {
        obj["data-clerk-proxy-url"] = options.proxyUrl;
    }
    if (options.domain) {
        obj["data-clerk-domain"] = options.domain;
    }
    if (options.nonce) {
        obj.nonce = options.nonce;
    }
    return obj;
};
var applyClerkJsScriptAttributes = (options)=>(script)=>{
        const attributes = buildClerkJsScriptAttributes(options);
        for(const attribute in attributes){
            script.setAttribute(attribute, attributes[attribute]);
        }
    };
;
 //# sourceMappingURL=chunk-WP3JQYFQ.mjs.map
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/loadClerkJsScript.mjs [app-client] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$WP3JQYFQ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-WP3JQYFQ.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$UK3BQ2MJ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-UK3BQ2MJ.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$6NDGN2IU$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-6NDGN2IU.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$IFTVZ2LQ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-IFTVZ2LQ.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$3TMSNP4L$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-3TMSNP4L.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$E3R3SJ7O$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-E3R3SJ7O.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$N2V3PKFE$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-N2V3PKFE.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$35WGBVWP$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-35WGBVWP.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$IV7BOO4U$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-IV7BOO4U.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$TETGTEI2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-TETGTEI2.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$KOH7GTJO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-KOH7GTJO.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$I6MTSTOF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-I6MTSTOF.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-7ELT755Q.mjs [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
 //# sourceMappingURL=loadClerkJsScript.mjs.map
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/loadClerkJsScript.mjs [app-client] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$WP3JQYFQ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-WP3JQYFQ.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$UK3BQ2MJ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-UK3BQ2MJ.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$6NDGN2IU$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-6NDGN2IU.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$IFTVZ2LQ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-IFTVZ2LQ.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$3TMSNP4L$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-3TMSNP4L.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$E3R3SJ7O$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-E3R3SJ7O.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$N2V3PKFE$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-N2V3PKFE.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$35WGBVWP$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-35WGBVWP.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$IV7BOO4U$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-IV7BOO4U.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$TETGTEI2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-TETGTEI2.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$KOH7GTJO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-KOH7GTJO.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$I6MTSTOF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-I6MTSTOF.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-7ELT755Q.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$loadClerkJsScript$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/loadClerkJsScript.mjs [app-client] (ecmascript) <locals>");
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/keys.mjs [app-client] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$IV7BOO4U$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-IV7BOO4U.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$TETGTEI2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-TETGTEI2.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$KOH7GTJO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-KOH7GTJO.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$I6MTSTOF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-I6MTSTOF.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-7ELT755Q.mjs [app-client] (ecmascript)");
;
;
;
;
;
;
 //# sourceMappingURL=keys.mjs.map
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/keys.mjs [app-client] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$IV7BOO4U$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-IV7BOO4U.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$TETGTEI2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-TETGTEI2.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$KOH7GTJO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-KOH7GTJO.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$I6MTSTOF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-I6MTSTOF.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-7ELT755Q.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$keys$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/keys.mjs [app-client] (ecmascript) <locals>");
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-ZIXJBK4O.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

// src/deriveState.ts
__turbopack_context__.s({
    "deriveState": ()=>deriveState
});
var deriveState = (clerkOperational, state, initialState)=>{
    if (!clerkOperational && initialState) {
        return deriveFromSsrInitialState(initialState);
    }
    return deriveFromClientSideState(state);
};
var deriveFromSsrInitialState = (initialState)=>{
    const userId = initialState.userId;
    const user = initialState.user;
    const sessionId = initialState.sessionId;
    const sessionStatus = initialState.sessionStatus;
    const sessionClaims = initialState.sessionClaims;
    const session = initialState.session;
    const organization = initialState.organization;
    const orgId = initialState.orgId;
    const orgRole = initialState.orgRole;
    const orgPermissions = initialState.orgPermissions;
    const orgSlug = initialState.orgSlug;
    const actor = initialState.actor;
    const factorVerificationAge = initialState.factorVerificationAge;
    return {
        userId,
        user,
        sessionId,
        session,
        sessionStatus,
        sessionClaims,
        organization,
        orgId,
        orgRole,
        orgPermissions,
        orgSlug,
        actor,
        factorVerificationAge
    };
};
var deriveFromClientSideState = (state)=>{
    var _state_session, _state_session_lastActiveToken_jwt, _state_session_lastActiveToken, _user_organizationMemberships;
    const userId = state.user ? state.user.id : state.user;
    const user = state.user;
    const sessionId = state.session ? state.session.id : state.session;
    const session = state.session;
    const sessionStatus = (_state_session = state.session) === null || _state_session === void 0 ? void 0 : _state_session.status;
    const sessionClaims = state.session ? (_state_session_lastActiveToken = state.session.lastActiveToken) === null || _state_session_lastActiveToken === void 0 ? void 0 : (_state_session_lastActiveToken_jwt = _state_session_lastActiveToken.jwt) === null || _state_session_lastActiveToken_jwt === void 0 ? void 0 : _state_session_lastActiveToken_jwt.claims : null;
    const factorVerificationAge = state.session ? state.session.factorVerificationAge : null;
    const actor = session === null || session === void 0 ? void 0 : session.actor;
    const organization = state.organization;
    const orgId = state.organization ? state.organization.id : state.organization;
    const orgSlug = organization === null || organization === void 0 ? void 0 : organization.slug;
    const membership = organization ? user === null || user === void 0 ? void 0 : (_user_organizationMemberships = user.organizationMemberships) === null || _user_organizationMemberships === void 0 ? void 0 : _user_organizationMemberships.find((om)=>om.organization.id === orgId) : organization;
    const orgPermissions = membership ? membership.permissions : membership;
    const orgRole = membership ? membership.role : membership;
    return {
        userId,
        user,
        sessionId,
        session,
        sessionStatus,
        sessionClaims,
        organization,
        orgId,
        orgRole,
        orgSlug,
        orgPermissions,
        actor,
        factorVerificationAge
    };
};
;
 //# sourceMappingURL=chunk-ZIXJBK4O.mjs.map
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/deriveState.mjs [app-client] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$ZIXJBK4O$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-ZIXJBK4O.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-7ELT755Q.mjs [app-client] (ecmascript)");
;
;
;
 //# sourceMappingURL=deriveState.mjs.map
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/deriveState.mjs [app-client] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$ZIXJBK4O$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-ZIXJBK4O.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-7ELT755Q.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$deriveState$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/deriveState.mjs [app-client] (ecmascript) <locals>");
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-JKSAJ6AV.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

// src/browser.ts
__turbopack_context__.s({
    "inBrowser": ()=>inBrowser,
    "isBrowserOnline": ()=>isBrowserOnline,
    "isValidBrowser": ()=>isValidBrowser,
    "isValidBrowserOnline": ()=>isValidBrowserOnline,
    "userAgentIsRobot": ()=>userAgentIsRobot
});
function inBrowser() {
    return typeof window !== "undefined";
}
var botAgents = [
    "bot",
    "spider",
    "crawl",
    "APIs-Google",
    "AdsBot",
    "Googlebot",
    "mediapartners",
    "Google Favicon",
    "FeedFetcher",
    "Google-Read-Aloud",
    "DuplexWeb-Google",
    "googleweblight",
    "bing",
    "yandex",
    "baidu",
    "duckduck",
    "yahoo",
    "ecosia",
    "ia_archiver",
    "facebook",
    "instagram",
    "pinterest",
    "reddit",
    "slack",
    "twitter",
    "whatsapp",
    "youtube",
    "semrush"
];
var botAgentRegex = new RegExp(botAgents.join("|"), "i");
function userAgentIsRobot(userAgent) {
    return !userAgent ? false : botAgentRegex.test(userAgent);
}
function isValidBrowser() {
    var _window;
    const navigator = inBrowser() ? (_window = window) === null || _window === void 0 ? void 0 : _window.navigator : null;
    if (!navigator) {
        return false;
    }
    return !userAgentIsRobot(navigator === null || navigator === void 0 ? void 0 : navigator.userAgent) && !(navigator === null || navigator === void 0 ? void 0 : navigator.webdriver);
}
function isBrowserOnline() {
    var _window, _navigator_connection, _navigator_connection1;
    const navigator = inBrowser() ? (_window = window) === null || _window === void 0 ? void 0 : _window.navigator : null;
    if (!navigator) {
        return false;
    }
    const isNavigatorOnline = navigator === null || navigator === void 0 ? void 0 : navigator.onLine;
    const isExperimentalConnectionOnline = (navigator === null || navigator === void 0 ? void 0 : (_navigator_connection = navigator.connection) === null || _navigator_connection === void 0 ? void 0 : _navigator_connection.rtt) !== 0 && (navigator === null || navigator === void 0 ? void 0 : (_navigator_connection1 = navigator.connection) === null || _navigator_connection1 === void 0 ? void 0 : _navigator_connection1.downlink) !== 0;
    return isExperimentalConnectionOnline && isNavigatorOnline;
}
function isValidBrowserOnline() {
    return isBrowserOnline() && isValidBrowser();
}
;
 //# sourceMappingURL=chunk-JKSAJ6AV.mjs.map
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/browser.mjs [app-client] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$JKSAJ6AV$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-JKSAJ6AV.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-7ELT755Q.mjs [app-client] (ecmascript)");
;
;
;
 //# sourceMappingURL=browser.mjs.map
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/browser.mjs [app-client] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$JKSAJ6AV$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-JKSAJ6AV.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-7ELT755Q.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$browser$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/browser.mjs [app-client] (ecmascript) <locals>");
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-GVKBGR5N.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

// src/eventBus.ts
__turbopack_context__.s({
    "createEventBus": ()=>createEventBus
});
var _on = (eventToHandlersMap, latestPayloadMap, event, handler, opts)=>{
    const { notify } = opts || {};
    let handlers = eventToHandlersMap.get(event);
    if (!handlers) {
        handlers = [];
        eventToHandlersMap.set(event, handlers);
    }
    handlers.push(handler);
    if (notify && latestPayloadMap.has(event)) {
        handler(latestPayloadMap.get(event));
    }
};
var _dispatch = (eventToHandlersMap, event, payload)=>(eventToHandlersMap.get(event) || []).map((h)=>h(payload));
var _off = (eventToHandlersMap, event, handler)=>{
    const handlers = eventToHandlersMap.get(event);
    if (handlers) {
        if (handler) {
            handlers.splice(handlers.indexOf(handler) >>> 0, 1);
        } else {
            eventToHandlersMap.set(event, []);
        }
    }
};
var createEventBus = ()=>{
    const eventToHandlersMap = /* @__PURE__ */ new Map();
    const latestPayloadMap = /* @__PURE__ */ new Map();
    const eventToPredispatchHandlersMap = /* @__PURE__ */ new Map();
    const emit = (event, payload)=>{
        latestPayloadMap.set(event, payload);
        _dispatch(eventToPredispatchHandlersMap, event, payload);
        _dispatch(eventToHandlersMap, event, payload);
    };
    return {
        // Subscribe to an event
        on: function() {
            for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                args[_key] = arguments[_key];
            }
            return _on(eventToHandlersMap, latestPayloadMap, ...args);
        },
        // Subscribe to an event with priority
        // Registered handlers with `prioritizedOn` will be called before handlers registered with `on`
        prioritizedOn: function() {
            for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                args[_key] = arguments[_key];
            }
            return _on(eventToPredispatchHandlersMap, latestPayloadMap, ...args);
        },
        // Dispatch an event
        emit,
        // Unsubscribe from an event
        off: function() {
            for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                args[_key] = arguments[_key];
            }
            return _off(eventToHandlersMap, ...args);
        },
        // Unsubscribe from an event with priority
        // Unsubscribes handlers only registered with `prioritizedOn`
        prioritizedOff: function() {
            for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                args[_key] = arguments[_key];
            }
            return _off(eventToPredispatchHandlersMap, ...args);
        },
        // Internal utilities
        internal: {
            retrieveListeners: (event)=>eventToHandlersMap.get(event) || []
        }
    };
};
;
 //# sourceMappingURL=chunk-GVKBGR5N.mjs.map
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/clerkEventBus.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "clerkEvents": ()=>clerkEvents,
    "createClerkEventBus": ()=>createClerkEventBus
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$GVKBGR5N$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-GVKBGR5N.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-7ELT755Q.mjs [app-client] (ecmascript)");
;
;
// src/clerkEventBus.ts
var clerkEvents = {
    Status: "status"
};
var createClerkEventBus = ()=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$GVKBGR5N$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createEventBus"])();
};
;
 //# sourceMappingURL=clerkEventBus.mjs.map
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-CYDR2ZSA.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

// src/logger.ts
__turbopack_context__.s({
    "logger": ()=>logger
});
var loggedMessages = /* @__PURE__ */ new Set();
var logger = {
    /**
   * A custom logger that ensures messages are logged only once.
   * Reduces noise and duplicated messages when logs are in a hot codepath.
   */ warnOnce: (msg)=>{
        if (loggedMessages.has(msg)) {
            return;
        }
        loggedMessages.add(msg);
        console.warn(msg);
    },
    logOnce: (msg)=>{
        if (loggedMessages.has(msg)) {
            return;
        }
        console.log(msg);
        loggedMessages.add(msg);
    }
};
;
 //# sourceMappingURL=chunk-CYDR2ZSA.mjs.map
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/logger.mjs [app-client] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$CYDR2ZSA$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-CYDR2ZSA.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-7ELT755Q.mjs [app-client] (ecmascript)");
;
;
;
 //# sourceMappingURL=logger.mjs.map
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/logger.mjs [app-client] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$CYDR2ZSA$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-CYDR2ZSA.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-7ELT755Q.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$logger$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/logger.mjs [app-client] (ecmascript) <locals>");
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-BLFJDBCF.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "apiUrlFromPublishableKey": ()=>apiUrlFromPublishableKey
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$IV7BOO4U$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-IV7BOO4U.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$I6MTSTOF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-I6MTSTOF.mjs [app-client] (ecmascript)");
;
;
// src/apiUrlFromPublishableKey.ts
var apiUrlFromPublishableKey = (publishableKey)=>{
    var _parsePublishableKey;
    const frontendApi = (_parsePublishableKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$IV7BOO4U$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePublishableKey"])(publishableKey)) === null || _parsePublishableKey === void 0 ? void 0 : _parsePublishableKey.frontendApi;
    if ((frontendApi === null || frontendApi === void 0 ? void 0 : frontendApi.startsWith("clerk.")) && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$I6MTSTOF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LEGACY_DEV_INSTANCE_SUFFIXES"].some((suffix)=>frontendApi === null || frontendApi === void 0 ? void 0 : frontendApi.endsWith(suffix))) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$I6MTSTOF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PROD_API_URL"];
    }
    if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$I6MTSTOF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOCAL_ENV_SUFFIXES"].some((suffix)=>frontendApi === null || frontendApi === void 0 ? void 0 : frontendApi.endsWith(suffix))) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$I6MTSTOF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOCAL_API_URL"];
    }
    if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$I6MTSTOF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STAGING_ENV_SUFFIXES"].some((suffix)=>frontendApi === null || frontendApi === void 0 ? void 0 : frontendApi.endsWith(suffix))) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$I6MTSTOF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STAGING_API_URL"];
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$I6MTSTOF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PROD_API_URL"];
};
;
 //# sourceMappingURL=chunk-BLFJDBCF.mjs.map
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/apiUrlFromPublishableKey.mjs [app-client] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$BLFJDBCF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-BLFJDBCF.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$IV7BOO4U$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-IV7BOO4U.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$TETGTEI2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-TETGTEI2.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$KOH7GTJO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-KOH7GTJO.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$I6MTSTOF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-I6MTSTOF.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-7ELT755Q.mjs [app-client] (ecmascript)");
;
;
;
;
;
;
;
 //# sourceMappingURL=apiUrlFromPublishableKey.mjs.map
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/apiUrlFromPublishableKey.mjs [app-client] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$BLFJDBCF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-BLFJDBCF.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$IV7BOO4U$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-IV7BOO4U.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$TETGTEI2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-TETGTEI2.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$KOH7GTJO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-KOH7GTJO.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$I6MTSTOF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-I6MTSTOF.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-7ELT755Q.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$apiUrlFromPublishableKey$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/apiUrlFromPublishableKey.mjs [app-client] (ecmascript) <locals>");
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/underscore.mjs [app-client] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$GGFRMWFO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-GGFRMWFO.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-7ELT755Q.mjs [app-client] (ecmascript)");
;
;
;
 //# sourceMappingURL=underscore.mjs.map
}),
"[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/underscore.mjs [app-client] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$GGFRMWFO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-GGFRMWFO.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$chunk$2d$7ELT755Q$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/chunk-7ELT755Q.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$shared$40$3$2e$20$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$underscore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+shared@3.20.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@clerk/shared/dist/underscore.mjs [app-client] (ecmascript) <locals>");
}),
}]);

//# sourceMappingURL=ccf77_%40clerk_shared_dist_9e3e56f3._.js.map