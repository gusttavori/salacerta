import { supabase } from "../Config/supabase";
export interface review {
  feedback: string;
  star: number;
  foundRoom: string;
}
export const reviews = {
  async addNewReview(review: review) {
    const { data, error } = await supabase
      .from("reviews")
      .insert(review)
      .select();
    if (error) throw error;
    return data;
  },
};
