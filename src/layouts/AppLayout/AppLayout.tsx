import { Outlet } from "react-router-dom";
import * as Toast from "@radix-ui/react-toast";
import { useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { AppContext } from "../../contexts/AppContext.tsx";

export const AppLayout = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const showToast = (message: string) => {
    setMessage(message);
    setOpen(true);
  };

  return (
    <AppContext.Provider value={{ showToast }}>
      <Outlet />
      <Toast.Provider swipeDirection="right" duration={4000}>
        <Toast.Root
          className="ToastRoot flex flex-row items-center justify-between"
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
    </AppContext.Provider>
  );
};
