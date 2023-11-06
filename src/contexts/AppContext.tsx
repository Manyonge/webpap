import { createContext, useContext } from "react";
import { SeverityColorEnum } from "../common/enums";

export type AppContextType = {
  showToast: (message: string, severity?: SeverityColorEnum) => void;
  supabaseFetcher: (requestFn: any) => Promise<any>;
  uploadPhoto: (
    photo: File | boolean | string,
    fileName: string,
  ) => Promise<string>;
  windowWidth: number;
};
export const AppContext = createContext<AppContextType>({
  showToast: () => "",
  supabaseFetcher: async () => "",
  uploadPhoto: async () => "",
  windowWidth: window.innerWidth,
});
export const useAppContext = () => useContext(AppContext);
