
export const getImage = (uri: string) => {
    const img = uri?.replace("ipfs://", "https://ipfs.io/ipfs/");
    console.log(img)
    return img

}

export const getReleaseDate = (attrs: any[]) => {
    const elem = attrs.find((item: { name: string; }) => item.name === "Release Date");
    return elem.value;
}

export const getProductions = (nfts: any[]) => {
    const result = nfts.find((c: { contract: string; }) => c.contract.toLowerCase() === process.env.NEXT_PUBLIC_PRODUCTION_NFT?.toLowerCase());
    return result?.nfts ?? [];
}

export const getProfiles = (nfts: any[]) => {
    const result = nfts.find((c: { contract: string; }) => c.contract.toLowerCase() === process.env.NEXT_PUBLIC_PROFILE_NFT?.toLowerCase());
    return result?.nfts ?? [];
}

export const getParticipations = (nfts: any[]) => {
    const result = nfts.find((c: { contract: string; }) => c.contract.toLowerCase() === process.env.NEXT_PUBLIC_PARTICIPATION_NFT?.toLowerCase());
    return result?.nfts ?? [];
}
export const query = (data, eventId?: string, participantId?: string) => {
    //   const allEvents = getProductions(data);
    const allUsers = getProfiles(data);

    const allEvents = getProductions(data).map(event => {
        return {
            ...event,
            participants: allUsers,
        }
    });
    console.log(allEvents);
    return allEvents
};

export const participated = (data, uid, eid) => {
    const allParticipations = getParticipations(data);
    const userId = parseInt(uid);
    const eventId = parseInt(eid);

    return true;
}

export const getRole = (participations, uid, eventId) => {
    console.log(participations)
    console.log(uid)
    console.log(eventId)
  const match = participations.find((p) => {
    const attrMap = p.metadata.attributes.reduce((acc, attr) => {
      acc[attr.trait_type] = attr.value;
      return acc;
    }, {});

    return (
      parseInt(attrMap["User"]?.toLowerCase()) === parseInt(uid) &&
      parseInt(attrMap["Event"]) === parseInt(eventId)
    );
  });
  if (!match) return null;

  const roleAttr = match.metadata.attributes.find(
    (attr) => attr.trait_type === "Role"
  );

  return roleAttr?.value || null;
}