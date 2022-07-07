import { getAlchemy, getProvider, getSeaPort } from "./utils";
// @ts-ignore
import dotenv from "dotenv"
require('log-timestamp');

import { Network, getNftsForOwner } from '@alch/alchemy-sdk';
import { getAddress } from "ethers/lib/utils";

dotenv.config()
const env = process.env

const alchemy = getAlchemy(env.ALCHEMY_API_KEY!, Network.ETH_MAINNET, 10);
const provider = getProvider(env.PRIVATE_KEYS!.split(","), env.RPC_URL!)
const seaport = getSeaPort(provider, env.OS_API_KEY!)
const listPrice = parseFloat(env.PRICE!)
const contractAddress = getAddress(env.TOKEN_CONTRACT!)

async function main() {
    for (const addr of provider.getAddresses()) {
        const nfts = await getNftsForOwner(
            alchemy,
            addr,
            {
                contractAddresses: [contractAddress]
            },
        )
        //TODO Need to add page-check, now only first 100 NFT are fetching
        for (const nft of nfts.ownedNfts) {
            try {
                await seaport.createSellOrder(
                    {
                        asset: {
                            tokenId: nft.tokenId,
                            tokenAddress: contractAddress
                        },
                        accountAddress: addr,
                        startAmount: listPrice,
                    }
                )
                console.log(`[${addr}] Success list ${nft.tokenId} for ${listPrice}`)
                //TODO Need to check listing response
            }
            catch (error) {
                console.error(error)
            }
        }
    }
}

main()