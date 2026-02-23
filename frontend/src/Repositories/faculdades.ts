import { supabase } from "../Config/supabase";

export const faculdades = {
  async listAll() {
    const { data, error } = await supabase.from("faculdades").select("*");
    if (error) throw error;
    return data;
  },
};
