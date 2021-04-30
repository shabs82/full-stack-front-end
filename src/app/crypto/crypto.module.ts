import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CryptoRoutingModule } from './crypto-routing.module';
import { CryptoComponent } from './crypto.component';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [CryptoComponent],
  imports: [
    CommonModule,
    CryptoRoutingModule,
    ReactiveFormsModule
  ]
})
export class CryptoModule { }
