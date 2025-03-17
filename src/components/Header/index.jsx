import { Box, Flex, Text } from "@radix-ui/themes";
import React, {  useEffect } from "react";
import WalletConnection from "./WalletConnection";
import { useAccount } from "wagmi";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useAppContext } from "../../contexts/appContext";
import useMintToken from "../../hooks/useMintToken";

const Header = () => {
    const { address } = useAccount();
    const { setMyNFTpage } = useAppContext();
    const pathname = window.location.pathname;
    const mintToken = useMintToken();

    useEffect(() => {
        if (pathname === "/my-tokens") {
            setMyNFTpage(true);
        } else {
            setMyNFTpage(false);
        }
    },[pathname]);

    const NavLink = ({ href, icon, children }) => (
        <a
            href={href}

            className="text-secondary/90 hover:text-secondary font-medium transition-colors duration-200 flex items-center gap-1"
        >
            <Icon icon={icon} className="w-5 h-5" />
            {children}
        </a>
    );

    return (
        <Flex
            gap="3"
            as="header"
            width="100%"
            align="center"
            justify="between"
            className="bg-gradient-to-r from-primary to-primary/90 py-4 px-6 shadow-md items-center"
        >
            <Box>
                <Text
                    className="text-secondary font-bold text-2xl flex items-center gap-2"
                    as="span"
                    role="img"
                    aria-label="logo"
                >
                    <Icon icon="ph:cube-bold" className="w-7 h-7" />
                    MukitaVerse
                </Text>
            </Box>

            <Flex gap="6" align="center">
                {address && (
                    <nav className="hidden md:flex items-center gap-6">
                        <NavLink
                            href="/"
                        >
                            <Icon icon="ph:squares-four-bold" className="w-5 h-5 text-white-600" />
                            Marketplace
                        </NavLink>
                        <NavLink
                            href="/my-tokens"
                        >
                            <Icon icon="ph:wallet-bold" className="w-5 h-5 text-white-600" />
                            My NFTs
                        </NavLink>
                        <button
                            className="bg-primary/80 text-secondary font-semibold px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                            onClick={mintToken}

                        >
                            <Icon icon="ph:plus-circle-bold" className="w-5 h-5 text-white-600" />
                            Create
                        </button>
                    </nav>
                )}
                <WalletConnection />
            </Flex>
        </Flex>
    );
};

export default Header;