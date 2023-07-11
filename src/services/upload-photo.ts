import { supabase } from "../supabase.ts";

export const uploadPhoto = async (
  photo: File | boolean | string,
  fileName: string,
) => {
  const { data: pathData, error: pathError } = await supabase.storage
    .from("webpap storage")
    .upload(fileName, photo as File);

  if (pathError) throw new Error(pathError?.message);

  const { data: urlData } = supabase.storage
    .from("webpap storage")
    .getPublicUrl(pathData?.path as string);

  return urlData.publicUrl;
};
