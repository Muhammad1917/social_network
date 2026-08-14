import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
const queryClient = new QueryClient();
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
createRoot(document.getElementById("root")).render(
    <QueryClientProvider client={queryClient}>
      <StrictMode>
        <App />
      </StrictMode>
        
    </QueryClientProvider>
)
