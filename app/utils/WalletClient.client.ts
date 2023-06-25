import albedo from "@albedo-link/intent";
import {
  getPublicKey as freighterPublicKey,
  signTransaction as signTx,
} from "@stellar/freighter-api";
import { SignClient } from "@walletconnect/sign-client";
import type { Provider, Network } from "~/types";

enum WalletConnectChains {
  PUBLIC = "stellar:pubnet",
  TESTNET = "stellar:testnet",
}

enum WalletConnectMethods {
  SIGN = "stellar_signXDR",
  SIGN_AND_SUBMIT = "stellar_signAndSubmitXDR",
}

class WalletClient {
  provider: Provider;
  network: Network;
  client: any;
  session: any;
  approval: any;
  uri: any;
  horizon_url: string | null;
  //chain: "stellar:testnet" | "stellar:pubnet" | null;
  chain: WalletConnectChains | null;

  constructor(provider: Provider, network: Network) {
    this.provider = provider;
    this.network = network;
    this.client = null;
    this.session = null;
    this.approval = null;
    this.uri = null;
    this.horizon_url = null;
    this.chain = null;
  }

  async getPublicKey() {
    const { provider } = this;
    try {
      // const { provider, timestamp } = provider
      let publicKey = "";
      if (provider === "albedo") {
        publicKey = await this.getAlbedoKey();
      } else if (provider === "rabet") {
        publicKey = await this.getRabetKey();
      } else if (provider === "freighter") {
        publicKey = await this.getFreighterKey();
      } else if (provider === "x_bull") {
        publicKey = await this.getXBullKey();
      } else if (provider === "wallet_connect") {
        publicKey = await this.getWalletConnectKey();
      }
      if (publicKey.length === 0)
        throw new Error(`Public key not found at ${provider}`);
      return { publicKey, message: "OK", code: 200 };
    } catch (error: any) {
      const { message, code } = error ?? { message: "Error", code: 500 };
      return { message, code };
    }
  }

