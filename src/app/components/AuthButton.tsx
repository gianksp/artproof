import "../globals.css";
import Link from "next/link";
import { useActiveAccount, darkTheme, lightTheme, ThirdwebProvider, ConnectButton } from "thirdweb/react";
import { client } from "../client";
import { avalancheFuji } from "thirdweb/chains";
import { useRouter } from "next/navigation";
import { getNFTs, balanceOf, getOwnedNFTs } from "thirdweb/extensions/erc721";
import { getContract } from "thirdweb";
import { useEffect, useState } from "react";
import { profile } from "node:console";

export const AuthButton = () => {
    const account = useActiveAccount();
    const [profileNft, setProfileNft] = useState({})

    const contract = getContract({
        address: process.env.NEXT_PUBLIC_PROFILE_NFT!,
        chain: avalancheFuji,
        client,
    });

    const loadProfile = async () => {
        const result = await getOwnedNFTs({
            contract,
            owner: account?.address?.toLowerCase(), // must match exact checksum format
        });

        console.log(result)
        if (result.length > 0) {
            setProfileNft(result[0]);
            localStorage.setItem("profileNft", result[0].id.toString());
        } else {
            setProfileNft(null);
            localStorage.removeItem("profileNft");
        }
    }

    useEffect(() => {
        if (account?.address) {
            loadProfile();
        }
    }, [account?.address])

    const router = useRouter();
    console.log(profileNft)
    return (
        <ConnectButton client={client}
            chain={avalancheFuji}
            // auth={{
            // isLoggedIn: async (address) => {
            //   console.log("checking if logged in!", { address });
            //   return await isLoggedIn();
            // },
            // doLogin: async (params) => {
            //   console.log("logging in!");
            //   await login(params);
            // },
            // getLoginPayload: async ({ address }) =>
            //   generatePayload({ address }),
            // doLogout: async () => {
            //   console.log("logging out!");
            //   await logout();
            // },
            // }}
            theme={lightTheme({
                // colors: {
                //   modalBg: "red",
                // },
            })}
            detailsModal={{
                footer: ({ close }) => (
                    <div className="pt-3 border-t mt-4 text-sm">
                        {profileNft && <button
                            onClick={() => {
                                router.push(`/person/${profileNft?.id}`);
                                close();
                            }}
                            className="text-brand-olive hover:text-brand-yellow transition"
                        >
                            <span className="px-4 text-lg">👤 Manage Profile</span>
                        </button>}
                        {!profileNft && <button
                            onClick={() => {
                                router.push(`/person/create`);
                                close();
                            }}
                            className="text-brand-olive hover:text-brand-yellow transition"
                        >
                            <span className="px-4 text-lg">👤 Create Profile</span>
                        </button>}
                    </div>
                ),
            }}
        />
    )
}