import { Icon } from "@iconify/react/dist/iconify.js";
import { formatEther } from "ethers";
import React, { useState, useEffect } from 'react';
import { truncateString } from "../../utils";
import { Contract } from "ethers";
import NFT_ABI from "../../ABI/nft.json";
import { getEthersSigner } from "../../config/wallet-connection/adapter";
import { useConfig } from "wagmi";
import { Dialog, Flex } from "@radix-ui/themes";

const BaseNFTCard = ({ metadata, children }) => {
    return (
        <div className="w-full space-y-4 rounded-xl bg-secondary shadow-sm border border-primary p-4 transition-all hover:shadow-md">
            <div className="relative overflow-hidden rounded-xl">
                <img
                    src={metadata.image}
                    alt={`${metadata.name} image`}
                    className="rounded-xl w-full h-64 object-cover transition-transform hover:scale-105"
                />
            </div>

            <h1 className="font-bold text-lg">{metadata.name}</h1>

            <p className="text-sm text-gray-600">
                {truncateString(metadata.description, 100)}
            </p>

            <div className="flex gap-2 items-center text-gray-700">
                <Icon icon="ri:file-list-3-line" className="w-5 h-5" />
                <span>{metadata.attributes.length} Attributes</span>
            </div>

            {children}
        </div>
    );
};

export const NFTCard = ({ metadata, mintPrice, tokenId, nextTokenId, mintNFT }) => {
    const [isMinting, setIsMinting] = useState(false);
    const [mintStatus, setMintStatus] = useState(null);

    const handleMint = async () => {
        setIsMinting(true);
        setMintStatus(null);
        try {
            await mintNFT();
            setMintStatus('success');
            setTimeout(() => setMintStatus(null), 3000);
        } catch (error) {
            console.error("Mint failed:", error);
            setMintStatus('error');
        } finally {
            setIsMinting(false);
        }
    };

    const isOwned = Number(nextTokenId) > tokenId;
    const canMint = Number(nextTokenId) === tokenId;

    return (
        <BaseNFTCard metadata={metadata}>
            <div className="flex gap-2 items-center">
                <Icon icon="ri:eth-line" className="w-5 h-5" />
                <span className="font-medium">{`${formatEther(mintPrice)} ETH`}</span>
            </div>

            {mintStatus === 'success' && (
                <div className="p-2 bg-green-100 rounded-md text-green-800 text-center">
                    NFT minted successfully!
                </div>
            )}

            {mintStatus === 'error' && (
                <div className="p-2 bg-red-100 rounded-md text-red-800 text-center">
                    Failed to mint NFT
                </div>
            )}

            <button
                disabled={!canMint || isMinting}
                onClick={handleMint}
                className={`w-full p-4 rounded-md text-white font-bold transition-colors
          ${isOwned ? 'bg-green-500' : canMint ? 'bg-primary/80 hover:bg-primary' : 'bg-gray-400'} 
          disabled:bg-gray-400 disabled:cursor-not-allowed`}
            >
                {isMinting ? (
                    <span className="flex items-center justify-center gap-2">
                        <Icon icon="eos-icons:loading" className="animate-spin w-5 h-5" />
                        Minting...
                    </span>
                ) : isOwned ? (
                    "Owned"
                ) : (
                    "Mint NFT"
                )}
            </button>
        </BaseNFTCard>
    );
};

