import { createContext, useContext } from "react";
import { SeverityColorEnum } from "../common/enums";

export type AppContextType = {
  showToast: (message: string, severity?: SeverityColorEnum) => void;
  supabaseApi: (requestFn: any) => Promise<any>;
};
export const AppContext = createContext<AppContextType>({
  showToast: () => "",
  supabaseApi: async () => "",
});
export const useAppContext = () => useContext(AppContext);
