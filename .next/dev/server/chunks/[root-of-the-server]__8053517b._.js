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
"[project]/pages/api/forum/new.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mysql2$2f$promise__$5b$external$5d$__$28$mysql2$2f$promise$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mysql2/promise [external] (mysql2/promise, cjs)");
;
async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            message: "Метод не разрешён"
        });
    }
    const { title, content, authorId } = req.body;
    if (!title || !content || !authorId) {
        return res.status(400).json({
            message: "Заполните все поля"
        });
    }
    try {
        const db = await __TURBOPACK__imported__module__$5b$externals$5d2f$mysql2$2f$promise__$5b$external$5d$__$28$mysql2$2f$promise$2c$__cjs$29$__["default"].createConnection({
            host: process.env.TIDB_HOST,
            user: process.env.TIDB_USER,
            password: process.env.TIDB_PASSWORD,
            database: "test",
            ssl: {
                rejectUnauthorized: true
            }
        });
        const [result] = await db.execute("INSERT INTO threads (title, content, author_id) VALUES (?, ?, ?)", [
            title,
            content,
            authorId
        ]);
        await db.end();
        return res.status(200).json({
            success: true,
            threadId: result.insertId
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Ошибка сервера"
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__8053517b._.js.map