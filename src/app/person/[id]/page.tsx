"use client";

import { use } from "react";
import { events } from "@/app/lib/data";
import { useEffect, useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { getNFTs, balanceOf, getOwnedNFTs } from "thirdweb/extensions/erc721";
import { avalancheFuji } from "thirdweb/chains";
import { getContract } from "thirdweb";
import { client } from "@/app/client";
import { getImage, getParticipations, getProductions, getProfiles, getRole, query } from "@/app/utils";
import type { RootState, AppDispatch } from "@/app/store/store";
import { useDispatch, useSelector } from "react-redux";
import { EventCard } from "@/app/components/EventCard";

export default function PersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); // ✅ unwrap Promise

  const account = useActiveAccount();
  const personId = decodeURIComponent(id).toLowerCase();

  // const appearances = events
  //   .filter((event) =>
  //     event.people.some((person) => person.id.toLowerCase() === personId)
  //   )
  //   .map((event) => {
  //     const person = event.people.find((p) => p.id.toLowerCase() === personId);
  //     const others = event.people.filter((p) => p.id.toLowerCase() !== personId);
  //     return { event, person, others };
  //   });


  // if (appearances.length === 0) return <div className="p-10">Profile not found.</div>;



    const { nfts, loading, error } = useSelector((state: RootState) => state.nft);
    console.log(nfts)
    // console.log(nfts)
    const allProfiles = getProfiles(nfts);
    const allProductions = getProductions(nfts);
    const allParticipations = getParticipations(nfts);
    console.log(allProductions)
    // console.log(allProfiles)
    // console.log(id);
    // console.log(profile)
  const profile = allProfiles?.find((prof) => {
        // console.log(prof.id)
        // console.log(id)
        const value = parseInt(prof.id) === parseInt(id)
        // console.log(value)
        return value
      })

    console.log(query(nfts, null, id));
  // const profile = appearances[0].person;
  const [showChat, setShowChat] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  // console.log(profile)
  // const contract = getContract({
  //   address: process.env.NEXT_PUBLIC_PROFILE_NFT!,
  //   chain: avalancheFuji,
  //   client,
  // });

  // const loadProfile = async () => {
  //   const result = await getOwnedNFTs({
  //     contract,
  //     owner: personId, // must match exact checksum format
  //   });

  //   console.log(result)
  //   if (result.length > 0) {
  //     setProfile(result[0])
  //   }
  // }

  // useEffect(() => {
  //   if (account?.address) {
  //     loadProfile();
  //   }
  // }, [account?.address])

  useEffect(() => {
    const stored = localStorage.getItem(`chat_${profile?.id}`);
    if (stored) {
      setMessages(JSON.parse(stored));
    }
  }, [profile?.id]);

  const sendMessage = () => {
    if (!messageInput.trim()) return;
    const newMessages = [...messages, { sender: "You", text: messageInput.trim() }];
    setMessages(newMessages);
    localStorage.setItem(`chat_${profile?.id}`, JSON.stringify(newMessages));
    setMessageInput("");
  };
  console.log("-----")
  console.log(profile)
  console.log(id)
  return (
    <main className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="relative w-full h-[40vh] bg-black overflow-hidden">
        <img
          src={getImage(profile?.metadata?.image)}
          alt={profile?.metadata?.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
          <h1 className="text-4xl font-bold mb-2">{profile?.metadata?.name}</h1>
          <p className="text-lg text-gray-200">{profile?.metadata?.role}</p>
          <p className="text-xs text-gray-400">ID: {id}</p>
          {parseInt(localStorage.getItem('profileNft') || 10000) !== parseInt(id) && <button
            onClick={() => setShowChat(true)}
            className="mt-4 px-4 py-2 bg-brand-olive text-white rounded hover:bg-brand-yellow transition"
          >
            Message {profile?.metadata?.name}
          </button>}
        </div>
      </section>

      <section>
  <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-12 px-12">
                  {/* {filtered.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))} */}
                  {allProductions?.map((event) => {
                    const currentRole = getRole(allParticipations, id, event.id)
                    return currentRole ? (<EventCard key={event?.id} event={event} />) : (<></>)
                  })}
                </div>
              
      </section>
      {/* <section className="max-w-6xl mx-auto px-4 sm:px-8 py-12 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {allProductions.map(({ event, others }, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-5">
          <img
            src={getImage(event?.metadata?.image)}
            alt={event?.metadata?.name}
            className="w-full h-48 object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
            <h2 className="text-lg font-semibold text-slate-800 mb-1">
              <a href={`/event/${event?.id}`} className="text-brand-primary hover:text-brand-olive transition">
                {event?.metadata?.name}
              </a>
            </h2>
            <p className="text-sm text-gray-500 mb-2">
            {event?.metadata?.attributes && new Date(event?.metadata?.attributes[0].value).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
            </p>
            <p className="text-sm text-gray-700 mb-3 line-clamp-3">{event?.metadata?.description}</p>
            <p className="text-sm font-medium text-slate-700 mb-1">Collaborated with:</p>
            <div className="flex flex-wrap gap-2">
              {/* {others.map((p, idx) => (
                <a
                  key={idx}
                  href={`/person/${p.id}`}
                  className="text-xs px-3 py-1 bg-gray-100 rounded-full hover:bg-brand-olive hover:text-white transition"
                >
                  {p.name}
                </a>
              ))} 
            </div>
          </div>
        ))}
      </section>  */}

      {showChat && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm">
          <div className="bg-white shadow-xl rounded-t-xl border-t-4 border-brand-olive overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-brand-olive text-white">
              <div className="flex items-center space-x-2">
                <img
                  src={getImage(profile?.metadata?.image)}
                  alt={profile?.metadata?.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{profile?.metadata?.name}</p>
                  <p className="text-xs text-brand-yellow">{profile?.metadata?.role}</p>
                </div>
              </div>
              <button onClick={() => setShowChat(false)} className="text-xl hover:text-brand-yellow">×</button>
            </div>

            <div className="h-60 overflow-y-auto px-4 py-2 bg-gray-50 text-sm text-gray-800 space-y-2">
              {messages.map((msg, i) => (
                <div key={i} className={msg.sender === "You" ? "text-right" : "text-left"}>
                  <p>
                    <span className="font-semibold">{msg.sender}:</span> {msg.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t px-4 py-2 bg-white">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-olive"
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
