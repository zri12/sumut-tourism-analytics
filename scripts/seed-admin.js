const bcrypt = require("bcryptjs");
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY wajib diisi.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const username = "admin";
  const { data: existing, error: findError } = await supabase
    .from("admins")
    .select("id, username")
    .eq("username", username)
    .maybeSingle();

  if (findError) throw findError;
  if (existing) {
    console.log("Admin default sudah ada, seed dilewati.");
    return;
  }

  const passwordHash = await bcrypt.hash("admin123", 10);
  const { error } = await supabase.from("admins").insert({
    name: "Administrator",
    username,
    password_hash: passwordHash,
  });

  if (error) throw error;
  console.log("Admin default berhasil dibuat: username admin, password admin123");
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
