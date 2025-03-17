import { Box, Flex, Text, Grid, Link } from "@radix-ui/themes";
import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

const Footer = () => {
    return (
        <Flex
            direction="column"
            as="footer"
            width="100%"
            className="border-t border-primary bg-secondary py-8 mt-auto"
        >
            <Grid columns="3" gap="4" className="container mx-auto px-4">
                <Box className="space-y-3">
                    <Text className="text-primary font-bold text-lg mb-2">MukitaVerse</Text>
   
                    <Flex gap="3" className="mt-4">
                        <Link href="#" className="text-primary hover:text-primary/80">
                            <Icon icon="ri:twitter-fill" className="w-5 h-5" />
                        </Link>
                        <Link href="#" className="text-primary hover:text-primary/80">
                            <Icon icon="ri:discord-fill" className="w-5 h-5" />
                        </Link>
                        <Link href="#" className="text-primary hover:text-primary/80">
                            <Icon icon="ri:github-fill" className="w-5 h-5" />
                        </Link>
                    </Flex>
                </Box>

                <Box className="space-y-3">
                    <Text className="text-primary font-bold text-lg mb-2">Navigation</Text>
                    <Flex direction="column" gap="2">
                        <Link href="/" className="text-sm text-gray-600 hover:text-primary">
                            Home
                        </Link>
                        <Link href="/" className="text-sm text-gray-600 hover:text-primary">
                            Marketplace
                        </Link>
                        <Link href="/my-tokens" className="text-sm text-gray-600 hover:text-primary">
                            My Collection
                        </Link>
                    </Flex>
                </Box>

                <Box className="space-y-3">
                    <Text className="text-primary font-bold text-lg mb-2">Support</Text>
                    <Flex direction="column" gap="2">
                        <Link href="/faq" className="text-sm text-gray-600 hover:text-primary">
                            FAQ
                        </Link>
                        <Link href="/docs" className="text-sm text-gray-600 hover:text-primary">
                            Documentation
                        </Link>
                        <Link href="/contact" className="text-sm text-gray-600 hover:text-primary">
                            Contact Us
                        </Link>
                    </Flex>
                </Box>
            </Grid>

            <Flex
                justify="between"
                align="center"
                className="border-t border-gray-200 mt-6 pt-6 container mx-auto px-4"
            >
                <Text className="text-sm text-gray-600">
                    &copy; {new Date().getFullYear()} Cohort XII. All rights reserved.
                </Text>
                <Flex gap="4">
                    <Link href="/terms" className="text-xs text-gray-500 hover:text-primary">
                        Terms of Service
                    </Link>
                    <Link href="/privacy" className="text-xs text-gray-500 hover:text-primary">
                        Privacy Policy
                    </Link>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default Footer;