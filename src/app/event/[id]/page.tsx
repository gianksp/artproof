"use client";
import { useRouter } from "next/navigation";

import { events } from "@/app/lib/data";
import { PersonCard } from "@/app/components/PersonCard";
import { useEffect, useState } from "react";
import { getContract, Insight } from "thirdweb";
import { avalancheFuji } from "thirdweb/chains";
import { client } from "@/app/client";
import { useActiveAccount } from "thirdweb/react";
import { getImage, getProductions, getProfiles } from "@/app/utils";
import { getNFT } from "thirdweb/extensions/erc721";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
export default function EventPage({ params }: { params: { id: string } }) {
    //   const event = events.find((e) => e.id.toString() === params.id);
    //   if (!event) return <div className="p-8">Event not found.</div>;
    const account = useActiveAccount();
    // const [event, setEvent] = useState();
    // const contract = getContract({
    //     address: process.env.NEXT_PUBLIC_PRODUCTION_NFT,
    //     chain: avalancheFuji,
    //     client,
    // });

    const router = useRouter();



    // const loadProfile = async () => {
    //     console.log(params.id)
    //     const nft = await getNFT({
    //         contract,
    //         tokenId: params.id,
    //     });
    //     console.log(nft)
    //     if (nft) {
    //         setEvent(nft)
    //     }
    // }

    // useEffect(() => {
    //     loadProfile();
    // }, [])


    const { nfts, loading, error } = useSelector((state: RootState) => state.nft);
    const allEvents = getProductions(nfts)
    const event = allEvents.find((e) => parseInt(e.id) === parseInt(params.id))
    const users = getProfiles(nfts)
    const handleClaim = () => {
        router.push(`/event/${event.id}/claim`);
    };
    // console.log(evt)
    return (
        <main className="min-h-screen bg-gray-100">
            {/* Hero Banner */}
   <section className="relative w-full h-[50vh] overflow-hidden flex items-center justify-center">
  <img
    src={getImage(event?.metadata?.image)}
    alt={event?.metadata?.name}
    className="absolute inset-0 w-full h-full object-cover"
  />
  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
  
  <div className="relative z-10 text-center text-white px-4 max-w-2xl">
    <h1 className="text-4xl sm:text-5xl font-bold mb-3">
      {event?.metadata?.name}
    </h1>
    <p className="text-sm sm:text-base text-gray-200 mb-4">
      {event?.metadata?.attributes && new Date(event?.metadata?.attributes[0].value).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}
    </p>
    <button
      onClick={handleClaim}
      className="px-6 py-2 text-sm font-medium rounded-lg bg-brand-olive text-white hover:bg-brand-yellow transition"
    >
      Claim Participation
    </button>
  </div>
</section>


            {/* Details Section */}
            <section className="max-w-5xl mx-auto px-4 sm:px-8 py-12">
                <div className="bg-white rounded-2xl shadow-md p-6 mb-10">
                    <h2 className="text-xl font-semibold text-slate-800 mb-4">About the Production</h2>
                    <p className="text-base text-gray-700 leading-relaxed">{event?.metadata?.description}</p>
                </div>

                <div className="bg-white rounded-2xl shadow-md p-6">
                    <h2 className="text-xl font-semibold text-slate-800 mb-4">Collaborators</h2>
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                        {users.map((person, idx) => (
              <PersonCard key={idx} person={person} event={event}/>
            ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
