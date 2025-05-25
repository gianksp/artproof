"use client";

import { useEffect, useState } from "react";
// import { events } from "@/app/lib/data";
import { EventCard } from "./components/EventCard";
import { HeroSection } from "./components/HeroSection";
import { getNFTs } from "thirdweb/extensions/erc721";
import { client } from "./client";
import { avalancheFuji } from "thirdweb/chains";
import { getContract, NFT } from "thirdweb";
import { fetchUserNFTs } from "./store/productions";
import { AsyncThunkAction, ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import type { RootState, AppDispatch } from "@/app/store/store";
import { useDispatch, useSelector } from "react-redux";
import { getProductions } from "./utils";


export default function HomePage() {

  const { nfts, loading, error } = useSelector((state: RootState) => state.nft);
  const events = getProductions(nfts);

  return (
    <main className="min-h-screen bg-brand-light">
      <div>
        {/* Hero Section */}
        <HeroSection />

        {/* Page Content */}

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-12 px-12">
          {/* {filtered.map((event) => (
            <EventCard key={event.id} event={event} />
          ))} */}
          {events?.map((event) => {
            return <EventCard key={event?.id} event={event} />
          })}
        </div>
      </div>
    </main>
  );
}

