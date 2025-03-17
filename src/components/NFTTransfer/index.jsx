import React, { useState } from 'react';
import { Dialog, Flex } from "@radix-ui/themes";

const NFTTransfer = () => {
    const [tokenID, setTokenID] = useState('');
    const [recipientAddress, setRecipientAddress] = useState('');

    const handleTransfer = () => {

        console.log(`Transferring token ID ${tokenID} to ${recipientAddress}`);
    };

    return (
        <Dialog.Root>
            <Dialog.Trigger>
                <button className="bg-secondary text-primary px-4 py-2 rounded-md cursor-pointer">
                    Transfer NFT Token
                </button>
            </Dialog.Trigger>

            <Dialog.Content maxWidth="450px">
                <Dialog.Title className="text-primary">
                    Transfer NFT Token
                </Dialog.Title>

                <Flex direction="column" gap="3">
                    <div>
                        <h2>Transfer NFT Token</h2>
                        <input
                            type="text"
                            placeholder="Token ID"
                            value={tokenID}
                            onChange={(e) => setTokenID(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Recipient Address"
                            value={recipientAddress}
                            onChange={(e) => setRecipientAddress(e.target.value)}
                        />
                        <button onClick={handleTransfer}>Transfer</button>
                    </div>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>


    );
};

export default NFTTransfer;