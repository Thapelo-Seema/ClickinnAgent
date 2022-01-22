import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class IonicStorageService {

  private _storage: Storage | null = null;

  constructor(private storage: Storage) { 
    this.init();
  }

  async init(){
    const storage = await this.storage.create();
    this._storage = storage; 
  }

  public async setUser(agent_uid: string){
    await this._storage?.set("agent_uid", agent_uid)
    await this._storage?.set('user_type', "agent")
  }

  public async getUID(){
    return await this._storage?.get("agent_uid");
  }

  public async getUserType(){
    return await this._storage?.get("user_type");
  }

  public async setUserType(){
    await this._storage?.set('user_type', "agent")
  }

  async getUser(){
    let uid = await this._storage?.get("agent_uid");
    let user_type = await this._storage?.get("user_type");
    return {'uid': uid, 'user_type': user_type }
  }

  async removeUser(){
    this._storage?.remove("user_type");
    return await this._storage?.remove("agent_uid");
  }

}
