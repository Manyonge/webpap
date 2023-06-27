import './App.css'
import {QueryClient, QueryClientProvider} from "react-query";

function App() {
const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>

    </QueryClientProvider>
  )
}

export default App

