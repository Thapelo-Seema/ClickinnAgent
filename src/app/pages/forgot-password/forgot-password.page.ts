import { Component, OnInit } from '@angular/core';
import { ModalController} from '@ionic/angular';
import { IonicComponentService } from '../../services/ionic-component.service';
import { FormBuilder, FormGroup ,Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  public registerForm: FormGroup;
  constructor(
    private ion_component_svc: IonicComponentService,
    private modal_controller: ModalController,
    public  formBuilder: FormBuilder,
    private auth_svc: AuthService
  ) { 
    let EMAIL_REGEXP = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    this.registerForm = formBuilder.group({
      username:  ['', Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEXP)])]
    });
  }

  ngOnInit() {
  }

  async close(){
    await this.modal_controller.dismiss();
  }

  reset(){
    this.ion_component_svc.presentLoading();
    this.auth_svc.forgotPassword(this.registerForm.value.username)
    .then(() =>{
      this.ion_component_svc.dismissLoading().catch(err => console.log(err))
      this.ion_component_svc.presentAlert("Password reset link sent to your email!");
      this.close()
    })
    .catch(err =>{
      console.log(err)
      this.ion_component_svc.dismissLoading().catch(err => console.log(err))
      this.ion_component_svc.presentAlert("There is no user account for this email");
      this.close();
    })
  }

}
