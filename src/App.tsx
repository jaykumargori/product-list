import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/react-query';
import ProductList from './components/ProductList';
import './styles/globals.css';
import './styles/fonts.css';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="min-h-screen p-4 md:p-6 lg:p-8">
        <ProductList />
      </main>
    </QueryClientProvider>
  );
}

export default App
