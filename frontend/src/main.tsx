import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { WagmiProvider, createConfig, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { defineChain } from 'viem';
import { metaMask } from 'wagmi/connectors';
import App from './App';
import './index.css';

// Coston2 Chain Definition
const coston2 = defineChain({
  id: 114,
  name: 'Coston2',
  nativeCurrency: { name: 'C2FLR', symbol: 'C2FLR', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://coston2-api.flare.network/ext/C/rpc'] },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://coston2-explorer.flare.network' },
  },
});

// Wagmi Config
const config = createConfig({
  chains: [coston2],
  transports: {
    [coston2.id]: http(),
  },
  connectors: [
    metaMask(),
  ],
});

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
);