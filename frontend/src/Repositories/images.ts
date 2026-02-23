import { supabase } from "../Config/supabase";
import heic2any from "heic2any";

export const images = {
  uploadImage: async (file) => {
    try {
      let fileToUpload = file;
      let fileExt = file.name.split(".").pop().toLowerCase();
      const fileNameBase = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      if (fileExt === "heic" || fileExt === "heif") {
        console.log("Convertendo arquivo HEIC para JPEG...");
        
        const blob = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.8 
        });

        const convertedBlob = Array.isArray(blob) ? blob[0] : blob;

        fileToUpload = new File([convertedBlob], `${fileNameBase}.jpg`, {
          type: "image/jpeg"
        });
        fileExt = "jpg";
      }

      const finalFileName = `${fileNameBase}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("images")
        .upload(finalFileName, fileToUpload);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("images")
        .getPublicUrl(finalFileName);

      return urlData.publicUrl;
    } catch (error) {
      console.error("Erro no processamento ou upload da imagem:", error);
      return null;
    }
  },
};