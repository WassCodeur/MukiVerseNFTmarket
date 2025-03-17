import { Icon } from "@iconify/react/dist/iconify.js";
import { Dialog, Flex } from "@radix-ui/themes";
import React, { useState } from "react";
import { useConnectors } from "wagmi";

const WalletModal = () => {
    const connectors = useConnectors();
    const [pendingConnectorUID, setPendingConnectorUID] = useState(null);

    const walletConnectConnector = connectors.find(
        (connector) => connector.id === "walletConnect"
    );

    const otherConnectors = connectors.filter(
        (connector) => connector.id !== "walletConnect"
    );

    const connectWallet = async (connector) => {
        try {
            setPendingConnectorUID(connector.id);
            await connector.connect();
        } catch (error) {
            console.error(error);
        } finally {
            setPendingConnectorUID(null);
        }
    };

    return (
        <Dialog.Root>
            <Dialog.Trigger>
                <button className="bg-gradient-to-r from-primary to-primary/80 text-secondary font-semibold px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2">
                    <Icon icon="ph:wallet-bold" className="w-5 h-5" />
                    Connect Wallet
                </button>
            </Dialog.Trigger>

            <Dialog.Content maxWidth="450px" className="p-0 overflow-hidden border border-primary/10 rounded-xl shadow-xl">
                <div className="bg-gradient-to-r from-primary to-primary/90 p-4">
                    <Dialog.Title className="text-secondary text-xl font-bold mb-1">
                        Connect Your Wallet
                    </Dialog.Title>
                    <p className="text-secondary/80 text-sm">
                        Select a wallet to connect to our NFT marketplace
                    </p>
                </div>

                <Flex direction="column" gap="2" className="p-4 bg-secondary">
                    {walletConnectConnector && (
                        <button
                            onClick={() => connectWallet(walletConnectConnector)}
                            disabled={pendingConnectorUID === walletConnectConnector.uid}
                            className="w-full flex justify-between items-center p-4 bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 rounded-xl transition-colors duration-200"
                        >
                            <div className="flex items-center gap-3">
                                <img
                                    src="https://logosarchive.com/wp-content/uploads/2022/02/WalletConnect-icon.svg"
                                    className="w-8 h-8"
                                    alt="WalletConnect"
                                />
                                <span className="font-medium">WalletConnect</span>
                            </div>
                            {pendingConnectorUID === walletConnectConnector.uid ? (
                                <Icon icon="svg-spinners:270-ring" className="w-5 h-5 text-primary animate-spin" />
                            ) : (
                                <Icon icon="material-symbols:arrow-forward-rounded" className="w-5 h-5 text-gray-400" />
                            )}
                        </button>
                    )}

                    <div className="flex flex-col gap-2 mt-2">
                        {otherConnectors.map((connector) => (
                            <button
                                key={connector.id}
                                onClick={() => connectWallet(connector)}
                                disabled={pendingConnectorUID === connector.uid}
                                className="w-full flex justify-between items-center p-4 bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 rounded-xl transition-colors duration-200"
                            >
                                <div className="flex items-center gap-3">
                                    <img src={connector.icon} className="w-8 h-8" alt={connector.name} />
                                    <span className="font-medium">{connector.name}</span>
                                </div>
                                {pendingConnectorUID === connector.uid ? (
                                    <Icon icon="svg-spinners:270-ring" className="w-5 h-5 text-primary animate-spin" />
                                ) : (
                                    <Icon icon="material-symbols:arrow-forward-rounded" className="w-5 h-5 text-gray-400" />
                                )}
                            </button>
                        ))}
                    </div>

                    <p className="text-xs text-gray-500 mt-4 text-center">
                        By connecting, you agree to our Terms of Service
                    </p>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
};

export default WalletModal;
