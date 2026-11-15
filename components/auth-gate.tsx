"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useApp } from "./app-provider";
import { ProfileEditor } from "./profile-page";
import { Icon } from "./icon";
import { isUscEmail } from "@/lib/usc-email";
export function AuthGate({children}:{children:React.ReactNode}){
 const {configured,loading,error,user,profile,reload,signOut}=useApp();const [signOutError,setSignOutError]=useState("");const [oauthError,setOauthError]=useState("");
 useEffect(()=>{const url=new URL(window.location.href);const query=new URLSearchParams(url.search);const fragment=new URLSearchParams(url.hash.slice(1));const code=query.get("auth_error")??query.get("error")??fragment.get("error");if(!code)return;const description=`${query.get("error_description")??""} ${fragment.get("error_description")??""}`.toLowerCase();setOauthError(description.includes("usc.edu")?"Google sign-in was rejected. Choose a Google account with an email ending exactly in @usc.edu.":"Google sign-in could not be completed. Check your Google account and try again.");window.history.replaceState(null,"",url.pathname);},[]);
 if(!configured)return <div className="auth-backdrop"><section className="auth-card"><span className="auth-logo"><Icon name="compass" size={26}/>TrojanPALS</span><h1>Connect your workspace.</h1><p>Add your Supabase project URL and publishable key to <code>.env.local</code>, run the two SQL files, and restart the development server.</p><p>Follow <strong>BACKEND_SETUP.md</strong> in the project folder. No student profile or review data is shown until the backend is connected.</p></section></div>;
 if(oauthError&&!user)return <AuthScreen initialError={oauthError}/>;
 if(loading)return <div className="auth-backdrop"><section className="auth-card" role="status"><Icon name="compass" size={35}/><h1>Opening your workspace…</h1><p>Loading your account from Supabase.</p></section></div>;
 if(error)return <div className="auth-backdrop"><section className="auth-card" role="alert"><h1>We couldn’t load your workspace.</h1><p>{error}</p><p>Confirm both SQL files ran successfully and the environment values are correct.</p><button className="btn primary" onClick={()=>void reload()}>Try again</button></section></div>;
 if(!user)return <AuthScreen initialError={oauthError}/>;
 if(!(user.providers.includes("google")||user.provider==="google")||!isUscEmail(user.email))return <div className="auth-backdrop"><section className="auth-card" role="alert"><h1>A USC Google account is required.</h1><p>Sign in with a Google account whose email ends exactly in @usc.edu to access TrojanPALS.</p>{signOutError&&<p className="form-error">{signOutError}</p>}<button className="btn primary" onClick={()=>void signOut().catch(reason=>setSignOutError(reason instanceof Error?reason.message:"Could not sign out."))}>Sign out</button></section></div>;
 if(!profile.onboardingComplete)return <div className="onboarding-backdrop"><section className="onboarding-intro"><span className="auth-logo"><Icon name="compass" size={26}/>TrojanPALS</span><h1>Let’s make this <em>your path.</em></h1><p>You’re signed in as {user.email}. Create your profile to enter your workspace.</p></section><ProfileEditor onboarding/></div>;
 return children;
}
function AuthScreen({initialError=""}:{initialError?:string}){
 const [busy,setBusy]=useState(false);const [error,setError]=useState(initialError);
 async function signInWithGoogle(){setBusy(true);setError("");try{const {error}=await createClient().auth.signInWithOAuth({provider:"google",options:{redirectTo:`${window.location.origin}/auth/callback`,queryParams:{hd:"usc.edu",prompt:"select_account"}}});if(error)throw error;}catch(reason){setError(reason instanceof Error?reason.message:"Google sign-in failed.");setBusy(false);}}
 return <div className="auth-backdrop"><section className="auth-story"><span className="eyebrow">YOUR NEXT CHAPTER</span><h1>Your interests.<br/>Your people.<br/><em>Your path.</em></h1><p>Find courses that excite you, learn from student experiences, and connect your curiosity with what comes next.</p>
 {/* <span className="auth-story-note">USC hackathon prototype · Not affiliated with USC</span> */}
 </section><section className="auth-card"><span className="auth-logo"><Icon name="compass" size={26}/>TrojanPALS</span><h2>Welcome to TrojanPALS.</h2><p>Sign in with your USC Google account. Only addresses ending in @usc.edu are accepted.</p>{error&&<p className="form-error" role="alert">{error}</p>}<button className="btn primary auth-google-button" disabled={busy} onClick={()=>void signInWithGoogle()}>{busy?"Connecting to Google…":"Continue with Google"}<Icon name="arrow" size={17}/></button></section></div>;
}
