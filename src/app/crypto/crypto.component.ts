import { Component, OnInit } from '@angular/core';
import {CryptoService} from './shared/crypto.service';
import {Observable} from 'rxjs';
import {CryptoModel} from './shared/crypto-model';

@Component({
  selector: 'app-crypto',
  templateUrl: './crypto.component.html',
  styleUrls: ['./crypto.component.scss']
})
export class CryptoComponent implements OnInit {

  allCrypto$: Observable<CryptoModel[]> | undefined;
  constructor(private cryptoService: CryptoService) { }

  ngOnInit(): void {
    this.allCrypto$ = this.cryptoService.getAllCrypto();
  }

}
