import { supabase } from "../Config/supabase";

export interface RouteModel {
  name?: string;
  steps: string[];
  faculdade?: number | string;
  origem_id?: number | string;
  destino_id?: number | string;
}

export const rotas = {
  async listAll() {
    const { data, error } = await supabase
      .from("rotas")
      .select("*")
      .order("id", { ascending: false }); 
    if (error) throw error;
    return data;
  },

  async listByName(name: string) {
    const { data, error } = await supabase
      .from("rotas")
      .select("*")
      .ilike("name", `%${name}%`);
    if (error) throw error;
    return data;
  },

  async listById(id: string) {
    const { data, error } = await supabase
      .from("rotas")
      .select()
      .eq("id", `${id}`);
    if (error) throw error;
    return data;
  },

  async findByPath(faculdadeId: string | number, origemId: string | number, destinoId: string | number) {
    const { data, error } = await supabase
      .from("rotas")
      .select("*")
      .eq("faculdade", faculdadeId)
      .eq("origem_id", origemId)
      .eq("destino_id", destinoId)
      .single(); 

    if (error) {
      if (error.code === 'PGRST116') return null; 
      throw error;
    }
    return data;
  },

  async addNewRoute(route: RouteModel) {
    const { data, error } = await supabase.from("rotas").insert(route).select();
    if (error) throw error;
    return data;
  },

  async updateRoute(id: string | number, route: RouteModel) {
    const { data, error } = await supabase.from("rotas").update(route).eq("id", id).select();
    if (error) throw error;
    return data;
  },

  async deleteRoute(id: string | number) {
    const { data, error } = await supabase.from("rotas").delete().eq("id", id);
    if (error) throw error;
    return data;
  }
};