export const NFTOwnerCard = ({ metadata, tokenId }) => {
    const [owner, setOwner] = useState("");
    const [isOwner, setIsOwner] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [isTransferring, setIsTransferring] = useState(false);
    const [recipientAddress, setRecipientAddress] = useState("");
    const [tokenID, setTokenID] = useState(tokenId);
    const [transferStatus, setTransferStatus] = useState(null);
    const [transferError, setTransferError] = useState("");
    const wagmiConfig = useConfig();

    const getContract = async () => {
        try {
            const signer = await getEthersSigner(wagmiConfig);
            const contract = new Contract(
                import.meta.env.VITE_NFT_CONTRACT_ADDRESS,
                NFT_ABI,
                signer
            );
            return { contract, signer };
        } catch (error) {
            console.error("Failed to get contract:", error);
            throw error;
        }
    };

    const checkOwner = async () => {
        setIsLoading(true);
        try {
            const { contract, signer } = await getContract();
            const ownerAddress = await contract.ownerOf(tokenId);
            const account = await signer.getAddress();

            setOwner(ownerAddress);
            setIsOwner(ownerAddress.toLowerCase() === account.toLowerCase());
        } catch (error) {
            console.error("Error checking owner:", error);
            setIsOwner(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTransfer = async () => {
        setTransferError("");
        setTransferStatus(null);
        setIsTransferring(true);

        try {
            const { contract, signer } = await getContract();

            if (isOwner) {
                const signerAddress = await signer.getAddress();

                if (!recipientAddress || !recipientAddress.startsWith("0x")) {
                    throw new Error("Invalid recipient address");
                }

                const tx = await contract.transferFrom(signerAddress, recipientAddress, tokenID);
                await tx.wait();

                setTransferStatus('success');
                setTimeout(() => {
                    setIsOpen(false);
                    setTransferStatus(null);
                }, 2000);

                setIsOwner(false);
                setOwner(recipientAddress);
            }
        } catch (error) {
            console.error("Transfer error:", error);
            setTransferError(error.message || "Transfer failed");
            setTransferStatus('error');
        } finally {
            setIsTransferring(false);
        }
    };

    useEffect(() => {
        checkOwner();

        const setupTransferEvent = async () => {
            try {
                const { contract } = await getContract();
                contract.on("Transfer", (from, to, transferredTokenId) => {
                    if (transferredTokenId.toString() === tokenId.toString()) {
                        checkOwner(); 
                    }
                });

                return () => {
                    contract.removeAllListeners("Transfer");
                };
            } catch (error) {
                console.error("Failed to setup event listener:", error);
            }
        };

        setupTransferEvent();
    }, [tokenId]);

    if (isLoading) {
        return (
            <div className="w-full h-64 rounded-xl bg-secondary shadow-sm border border-primary p-4 flex items-center justify-center">
                <Icon icon="eos-icons:loading" className="animate-spin w-10 h-10 text-primary" />
            </div>
        );
    }

    if (!isOwner) return null;

    return (
        <BaseNFTCard metadata={metadata}>
            <div className="flex gap-2 items-center">
                <Icon icon="ri:file-list-3-line" className="w-5 h-5" />
                <span>{`Token ID: ${Number(tokenId)}`}</span>
            </div>

            <div className="flex gap-2 items-center">
                <Icon icon="ri:user-3-line" className="w-5 h-5" />
                <span className="truncate">{`Owner: ${owner.slice(0, 6)}...${owner.slice(-4)}`}</span>
            </div>

            <div className="flex flex-col gap-2">
                <div className="p-2 bg-green-100 rounded-md text-green-800 text-center">
                    You own this NFT
                </div>

                <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
                    <Dialog.Trigger>
                        <button className="w-full p-4 bg-primary/80 rounded-md text-white font-bold hover:bg-primary transition-colors">
                            Transfer NFT
                        </button>
                    </Dialog.Trigger>

                    <Dialog.Content maxWidth="450px" className="p-6">
                        <Dialog.Title className="text-primary text-xl font-bold mb-4">
                            Transfer NFT
                        </Dialog.Title>

                        <Flex direction="column" gap="3">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Token ID</label>
                                    <input
                                        type="text"
                                        value={tokenID}
                                        readOnly
                                        className="w-full p-3 border rounded bg-gray-100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Recipient Address</label>
                                    <input
                                        type="text"
                                        placeholder="0x..."
                                        value={recipientAddress}
                                        onChange={(e) => setRecipientAddress(e.target.value)}
                                        className="w-full p-3 border rounded focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                    />
                                </div>

                                {transferStatus === 'success' && (
                                    <div className="p-3 bg-green-100 text-green-800 rounded-md text-sm">
                                        NFT transferred successfully!
                                    </div>
                                )}

                                {transferStatus === 'error' && (
                                    <div className="p-3 bg-red-100 text-red-800 rounded-md text-sm">
                                        {transferError}
                                    </div>
                                )}

                                <div className="flex gap-2 mt-4">
                                    <Dialog.Close>
                                        <button className="flex-1 p-3 bg-gray-200 rounded-md font-medium">
                                            Cancel
                                        </button>
                                    </Dialog.Close>

                                    <button
                                        onClick={handleTransfer}
                                        disabled={isTransferring || !recipientAddress}
                                        className="flex-1 p-3 bg-primary rounded-md text-white font-bold disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        {isTransferring ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <Icon icon="eos-icons:loading" className="animate-spin w-5 h-5" />
                                                Transferring...
                                            </span>
                                        ) : (
                                            "Transfer"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </Flex>
                    </Dialog.Content>
                </Dialog.Root>
            </div>
        </BaseNFTCard>
    );
};