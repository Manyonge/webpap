import { Outlet } from "react-router-dom";
import * as Toast from "@radix-ui/react-toast";
import { useEffect, useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { AppContext, AuthProvider } from "../../contexts";
import { SeverityColorEnum } from "../../common/enums";
import imageCompression from "browser-image-compression";
import { supabase } from "../../supabase.ts";
import { blobToWebP } from "webp-converter-browser";

export const AppLayout = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severityColor, setSeverityColor] = useState(SeverityColorEnum.Normal);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const showToast = (message: string, severity?: SeverityColorEnum) => {
    setMessage(message);
    severity ? setSeverityColor(severity) : null;
    setOpen(true);
  };

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    console.log(windowWidth);
  }, [windowWidth, window.innerWidth]);

  const supabaseFetcher = async (requestFn: any) => {
    try {
      const { data, error } = await requestFn;
      if (error) {
        throw new Error(error.message);
      }
      return data;
    } catch (e: any) {
      if (!navigator.onLine) {
        showToast(
          "You seem you have lost your connection",
          SeverityColorEnum.Error,
        );
        return;
      } else {
        showToast(e.message, SeverityColorEnum.Error);
        throw e;
      }
    }
  };

  const uploadPhoto = async (
    photo: File | boolean | string,
    fileName: string,
  ) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 500,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(photo as File, options);
      const webpBlob = await blobToWebP(compressedFile);

      const pathData = await supabaseFetcher(
        supabase.storage
          .from("webpap storage")
          .upload(fileName, webpBlob as File),
      );

      const urlData = await supabaseFetcher(
        supabase.storage
          .from("webpap storage")
          .getPublicUrl(pathData?.path as string),
      );

      return urlData.publicUrl;
    } catch (e: any) {
      showToast(e.message, SeverityColorEnum.Error);
      throw e;
    }
  };

  return (
    <AppContext.Provider
      value={{
        showToast,
        supabaseFetcher: supabaseFetcher,
        uploadPhoto,
        windowWidth,
      }}
    >
      <AuthProvider>
        <Outlet />
        <Toast.Provider swipeDirection="right" duration={4000}>
          <Toast.Root
            className={`ToastRoot flex  flex-row py-1 
            items-center  justify-center ${severityColor}`}
            open={open}
            onOpenChange={setOpen}
          >
            <Toast.Title className="ToastTitle ml-auto ">{message}</Toast.Title>
            <Toast.Action
              className="ToastAction ml-auto"
              asChild
              altText="close"
            >
              <button>
                {" "}
                <CloseOutlined />{" "}
              </button>
            </Toast.Action>
          </Toast.Root>
          <Toast.Viewport className="ToastViewport" />
        </Toast.Provider>
      </AuthProvider>
    </AppContext.Provider>
  );
};
