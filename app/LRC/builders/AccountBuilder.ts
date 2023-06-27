import { StellarAccount, User } from '../models';
import { UserForm, StellarAccountForm } from '../forms';
import { Keypair } from 'stellar-base';
import type { UserDataI } from '../interfaces/types';

export interface AccountBuilderData {
  id?: string;
  discord_user_id?: string;
  DB: any;
}

export class AccountBuilder {
  id: string;
  DB: any;
  discord_user_id: string;

  constructor({ id = '', DB }: AccountBuilderData) {
    this.id = id;
    this.discord_user_id = '';
    this.DB = DB;
  }
  //user: UserDataI
  async setup(user: UserDataI) {
    const { DB } = this;
    const userForm = new UserForm(new User(user));
    const { id, discord_user_id } = await User.create(userForm, DB) ?? {};
    if (id) {
      this.id = id;
      this.discord_user_id = discord_user_id;
      return await this.data()
    }
  }

  private async data() {
    const { DB, discord_user_id } = this;
    const user = await User.findOne('discord_user_id', discord_user_id, DB);
    const accounts = await StellarAccount.findBy('discord_user_id', discord_user_id, DB) ?? []
    return {
      user,
      accounts
    }
  }

  async addWallet({ public_key }: any) {
    const { DB, discord_user_id } = this;
    const key = Keypair.fromPublicKey(public_key).publicKey();
    if (key) {
      const stellarForm = new StellarAccountForm(
        new StellarAccount({
          public_key: key,
          discord_user_id: discord_user_id
        })
      );
      await StellarAccount.create(stellarForm, DB);
      return await this.data()
    }
  }

  async removeWallet({ public_key }: any) {
    const { DB, discord_user_id } = this;
    const stellarAccount = await StellarAccount.findOne('public_key', public_key, DB);
    if (stellarAccount.discord_user_id === discord_user_id) {
      await StellarAccount.delete(stellarAccount.id, DB);
      return await this.data()
    }
  }
}
