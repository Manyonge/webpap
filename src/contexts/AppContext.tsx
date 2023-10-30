import { createContext, useContext } from "react";
import { SeverityColorEnum } from "../common/enums";

export type AppContextType = {
  showToast: (message: string, severity?: SeverityColorEnum) => void;
  supabaseFetcher: (requestFn: any) => Promise<any>;
};
export const AppContext = createContext<AppContextType>({
  showToast: () => "",
  supabaseFetcher: async () => "",
});
export const useAppContext = () => useContext(AppContext);
