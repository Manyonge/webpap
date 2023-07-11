import { createContext, useContext } from "react";
import { SeverityColorEnum } from "../common/enums";

export type AppContextType = {
  showToast: (message: string, severity?: SeverityColorEnum) => void;
};
export const AppContext = createContext<AppContextType>({
  showToast: () => "",
});
export const useAppContext = () => useContext(AppContext);
