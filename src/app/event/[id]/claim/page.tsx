"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getContract, sendTransaction } from "thirdweb";
import { avalancheFuji } from "thirdweb/chains";
import { mintTo } from "thirdweb/extensions/erc721";
import { useActiveWallet, useActiveAccount } from "thirdweb/react";
import { client } from "@/app/client";
import { upload } from "thirdweb/storage";

import NotificationPopup from "@/app/components/NotificationPopup";
import { useDispatch } from "react-redux";
import { fetchUserNFTs } from "@/app/store/productions";


export default function ClaimParticipation({ params }: { params: { id: string } }) {
    const [popup, setPopup] = useState<{
        open: boolean;
        type: "success" | "error";
        message: string;
        link?: string;
    }>({ open: false, type: "success", message: "" });

    const router = useRouter();
    const account = useActiveAccount();
    const wallet = useActiveWallet();
    const [isLoading, setLoading] = useState(false);

    const [form, setForm] = useState<{
        role: string
    }>({
        role: ""
    });

    const contract = getContract({
        address: process.env.NEXT_PUBLIC_PARTICIPATION_NFT!,
        chain: avalancheFuji,
        client,
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);

        try {
           
            console.log(localStorage.getItem("profileNft"));
            // return
            // Mint NFT
            const transaction = mintTo({
                contract,
                to: account.address,
                nft: {
                    name: "Participation",
                    description: "Participation",
                    // image: imageUri,
                    attributes: [
                        {
                            trait_type: "Event",
                            value: params.id,
                        },
                                                {
                            trait_type: "User",
                            value: localStorage.getItem("profileNft")//account.address,
                        },
                        {
                            trait_type: "Role",
                            value: form.role,
                        },
                    ]
                },
            });
            console.log(transaction)

            await sendTransaction({ transaction, account });
            setPopup({
                open: true,
                type: "success",
                message: "NFT minted successfully!",
                link: `https://testnet.snowtrace.io/tx/${transaction.hash}`,
            });
            const dispatch = useDispatch();
            dispatch(fetchUserNFTs())
            setTimeout(() => {
                router.push("/");
            }, 3000)
        } catch (err) {
            console.error("Minting failed:", err);
            setPopup({
                open: true,
                type: "error",
                message: `Minting failed: ${(err as Error).message}`,
            });

        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-100 py-12 px-4 sm:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6">
                    Claim Participation
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Role
                        </label>
                        <input
                            type="text"
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-olive"
                            placeholder="e.g. Future Sounds Vol. 3"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`mt-4 px-6 py-2 rounded-lg font-medium transition ${isLoading
                            ? "bg-gray-400 cursor-not-allowed text-white"
                            : "bg-brand-olive text-white hover:bg-brand-yellow"
                            }`}
                    >
                        {isLoading ? "Minting..." : "Claim Role"}
                    </button>
                </form>
            </div>
            <NotificationPopup
                open={popup.open}
                onClose={() => setPopup({ ...popup, open: false })}
                type={popup.type}
                message={popup.message}
                link={popup.link}
            />

        </main>
    );
}
