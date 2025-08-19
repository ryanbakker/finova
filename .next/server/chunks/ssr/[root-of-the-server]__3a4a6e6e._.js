module.exports = {

"[externals]/mongoose [external] (mongoose, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("mongoose", () => require("mongoose"));

module.exports = mod;
}}),
"[project]/database/db.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "connectToDB": ()=>connectToDB
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const MONGODB_URL = process.env.MONGODB_URL;
let cached = ("TURBOPACK ident replacement", globalThis).mongoose;
if (!cached) {
    cached = ("TURBOPACK ident replacement", globalThis).mongoose = {
        conn: null,
        promise: null
    };
}
const connectToDB = async ()=>{
    console.log("connectToDB called");
    console.log("MONGODB_URL exists:", !!MONGODB_URL);
    // Temporary debug log - redact sensitive parts
    if (MONGODB_URL) {
        const url = MONGODB_URL;
        const redactedUrl = url.replace(/(mongodb\+srv?:\/\/)([^:]+):([^@]+)@/, "$1***:***@");
        console.log("MONGODB_URL (redacted):", redactedUrl);
        // Check if connection string has proper SSL parameters
        if (url.includes("mongodb+srv://") && !url.includes("ssl=true") && !url.includes("tls=true")) {
            console.log("Warning: MongoDB Atlas connection string detected without explicit SSL parameters");
        }
    } else {
        console.log("MONGODB_URL is undefined");
    }
    if (cached.conn) {
        console.log("Using cached connection");
        return cached.conn;
    }
    if (!MONGODB_URL) throw new Error("Missing MONGODB_URL");
    console.log("Creating new database connection...");
    // Parse the connection string to check if it's MongoDB Atlas
    const isAtlas = MONGODB_URL.includes("mongodb+srv://");
    const connectionOptions = {
        dbName: "InstantAI",
        bufferCommands: false,
        // Connection options to handle SSL issues
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        // Retry options
        retryWrites: true,
        w: "majority"
    };
    // Add SSL options based on connection type
    if (isAtlas) {
        // MongoDB Atlas specific options
        Object.assign(connectionOptions, {
            ssl: true,
            tls: true,
            tlsAllowInvalidCertificates: false,
            tlsAllowInvalidHostnames: false,
            // Atlas specific SSL options
            sslCA: undefined,
            sslCert: undefined,
            sslKey: undefined,
            sslPass: undefined
        });
        console.log("Using MongoDB Atlas SSL configuration");
    } else {
        // Local MongoDB options
        Object.assign(connectionOptions, {
            ssl: false,
            tls: false
        });
        console.log("Using local MongoDB configuration");
    }
    console.log("Connection options:", JSON.stringify(connectionOptions, null, 2));
    cached.promise = cached.promise || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].connect(MONGODB_URL, connectionOptions);
    try {
        cached.conn = await cached.promise;
        console.log("Database connection established successfully");
    } catch (error) {
        console.error("Database connection failed:", error);
        // Reset the promise on failure
        cached.promise = null;
        throw error;
    }
    return cached.conn;
};
}),
"[project]/database/models/liability.model.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const liabilitySchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    userId: {
        type: String,
        required: [
            true,
            'User ID is required'
        ],
        index: true,
        trim: true
    },
    name: {
        type: String,
        required: [
            true,
            'Liability name is required'
        ],
        trim: true,
        minlength: [
            1,
            'Liability name must be at least 1 character long'
        ],
        maxlength: [
            100,
            'Liability name cannot exceed 100 characters'
        ]
    },
    category: {
        type: String,
        required: [
            true,
            'Category is required'
        ],
        trim: true,
        minlength: [
            1,
            'Category must be at least 1 character long'
        ],
        maxlength: [
            50,
            'Category cannot exceed 50 characters'
        ]
    },
    amount: {
        type: Number,
        required: [
            true,
            'Amount is required'
        ],
        min: [
            0,
            'Amount must be non-negative'
        ],
        max: [
            999999999,
            'Amount cannot exceed 999,999,999'
        ]
    },
    currency: {
        type: String,
        required: [
            true,
            'Currency is required'
        ],
        default: 'USD',
        trim: true,
        uppercase: true,
        minlength: [
            3,
            'Currency must be at least 3 characters'
        ],
        maxlength: [
            3,
            'Currency must be exactly 3 characters'
        ]
    },
    institution: {
        type: String,
        required: false,
        trim: true,
        maxlength: [
            100,
            'Institution name cannot exceed 100 characters'
        ]
    },
    accountNumber: {
        type: String,
        required: false,
        trim: true,
        maxlength: [
            50,
            'Account number cannot exceed 50 characters'
        ]
    },
    dueDate: {
        type: Date,
        required: false,
        validate: {
            validator: function(value) {
                if (!value) return true; // Optional field
                const now = new Date();
                const maxDate = new Date(now.getFullYear() + 30, now.getMonth(), now.getDate()); // 30 years in future
                return value >= now;
            },
            message: 'Due date cannot be in the past'
        }
    },
    interestRate: {
        type: Number,
        required: false,
        min: [
            0,
            'Interest rate must be non-negative'
        ],
        max: [
            100,
            'Interest rate cannot exceed 100%'
        ],
        validate: {
            validator: function(value) {
                if (value === undefined || value === null) return true; // Optional field
                return value >= 0 && value <= 100;
            },
            message: 'Interest rate must be between 0% and 100%'
        }
    },
    monthlyPayment: {
        type: Number,
        required: false,
        min: [
            0,
            'Monthly payment must be non-negative'
        ],
        max: [
            999999999,
            'Monthly payment cannot exceed 999,999,999'
        ],
        validate: {
            validator: function(value) {
                if (value === undefined || value === null) return true; // Optional field
                return value >= 0;
            },
            message: 'Monthly payment must be non-negative'
        }
    },
    remainingBalance: {
        type: Number,
        required: false,
        min: [
            0,
            'Remaining balance must be non-negative'
        ],
        max: [
            999999999,
            'Remaining balance cannot exceed 999,999,999'
        ],
        validate: {
            validator: function(value) {
                if (value === undefined || value === null) return true; // Optional field
                return value >= 0;
            },
            message: 'Remaining balance must be non-negative'
        }
    },
    originalAmount: {
        type: Number,
        required: false,
        min: [
            0,
            'Original amount must be non-negative'
        ],
        max: [
            999999999,
            'Original amount cannot exceed 999,999,999'
        ],
        validate: {
            validator: function(value) {
                if (value === undefined || value === null) return true; // Optional field
                return value >= 0;
            },
            message: 'Original amount must be non-negative'
        }
    },
    notes: {
        type: String,
        required: false,
        trim: true,
        maxlength: [
            500,
            'Notes cannot exceed 500 characters'
        ]
    },
    isActive: {
        type: Boolean,
        required: [
            true,
            'Active status is required'
        ],
        default: true
    }
}, {
    timestamps: true
});
// Compound index for efficient queries
liabilitySchema.index({
    userId: 1,
    category: 1
});
liabilitySchema.index({
    userId: 1,
    isActive: 1
});
liabilitySchema.index({
    userId: 1,
    dueDate: 1
});
// Pre-save middleware to set default values
liabilitySchema.pre('save', function(next) {
    // Set remaining balance to amount if not provided
    if (this.remainingBalance === undefined || this.remainingBalance === null) {
        this.remainingBalance = this.amount;
    }
    // Set original amount to amount if not provided
    if (this.originalAmount === undefined || this.originalAmount === null) {
        this.originalAmount = this.amount;
    }
    next();
});
// Virtual for calculating total interest paid
liabilitySchema.virtual('totalInterestPaid').get(function() {
    if (this.originalAmount && this.remainingBalance) {
        return Math.max(0, this.originalAmount - this.remainingBalance);
    }
    return 0;
});
// Virtual for calculating progress percentage
liabilitySchema.virtual('progressPercentage').get(function() {
    if (this.originalAmount && this.remainingBalance) {
        const paid = this.originalAmount - this.remainingBalance;
        return Math.min(100, Math.max(0, paid / this.originalAmount * 100));
    }
    return 0;
});
// Ensure virtual fields are serialized
liabilitySchema.set('toJSON', {
    virtuals: true
});
liabilitySchema.set('toObject', {
    virtuals: true
});
const Liability = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.Liability || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('Liability', liabilitySchema);
const __TURBOPACK__default__export__ = Liability;
}),
"[project]/lib/actions/liability.actions.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"00475cfdd7db7b66965f82f54f46598528c1faf1fe":"getLiabilitiesByUserId","00e2d0f0b1c1d1cd966df3e2f2f1e63b9afc58fba0":"getLiabilityStats","4014ed817e31a69118f375e89c5b53202a703ea7d2":"deleteLiability","408668d31c369e9f240de50a6e232b6d1c9081d680":"createLiability","40fff565fd8e2b8584acc0d0cf618cbccfe7ef7ab4":"getLiabilityById","600ca9a33204fa77713404df1f22653537cc329768":"updateLiability","60dc46bc145e904be71361624a54ce2ee1ae797f1f":"searchLiabilities"},"",""] */ __turbopack_context__.s({
    "createLiability": ()=>createLiability,
    "deleteLiability": ()=>deleteLiability,
    "getLiabilitiesByUserId": ()=>getLiabilitiesByUserId,
    "getLiabilityById": ()=>getLiabilityById,
    "getLiabilityStats": ()=>getLiabilityStats,
    "searchLiabilities": ()=>searchLiabilities,
    "updateLiability": ()=>updateLiability
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.4.6_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.4.6_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$database$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/database/db.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$database$2f$models$2f$liability$2e$model$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/database/models/liability.model.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$nextjs$40$6$2e$30$2e$2_next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$react$2d$dom_3ff958a62ab96c8f1418931f065357e9$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$auth$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+nextjs@6.30.2_next@15.4.6_react-dom@19.1.0_react@19.1.0__react@19.1.0__react-dom_3ff958a62ab96c8f1418931f065357e9/node_modules/@clerk/nextjs/dist/esm/app-router/server/auth.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.4.6_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
// Helper function to get authenticated user ID
async function getAuthenticatedUserId() {
    const { userId } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$nextjs$40$6$2e$30$2e$2_next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$react$2d$dom_3ff958a62ab96c8f1418931f065357e9$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$auth$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auth"])();
    if (!userId) {
        throw new Error("Unauthorized: User not authenticated");
    }
    return userId;
}
async function createLiability(liability) {
    try {
        const userId = await getAuthenticatedUserId();
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$database$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["connectToDB"])();
        // Create new liability with user ID
        const newLiability = await __TURBOPACK__imported__module__$5b$project$5d2f$database$2f$models$2f$liability$2e$model$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].create({
            ...liability,
            userId,
            // Convert string dates to Date objects if provided
            dueDate: liability.dueDate ? new Date(liability.dueDate) : undefined
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/liabilities");
        return JSON.parse(JSON.stringify(newLiability));
    } catch (error) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["handleError"])(error);
        throw error;
    }
}
async function getLiabilitiesByUserId() {
    try {
        const userId = await getAuthenticatedUserId();
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$database$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["connectToDB"])();
        const liabilities = await __TURBOPACK__imported__module__$5b$project$5d2f$database$2f$models$2f$liability$2e$model$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].find({
            userId
        }).sort({
            createdAt: -1
        }).lean();
        return JSON.parse(JSON.stringify(liabilities));
    } catch (error) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["handleError"])(error);
        throw error;
    }
}
async function getLiabilityById(liabilityId) {
    try {
        const userId = await getAuthenticatedUserId();
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$database$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["connectToDB"])();
        // Ensure user can only access their own liability
        const liability = await __TURBOPACK__imported__module__$5b$project$5d2f$database$2f$models$2f$liability$2e$model$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].findOne({
            _id: liabilityId,
            userId
        }).lean();
        if (!liability) {
            throw new Error("Liability not found or access denied");
        }
        return JSON.parse(JSON.stringify(liability));
    } catch (error) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["handleError"])(error);
        throw error;
    }
}
async function updateLiability(liabilityId, updates) {
    try {
        const userId = await getAuthenticatedUserId();
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$database$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["connectToDB"])();
        // Ensure user can only update their own liability
        const existingLiability = await __TURBOPACK__imported__module__$5b$project$5d2f$database$2f$models$2f$liability$2e$model$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].findOne({
            _id: liabilityId,
            userId
        });
        if (!existingLiability) {
            throw new Error("Liability not found or access denied");
        }
        // Convert string dates to Date objects if provided
        const updateData = {
            ...updates
        };
        if (updates.dueDate) {
            updateData.dueDate = new Date(updates.dueDate);
        }
        const updatedLiability = await __TURBOPACK__imported__module__$5b$project$5d2f$database$2f$models$2f$liability$2e$model$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].findByIdAndUpdate(liabilityId, updateData, {
            new: true,
            runValidators: true
        });
        if (!updatedLiability) {
            throw new Error("Failed to update liability");
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/liabilities");
        return JSON.parse(JSON.stringify(updatedLiability));
    } catch (error) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["handleError"])(error);
        throw error;
    }
}
async function deleteLiability(liabilityId) {
    try {
        const userId = await getAuthenticatedUserId();
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$database$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["connectToDB"])();
        // Ensure user can only delete their own liability
        const existingLiability = await __TURBOPACK__imported__module__$5b$project$5d2f$database$2f$models$2f$liability$2e$model$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].findOne({
            _id: liabilityId,
            userId
        });
        if (!existingLiability) {
            throw new Error("Liability not found or access denied");
        }
        const deletedLiability = await __TURBOPACK__imported__module__$5b$project$5d2f$database$2f$models$2f$liability$2e$model$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].findByIdAndDelete(liabilityId);
        if (!deletedLiability) {
            throw new Error("Failed to delete liability");
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/liabilities");
        return JSON.parse(JSON.stringify(deletedLiability));
    } catch (error) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["handleError"])(error);
        throw error;
    }
}
async function getLiabilityStats() {
    try {
        const userId = await getAuthenticatedUserId();
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$database$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["connectToDB"])();
        const stats = await __TURBOPACK__imported__module__$5b$project$5d2f$database$2f$models$2f$liability$2e$model$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].aggregate([
            {
                $match: {
                    userId,
                    isActive: true
                }
            },
            {
                $group: {
                    _id: null,
                    totalLiabilities: {
                        $sum: 1
                    },
                    totalAmount: {
                        $sum: "$amount"
                    },
                    totalRemainingBalance: {
                        $sum: "$remainingBalance"
                    },
                    totalMonthlyPayments: {
                        $sum: {
                            $ifNull: [
                                "$monthlyPayment",
                                0
                            ]
                        }
                    },
                    averageInterestRate: {
                        $avg: "$interestRate"
                    }
                }
            }
        ]);
        const categoryBreakdown = await __TURBOPACK__imported__module__$5b$project$5d2f$database$2f$models$2f$liability$2e$model$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].aggregate([
            {
                $match: {
                    userId,
                    isActive: true
                }
            },
            {
                $group: {
                    _id: "$category",
                    count: {
                        $sum: 1
                    },
                    totalAmount: {
                        $sum: "$amount"
                    },
                    totalRemainingBalance: {
                        $sum: "$remainingBalance"
                    }
                }
            },
            {
                $sort: {
                    totalAmount: -1
                }
            }
        ]);
        return {
            summary: stats[0] || {
                totalLiabilities: 0,
                totalAmount: 0,
                totalRemainingBalance: 0,
                totalMonthlyPayments: 0,
                averageInterestRate: 0
            },
            categoryBreakdown
        };
    } catch (error) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["handleError"])(error);
        throw error;
    }
}
async function searchLiabilities(query, filters) {
    try {
        const userId = await getAuthenticatedUserId();
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$database$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["connectToDB"])();
        const searchQuery = {
            userId
        };
        // Text search
        if (query) {
            searchQuery.$or = [
                {
                    name: {
                        $regex: query,
                        $options: 'i'
                    }
                },
                {
                    institution: {
                        $regex: query,
                        $options: 'i'
                    }
                },
                {
                    notes: {
                        $regex: query,
                        $options: 'i'
                    }
                }
            ];
        }
        // Apply filters
        if (filters?.category) {
            searchQuery.category = filters.category;
        }
        if (filters?.status === 'active') {
            searchQuery.isActive = true;
        } else if (filters?.status === 'inactive') {
            searchQuery.isActive = false;
        }
        if (filters?.minAmount !== undefined || filters?.maxAmount !== undefined) {
            searchQuery.amount = {};
            if (filters.minAmount !== undefined) {
                searchQuery.amount.$gte = filters.minAmount;
            }
            if (filters.maxAmount !== undefined) {
                searchQuery.amount.$lte = filters.maxAmount;
            }
        }
        const liabilities = await __TURBOPACK__imported__module__$5b$project$5d2f$database$2f$models$2f$liability$2e$model$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].find(searchQuery).sort({
            createdAt: -1
        }).lean();
        return JSON.parse(JSON.stringify(liabilities));
    } catch (error) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["handleError"])(error);
        throw error;
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    createLiability,
    getLiabilitiesByUserId,
    getLiabilityById,
    updateLiability,
    deleteLiability,
    getLiabilityStats,
    searchLiabilities
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createLiability, "408668d31c369e9f240de50a6e232b6d1c9081d680", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getLiabilitiesByUserId, "00475cfdd7db7b66965f82f54f46598528c1faf1fe", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getLiabilityById, "40fff565fd8e2b8584acc0d0cf618cbccfe7ef7ab4", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateLiability, "600ca9a33204fa77713404df1f22653537cc329768", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteLiability, "4014ed817e31a69118f375e89c5b53202a703ea7d2", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getLiabilityStats, "00e2d0f0b1c1d1cd966df3e2f2f1e63b9afc58fba0", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(searchLiabilities, "60dc46bc145e904be71361624a54ce2ee1ae797f1f", null);
}),
"[project]/app/favicon.ico.mjs { IMAGE => \"[project]/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)": ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/favicon.ico.mjs { IMAGE => \"[project]/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[project]/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)": ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/app/(dashboard)/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)": ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/(dashboard)/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/app/(dashboard)/liabilities/loading.tsx [app-rsc] (ecmascript, Next.js Server Component)": ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/(dashboard)/liabilities/loading.tsx [app-rsc] (ecmascript)"));
}),
"[project]/app/(dashboard)/liabilities/page.tsx [app-rsc] (client reference proxy) <module evaluation>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.4.6_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/app/(dashboard)/liabilities/page.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/app/(dashboard)/liabilities/page.tsx <module evaluation>", "default");
}),
"[project]/app/(dashboard)/liabilities/page.tsx [app-rsc] (client reference proxy)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.4.6_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$4$2e$6_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/app/(dashboard)/liabilities/page.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/app/(dashboard)/liabilities/page.tsx", "default");
}),
"[project]/app/(dashboard)/liabilities/page.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$dashboard$292f$liabilities$2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/app/(dashboard)/liabilities/page.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$dashboard$292f$liabilities$2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/app/(dashboard)/liabilities/page.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$dashboard$292f$liabilities$2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/app/(dashboard)/liabilities/page.tsx [app-rsc] (ecmascript, Next.js Server Component)": ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/(dashboard)/liabilities/page.tsx [app-rsc] (ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__3a4a6e6e._.js.map