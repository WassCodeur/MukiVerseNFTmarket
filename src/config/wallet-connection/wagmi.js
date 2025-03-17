import { createConfig, http } from "wagmi";
import { liskSepolia, holesky, } from "wagmi/chains";
import { walletConnect } from "wagmi/connectors";

export const supportedNetworks = [holesky, liskSepolia];

export const config = createConfig({
    chains: supportedNetworks,
    multiInjectedProviderDiscovery: true, // default to true though
    connectors: [
        walletConnect({ projectId: import.meta.env.VITE_REOWN_PROJECT_ID }),
    ],
    transports: {
        
        [holesky.id]: http(),
        [liskSepolia.id]: http(),
        
        
    },
});
