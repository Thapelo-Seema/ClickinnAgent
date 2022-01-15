import { Injectable } from '@angular/core';
import { ChatMessage } from '../models/chat-message.model';
import { ChatThread } from '../models/chat-thread.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor() { }

  defaultMessage(){
    let msg: ChatMessage ={
      appointment: null,
      delivered: false,
      from: "",
      highlight: null,
      message: "",
      message_id: 0,
      read: false,
      recieved: false,
      rooms: [],
      time: 0
    }
    return msg;
  }

  copyMessage(_msg: ChatMessage){
    let msg: ChatMessage ={
      appointment: _msg.appointment || null,
      delivered: _msg.delivered || false,
      from: _msg.from || "",
      highlight: _msg.highlight || null,
      message: _msg.message || "",
      message_id: _msg.message_id || 0,
      read: _msg.read || false,
      recieved: _msg.recieved || false,
      rooms: _msg.rooms || [],
      time: _msg.time || 0
    }
    return msg;
  }

  defaultThread(){
    let thread: ChatThread = {
      chat_messages: [],
      last_message: null,
      last_update: 0,
      new_messages: [],
      thread_id: "",
      agent: null,
      client: null,
      user_1: null,
      user_2: null
    }
    return thread;
  }

  copyThread(_thread: ChatThread){
    let thread: ChatThread = {
      chat_messages: _thread.chat_messages || [],
      last_message: _thread.last_message || null,
      last_update: _thread.last_update || 0,
      new_messages: _thread.new_messages || [],
      thread_id: _thread.thread_id || "",
      agent: _thread.agent || null,
      client: _thread.client || null,
      user_1: null,
      user_2: null
    }

    if(_thread.user_1){
      thread.agent = _thread.user_1;
    }
    if(_thread.user_2){
      thread.client = _thread.user_2;
    }
    return thread;
  }
}
