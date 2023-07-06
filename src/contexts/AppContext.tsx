import { createContext, useContext } from "react";

export type AppContextType = {
  showToast: (message: string) => void;
};
export const AppContext = createContext<AppContextType>({
  showToast: () => "",
});
export const useAppContext = () => useContext(AppContext);
