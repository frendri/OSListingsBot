import HDWalletProvider = require("@truffle/hdwallet-provider");
import {Network, OpenSeaPort} from 'opensea-js'

export function getProvider(privateKey: string, rpcUrl: string) : HDWalletProvider {
    return new HDWalletProvider({
        privateKeys: [
            privateKey
        ],
        providerOrUrl: rpcUrl
    })
}

export function getSeaPort(provider: HDWalletProvider, apiKey: string) : OpenSeaPort {
    return new OpenSeaPort(provider, {
        networkName: Network.Main,
        apiKey: apiKey,
    },(arg) => console.log(arg))
}