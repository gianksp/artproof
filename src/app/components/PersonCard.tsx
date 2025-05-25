"use client";
import Link from "next/link";
import { getImage, getParticipations, getRole } from "../utils";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export function PersonCard({ person, event }: { person: { id: string; name: string; role: string; image: string } }) {

  const { nfts, loading, error } = useSelector((state: RootState) => state.nft);
  
  const role = getRole(getParticipations(nfts), person.id, event.id)
  const data = role ? (
        <Link href={`/person/${person.id}`} className="block">
      <div className="flex items-center space-x-4 bg-white rounded-xl shadow p-4 hover:shadow-md transition">
        <img
          src={getImage(person?.metadata?.image)}
          alt={person?.metadata?.name}
          className="w-14 h-14 rounded-full object-cover"
        />
        <div>
          <p className="font-medium text-slate-800">{person?.metadata?.name}</p>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
    </Link>
  ) : (<></>);
  return data;
}
