// Compatibility module for callers of the old frontend-only responder.
// The UI now calls /api/chat; no hard-coded student or course data is used.
export { matchingReply, buildChatContext } from "./chat-context";
