import { Component } from '@angular/core';
import { IonicComponentService } from './services/ionic-component.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private ionic_component_svc: IonicComponentService, private platform: Platform) {
    this.ionic_component_svc.presentLoading();
    setTimeout(() =>{
      this.ionic_component_svc.dismissLoading().catch(err => console.log(err))
    }, 4000)
  }
}
