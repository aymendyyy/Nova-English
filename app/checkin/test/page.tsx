import { createClient } from "@/lib/supabase/server";

export default async function SupabaseTestPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();

  if (error) {
    return (
      <main className="p-10">
        <h1>Supabase Connection Failed</h1>
        <p>{error.message}</p>
      </main>
    );
  }

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold">
        NOVA Supabase Connection
      </h1>

      <p className="mt-4 text-green-600">
        Supabase connected successfully!
      </p>

      <p className="mt-2">
        {data?.claims?.sub
          ? "Authenticated user detected."
          : "Connected successfully. No user signed in yet."}
      </p>
    </main>
  );
}