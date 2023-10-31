import { Outlet } from "react-router-dom";
import * as Toast from "@radix-ui/react-toast";
import { useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { AppContext, AuthProvider } from "../../contexts";
import { SeverityColorEnum } from "../../common/enums";

export const AppLayout = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severityColor, setSeverityColor] = useState(SeverityColorEnum.Normal);

  const showToast = (message: string, severity?: SeverityColorEnum) => {
    setMessage(message);
    severity ? setSeverityColor(severity) : null;
    setOpen(true);
  };

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
      }
    }
  };

  return (
    <AppContext.Provider
      value={{ showToast, supabaseFetcher: supabaseFetcher }}
    >
      <AuthProvider>
        <Outlet />
        <Toast.Provider swipeDirection="right" duration={4000}>
          <Toast.Root
            className={`ToastRoot flex text-center flex-row py-1 
            items-center justify-between ${severityColor}`}
            open={open}
            onOpenChange={setOpen}
          >
            <Toast.Title className="ToastTitle">{message}</Toast.Title>
            <Toast.Action className="ToastAction" asChild altText="close">
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
