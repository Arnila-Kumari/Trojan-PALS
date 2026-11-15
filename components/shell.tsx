"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "./app-provider";
import { Icon, IconName } from "./icon";
const navigation:{href:string;label:string;icon:IconName;description:string}[]=[
  {href:"/profile",label:"My profile",icon:"user",description:"Your interests & saved plan"},
  {href:"/chat",label:"AI companion",icon:"spark",description:"Think through your next step"},
  {href:"/courses",label:"Explore courses",icon:"book",description:"Find your next favorite class"},
  {href:"/research",label:"Discover research",icon:"flask",description:"Go beyond the classroom"},
];
export function Shell({children}:{children:React.ReactNode}) {
  const pathname=usePathname();const {profile,storageWarning}=useApp();
  const current=navigation.find(n=>pathname.startsWith(n.href))??navigation[2];
  return <div className="app-shell">
    <a className="skip-link" href="#main">Skip to content</a>
    <aside className="sidebar">
      <Link href="/courses" className="brand" aria-label="TrojanPALS home"><span className="brand-mark"><Icon name="compass" size={26}/></span><span>Trojan<span className="brand-light">PALS</span><small>YOUR NEXT CHAPTER</small></span></Link>
      <div className="workspace"><span className="workspace-icon"><Icon name="cap" size={20}/></span><span>University of Southern California<small>Student workspace</small></span><span className="status-dot"/></div>
      <p className="nav-caption">YOUR WORKSPACE</p>
      <nav aria-label="Main navigation">{navigation.map(item=>{
        const active=item===current;
        return <Link key={item.href} href={item.href} className={`nav-link ${active?"active":""}`} aria-current={active?"page":undefined}><Icon name={item.icon}/><span>{item.label}</span>{active&&<span className="nav-active-dot"/>}</Link>;
      })}</nav>
      <div className="sidebar-note"><span className="tiny-label">A LITTLE DIRECTION</span><Icon name="compass" size={28}/><h3>Your next chapter<br/>starts with curiosity.</h3><p>Connect what you love learning with where you want to go.</p><Link href="/chat">Let’s figure it out <Icon name="arrow" size={16}/></Link></div>
    </aside>
    <div className="main-shell">
      <header className="topbar"><div className="breadcrumb">Your workspace <span>/</span> <strong>{current.label}</strong></div><div className="topbar-right"><Link href="/profile" className="avatar small" aria-label="Open profile">{profile.name.trim().slice(0,1).toUpperCase()||"T"}</Link></div></header>
      {storageWarning&&<div className="storage-warning" role="status">{storageWarning}</div>}
      <main id="main" tabIndex={-1}>{children}</main>
    </div>
  </div>;
}
