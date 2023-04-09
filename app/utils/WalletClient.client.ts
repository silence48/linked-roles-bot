import albedo from '@albedo-link/intent';
import { getPublicKey, signTransaction as signTx } from '@stellar/freighter-api';

type Client = 'albedo' | 'rabet' | 'freighter' | 'wallet_connect'
type Network = 'TESTNET'

// Wallet Connect
// Every ACTION means print a QR

class WalletClient {
  name: Client
  network: Network

  constructor(name: Client, network: Network) {
    this.name = name
    this.network = network
  }

  async getPublicKey() {
    const { name } = this
    try {
      // const { name, timestamp } = provider
      if (name === 'albedo') {
        return await this.getAlbedoKey()
      } else if (name === 'rabet') {
        return await this.getRabetKey()
      } else if (name === 'freighter') {
        return await this.getFreighterKey()
      } else if (name === 'wallet_connect') {
        return await this.getFreighterKey()
      }
    } catch (error) {
      console.log(error)
    }
  }

  async signTransaction(txXDR: string, submit: boolean = false) {
    const { name } = this
    try {
      if (name === 'albedo') {
        return await this.signAlbedo(txXDR, submit)
      } else if (name === 'rabet') {
        return await this.signRabet(txXDR, submit)
      } else if (name === 'freighter') {
        return await this.signFreighter(txXDR, submit)
      } else if (name === 'wallet_connect') {
        return await this.signFreighter(txXDR, submit)
      }
    } catch (error) {
      console.log(error)
    }
  }


  private async submitTx(xdr: string) {
    const { network } = this
    const txThresholds = encodeURIComponent(xdr);
    return await (await fetch(`https://horizon-testnet.stellar.org/transactions/`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }, body: `tx=${txThresholds}` })).json()
  }

  private async signAlbedo(xdr: string, submit: boolean) {
    const { network } = this
    const { signed_envelope_xdr } = await albedo.tx({xdr, network, submit: false})
    if (submit) {
      const response = await this.submitTx(signed_envelope_xdr)
      return { horizonResult: response }
    } else {
      return { xdr, signed_envelope_xdr }
    }
  }

  private async signFreighter(xdr: string, submit: boolean) {
    const { network } = this
    const signed_envelope_xdr = await signTx(xdr, { network })
    if (submit) {
      const response = await this.submitTx(signed_envelope_xdr)
      return { horizonResult: response }
    } else {
      return { xdr, signed_envelope_xdr }
    }
  }

  private async signRabet(xdr: string, submit: boolean) {
    const { network } = this
    const w: any = window;
    if (w.rabet) {
      const { xdr:  signed_envelope_xdr } = await w.rabet.sign(xdr, network)
      if (submit) {
        const response = await this.submitTx(signed_envelope_xdr)
        return { horizonResult: response }
      } else {
        return { xdr, signed_envelope_xdr }
      }
    } 
  }

  private async signXBull() {

  }

  private async getAlbedoKey() {
    return await albedo.publicKey({})
  }

  private async getXBullKey() {

  }

  private async getRabetKey() {
    const w: any = window;
    if (w.rabet) {
      return w.rabet.connect()
    }
  }

  private async getFreighterKey() {
    return async () => {
      try {
        return await getPublicKey()
      } catch (e: any) {
        console.log(e)
      }
    };
  }
}

export { WalletClient };