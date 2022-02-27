import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  show_loading: boolean = true;

  constructor() {
  }

  ngOnInit(){
    setTimeout(() =>{
      this.show_loading = false;
    }, 12000)
  }
}
