(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/chat-page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChatPage",
    ()=>ChatPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/data.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$app$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/app-provider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/icon.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
const prompts = [
    "I’m interested in NLP and prefer project-based courses.",
    "Help me find a manageable course workload.",
    "What courses could help me prepare for NLP research?",
    "I prefer courses without exams. What are my options?"
];
function ChatPage() {
    _s();
    const { profile, messages, setMessages, ready } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$app$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApp"])();
    const [input, setInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [busy, setBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [contextSlug, setContextSlug] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])();
    const bottom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const pending = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const controller = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const preferences = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({});
    const conversation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const generation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatPage.useEffect": ()=>{
            setContextSlug(new URLSearchParams(window.location.search).get("course") ?? undefined);
            return ({
                "ChatPage.useEffect": ()=>{
                    controller.current?.abort();
                }
            })["ChatPage.useEffect"];
        }
    }["ChatPage.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatPage.useEffect": ()=>{
            bottom.current?.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });
        }
    }["ChatPage.useEffect"], [
        messages,
        busy
    ]);
    const context = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["courses"].find((c)=>c.slug === contextSlug);
    async function send(text) {
        const value = text.trim();
        if (!value || pending.current || !ready) return;
        pending.current = true;
        setBusy(true);
        setInput("");
        const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const currentGeneration = generation.current;
        const history = conversation.current.slice(-10);
        setMessages((previous)=>[
                ...previous,
                {
                    id: `user-${id}`,
                    role: "user",
                    text: value
                }
            ]);
        const abort = new AbortController();
        controller.current = abort;
        try {
            const requestMessage = context ? `Regarding ${context.id} (${context.title}): ${value}` : value;
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sendChatMessage"])(requestMessage, history, preferences.current, abort.signal);
            if (currentGeneration !== generation.current) return;
            preferences.current = result.preferences;
            conversation.current = [
                ...history,
                {
                    role: "user",
                    content: requestMessage
                },
                {
                    role: "assistant",
                    content: result.reply
                }
            ];
            // Only show links when the backend course ID exists in the frontend's local course catalog.
            const ids = [
                ...new Set(result.recommendations.map((r)=>(r.course_id || "").replace(/-/g, " ").toUpperCase()))
            ];
            const courseIds = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["courses"].filter((c)=>ids.includes(c.id.replace(/-/g, " ").toUpperCase())).map((c)=>c.id);
            setMessages((previous)=>[
                    ...previous,
                    {
                        id: `assistant-${id}`,
                        role: "assistant",
                        text: result.reply,
                        courseIds: courseIds.length ? courseIds : undefined
                    }
                ]);
        } catch (error) {
            if (currentGeneration !== generation.current || abort.signal.aborted) return;
            const detail = error instanceof Error ? error.message : "Unknown error";
            setMessages((previous)=>[
                    ...previous,
                    {
                        id: `assistant-${id}`,
                        role: "assistant",
                        text: `I couldn't reach the recommendation service (${detail}). Please try again.`
                    }
                ]);
        } finally{
            if (currentGeneration === generation.current) {
                pending.current = false;
                setBusy(false);
                controller.current = null;
            }
        }
    }
    function resetConversation() {
        generation.current += 1;
        controller.current?.abort();
        controller.current = null;
        pending.current = false;
        setBusy(false);
        preferences.current = {};
        conversation.current = [];
        setMessages((previous)=>previous.length ? [
                previous[0]
            ] : []);
    }
    function submit(event) {
        event.preventDefault();
        void send(input);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "page chat-page",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "page-heading",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "eyebrow",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {}, void 0, false, {
                                        fileName: "[project]/components/chat-page.tsx",
                                        lineNumber: 88,
                                        columnNumber: 106
                                    }, this),
                                    "THINK OUT LOUD. FIND YOUR DIRECTION."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/chat-page.tsx",
                                lineNumber: 88,
                                columnNumber: 81
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                children: [
                                    "A little guidance.",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("em", {
                                        children: " A clearer path."
                                    }, void 0, false, {
                                        fileName: "[project]/components/chat-page.tsx",
                                        lineNumber: 88,
                                        columnNumber: 177
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/chat-page.tsx",
                                lineNumber: 88,
                                columnNumber: 155
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Talk through courses, research interests, and what comes next."
                            }, void 0, false, {
                                fileName: "[project]/components/chat-page.tsx",
                                lineNumber: 88,
                                columnNumber: 207
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/chat-page.tsx",
                        lineNumber: 88,
                        columnNumber: 76
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn secondary",
                        disabled: busy || messages.length <= 1,
                        onClick: resetConversation,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                                name: "plus",
                                size: 16
                            }, void 0, false, {
                                fileName: "[project]/components/chat-page.tsx",
                                lineNumber: 88,
                                columnNumber: 384
                            }, this),
                            "New conversation"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/chat-page.tsx",
                        lineNumber: 88,
                        columnNumber: 282
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/chat-page.tsx",
                lineNumber: 88,
                columnNumber: 42
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "chat-layout",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "chat-panel panel",
                        "aria-label": "AI companion",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "chat-panel-header",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "assistant-avatar",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                                            name: "spark",
                                            size: 21
                                        }, void 0, false, {
                                            fileName: "[project]/components/chat-page.tsx",
                                            lineNumber: 89,
                                            columnNumber: 168
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/chat-page.tsx",
                                        lineNumber: 89,
                                        columnNumber: 133
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                children: "TrojanPals companion"
                                            }, void 0, false, {
                                                fileName: "[project]/components/chat-page.tsx",
                                                lineNumber: 89,
                                                columnNumber: 210
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "status-dot"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/chat-page.tsx",
                                                        lineNumber: 89,
                                                        columnNumber: 242
                                                    }, this),
                                                    "AI-powered course guidance"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/chat-page.tsx",
                                                lineNumber: 89,
                                                columnNumber: 239
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/chat-page.tsx",
                                        lineNumber: 89,
                                        columnNumber: 205
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "count-pill",
                                        children: "Your next move, together"
                                    }, void 0, false, {
                                        fileName: "[project]/components/chat-page.tsx",
                                        lineNumber: 89,
                                        columnNumber: 308
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/chat-page.tsx",
                                lineNumber: 89,
                                columnNumber: 98
                            }, this),
                            context && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "chat-context",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                                        name: "book",
                                        size: 16
                                    }, void 0, false, {
                                        fileName: "[project]/components/chat-page.tsx",
                                        lineNumber: 90,
                                        columnNumber: 47
                                    }, this),
                                    "Exploring ",
                                    context.id,
                                    ": ",
                                    context.title,
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "icon-button",
                                        "aria-label": "Remove course context",
                                        onClick: ()=>setContextSlug(undefined),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                                            name: "close",
                                            size: 14
                                        }, void 0, false, {
                                            fileName: "[project]/components/chat-page.tsx",
                                            lineNumber: 90,
                                            columnNumber: 224
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/chat-page.tsx",
                                        lineNumber: 90,
                                        columnNumber: 115
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/chat-page.tsx",
                                lineNumber: 90,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "messages",
                                role: "log",
                                "aria-label": "Conversation",
                                "aria-live": "polite",
                                "aria-relevant": "additions",
                                children: [
                                    messages.map((message)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                            className: `message ${message.role}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: message.role === "assistant" ? "message-avatar" : "message-avatar user-avatar",
                                                    children: message.role === "assistant" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                                                        name: "spark",
                                                        size: 17
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/chat-page.tsx",
                                                        lineNumber: 91,
                                                        columnNumber: 331
                                                    }, this) : profile.name.slice(0, 1).toUpperCase()
                                                }, void 0, false, {
                                                    fileName: "[project]/components/chat-page.tsx",
                                                    lineNumber: 91,
                                                    columnNumber: 202
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "message-content",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "message-author",
                                                            children: message.role === "assistant" ? "TrojanPals" : "You"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/chat-page.tsx",
                                                            lineNumber: 91,
                                                            columnNumber: 443
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            style: {
                                                                whiteSpace: "pre-wrap"
                                                            },
                                                            children: message.text
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/chat-page.tsx",
                                                            lineNumber: 91,
                                                            columnNumber: 536
                                                        }, this),
                                                        message.courseIds && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "chat-result-links",
                                                            children: message.courseIds.map((id)=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["courses"].find((c)=>c.id === id)).filter((c)=>!!c).map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                    href: `/courses/${c.slug}`,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                                                                            name: "book",
                                                                            size: 15
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/chat-page.tsx",
                                                                            lineNumber: 91,
                                                                            columnNumber: 781
                                                                        }, this),
                                                                        c.id,
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            children: c.title
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/chat-page.tsx",
                                                                            lineNumber: 91,
                                                                            columnNumber: 816
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                                                                            name: "arrow",
                                                                            size: 14
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/chat-page.tsx",
                                                                            lineNumber: 91,
                                                                            columnNumber: 838
                                                                        }, this)
                                                                    ]
                                                                }, c.id, true, {
                                                                    fileName: "[project]/components/chat-page.tsx",
                                                                    lineNumber: 91,
                                                                    columnNumber: 736
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/chat-page.tsx",
                                                            lineNumber: 91,
                                                            columnNumber: 614
                                                        }, this),
                                                        message.researchIds && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "chat-result-links",
                                                            children: message.researchIds.map((id)=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["researchAreas"].find((r)=>r.id === id)).filter((r)=>!!r).map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                    href: `/research#${r.id}`,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                                                                            name: "flask",
                                                                            size: 15
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/chat-page.tsx",
                                                                            lineNumber: 91,
                                                                            columnNumber: 1082
                                                                        }, this),
                                                                        r.title,
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                                                                            name: "arrow",
                                                                            size: 14
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/chat-page.tsx",
                                                                            lineNumber: 91,
                                                                            columnNumber: 1121
                                                                        }, this)
                                                                    ]
                                                                }, r.id, true, {
                                                                    fileName: "[project]/components/chat-page.tsx",
                                                                    lineNumber: 91,
                                                                    columnNumber: 1038
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/chat-page.tsx",
                                                            lineNumber: 91,
                                                            columnNumber: 908
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/chat-page.tsx",
                                                    lineNumber: 91,
                                                    columnNumber: 410
                                                }, this)
                                            ]
                                        }, message.id, true, {
                                            fileName: "[project]/components/chat-page.tsx",
                                            lineNumber: 91,
                                            columnNumber: 138
                                        }, this)),
                                    busy && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "typing",
                                        role: "status",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {}, void 0, false, {
                                                fileName: "[project]/components/chat-page.tsx",
                                                lineNumber: 91,
                                                columnNumber: 1232
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {}, void 0, false, {
                                                fileName: "[project]/components/chat-page.tsx",
                                                lineNumber: 91,
                                                columnNumber: 1239
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {}, void 0, false, {
                                                fileName: "[project]/components/chat-page.tsx",
                                                lineNumber: 91,
                                                columnNumber: 1246
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                children: "Finding courses for you…"
                                            }, void 0, false, {
                                                fileName: "[project]/components/chat-page.tsx",
                                                lineNumber: 91,
                                                columnNumber: 1253
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/chat-page.tsx",
                                        lineNumber: 91,
                                        columnNumber: 1194
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        ref: bottom
                                    }, void 0, false, {
                                        fileName: "[project]/components/chat-page.tsx",
                                        lineNumber: 91,
                                        columnNumber: 1299
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/chat-page.tsx",
                                lineNumber: 91,
                                columnNumber: 5
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "chat-compose",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                        onSubmit: submit,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "sr-only",
                                                htmlFor: "chat-input",
                                                children: "Your message"
                                            }, void 0, false, {
                                                fileName: "[project]/components/chat-page.tsx",
                                                lineNumber: 92,
                                                columnNumber: 59
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                id: "chat-input",
                                                maxLength: 2000,
                                                placeholder: context ? `Ask about ${context.id}…` : "Tell me what you’re curious about…",
                                                value: input,
                                                onChange: (e)=>setInput(e.target.value),
                                                onKeyDown: (e)=>{
                                                    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                                                        e.preventDefault();
                                                        void send(input);
                                                    }
                                                },
                                                rows: 2
                                            }, void 0, false, {
                                                fileName: "[project]/components/chat-page.tsx",
                                                lineNumber: 92,
                                                columnNumber: 127
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "send-button",
                                                type: "submit",
                                                disabled: !input.trim() || busy || !ready,
                                                "aria-label": "Send message",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                                                    name: "arrow",
                                                    size: 21
                                                }, void 0, false, {
                                                    fileName: "[project]/components/chat-page.tsx",
                                                    lineNumber: 92,
                                                    columnNumber: 571
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/chat-page.tsx",
                                                lineNumber: 92,
                                                columnNumber: 456
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/chat-page.tsx",
                                        lineNumber: 92,
                                        columnNumber: 35
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "Recommendations use available course records and student-reported reviews. Enter to send · Shift + Enter for a new line."
                                    }, void 0, false, {
                                        fileName: "[project]/components/chat-page.tsx",
                                        lineNumber: 92,
                                        columnNumber: 617
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/chat-page.tsx",
                                lineNumber: 92,
                                columnNumber: 5
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/chat-page.tsx",
                        lineNumber: 89,
                        columnNumber: 34
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        className: "chat-aside",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "panel",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "tiny-label",
                                        children: "NOT SURE WHERE TO START?"
                                    }, void 0, false, {
                                        fileName: "[project]/components/chat-page.tsx",
                                        lineNumber: 93,
                                        columnNumber: 68
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        children: "Start with a little curiosity."
                                    }, void 0, false, {
                                        fileName: "[project]/components/chat-page.tsx",
                                        lineNumber: 93,
                                        columnNumber: 128
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "prompt-list",
                                        children: prompts.map((prompt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                disabled: busy || !ready,
                                                onClick: ()=>void send(prompt),
                                                children: [
                                                    prompt,
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                                                        name: "arrow",
                                                        size: 16
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/chat-page.tsx",
                                                        lineNumber: 93,
                                                        columnNumber: 308
                                                    }, this)
                                                ]
                                            }, prompt, true, {
                                                fileName: "[project]/components/chat-page.tsx",
                                                lineNumber: 93,
                                                columnNumber: 219
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/components/chat-page.tsx",
                                        lineNumber: 93,
                                        columnNumber: 167
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/chat-page.tsx",
                                lineNumber: 93,
                                columnNumber: 45
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "advice-note",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                                        name: "target",
                                        size: 24
                                    }, void 0, false, {
                                        fileName: "[project]/components/chat-page.tsx",
                                        lineNumber: 93,
                                        columnNumber: 390
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        children: "Built around you."
                                    }, void 0, false, {
                                        fileName: "[project]/components/chat-page.tsx",
                                        lineNumber: 93,
                                        columnNumber: 421
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "Tell Trojan PALS your interests and course preferences in chat. You can update your saved profile separately."
                                    }, void 0, false, {
                                        fileName: "[project]/components/chat-page.tsx",
                                        lineNumber: 93,
                                        columnNumber: 447
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/profile",
                                        className: "text-button",
                                        children: [
                                            "Update my preferences ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                                                name: "arrow",
                                                size: 15
                                            }, void 0, false, {
                                                fileName: "[project]/components/chat-page.tsx",
                                                lineNumber: 93,
                                                columnNumber: 631
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/chat-page.tsx",
                                        lineNumber: 93,
                                        columnNumber: 563
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/chat-page.tsx",
                                lineNumber: 93,
                                columnNumber: 361
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/chat-page.tsx",
                        lineNumber: 93,
                        columnNumber: 15
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/chat-page.tsx",
                lineNumber: 89,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/chat-page.tsx",
        lineNumber: 88,
        columnNumber: 10
    }, this);
}
_s(ChatPage, "7r8amelAvWKvsohh/zvKmzDIRhM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$app$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApp"]
    ];
});
_c = ChatPage;
var _c;
__turbopack_context__.k.register(_c, "ChatPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "recommendCourses",
    ()=>recommendCourses,
    "sendChatMessage",
    ()=>sendChatMessage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const API_URL = ("TURBOPACK compile-time value", "http://localhost:8000") ?? "http://localhost:8000";
async function sendChatMessage(message, history, preferences, signal) {
    const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message,
            history,
            preferences
        }),
        signal
    });
    if (!response.ok) {
        throw new Error(`Chat API returned HTTP ${response.status}`);
    }
    const data = await response.json();
    if (!data || typeof data !== "object" || !("reply" in data) || typeof data.reply !== "string") {
        throw new Error("Unexpected chat API response");
    }
    const result = data;
    return {
        reply: result.reply,
        preferences: result.preferences && typeof result.preferences === "object" ? result.preferences : {},
        recommendations: Array.isArray(result.recommendations) ? result.recommendations : []
    };
}
// export type ChatRequest = {
//   message: string;
//   history: Array<{
//     role: string;
//     content: string;
//   }>;
//   preferences: Record<string, unknown>;
// };
async function postJSON(endpoint, body) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error ${response.status}: ${errorText}`);
    }
    return response.json();
}
async function recommendCourses(preferences) {
    return postJSON("/recommend", preferences);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_1uv98-iwj9muk._.js.map