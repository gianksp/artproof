// store/nftSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getContract, type NFT } from "thirdweb";
import { getNFTs } from "thirdweb/extensions/erc721";
import { avalancheFuji } from "thirdweb/chains";
import { client } from "@/app/client";

const CONTRACTS = [
  process.env.NEXT_PUBLIC_PROFILE_NFT!,
  process.env.NEXT_PUBLIC_PRODUCTION_NFT!,
  process.env.NEXT_PUBLIC_PARTICIPATION_NFT!,
];

export const fetchUserNFTs = createAsyncThunk(
  "nft/fetchUserNFTs",
  async () => {
    const results = await Promise.all(
      CONTRACTS.map(async (contractAddress) => {
        const contract = getContract({
          address: contractAddress,
          chain: avalancheFuji,
          client,
        });
        try {
          const nfts = await getNFTs({ contract, start:0, count: 100});
          return { contract: contractAddress, nfts };
        } catch (err) {
          console.error("Failed to load from", contractAddress, err);
          return { contract: contractAddress, nfts: [] };
        }
      })
    );
    return results;
  }
);

interface NFTState {
  nfts: { contract: string; nfts: NFT[] }[];
  loading: boolean;
  error: string | null;
}

const initialState: NFTState = {
  nfts: [],
  loading: false,
  error: null,
};

const nftSlice = createSlice({
  name: "nft",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserNFTs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserNFTs.fulfilled, (state, action) => {
        state.loading = false;
        state.nfts = action.payload;
      })
      .addCase(fetchUserNFTs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch NFTs";
      });
  },
});

export default nftSlice.reducer;
