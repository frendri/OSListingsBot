import { Network as alchemyNetwork, initializeAlchemy, Alchemy } from "@alch/alchemy-sdk";
import HDWalletProvider = require("@truffle/hdwallet-provider");
import { Network as openseaNetwork, OpenSeaPort } from 'opensea-js'

export function getAlchemy(apiKey: string, network: alchemyNetwork, maxRetries: number): Alchemy {
    return initializeAlchemy({
        apiKey: apiKey!,
        network: network,
        maxRetries: maxRetries,
    })
}

export function getProvider(privateKeys: string[], rpcUrl: string): HDWalletProvider {
    return new HDWalletProvider({
        privateKeys: privateKeys,
        providerOrUrl: rpcUrl
    })
}

export function getSeaPort(provider: HDWalletProvider, apiKey: string): OpenSeaPort {
    return new OpenSeaPort(provider, {
        networkName: openseaNetwork.Main,
        apiKey: apiKey,
    }, (arg) => console.log(arg))
}