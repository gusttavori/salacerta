import { supabase } from "../Config/supabase";

export const itemRepository = {
  async listarTodos() {
    const { data, error } = await supabase.from("steps").select("*");
    if (error) throw error;
    return data;
  },
};
