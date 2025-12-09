module.exports = [
"[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react/jsx-dev-runtime", () => require("react/jsx-dev-runtime"));

module.exports = mod;
}),
"[project]/pages/forum/new.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NewThreadPage
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
function NewThreadPage() {
    const [title, setTitle] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [content, setContent] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    // Временно! Позже подставим реального пользователя:
    const authorId = 1;
    const handleSubmit = async ()=>{
        if (!title || !content) {
            return alert("Заполните все поля");
        }
        try {
            const res = await fetch("/api/forum/new", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title,
                    content,
                    authorId
                })
            });
            const data = await res.json();
            if (res.ok) {
                window.location.href = `/forum/${data.threadId}`;
            } else {
                alert(data.message || "Ошибка создания темы");
            }
        } catch (err) {
            console.log(err);
            alert("Ошибка соединения с сервером");
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        style: {
            background: "#e6f8f7",
            minHeight: "100vh",
            padding: 30
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            style: {
                width: "60%",
                margin: "40px auto",
                background: "white",
                padding: 25,
                borderRadius: 20,
                boxShadow: "0 8px 20px rgba(0,0,0,0.15)"
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                    style: {
                        color: "#1f7a73",
                        textAlign: "center",
                        marginBottom: 20
                    },
                    children: "Создать новую тему"
                }, void 0, false, {
                    fileName: "[project]/pages/forum/new.js",
                    lineNumber: 53,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                    type: "text",
                    placeholder: "Название темы",
                    value: title,
                    onChange: (e)=>setTitle(e.target.value),
                    style: {
                        width: "100%",
                        padding: 12,
                        borderRadius: 10,
                        border: "1px solid #4fd1c5",
                        marginBottom: 15,
                        fontSize: 16
                    }
                }, void 0, false, {
                    fileName: "[project]/pages/forum/new.js",
                    lineNumber: 57,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
                    placeholder: "Содержание темы",
                    value: content,
                    onChange: (e)=>setContent(e.target.value),
                    style: {
                        width: "100%",
                        height: 150,
                        padding: 12,
                        borderRadius: 10,
                        border: "1px solid #4fd1c5",
                        marginBottom: 20,
                        fontSize: 16,
                        resize: "vertical"
                    }
                }, void 0, false, {
                    fileName: "[project]/pages/forum/new.js",
                    lineNumber: 72,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                    onClick: handleSubmit,
                    style: {
                        width: "100%",
                        padding: 14,
                        background: "#4fd1c5",
                        border: "none",
                        color: "white",
                        fontSize: 18,
                        fontWeight: "bold",
                        borderRadius: 12,
                        cursor: "pointer"
                    },
                    children: "Создать тему"
                }, void 0, false, {
                    fileName: "[project]/pages/forum/new.js",
                    lineNumber: 88,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/pages/forum/new.js",
            lineNumber: 45,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/pages/forum/new.js",
        lineNumber: 40,
        columnNumber: 5
    }, this);
}
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__5f3db8eb._.js.map