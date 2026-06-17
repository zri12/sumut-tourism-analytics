import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function normalizeSupabaseUrl(value) {
  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol)) return "";
    return url.origin;
  } catch {
    return "";
  }
}

const normalizedSupabaseUrl = normalizeSupabaseUrl(supabaseUrl);

export const isSupabasePublicConfigured = Boolean(
  normalizedSupabaseUrl && supabaseAnonKey,
);

export const supabase = isSupabasePublicConfigured
  ? createClient(normalizedSupabaseUrl, supabaseAnonKey)
  : null;
