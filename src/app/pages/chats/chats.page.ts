import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../object-init/chat.service';
import { ChattService } from '../../services/chatt.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatThread } from 'src/app/models/chat-thread.model';
import { format, parseISO, formatDistance } from 'date-fns';
import { IonicComponentService } from '../../services/ionic-component.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatsPage implements OnInit {

  chats: ChatThread[] = [];
  uid: string = "";
  constructor(
    private chat_init_svc: ChatService, 
    private chat_svc: ChattService,
    private activated_route: ActivatedRoute,
    private ionic_component_svc: IonicComponentService,
    private router: Router) { }

  ngOnInit() {
    this.ionic_component_svc.presentLoading()
    if(this.activated_route.snapshot.paramMap.get("uid")){
      this.uid = this.activated_route.snapshot.paramMap.get("uid");
      this.chat_svc.getUserThreads(this.uid)
      .subscribe(chts =>{
        if(chts && chts.length > 0){
          this.ionic_component_svc.dismissLoading().catch(err => console.log(err))
          this.chats = chts;
        }else{
          this.ionic_component_svc.dismissLoading().catch(err => console.log(err))
        }
      })
    }else{
      this.ionic_component_svc.dismissLoading().catch(err => console.log(err))
    }
  }

  updateDisplayPicLoaded(i){
    this.chats[i].client.dp_loaded = true;
  }

  gotoThread(thread_id){
    this.router.navigate(['/chat', {'thread_id': thread_id, 'uid': this.uid}]);
  }

  timeAgo(date){
    return formatDistance(date, Date.now(), {addSuffix: true});
  }

}
