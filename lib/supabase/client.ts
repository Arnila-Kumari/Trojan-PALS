"use client";
import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseConfig } from "./config";
export function createClient(){const config=getSupabaseConfig();if(!config)throw new Error("Supabase is not configured. Fill in .env.local and restart the app.");return createBrowserClient(config.url,config.key);}
