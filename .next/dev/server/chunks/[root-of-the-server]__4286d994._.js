module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/mysql2/promise [external] (mysql2/promise, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("mysql2/promise", () => require("mysql2/promise"));

module.exports = mod;
}),
"[project]/lib/db.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mysql2$2f$promise__$5b$external$5d$__$28$mysql2$2f$promise$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mysql2/promise [external] (mysql2/promise, cjs)");
;
let pool;
if (!pool) {
    pool = __TURBOPACK__imported__module__$5b$externals$5d2f$mysql2$2f$promise__$5b$external$5d$__$28$mysql2$2f$promise$2c$__cjs$29$__["default"].createPool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 4000,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        ssl: {
            rejectUnauthorized: true
        }
    });
}
const __TURBOPACK__default__export__ = pool;
 // 
}),
"[project]/pages/api/categories/index.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.js [api] (ecmascript)");
;
async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const [rows] = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$api$5d$__$28$ecmascript$29$__["default"].query('SELECT * FROM categories ORDER BY created_at DESC');
            res.status(200).json(rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Ошибка при получении категорий'
            });
        }
    } else if (req.method === 'POST') {
        // Создание новой категории
        const { title, description, slug } = req.body;
        if (!title || !slug) return res.status(400).json({
            message: 'Title и slug обязательны'
        });
        try {
            const [result] = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$api$5d$__$28$ecmascript$29$__["default"].query('INSERT INTO categories (title, description, slug) VALUES (?, ?, ?)', [
                title,
                description || '',
                slug
            ]);
            res.status(201).json({
                id: result.insertId,
                title,
                description,
                slug
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Ошибка при создании категории'
            });
        }
    } else {
        res.status(405).json({
            message: 'Метод не разрешён'
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__4286d994._.js.map