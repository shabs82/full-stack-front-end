import {ChatMessage} from './chat-message-model';
import {ChatUser} from './chat-user-model';

export interface WelcomeDto {
  users: ChatUser[];
  user: ChatUser;
  messages: ChatMessage[];

}
