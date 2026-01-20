module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/mailersend [external] (mailersend, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("mailersend", () => require("mailersend"));

module.exports = mod;
}),
"[project]/lib/mail.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// lib/mail.js
__turbopack_context__.s([
    "sendVerificationEmail",
    ()=>sendVerificationEmail
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mailersend__$5b$external$5d$__$28$mailersend$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mailersend [external] (mailersend, cjs)");
;
const mailerSend = new __TURBOPACK__imported__module__$5b$externals$5d2f$mailersend__$5b$external$5d$__$28$mailersend$2c$__cjs$29$__["MailerSend"]({
    apiKey: process.env.MAILERSEND_API_KEY
});
async function sendVerificationEmail(email, code) {
    const sentFrom = new __TURBOPACK__imported__module__$5b$externals$5d2f$mailersend__$5b$external$5d$__$28$mailersend$2c$__cjs$29$__["Sender"]("no-reply@test-69oxl5eo2pkl785k.mlsender.net", "Med.Unit");
    const recipients = [
        new __TURBOPACK__imported__module__$5b$externals$5d2f$mailersend__$5b$external$5d$__$28$mailersend$2c$__cjs$29$__["Recipient"](email)
    ];
    const emailParams = new __TURBOPACK__imported__module__$5b$externals$5d2f$mailersend__$5b$external$5d$__$28$mailersend$2c$__cjs$29$__["EmailParams"]().setFrom(sentFrom).setTo(recipients).setSubject("Код подтверждения").setText(`Ваш код подтверждения: ${code}\n\nКод действует 10 минут.`);
    await mailerSend.email.send(emailParams);
}
}),
"[project]/pages/api/test-mail.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mail$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mail.js [api] (ecmascript)");
const config = {
    runtime: "nodejs"
};
;
async function handler(req, res) {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mail$2e$js__$5b$api$5d$__$28$ecmascript$29$__["sendVerificationEmail"])("nazariikovalev@gmail.com", "123456");
    res.status(200).json({
        ok: true
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__f87b7de3._.js.map