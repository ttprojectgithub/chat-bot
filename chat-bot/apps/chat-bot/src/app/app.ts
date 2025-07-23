import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcome } from './nx-welcome';
import { ChatRoomComponent } from './chat-room/chat-room.component';

@Component({
  imports: [NxWelcome, RouterModule,ChatRoomComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'chat-bot';
}
