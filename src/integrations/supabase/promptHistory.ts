import { supabase } from "./client";

// Store a prompt for the current user
export async function storePrompt(prompt: string, userId: string) {
  const { error } = await supabase
    .from("prompt_history")
    .insert([{ user_id: userId, prompt }]);
  if (error) throw error;
}

// Fetch all prompts for the current user (latest first)
export async function fetchPromptHistory(userId: string) {
  const { data, error } = await supabase
    .from("prompt_history")
    .select("id, prompt, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}
