"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getContract, sendTransaction } from "thirdweb";
import { avalancheFuji } from "thirdweb/chains";
import { mintTo } from "thirdweb/extensions/erc721";
import { useActiveWallet, useActiveAccount } from "thirdweb/react";
import { client } from "../client";
import { upload } from "thirdweb/storage";

import NotificationPopup from "@/app/components/NotificationPopup";


export default function CreateProductionPage() {
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
        title: string;
        date: string;
        description: string;
        image: File | null;
    }>({
        title: "",
        date: "",
        description: "",
        image: null,
    });

    const contract = getContract({
        address: process.env.NEXT_PUBLIC_PRODUCTION_NFT!,
        chain: avalancheFuji,
        client,
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setForm((prev) => ({ ...prev, image: file }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.image || !account?.address) return;

        setLoading(true);

        try {
            // Upload image to IPFS
            // This uploads only the image and returns the IPFS URI
            const imageUri = await upload({
                client,
                files: [form.image], // form.image must be a File object
            });


            // Mint NFT
            const transaction = mintTo({
                contract,
                to: account.address,
                nft: {
                    name: form.title,
                    description: form.description,
                    image: imageUri,
                    attributes: [
                        {
                            trait_type: "Release Date",
                            value: form.date,
                        },
                    ]
                },
            });

            await sendTransaction({ transaction, account });
            setPopup({
                open: true,
                type: "success",
                message: "NFT minted successfully!",
                link: `https://testnet.snowtrace.io/tx/${transaction.hash}`,
            });
            setTimeout(() => {
                router.push("/");
            }, 2000)
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
                    Create New Production
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-olive"
                            placeholder="e.g. Future Sounds Vol. 3"
                        />
                    </div>

                    {/* Release Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Release Date
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={form.date}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-olive"
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Image File
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-olive"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            required
                            rows={5}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-olive"
                            placeholder="Describe the music, collaborators, or vibe..."
                        ></textarea>
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
                        {isLoading ? "Minting..." : "Submit & Mint NFT"}
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
