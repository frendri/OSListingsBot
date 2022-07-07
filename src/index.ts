import {getProvider, getSeaPort} from "./utils";
// @ts-ignore
import dotenv from "dotenv"
require('log-timestamp');

import { Network, initializeAlchemy, getNftsForOwner } from '@alch/alchemy-sdk';
import {getAddress} from "ethers/lib/utils";

dotenv.config()

const dotenvConfig = process.env

const settings = {
    apiKey: dotenvConfig.ALCHEMY_API_KEY!,
    network: Network.ETH_MAINNET,
    maxRetries: 10
};
const alchemy = initializeAlchemy(settings);


const provider = getProvider(dotenvConfig.PRIVATE_KEY!, dotenvConfig.RPC_URL!)
const userAddress = provider.getAddress(0)
const listPrice = parseFloat(dotenvConfig.PRICE!)
const contractAddress = getAddress(dotenvConfig.TOKEN_CONTRACT!)
const seaport = getSeaPort(provider, dotenvConfig.OS_API_KEY!)


async function main() {
    const myNfts = await getNftsForOwner(
        alchemy,
        userAddress,
        {
            contractAddresses: [contractAddress]
        })
    //TODO Need to add page-check, now only first 100 NFT are fetching
    for (const myNft of myNfts.ownedNfts) {
        try {
            await seaport.createSellOrder(
                {
                    asset: {
                        tokenId: myNft.tokenId,
                        tokenAddress: contractAddress
                    },
                    accountAddress: userAddress,
                    startAmount: listPrice
                }
            )
            console.log('Success list', myNft.tokenId, 'for', listPrice)
            //TODO Need to check listing response
        }
        catch (error) {
            console.error(error)
        }
    }
}

main()