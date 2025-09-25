import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useAuth() {
  const [session, setSession] =
    useState<
      Awaited<ReturnType<typeof supabase.auth.getSession>>["data"]["session"]
    >(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, s) => setSession(s)
    );
    return () => subscription.subscription.unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) throw error;
  };

  const signUpWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      // 1️⃣ Sign up the user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw new Error(`Sign-up failed: ${error.message}`);

      // 2️⃣ Verify user exists
      if (!data.user) {
        throw new Error("User data not returned after sign-up");
      }

      // 3️⃣ Update session if auto-signed-in
      if (data.session) {
        setSession(data.session); // Set session immediately
      }

      // 4️⃣ Insert into profiles table
      const { error: profileError } = await supabase.from("profiles").upsert(
        {
          id: data.user.id,
          email: data.user.email,
          username: null,
          full_name: null,
          avatar_url: null,
          created_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

      if (profileError) {
        throw new Error(`Profile insertion failed: ${profileError.message}`);
      }

      return data.user;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { session, loading, signInWithEmail, signUpWithEmail, signOut };
}
