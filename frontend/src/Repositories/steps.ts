import { supabase } from "../Config/supabase";

export interface StepsModel {
  id?: string;
  description: string;
  image: string;
  is_origem?: boolean; 
}

export const steps = {
  async listAll() {
    const { data, error } = await supabase
      .from("steps")
      .select("*")
      .order("description", { ascending: true }); 
    if (error) throw error;
    return data;
  },

  async listByDescription(description: string) {
    const { data, error } = await supabase
      .from("steps")
      .select("*")
      .ilike("description", `%${description}%`);
    if (error) throw error;
    return data;
  },

  async listByArrayIds(ids: string[]) {
    const { data, error } = await supabase
      .from("steps")
      .select("*")
      .in("id", ids);
    if (error) throw error;
    
    const sortedData = ids.map(id => data.find(step => step.id.toString() === id.toString())).filter(Boolean);
    return sortedData;
  },

  async addNewStep(step: StepsModel) {
    const { data, error } = await supabase.from("steps").insert(step).select();
    if (error) throw error;
    return data;
  },
};