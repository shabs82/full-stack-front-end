import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ChatService} from './shared/chat.service';
import {Observable, pipe, Subject, Subscription} from 'rxjs';
import {ChatUser} from './shared/chat-user-model';
import {ChatMessage} from './shared/chat-message-model';
import {debounceTime, map, takeUntil, tap} from 'rxjs/operators';
import {WelcomeDto} from './shared/welcome.dto';




@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit , OnDestroy{
  messageFc = new FormControl('');
  userNameFc = new FormControl('');
  users$: Observable<ChatUser[]> | undefined;
  messages$: Observable<ChatMessage[]> | undefined;
  unsubscribe$ = new Subject();
  allMessages$: Observable<ChatMessage[]> | undefined;
  chatUser: ChatUser| undefined;
  UsersTyping: ChatUser[];
  error$: Observable<string> | undefined;
  unsubscribeWelcome: Subscription;
  listenForWelcome$: Observable<WelcomeDto> | undefined;



  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    this.messageFc.valueChanges
      .pipe(
        takeUntil(this.unsubscribe$),
        debounceTime(500),
      )
      .subscribe((value ) => {
        this.chatService.sendTyping(value.leftBounds > 0);
          }
      );
    this.chatService.listenForUserTyping()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((chatUser) => {
        if (chatUser.typing && !this.UsersTyping.find((u) => u.id === chatUser.id)){
          this.UsersTyping.push(chatUser);
        }else {
          this.UsersTyping = this.UsersTyping.filter((u) => u.id !== chatUser.id);
        }

      });
    this.users$ = this.chatService.listenForUsers();
    this.error$ = this.chatService.listenForErrors();

    // first Solution remember to unsubscribe on destroy manually
   /* this.unsubscribeWelcome = this.chatService.listenForWelcome()
      .subscribe(welcome => {
        this.chatUser = welcome.user;
        this.user.push(chatUser);
      });*/
    // Second soution we will ask to automaticly unsubscribe in code
    /*this.chatService.listenForWelcome()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(welcome => {
        this.chatUser = welcome.user;
        this.user.push(chatUser);
      });*/
      // Third we will not even subscribe in ts cde
    this.listenForWelcome$ = this.chatService.listenForWelcome()
      .pipe(
        tap(welcome => {
          this.chatUser = welcome.user;
          // this.users$.subscribe(u => u.push(this.chatUser));
          this.users$.pipe(
            tap(
              u => u.push((this.chatUser))
            )
          );
        })
      );
    if (this.chatService.chatUser) {
      this.chatService.chatUser.subscribe( cs => this.chatService.sendUserName(cs.username));
    }
    this.chatService.listenForConnect();
    pipe(
        takeUntil(this.unsubscribe$)
      );

  }
   ngOnDestroy(): void{
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    if (this.unsubscribeWelcome) {
      this.unsubscribeWelcome.unsubscribe();
    }
  }

  sendMessage(): void{
    this.chatService.sendMessage(this.messageFc.value);
    this.messageFc.patchValue('');
  }
  sendUserName(): void{
    if (this.userNameFc.value) {
      this.chatService.sendUserName(this.userNameFc.value);
      this.messages$ = this.listenForWelcome$.
      pipe(
        map(
          m => m.messages
        )
      );
      this.users$ = this.listenForWelcome$.
        pipe(
          map(
            u => u.users
          )
      );
    }

  }

}
