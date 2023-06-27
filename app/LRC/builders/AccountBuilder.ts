import { StellarAccount, User } from '../models';
import { UserForm, StellarAccountForm } from '../forms';
import { Keypair } from 'stellar-base';
import type { UserDataI } from '../interfaces/types';

interface AccountBuilderData {
  discord_user_id?: string;
  data?: any;
  DB: any;
}

export class AccountBuilder {
  readonly DB: any;
  data: any;
  discord_user_id: string;

  constructor({ discord_user_id = '', DB }: AccountBuilderData) {
    this.discord_user_id = discord_user_id;
    this.data = null;
    this.DB = DB;
  }

  static async create({ user, DB }: { user: UserDataI; DB: any }) {
    const { discord_user_id, discord_access_token, discord_expires_at, discord_refresh_token } = user;
    const instance = new AccountBuilder({ discord_user_id, DB });
    if (instance.discord_user_id) {
      await instance.setup({ discord_user_id, discord_access_token, discord_expires_at, discord_refresh_token });
    }
    return instance;
  }

  static async find({ discord_user_id, DB }: { discord_user_id: string; DB: any }) {
    const instance = new AccountBuilder({ discord_user_id, DB });
    if (instance.discord_user_id) {
      await instance.build();
    }
    return instance;
  }

  async setup(user: UserDataI) {
    const { DB } = this;
    const userForm = new UserForm(new User(user));
    const { id } = (await User.create(userForm, DB)) ?? {};
    if (id) {
      return await this.build();
    } else {
      console.log('something went wrong');
    }
  }

  private async build() {
    const { DB, discord_user_id } = this;
    const user = await User.findOne('discord_user_id', discord_user_id, DB);
    const accounts = (await StellarAccount.findBy('discord_user_id', discord_user_id, DB)) ?? [];
    this.data = {
      user,
      accounts
    };
  }

  async updateDiscordCredentials({ discord_access_token, discord_refresh_token, discord_expires_at }: UserDataI) {
    const { DB, discord_user_id } = this;
    const user = await User.findOne('discord_user_id', discord_user_id, DB);
    await User.update(
      {
        ...user,
        discord_access_token,
        discord_refresh_token,
        discord_expires_at
      },
      DB
    );
    return await this.build();
  }

  async addStellarAccount({ public_key }: any) {
    const { DB, discord_user_id } = this;
    const key = Keypair.fromPublicKey(public_key).publicKey();
    const exists = await StellarAccount.findOne('public_key', key, DB)
    
    if (!exists) {
      const stellarForm = new StellarAccountForm(
        new StellarAccount({
          public_key: key,
          discord_user_id: discord_user_id
        })
      );
      await StellarAccount.create(stellarForm, DB);
    }

    return await this.build();
  }

  async removeStellarAccount({ public_key }: any) {
    const { DB, discord_user_id } = this;
    const stellarAccount = await StellarAccount.findOne('public_key', public_key, DB);
    if (stellarAccount.discord_user_id === discord_user_id) {
      await StellarAccount.delete(stellarAccount.id, DB);
      return await this.build();
    }
  }

  async getStellarAccounts() {
    const { DB, discord_user_id } = this;
    const accounts = (await StellarAccount.findBy('discord_user_id', discord_user_id, DB)) ?? [];
    return {
      accounts
    };
  }
}
