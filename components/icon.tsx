import type { CSSProperties } from "react";
export type IconName = "compass" | "user" | "chat" | "book" | "flask" | "arrow" | "search" | "chevron" | "spark" | "bookmark" | "check" | "clock" | "close" | "plus" | "send" | "external" | "language" | "brain" | "code" | "database" | "nodes" | "eye" | "sliders" | "cap" | "info" | "menu" | "target" | "trash";
const paths: Record<IconName, React.ReactNode> = {
  compass:<><circle cx="12" cy="12" r="9"/><path d="m16 8-2.5 5.5L8 16l2.5-5.5L16 8Z"/></>,
  user:<><circle cx="12" cy="8" r="3.5"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/></>,
  chat:<path d="M21 11.5a9 9 0 0 1-9 9H4l-2 2V11.5a9.5 9.5 0 0 1 19 0Z"/>,
  book:<><path d="M12 5C8 2 4 3 2 4v15c3-1.5 7-1 10 1 3-2 7-2.5 10-1V4c-2-1-6-2-10 1Z"/><path d="M12 5v15"/></>,
  flask:<><path d="M9 3h6m-5 0v7L4 20c-.3.5 0 1 1 1h14c1 0 1.3-.5 1-1l-6-10V3M7 15h10"/></>,
  arrow:<path d="M4 12h16m-6-6 6 6-6 6"/>,search:<><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>,
  chevron:<path d="m9 5 7 7-7 7"/>, spark:<><path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z"/><path d="m20 2 .5 1.5L22 4l-1.5.5L20 6l-.5-1.5L18 4l1.5-.5L20 2Z"/></>,
  bookmark:<path d="M6 3h12v18l-6-4-6 4V3Z"/>,check:<path d="m5 12 4 4L19 6"/>,clock:<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  close:<path d="m6 6 12 12M6 18 18 6"/>,plus:<path d="M12 5v14M5 12h14"/>,send:<><path d="m22 2-7 20-4-9-9-4L22 2Z"/><path d="m11 13 7-7"/></>,external:<><path d="M14 3h7v7m0-7L10 14M10 3H4v17h17v-7"/></>,
  language:<><rect x="3" y="4" width="18" height="14" rx="3"/><path d="m7 18-2 3m3-9 2-5 2 5m-3.5-1h3M15 8h3m-3 4h3"/></>,
  brain:<><path d="M12 5C8 0 3 5 5 8c-5 3-2 8 0 8-1 5 5 7 7 3 2 4 8 2 7-3 2 0 5-5 0-8 2-3-3-8-7-3Zm0 0v14M6 8l2 2m-3 6 3-2m10-6-2 2m3 6-3-2"/></>,
  code:<path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18"/>,
  database:<><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 4 18 4 18 0V5M3 12c0 4 18 4 18 0"/></>,
  nodes:<><circle cx="5" cy="5" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="12" cy="19" r="2"/><path d="m7 5 10 1M6 7l5 10m7-9-5 9"/></>,
  eye:<><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>,
  sliders:<><path d="M4 7h16M4 17h16M8 4v6m8 4v6"/></>,cap:<><path d="m2 9 10-5 10 5-10 5L2 9Zm4 2v6c4 3 8 3 12 0v-6m4-2v8"/></>,info:<><circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.1"/></>,menu:<path d="M3 6h18M3 12h18M3 18h18"/>,target:<><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></>,trash:<><path d="M3 6h18M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7m4-7v7"/></>,
};
export function Icon({name,size=20,className="",style}: {name:IconName;size?:number;className?:string;style?:CSSProperties}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">{paths[name]}</svg>;
}