  async signTransaction(xdr: string, submit: boolean = false) {
    const { provider } = this;
    if (this.horizon_url === null) this.setHorizonUrl()
    try {
      if (provider === "albedo") {
        return await this.signAlbedo(xdr, submit);
      } else if (provider === "rabet") {
        return await this.signRabet(xdr, submit);
      } else if (provider === "freighter") {
        return await this.signFreighter(xdr, submit);
      } else if (provider === "x_bull") {
        return await this.signXBull(xdr, submit);
      } else if (provider === "wallet_connect") {
        return await this.signWalletConnect(xdr, submit);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async restoreSession() {
    await this.initWalletConnectClient()
    this.setHorizonUrl()
    this.setWalletConnectChain()
    const lastKeyIndex = this.client.session.getAll().length - 1;
    this.session = this.client.session.getAll()[lastKeyIndex];
  }

  private async submitTx(xdr: string) {
    const txThresholds = encodeURIComponent(xdr);
    return await (
      await fetch(`https://${this.horizon_url}/transactions/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: `tx=${txThresholds}`,
      })
    ).json();
  }

  private async signAlbedo(xdr: string, submit: boolean) {
    const { network } = this;
    const { signed_envelope_xdr } = await albedo.tx({
      xdr,
      network,
      submit: false,
    });
    if (submit) {
      const response = await this.submitTx(signed_envelope_xdr);
      return { horizonResult: response };
    } else {
      return { xdr, signed_envelope_xdr };
    }
  }

  private async signFreighter(xdr: string, submit: boolean) {
    const { network } = this;
    const signed_envelope_xdr = await signTx(xdr, { network });
    if (submit) {
      const response = await this.submitTx(signed_envelope_xdr);
      return { horizonResult: response };
    } else {
      return { xdr, signed_envelope_xdr };
    }
  }

  private async signRabet(xdr: string, submit: boolean) {
    const { network } = this;
    const w: any = window;
    if (w.rabet) {
      const { xdr: signed_envelope_xdr } = await w.rabet.sign(xdr, network);
      if (submit) {
        const response = await this.submitTx(signed_envelope_xdr);
        return { horizonResult: response };
      } else {
        return { xdr, signed_envelope_xdr };
      }
    }
  }

  private async signXBull(xdr: string, submit: boolean) {
    const { network } = this;
    const w: any = window;
    const publicKey = await w.xBullSDK.getPublicKey();
    if (w.xBullSDK) {
      const signed_envelope_xdr = await w.xBullSDK.signXDR(xdr, network, publicKey);
      if (submit) {
        const response = await this.submitTx(signed_envelope_xdr);
        return { horizonResult: response };
      } else {
        return { xdr, signed_envelope_xdr };
      }
    }
    // should there be error handling here?
  }

  private async getAlbedoKey() {
    const { pubkey } = (await albedo.publicKey({})) ?? {};
    return pubkey;
  }

  private async getXBullKey() {
    const w: any = window;
    let publicKey = "";
    if (w.xBullSDK) {
      await w.xBullSDK.connect({
        canRequestPublicKey: true,
        canRequestSign: true
      }).then(async () => {
       publicKey = await w.xBullSDK.getPublicKey();
      });
    }
  }

  private async getRabetKey() {
    const w: any = window;
    if (w.rabet) {
      return w.rabet.connect().then(({ publicKey }: any) => publicKey);
    }
  }

  private async getFreighterKey() {
    return await freighterPublicKey();
  }

  private async getWalletConnectKey() {
    this.session = await this.getApproval();
    const allNamespaceAccounts = Object.values(this.session.namespaces)
      .map((namespace: any) => namespace.accounts)
      .flat();
    const publicKey = allNamespaceAccounts[0].replace(`${this.chain}:`, "");

    return publicKey.toUpperCase();
  }

  private async getApproval() {
    return await this.approval();
  }

  private async signWalletConnect(xdr: string, submit: boolean = false) {
    if (this.client === null) return { message: "WalletConnect not connected", code: 500 };
    // Check if the XDR is valid.
    const { signedXDR: signed_envelope_xdr } = await this.client.request({
      topic: this.session.topic,
      chainId: this.chain,
      request: {
        id: 1,
        jsonrpc: "2.0",
        method: "stellar_signXDR",
        params: {
          xdr,
        },
      },
    });
    if (submit) {
      const response = await this.submitTx(signed_envelope_xdr);
      return { horizonResult: response };
    } else {
      return { xdr, signed_envelope_xdr };
    }
  }

  async initWalletConnect() {
    // make them env variables
    try {
      await this.initWalletConnectClient()

      const { uri, approval } = await this.createConnection();

      this.uri = uri;
      this.approval = approval;

      return { uri, approval };
    } catch (error) {
      console.error("Error in WalletConnect init: ", error);
    }
  }

  private async initWalletConnectClient() {
    try {
      this.client = await SignClient.init({
        projectId: "de5dffb20a999465a31bef12a0defd9b",
        metadata: {
          name: "CommuuniDAO",
          url: "my-auth-dapp.com",
          description: "CommuniDAO is the Stellar Dao Discord Bot",
          icons: [
            "https://cdn.discordapp.com/attachments/1094354605401460896/1094354605887996104/StellarDiscordDaoBot.png",
          ],
        },
      });
    } catch (error) {
      console.error("Error in WalletConnect init: ", error);
    } 
  }
  private setWalletConnectChain() {
    this.chain =
    this.network === "TESTNET"
      ? WalletConnectChains.TESTNET
      : WalletConnectChains.PUBLIC;
  }

  private setHorizonUrl() {
    this.horizon_url =
    this.network === "TESTNET"
      ? "horizon-testnet.stellar.org"
      : "horizon.stellar.org";
  }
  

  private async createConnection() {
    if (this.client === null) return { message: "Client not initialized" }
    this.setWalletConnectChain()

    const { uri, approval } = await this.client.connect({
      requiredNamespaces: {
        stellar: {
          methods: [WalletConnectMethods.SIGN],
          chains: [this.chain],
          events: [],
        },
      },
    });
    return { uri, approval };
  }
}

export { WalletClient };
