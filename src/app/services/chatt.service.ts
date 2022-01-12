import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ChatThread } from '../models/chat-thread.model';

@Injectable({
  providedIn: 'root'
})
export class ChattService {

  constructor(private afs: AngularFirestore) { }

  createThread(thread: ChatThread){
    return this.afs.collection('ChatThreads').add(thread);
  }

  getThread(thread_id){
    return this.afs.collection<ChatThread>('ChatThreads').doc(thread_id).valueChanges();
  }

  updateThread(thread: ChatThread){
    return this.afs.collection('ChatThreads').doc(thread.thread_id).update(thread);
  }

  getUserThreads(uid){
    return this.afs.collection<ChatThread>('ChatThreads', ref =>
    ref.where("agent.uid", "==", uid)
    .orderBy("last_update", "desc")).valueChanges();
  }
}
