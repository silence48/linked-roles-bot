import { StellarAccount, User } from '../models';
import { UserForm, StellarAccountForm } from '../forms';
import { Keypair } from 'stellar-base';
import type { UserDataI } from '../interfaces/types';

export interface AccountBuilder {
  discord_user_id: string;
  data: any;
  DB: any;
  setup(user: UserDataI): Promise<void>;
  build(): Promise<void>;
  updateDiscordCredentials(credentials: UserDataI): Promise<void>;
  addStellarAccount(account: { public_key: string, access_token: string, refresh_token: string }): Promise<void>;
  removeStellarAccount(account: { public_key: string }): Promise<void>;
  getStellarAccounts(): Promise<{ accounts: any[] }>;
}

interface AccountBuilderData {
  discord_user_id?: string;
  data?: any;
  DB: any;
}

export class AccountBuilder {
  DB: any;
  data: any;
  discord_user_id: string;

  constructor({ discord_user_id = '', DB }: AccountBuilderData) {
    this.discord_user_id = discord_user_id;
    this.data = null;
    this.DB = DB;
  }

  static async create({ user, DB }: { user: UserDataI; DB: any }) {
    const instance = new AccountBuilder({ discord_user_id: user.discord_user_id, DB });
    await instance.setup(user);
    return instance;
  }

  static async find({ discord_user_id, DB }: { discord_user_id: string; DB: any }) {
    const instance = new AccountBuilder({ discord_user_id, DB });
    await instance.build();
    return instance;
  }

  async setup(user: UserDataI) {
    const userForm = new UserForm(new User(user));
    const { id } = (await User.create(userForm, this.DB)) ?? {};
    if (id) {
      await this.build();
    } else {
      console.log('something went wrong');
    }
  }

  async build() {
    const user = await User.findOne('discord_user_id', this.discord_user_id, this.DB);
    const accounts = (await StellarAccount.findBy('discord_user_id', this.discord_user_id, this.DB)) ?? [];
    this.data = {
      user,
      accounts
    };
  }

  async updateDiscordCredentials({ discord_access_token, discord_refresh_token, discord_expires_at }: UserDataI) {
    const user = await User.findOne('discord_user_id', this.discord_user_id, this.DB);
    await User.update(
      {
        ...user,
        discord_access_token,
        discord_refresh_token,
        discord_expires_at
      },
      this.DB
    );
    await this.build();
  }

  async addStellarAccount({ public_key, access_token, refresh_token }: any) {
    const key = Keypair.fromPublicKey(public_key).publicKey();
    const exists = await StellarAccount.findOne('public_key', key, this.DB)
    
    if (!exists) {
      const stellarForm = new StellarAccountForm(
        new StellarAccount({
          public_key: key,
          discord_user_id: this.discord_user_id,
          access_token: access_token,
          refresh_token: refresh_token
        })
      );
      await StellarAccount.create(stellarForm, this.DB);
    }

    await this.build();
  }

  async removeStellarAccount({ public_key }: any) {
    const stellarAccount = await StellarAccount.findOne('public_key', public_key, this.DB);
    if (stellarAccount.discord_user_id === this.discord_user_id) {
      await StellarAccount.delete(stellarAccount.id, this.DB);
      await this.build();
    }
  }

  async getStellarAccounts() {
    const accounts = (await StellarAccount.findBy('discord_user_id', this.discord_user_id, this.DB)) ?? [];
    return {
      accounts
    };
  }
}
