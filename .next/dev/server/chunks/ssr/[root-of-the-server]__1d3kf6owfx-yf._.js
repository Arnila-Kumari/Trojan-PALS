module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/dynamic-access-async-storage.external.js [external] (next/dist/server/app-render/dynamic-access-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/dynamic-access-async-storage.external.js", () => require("next/dist/server/app-render/dynamic-access-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
"[project]/components/app-provider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppProvider",
    ()=>AppProvider,
    "useApp",
    ()=>useApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/data.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
const Context = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
const initialMessage = {
    id: "welcome",
    role: "assistant",
    text: "Hi! Tell me what you’d like to learn and what you want your next semester to feel like. I can help you explore courses, compare reported workloads, and think through academic choices. Research matching is coming soon."
};
function AppProvider({ children }) {
    const [profile, setProfile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defaultProfile"]);
    const [saved, setSaved] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [savedResearch, setSavedResearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([
        initialMessage
    ]);
    const [ready, setReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [storageWarning, setStorageWarning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [notice, setNotice] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const timeout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        try {
            const raw = localStorage.getItem("trojanpath-v1");
            if (raw) {
                const data = JSON.parse(raw);
                if (data.profile && typeof data.profile === "object") {
                    const p = data.profile;
                    setProfile({
                        name: typeof p.name === "string" ? p.name.slice(0, 80) : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defaultProfile"].name,
                        program: typeof p.program === "string" ? p.program.slice(0, 120) : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defaultProfile"].program,
                        interests: Array.isArray(p.interests) ? p.interests.filter((v)=>typeof v === "string" && __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["interestOptions"].includes(v)) : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defaultProfile"].interests,
                        assessment: [
                            "Projects",
                            "Exams",
                            "No preference"
                        ].includes(p.assessment) ? p.assessment : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defaultProfile"].assessment,
                        workload: typeof p.workload === "number" && Number.isFinite(p.workload) ? Math.max(6, Math.min(20, p.workload)) : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defaultProfile"].workload,
                        completed: Array.isArray(p.completed) ? p.completed.filter((id)=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["courses"].some((c)=>c.id === id)) : [],
                        goal: typeof p.goal === "string" ? p.goal.slice(0, 800) : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defaultProfile"].goal
                    });
                }
                if (Array.isArray(data.saved)) setSaved(data.saved.filter((id)=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["courses"].some((c)=>c.id === id)));
                if (Array.isArray(data.savedResearch)) setSavedResearch(data.savedResearch.filter((id)=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["researchAreas"].some((r)=>r.id === id)));
                if (Array.isArray(data.messages)) {
                    const valid = data.messages.filter((m)=>m && typeof m.id === "string" && [
                            "user",
                            "assistant"
                        ].includes(m.role) && typeof m.text === "string" && m.id !== "welcome").slice(-59).map((m)=>({
                            id: m.id,
                            role: m.role,
                            text: m.text.slice(0, 12000),
                            courseIds: Array.isArray(m.courseIds) ? m.courseIds.filter((id)=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["courses"].some((c)=>c.id === id)) : undefined,
                            researchIds: Array.isArray(m.researchIds) ? m.researchIds.filter((id)=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["researchAreas"].some((r)=>r.id === id)) : undefined
                        }));
                    if (valid.length) setMessages([
                        initialMessage,
                        ...valid
                    ]);
                }
            }
        } catch  {
            setStorageWarning("Saved browser data could not be loaded. You can still use this demo.");
        }
        setReady(true);
        return ()=>{
            if (timeout.current) clearTimeout(timeout.current);
        };
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!ready) return;
        try {
            localStorage.setItem("trojanpath-v1", JSON.stringify({
                profile,
                saved,
                savedResearch,
                messages
            }));
        } catch  {
            setStorageWarning("Browser storage is unavailable. Changes will last only for this session.");
        }
    }, [
        profile,
        saved,
        savedResearch,
        messages,
        ready
    ]);
    function toast(message) {
        setNotice(message);
        if (timeout.current) clearTimeout(timeout.current);
        timeout.current = setTimeout(()=>setNotice(""), 3200);
    }
    function toggleSaved(id) {
        setSaved((previous)=>previous.includes(id) ? previous.filter((v)=>v !== id) : [
                ...previous,
                id
            ]);
    }
    function toggleResearch(id) {
        setSavedResearch((previous)=>previous.includes(id) ? previous.filter((v)=>v !== id) : [
                ...previous,
                id
            ]);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Context.Provider, {
        value: {
            profile,
            setProfile,
            saved,
            toggleSaved,
            savedResearch,
            toggleResearch,
            messages,
            setMessages,
            toast,
            ready,
            storageWarning
        },
        children: [
            children,
            notice && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "toast",
                role: "status",
                children: notice
            }, void 0, false, {
                fileName: "[project]/components/app-provider.tsx",
                lineNumber: 57,
                columnNumber: 171
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/app-provider.tsx",
        lineNumber: 57,
        columnNumber: 10
    }, this);
}
function useApp() {
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(Context);
    if (!store) throw new Error("AppProvider is required");
    return store;
}
}),
"[project]/components/icon.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Icon",
    ()=>Icon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
const paths = {
    compass: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "9"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 4,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "m16 8-2.5 5.5L8 16l2.5-5.5L16 8Z"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 4,
                columnNumber: 44
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 4,
        columnNumber: 11
    }, ("TURBOPACK compile-time value", void 0)),
    user: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "8",
                r: "3.5"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 5,
                columnNumber: 10
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M5 21v-2a7 7 0 0 1 14 0v2"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 5,
                columnNumber: 42
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 5,
        columnNumber: 8
    }, ("TURBOPACK compile-time value", void 0)),
    chat: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
        d: "M21 11.5a9 9 0 0 1-9 9H4l-2 2V11.5a9.5 9.5 0 0 1 19 0Z"
    }, void 0, false, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 6,
        columnNumber: 8
    }, ("TURBOPACK compile-time value", void 0)),
    book: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 5C8 2 4 3 2 4v15c3-1.5 7-1 10 1 3-2 7-2.5 10-1V4c-2-1-6-2-10 1Z"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 7,
                columnNumber: 10
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 5v15"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 7,
                columnNumber: 89
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 7,
        columnNumber: 8
    }, ("TURBOPACK compile-time value", void 0)),
    flask: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M9 3h6m-5 0v7L4 20c-.3.5 0 1 1 1h14c1 0 1.3-.5 1-1l-6-10V3M7 15h10"
        }, void 0, false, {
            fileName: "[project]/components/icon.tsx",
            lineNumber: 8,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 8,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0)),
    arrow: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
        d: "M4 12h16m-6-6 6 6-6 6"
    }, void 0, false, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 9,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0)),
    search: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "10.5",
                cy: "10.5",
                r: "6.5"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 9,
                columnNumber: 52
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "m16 16 5 5"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 9,
                columnNumber: 89
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 9,
        columnNumber: 50
    }, ("TURBOPACK compile-time value", void 0)),
    chevron: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
        d: "m9 5 7 7-7 7"
    }, void 0, false, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 10,
        columnNumber: 11
    }, ("TURBOPACK compile-time value", void 0)),
    spark: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 10,
                columnNumber: 45
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "m20 2 .5 1.5L22 4l-1.5.5L20 6l-.5-1.5L18 4l1.5-.5L20 2Z"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 10,
                columnNumber: 119
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 10,
        columnNumber: 43
    }, ("TURBOPACK compile-time value", void 0)),
    bookmark: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
        d: "M6 3h12v18l-6-4-6 4V3Z"
    }, void 0, false, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 11,
        columnNumber: 12
    }, ("TURBOPACK compile-time value", void 0)),
    check: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
        d: "m5 12 4 4L19 6"
    }, void 0, false, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 11,
        columnNumber: 53
    }, ("TURBOPACK compile-time value", void 0)),
    clock: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "9"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 11,
                columnNumber: 88
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 7v5l3 2"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 11,
                columnNumber: 119
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 11,
        columnNumber: 86
    }, ("TURBOPACK compile-time value", void 0)),
    close: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
        d: "m6 6 12 12M6 18 18 6"
    }, void 0, false, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 12,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0)),
    plus: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
        d: "M12 5v14M5 12h14"
    }, void 0, false, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 12,
        columnNumber: 47
    }, ("TURBOPACK compile-time value", void 0)),
    send: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "m22 2-7 20-4-9-9-4L22 2Z"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 12,
                columnNumber: 83
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "m11 13 7-7"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 12,
                columnNumber: 119
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 12,
        columnNumber: 81
    }, ("TURBOPACK compile-time value", void 0)),
    external: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M14 3h7v7m0-7L10 14M10 3H4v17h17v-7"
        }, void 0, false, {
            fileName: "[project]/components/icon.tsx",
            lineNumber: 12,
            columnNumber: 156
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 12,
        columnNumber: 154
    }, ("TURBOPACK compile-time value", void 0)),
    language: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "3",
                y: "4",
                width: "18",
                height: "14",
                rx: "3"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 13,
                columnNumber: 14
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "m7 18-2 3m3-9 2-5 2 5m-3.5-1h3M15 8h3m-3 4h3"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 13,
                columnNumber: 63
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 13,
        columnNumber: 12
    }, ("TURBOPACK compile-time value", void 0)),
    brain: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M12 5C8 0 3 5 5 8c-5 3-2 8 0 8-1 5 5 7 7 3 2 4 8 2 7-3 2 0 5-5 0-8 2-3-3-8-7-3Zm0 0v14M6 8l2 2m-3 6 3-2m10-6-2 2m3 6-3-2"
        }, void 0, false, {
            fileName: "[project]/components/icon.tsx",
            lineNumber: 14,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 14,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0)),
    code: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
        d: "m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18"
    }, void 0, false, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 15,
        columnNumber: 8
    }, ("TURBOPACK compile-time value", void 0)),
    database: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                cx: "12",
                cy: "5",
                rx: "9",
                ry: "3"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 16,
                columnNumber: 14
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M3 5v14c0 4 18 4 18 0V5M3 12c0 4 18 4 18 0"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 16,
                columnNumber: 53
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 16,
        columnNumber: 12
    }, ("TURBOPACK compile-time value", void 0)),
    nodes: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "5",
                cy: "5",
                r: "2"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 17,
                columnNumber: 11
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "19",
                cy: "6",
                r: "2"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 17,
                columnNumber: 40
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "19",
                r: "2"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 17,
                columnNumber: 70
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "m7 5 10 1M6 7l5 10m7-9-5 9"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 17,
                columnNumber: 101
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 17,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0)),
    eye: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 18,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "3"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 18,
                columnNumber: 65
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 18,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0)),
    sliders: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M4 7h16M4 17h16M8 4v6m8 4v6"
        }, void 0, false, {
            fileName: "[project]/components/icon.tsx",
            lineNumber: 19,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 19,
        columnNumber: 11
    }, ("TURBOPACK compile-time value", void 0)),
    cap: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "m2 9 10-5 10 5-10 5L2 9Zm4 2v6c4 3 8 3 12 0v-6m4-2v8"
        }, void 0, false, {
            fileName: "[project]/components/icon.tsx",
            lineNumber: 19,
            columnNumber: 62
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 19,
        columnNumber: 60
    }, ("TURBOPACK compile-time value", void 0)),
    info: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "9"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 19,
                columnNumber: 137
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 11v6m0-10v.1"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 19,
                columnNumber: 168
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 19,
        columnNumber: 135
    }, ("TURBOPACK compile-time value", void 0)),
    menu: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
        d: "M3 6h18M3 12h18M3 18h18"
    }, void 0, false, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 19,
        columnNumber: 205
    }, ("TURBOPACK compile-time value", void 0)),
    target: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "9"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 19,
                columnNumber: 250
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "5"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 19,
                columnNumber: 281
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "1"
            }, void 0, false, {
                fileName: "[project]/components/icon.tsx",
                lineNumber: 19,
                columnNumber: 312
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 19,
        columnNumber: 248
    }, ("TURBOPACK compile-time value", void 0)),
    trash: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M3 6h18M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7m4-7v7"
        }, void 0, false, {
            fileName: "[project]/components/icon.tsx",
            lineNumber: 19,
            columnNumber: 355
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 19,
        columnNumber: 353
    }, ("TURBOPACK compile-time value", void 0))
};
function Icon({ name, size = 20, className = "", style }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "1.65",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: className,
        style: style,
        "aria-hidden": "true",
        children: paths[name]
    }, void 0, false, {
        fileName: "[project]/components/icon.tsx",
        lineNumber: 22,
        columnNumber: 10
    }, this);
}
}),
"[project]/components/shell.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Shell",
    ()=>Shell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$app$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/app-provider.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/icon.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const navigation = [
    {
        href: "/profile",
        label: "My profile",
        icon: "user",
        description: "Your interests & saved plan"
    },
    {
        href: "/chat",
        label: "AI companion",
        icon: "spark",
        description: "Think through your next step"
    },
    {
        href: "/courses",
        label: "Explore courses",
        icon: "book",
        description: "Find your next favorite class"
    },
    {
        href: "/research",
        label: "Discover research",
        icon: "flask",
        description: "Go beyond the classroom"
    }
];
function Shell({ children }) {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const { profile, saved, savedResearch, storageWarning } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$app$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useApp"])();
    const current = navigation.find((n)=>pathname.startsWith(n.href)) ?? navigation[2];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "app-shell",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                className: "skip-link",
                href: "#main",
                children: "Skip to content"
            }, void 0, false, {
                fileName: "[project]/components/shell.tsx",
                lineNumber: 16,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                className: "sidebar",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/courses",
                        className: "brand",
                        "aria-label": "TrojanPals home",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "brand-mark",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icon"], {
                                    name: "compass",
                                    size: 26
                                }, void 0, false, {
                                    fileName: "[project]/components/shell.tsx",
                                    lineNumber: 18,
                                    columnNumber: 105
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/shell.tsx",
                                lineNumber: 18,
                                columnNumber: 76
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "Trojan",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "brand-light",
                                        children: "Pals"
                                    }, void 0, false, {
                                        fileName: "[project]/components/shell.tsx",
                                        lineNumber: 18,
                                        columnNumber: 156
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                        children: "YOUR NEXT CHAPTER"
                                    }, void 0, false, {
                                        fileName: "[project]/components/shell.tsx",
                                        lineNumber: 18,
                                        columnNumber: 197
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/shell.tsx",
                                lineNumber: 18,
                                columnNumber: 144
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/shell.tsx",
                        lineNumber: 18,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "workspace",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "workspace-icon",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icon"], {
                                    name: "cap",
                                    size: 20
                                }, void 0, false, {
                                    fileName: "[project]/components/shell.tsx",
                                    lineNumber: 19,
                                    columnNumber: 67
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/shell.tsx",
                                lineNumber: 19,
                                columnNumber: 34
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "University of Southern California",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                        children: "Student workspace"
                                    }, void 0, false, {
                                        fileName: "[project]/components/shell.tsx",
                                        lineNumber: 19,
                                        columnNumber: 141
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/shell.tsx",
                                lineNumber: 19,
                                columnNumber: 102
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "status-dot"
                            }, void 0, false, {
                                fileName: "[project]/components/shell.tsx",
                                lineNumber: 19,
                                columnNumber: 180
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/shell.tsx",
                        lineNumber: 19,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "nav-caption",
                        children: "YOUR WORKSPACE"
                    }, void 0, false, {
                        fileName: "[project]/components/shell.tsx",
                        lineNumber: 20,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        "aria-label": "Main navigation",
                        children: navigation.map((item)=>{
                            const active = item === current;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: item.href,
                                className: `nav-link ${active ? "active" : ""}`,
                                "aria-current": active ? "page" : undefined,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icon"], {
                                        name: item.icon
                                    }, void 0, false, {
                                        fileName: "[project]/components/shell.tsx",
                                        lineNumber: 23,
                                        columnNumber: 139
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: item.label
                                    }, void 0, false, {
                                        fileName: "[project]/components/shell.tsx",
                                        lineNumber: 23,
                                        columnNumber: 163
                                    }, this),
                                    active && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "nav-active-dot"
                                    }, void 0, false, {
                                        fileName: "[project]/components/shell.tsx",
                                        lineNumber: 23,
                                        columnNumber: 197
                                    }, this)
                                ]
                            }, item.href, true, {
                                fileName: "[project]/components/shell.tsx",
                                lineNumber: 23,
                                columnNumber: 16
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/components/shell.tsx",
                        lineNumber: 21,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "sidebar-note",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "tiny-label",
                                children: "A LITTLE DIRECTION"
                            }, void 0, false, {
                                fileName: "[project]/components/shell.tsx",
                                lineNumber: 25,
                                columnNumber: 37
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icon"], {
                                name: "compass",
                                size: 28
                            }, void 0, false, {
                                fileName: "[project]/components/shell.tsx",
                                lineNumber: 25,
                                columnNumber: 91
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                children: [
                                    "Your next chapter",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/components/shell.tsx",
                                        lineNumber: 25,
                                        columnNumber: 144
                                    }, this),
                                    "starts with curiosity."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/shell.tsx",
                                lineNumber: 25,
                                columnNumber: 123
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Connect what you love learning with where you want to go."
                            }, void 0, false, {
                                fileName: "[project]/components/shell.tsx",
                                lineNumber: 25,
                                columnNumber: 176
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/chat",
                                children: [
                                    "Let’s figure it out ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icon"], {
                                        name: "arrow",
                                        size: 16
                                    }, void 0, false, {
                                        fileName: "[project]/components/shell.tsx",
                                        lineNumber: 25,
                                        columnNumber: 279
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/shell.tsx",
                                lineNumber: 25,
                                columnNumber: 240
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/shell.tsx",
                        lineNumber: 25,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        className: "sidebar-saved",
                        href: "/profile#saved",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icon"], {
                                name: "bookmark",
                                size: 18
                            }, void 0, false, {
                                fileName: "[project]/components/shell.tsx",
                                lineNumber: 26,
                                columnNumber: 61
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "My saved path"
                            }, void 0, false, {
                                fileName: "[project]/components/shell.tsx",
                                lineNumber: 26,
                                columnNumber: 94
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                children: saved.length + savedResearch.length
                            }, void 0, false, {
                                fileName: "[project]/components/shell.tsx",
                                lineNumber: 26,
                                columnNumber: 120
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/shell.tsx",
                        lineNumber: 26,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        className: "account",
                        href: "/profile",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "avatar",
                                children: profile.name.trim().slice(0, 1).toUpperCase() || "T"
                            }, void 0, false, {
                                fileName: "[project]/components/shell.tsx",
                                lineNumber: 27,
                                columnNumber: 49
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    profile.name || "Trojan student",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                        children: profile.program || "Student"
                                    }, void 0, false, {
                                        fileName: "[project]/components/shell.tsx",
                                        lineNumber: 27,
                                        columnNumber: 170
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/shell.tsx",
                                lineNumber: 27,
                                columnNumber: 132
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icon"], {
                                name: "chevron",
                                size: 16
                            }, void 0, false, {
                                fileName: "[project]/components/shell.tsx",
                                lineNumber: 27,
                                columnNumber: 220
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/shell.tsx",
                        lineNumber: 27,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/shell.tsx",
                lineNumber: 17,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "main-shell",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: "topbar",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "breadcrumb",
                                children: [
                                    "Your workspace ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "/"
                                    }, void 0, false, {
                                        fileName: "[project]/components/shell.tsx",
                                        lineNumber: 30,
                                        columnNumber: 77
                                    }, this),
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: current.label
                                    }, void 0, false, {
                                        fileName: "[project]/components/shell.tsx",
                                        lineNumber: 30,
                                        columnNumber: 92
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/shell.tsx",
                                lineNumber: 30,
                                columnNumber: 34
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "topbar-right",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "demo-badge",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {}, void 0, false, {
                                                fileName: "[project]/components/shell.tsx",
                                                lineNumber: 30,
                                                columnNumber: 189
                                            }, this),
                                            "Frontend demo"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/shell.tsx",
                                        lineNumber: 30,
                                        columnNumber: 160
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/profile",
                                        className: "avatar small",
                                        "aria-label": "Open profile",
                                        children: profile.name.trim().slice(0, 1).toUpperCase() || "T"
                                    }, void 0, false, {
                                        fileName: "[project]/components/shell.tsx",
                                        lineNumber: 30,
                                        columnNumber: 216
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/shell.tsx",
                                lineNumber: 30,
                                columnNumber: 130
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/shell.tsx",
                        lineNumber: 30,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "demo-strip",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icon"], {
                                name: "info",
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/components/shell.tsx",
                                lineNumber: 31,
                                columnNumber: 35
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Sample data throughout. Course details, reviews, research directions, and chat responses are illustrative—not verified USC guidance."
                            }, void 0, false, {
                                fileName: "[project]/components/shell.tsx",
                                lineNumber: 31,
                                columnNumber: 64
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/shell.tsx",
                        lineNumber: 31,
                        columnNumber: 7
                    }, this),
                    storageWarning && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "storage-warning",
                        role: "status",
                        children: storageWarning
                    }, void 0, false, {
                        fileName: "[project]/components/shell.tsx",
                        lineNumber: 32,
                        columnNumber: 24
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        id: "main",
                        tabIndex: -1,
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/components/shell.tsx",
                        lineNumber: 33,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                        className: "footer",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Made for curious Trojans."
                            }, void 0, false, {
                                fileName: "[project]/components/shell.tsx",
                                lineNumber: 34,
                                columnNumber: 34
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "TrojanPals · Hackathon prototype · Not affiliated with USC"
                            }, void 0, false, {
                                fileName: "[project]/components/shell.tsx",
                                lineNumber: 34,
                                columnNumber: 72
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/shell.tsx",
                        lineNumber: 34,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/shell.tsx",
                lineNumber: 29,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/shell.tsx",
        lineNumber: 15,
        columnNumber: 10
    }, this);
}
}),
"[project]/lib/data.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// All descriptions, requirements, assessment splits, workload estimates, and
// community contributions below are ILLUSTRATIVE DEMO DATA, not USC guidance.
// Replace with verified, semester-specific sources before a real launch.
__turbopack_context__.s([
    "courses",
    ()=>courses,
    "defaultProfile",
    ()=>defaultProfile,
    "interestOptions",
    ()=>interestOptions,
    "rankCourses",
    ()=>rankCourses,
    "researchAreas",
    ()=>researchAreas
]);
const interestOptions = [
    "Natural Language Processing",
    "Machine Learning",
    "Healthcare AI",
    "Data Science",
    "Web Development",
    "Computer Vision",
    "Algorithms",
    "Responsible AI"
];
const defaultProfile = {
    name: "Prisha",
    program: "Computer Science",
    interests: [
        "Natural Language Processing",
        "Machine Learning"
    ],
    assessment: "Projects",
    workload: 12,
    completed: [],
    goal: "Explore NLP and find a research direction that excites me."
};
const courses = [
    {
        id: "CSCI 544",
        slug: "csci-544",
        title: "Applied Natural Language Processing",
        short: "Turn human language into something machines can understand.",
        description: "Explore the ideas behind language technologies, from representing words to building and evaluating modern language models. The sample learning path connects core concepts with a practical NLP project.",
        tags: [
            "Natural Language Processing",
            "Machine Learning",
            "Healthcare AI"
        ],
        hours: 12,
        format: "Projects",
        level: "Advanced",
        color: "rose",
        icon: "language",
        prerequisites: "Demo requirement: complete CSCI 570; familiarity with Python and probability is suggested.",
        prerequisiteIds: [
            "CSCI 570"
        ],
        topics: [
            "Text representations",
            "Sequence modeling",
            "Transformers",
            "Language model evaluation",
            "Applied NLP project"
        ],
        assessment: [
            {
                label: "Projects",
                percent: 50
            },
            {
                label: "Assignments",
                percent: 25
            },
            {
                label: "Exams",
                percent: 25
            }
        ],
        outcomes: [
            "Build a text classification or information extraction pipeline.",
            "Explain how contextual language representations work.",
            "Evaluate model quality and discuss limitations."
        ],
        research: [
            "clinical-language",
            "responsible-language"
        ]
    },
    {
        id: "CSCI 567",
        slug: "csci-567",
        title: "Machine Learning",
        short: "Build the foundations behind models that learn from data.",
        description: "Develop intuition for supervised and unsupervised learning. This illustrative course profile combines mathematical foundations, model evaluation, and applied modeling exercises.",
        tags: [
            "Machine Learning",
            "Data Science",
            "Healthcare AI"
        ],
        hours: 14,
        format: "Mixed",
        level: "Foundations",
        color: "blue",
        icon: "nodes",
        prerequisites: "Demo requirement: complete CSCI 570; linear algebra and probability are suggested.",
        prerequisiteIds: [
            "CSCI 570"
        ],
        topics: [
            "Supervised learning",
            "Classification",
            "Clustering",
            "Generalization",
            "Model evaluation"
        ],
        assessment: [
            {
                label: "Projects",
                percent: 30
            },
            {
                label: "Assignments",
                percent: 30
            },
            {
                label: "Exams",
                percent: 40
            }
        ],
        outcomes: [
            "Choose an appropriate learning method for a dataset.",
            "Compare models with meaningful evaluation metrics.",
            "Recognize overfitting and data leakage."
        ],
        research: [
            "clinical-language",
            "visual-intelligence"
        ]
    },
    {
        id: "CSCI 566",
        slug: "csci-566",
        title: "Deep Learning and Its Applications",
        short: "Go from neural network fundamentals to modern applications.",
        description: "Study neural architectures, optimization, and applications in language and vision. The demo profile emphasizes implementation and an exploratory final project.",
        tags: [
            "Machine Learning",
            "Natural Language Processing",
            "Computer Vision"
        ],
        hours: 16,
        format: "Projects",
        level: "Advanced",
        color: "lavender",
        icon: "brain",
        prerequisites: "Demo requirement: complete CSCI 567; confidence with Python and linear algebra is suggested.",
        prerequisiteIds: [
            "CSCI 567"
        ],
        topics: [
            "Backpropagation",
            "Optimization",
            "Convolutional networks",
            "Attention",
            "Transfer learning"
        ],
        assessment: [
            {
                label: "Projects",
                percent: 45
            },
            {
                label: "Assignments",
                percent: 30
            },
            {
                label: "Exams",
                percent: 25
            }
        ],
        outcomes: [
            "Train and diagnose a neural network.",
            "Compare architectures for language and vision tasks.",
            "Design a reproducible model evaluation."
        ],
        research: [
            "visual-intelligence",
            "responsible-language"
        ]
    },
    {
        id: "CSCI 570",
        slug: "csci-570",
        title: "Analysis of Algorithms",
        short: "Learn to turn complex problems into efficient solutions.",
        description: "Practice algorithm design and reasoning about correctness and efficiency. This sample course profile covers several core approaches used throughout computer science.",
        tags: [
            "Algorithms"
        ],
        hours: 13,
        format: "Exams",
        level: "Foundations",
        color: "sand",
        icon: "nodes",
        prerequisites: "Demo guidance: familiarity with data structures and discrete mathematics.",
        prerequisiteIds: [],
        topics: [
            "Divide and conquer",
            "Greedy algorithms",
            "Dynamic programming",
            "Network flow",
            "Complexity"
        ],
        assessment: [
            {
                label: "Assignments",
                percent: 35
            },
            {
                label: "Exams",
                percent: 65
            }
        ],
        outcomes: [
            "Design and analyze algorithms.",
            "Write correctness arguments.",
            "Recognize common problem structures."
        ],
        research: []
    },
    {
        id: "CSCI 576",
        slug: "csci-576",
        title: "Multimedia Systems Design",
        short: "Explore how computers represent and process digital media.",
        description: "Investigate images, video, compression, and media systems through this illustrative project-oriented course profile.",
        tags: [
            "Computer Vision",
            "Web Development"
        ],
        hours: 10,
        format: "Projects",
        level: "Advanced",
        color: "mint",
        icon: "eye",
        prerequisites: "Demo guidance: programming experience and basic linear algebra.",
        prerequisiteIds: [],
        topics: [
            "Digital images",
            "Video processing",
            "Compression",
            "Media systems"
        ],
        assessment: [
            {
                label: "Projects",
                percent: 60
            },
            {
                label: "Assignments",
                percent: 20
            },
            {
                label: "Exams",
                percent: 20
            }
        ],
        outcomes: [
            "Build a small multimedia application.",
            "Explain image and video representations.",
            "Compare compression tradeoffs."
        ],
        research: [
            "visual-intelligence"
        ]
    },
    {
        id: "CSCI 585",
        slug: "csci-585",
        title: "Database Systems",
        short: "Design the data layer that powers useful applications.",
        description: "Explore relational modeling, querying, and data system design. This illustrative profile connects database concepts with an applied project.",
        tags: [
            "Data Science",
            "Web Development"
        ],
        hours: 10,
        format: "Projects",
        level: "Foundations",
        color: "mint",
        icon: "database",
        prerequisites: "Demo guidance: basic programming and data structures.",
        prerequisiteIds: [],
        topics: [
            "Relational modeling",
            "SQL",
            "Indexing",
            "Transactions",
            "Data application project"
        ],
        assessment: [
            {
                label: "Projects",
                percent: 40
            },
            {
                label: "Assignments",
                percent: 35
            },
            {
                label: "Exams",
                percent: 25
            }
        ],
        outcomes: [
            "Design a relational schema.",
            "Write and optimize queries.",
            "Choose appropriate data storage approaches."
        ],
        research: [
            "clinical-language"
        ]
    },
    {
        id: "CSCI 561",
        slug: "csci-561",
        title: "Foundations of Artificial Intelligence",
        short: "Explore search, reasoning, and intelligent decision-making.",
        description: "Examine foundational ideas in artificial intelligence, including search, reasoning, and decisions under uncertainty. All workload and assessment information is a sample.",
        tags: [
            "Algorithms",
            "Machine Learning",
            "Responsible AI"
        ],
        hours: 12,
        format: "Mixed",
        level: "Foundations",
        color: "sand",
        icon: "brain",
        prerequisites: "Demo guidance: programming, probability, and algorithm fundamentals.",
        prerequisiteIds: [],
        topics: [
            "Search",
            "Game playing",
            "Knowledge representation",
            "Probabilistic reasoning"
        ],
        assessment: [
            {
                label: "Projects",
                percent: 35
            },
            {
                label: "Assignments",
                percent: 25
            },
            {
                label: "Exams",
                percent: 40
            }
        ],
        outcomes: [
            "Implement a search-based problem solver.",
            "Represent knowledge and uncertainty.",
            "Compare approaches to intelligent decisions."
        ],
        research: [
            "responsible-language"
        ]
    },
    {
        id: "CSCI 572",
        slug: "csci-572",
        title: "Information Retrieval and Web Search Engines",
        short: "Understand how search connects people with information.",
        description: "Study indexing, retrieval, ranking, and evaluation. The sample project path offers a bridge between language processing and practical search applications.",
        tags: [
            "Natural Language Processing",
            "Data Science",
            "Web Development"
        ],
        hours: 11,
        format: "Projects",
        level: "Advanced",
        color: "blue",
        icon: "language",
        prerequisites: "Demo guidance: programming and basic data structures.",
        prerequisiteIds: [],
        topics: [
            "Indexing",
            "Retrieval models",
            "Ranking",
            "Search evaluation",
            "Search interfaces"
        ],
        assessment: [
            {
                label: "Projects",
                percent: 55
            },
            {
                label: "Assignments",
                percent: 25
            },
            {
                label: "Exams",
                percent: 20
            }
        ],
        outcomes: [
            "Build a small search system.",
            "Evaluate retrieval relevance.",
            "Explain ranking tradeoffs."
        ],
        research: [
            "clinical-language",
            "responsible-language"
        ]
    },
    {
        id: "CSCI 571",
        slug: "csci-571",
        title: "Web Technologies",
        short: "Bring your ideas to life with useful web experiences.",
        description: "Develop interactive web applications and learn how frontend and backend systems work together. The assessment and workload figures shown here are examples.",
        tags: [
            "Web Development"
        ],
        hours: 12,
        format: "Projects",
        level: "Foundations",
        color: "rose",
        icon: "code",
        prerequisites: "Demo guidance: familiarity with programming.",
        prerequisiteIds: [],
        topics: [
            "HTML and CSS",
            "JavaScript",
            "APIs",
            "Web application architecture"
        ],
        assessment: [
            {
                label: "Projects",
                percent: 65
            },
            {
                label: "Assignments",
                percent: 20
            },
            {
                label: "Exams",
                percent: 15
            }
        ],
        outcomes: [
            "Build a responsive web interface.",
            "Connect an interface to an API.",
            "Deploy a small web application."
        ],
        research: []
    },
    {
        id: "CSCI 599",
        slug: "csci-599",
        title: "Special Topics: Responsible AI",
        short: "Ask better questions about the AI systems we build.",
        description: "An entirely fictional special-topics offering used to demonstrate the interface. Explore fairness, transparency, evaluation, and the social implications of AI.",
        tags: [
            "Responsible AI",
            "Machine Learning",
            "Natural Language Processing"
        ],
        hours: 9,
        format: "Projects",
        level: "Advanced",
        color: "lavender",
        icon: "brain",
        prerequisites: "Demo requirement: complete CSCI 567; this special-topics offering is fictional.",
        prerequisiteIds: [
            "CSCI 567"
        ],
        topics: [
            "Fairness",
            "Interpretability",
            "Robustness",
            "Human-centered evaluation"
        ],
        assessment: [
            {
                label: "Projects",
                percent: 60
            },
            {
                label: "Reading responses",
                percent: 25
            },
            {
                label: "Presentation",
                percent: 15
            }
        ],
        outcomes: [
            "Critique an AI evaluation approach.",
            "Analyze possible harms and tradeoffs.",
            "Communicate system limitations."
        ],
        research: [
            "responsible-language"
        ]
    }
];
const researchAreas = [
    {
        id: "clinical-language",
        title: "Language for better healthcare",
        area: "NLP × Healthcare",
        description: "Explore how language technology could help people work with complex clinical information.",
        tags: [
            "Natural Language Processing",
            "Healthcare AI",
            "Data Science"
        ],
        color: "rose",
        question: "How can we extract useful information from clinical text while protecting privacy?",
        preparation: [
            "Build a small information extraction project on public, non-sensitive text.",
            "Learn precision, recall, and common dataset limitations.",
            "Read a relevant lab publication before drafting an introduction."
        ]
    },
    {
        id: "responsible-language",
        title: "More trustworthy language models",
        area: "NLP × Responsible AI",
        description: "Investigate how language systems behave, where they fail, and how to evaluate them responsibly.",
        tags: [
            "Natural Language Processing",
            "Responsible AI",
            "Machine Learning"
        ],
        color: "lavender",
        question: "How can we tell when a language model is unreliable or unfair?",
        preparation: [
            "Compare model outputs on a small documented evaluation set.",
            "Study robustness, bias, and evaluation methods.",
            "Write a one-page summary of a research question that interests you."
        ]
    },
    {
        id: "visual-intelligence",
        title: "Understanding the visual world",
        area: "Vision × Deep Learning",
        description: "Explore how machines learn useful representations of images and other visual information.",
        tags: [
            "Computer Vision",
            "Machine Learning"
        ],
        color: "mint",
        question: "How can a model learn visual concepts that generalize to new situations?",
        preparation: [
            "Complete an introductory image classification project.",
            "Learn about train/test splits, augmentation, and transfer learning.",
            "Document one failure case and propose an experiment."
        ]
    }
];
function rankCourses(profile) {
    return courses.filter((c)=>!profile.completed.includes(c.id)).map((course)=>{
        const shared = course.tags.filter((tag)=>profile.interests.includes(tag));
        const missing = course.prerequisiteIds.filter((id)=>!profile.completed.includes(id));
        const reasons = [];
        let score = shared.length * 30;
        if (shared.length) reasons.push(`Matches your interest in ${shared[0].toLowerCase()}`);
        if (profile.assessment !== "No preference" && course.format === profile.assessment) {
            score += 18;
            reasons.push(`${course.format === "Projects" ? "Project-focused" : "Exam-focused"} assessment preference`);
        }
        if (course.hours <= profile.workload) {
            score += 12;
            reasons.push("Within your weekly workload preference");
        } else score -= (course.hours - profile.workload) * 3;
        score -= missing.length * 12;
        return {
            course,
            score,
            reasons: reasons.length ? reasons : [
                "An option to explore beyond your current interests"
            ],
            missing
        };
    }).sort((a, b)=>b.score - a.score || a.course.title.localeCompare(b.course.title));
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1d3kf6owfx-yf._.js.map