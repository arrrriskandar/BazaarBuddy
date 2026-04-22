// supabase/storage.js
import { supabase } from "./config";

export const uploadFile = async (file, path) => {
  try {
    const { error } = await supabase.storage
      .from("bb") // your bucket
      .upload(path, file, {
        upsert: true,
      });

    if (error) throw error;

    const { data } = supabase.storage.from("bb").getPublicUrl(path);

    return data.publicUrl;
  } catch (error) {
    throw error;
  }
};
