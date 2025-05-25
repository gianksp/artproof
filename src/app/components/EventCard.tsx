"use client";
import Link from "next/link";
import { getImage, getReleaseDate } from "../utils";

export function EventCard({ event }: { event: any }) {
  
  
  const card =   event?.metadata?.image ? (<Link href={`/event/${event.id}`} className="block group">
      <div className="rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-md hover:shadow-xl transition duration-300 ease-in-out">
        <div className="relative">
          <img
            src={getImage(event?.metadata?.image)}
            alt={event?.metadata?.title}
            className="w-full h-48 object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
          <div className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm px-2 py-1 text-xs rounded-full text-gray-600">
            {/* {n} */}
            {event?.metadata?.attributes && new Date(event?.metadata?.attributes[0].value).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        </div>
        <div className="p-4 space-y-2">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-800 group-hover:text-brand-olive transition-colors">
            {event?.metadata?.name}
          </h2>
          <p className="text-sm text-gray-600 line-clamp-3">{event?.metadata?.description}</p>
        </div>
      </div>
    </Link>) : (<></>);
  return card;
}
