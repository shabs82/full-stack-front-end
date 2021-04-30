import { Injectable } from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {CryptoModel} from './crypto-model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  constructor(private socket: Socket) {}

  getAllCrypto(): Observable<CryptoModel[]> {
    return this.socket.fromEvent<CryptoModel[]>('allCrypto');

  }
}
