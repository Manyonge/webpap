import "./App.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { ConfigProvider, ThemeConfig } from "antd";

const theme: ThemeConfig = {
  token: {
    colorPrimary: "rgba(165, 126, 93, 1)",
  },
};

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={theme}>
        <RouterProvider router={router} />
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
