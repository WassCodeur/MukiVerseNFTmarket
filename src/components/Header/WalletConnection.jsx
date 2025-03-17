import React, { useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import WalletModal from "./WalletModal";
import { shortenAddress } from "../../utils";
import { Flex, Popover } from "@radix-ui/themes";
import { Icon } from "@iconify/react/dist/iconify.js";
import { supportedNetworks } from "../../config/wallet-connection/wagmi";

const WalletConnection = () => {
    const account = useAccount();
    const { disconnect } = useDisconnect();
    const [copySuccess, setCopySuccess] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(account.address);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Failed to copy address: ', err);
        }
    };

    if (!account.address) {
        return <WalletModal />;
    }

    return (
        <Popover.Root>
            <Popover.Trigger>
                <button className="bg-secondary/10 hover:bg-secondary/20 text-secondary font-medium px-4 py-2 rounded-lg transition-colors duration-200 border border-secondary/20 shadow-sm">
                    <Flex align="center" gap="2">
                        <Icon
                            icon="ph:wallet-fill"
                            className="w-5 h-5 text-secondary"
                        />
                        <span>{shortenAddress(account.address)}</span>
                        <Icon
                            icon="radix-icons:caret-down"
                            className="w-4 h-4 text-secondary/80"
                        />
                    </Flex>
                </button>
            </Popover.Trigger>
            <Popover.Content width="280px" className="p-0 rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-primary/90 p-3">
                    <p className="text-secondary text-sm font-medium mb-1">Connected Wallet</p>
                    <p className="text-secondary/80 text-xs truncate">{account.address}</p>
                </div>

                <div className="py-2">
                    <a
                        className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 transition-colors duration-200"
                        href={`${supportedNetworks[0].blockExplorers.default.url}/address/${account.address}`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <Icon icon="ph:link-bold" className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-800 font-medium">View on Explorer</span>
                    </a>

                    <button
                        onClick={copyToClipboard}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-200"
                    >
                        <Icon
                            icon={copySuccess ? "ph:check-bold" : "ph:copy-bold"}
                            className={`w-5 h-5 ${copySuccess ? "text-green-600" : "text-gray-600"}`}
                        />
                        <span className="text-gray-800 font-medium">
                            {copySuccess ? "Address Copied!" : "Copy Address"}
                        </span>
                    </button>

                    <a href="/" className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-200">
                        <Icon icon="ph:squares-four-bold" className="w-5 h-5 text-gray-600" />

                        Marketplace
                    </a>
                    <a className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-200"

                        href="/my-tokens"
                    >
                        <Icon icon="ph:wallet-bold" className="w-5 h-5 text-gray-600" />
                        My NFTs
                    </a>
                    <button
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-200"


                    >
                        <Icon icon="ph:plus-circle-bold" className="w-5 h-5 text-gray-600" />
                        Create
                    </button>

                    <div className="mx-4 my-2 border-t border-gray-200"></div>

                    <button
                        onClick={disconnect}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                        <Icon
                            icon="ph:power-bold"
                            className="w-5 h-5"
                        />
                        <span className="font-medium">Disconnect</span>
                    </button>
                </div>
            </Popover.Content>
        </Popover.Root>
    );
};

export default WalletConnection;