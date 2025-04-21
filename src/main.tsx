import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthProvider from './context/AuthContext.tsx'


  //react query 
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 5,
        retryDelay: 5000,
      }
    }
  });
createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  // </StrictMode>,
)
