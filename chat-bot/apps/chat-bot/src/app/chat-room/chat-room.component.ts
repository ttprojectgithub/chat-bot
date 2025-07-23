import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  effect,
  Injector,
  runInInjectionContext
} from '@angular/core';
import { CommonModule, NgIf, NgForOf, NgFor } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  trigger,
  transition,
  style,
  animate,
} from '@angular/animations';
import { BotService } from '@chat-bot/bot';
import { LoadingSpinnerComponent } from '@chat-bot/shared-ui';

@Component({
  selector: 'chat-room',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingSpinnerComponent],
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('250ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class ChatRoomComponent {
  form: FormGroup;
  messages = signal<{ sender: 'user' | 'bot'; content: string }[]>([]);
  isLoading = signal(false);
  copied = signal(false);

  editForm: FormGroup;
  editingIndex: number | null = null;

  constructor(private fb: FormBuilder, private botService: BotService, private injector: Injector) {
    this.form = this.fb.group({
      message: ['', Validators.required],
    });
  
    this.editForm = this.fb.group({
      editMessage: ['', Validators.required],
    });
  
  
    const saved = localStorage.getItem('chat-history');
    if (saved) {
      this.messages.set(JSON.parse(saved));
    }
  

    runInInjectionContext(this.injector, () => {
      effect(() => {
        localStorage.setItem('chat-history', JSON.stringify(this.messages()));
      });
    });
  }
  
  ngOnInit(): void {
   
  }

  sendMessage(): void {
    const msg = this.form.value.message?.trim();
    if (!msg) return;

    this.messages.update((msgs) => [...msgs, { sender: 'user', content: msg }]);
    this.form.reset();
    this.isLoading.set(true);

    this.botService.getBotAnswer(msg).subscribe((answer) => {
      this.messages.update((msgs) => [
        ...msgs,
        { sender: 'bot', content: this.formatAnswer(answer) },
      ]);
      this.isLoading.set(false);
    });
  }

  private formatAnswer(answer: string): string {
    const formatted = answer
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      .replace(/\n/g, '<br />');
    return formatted.trim();
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1500);
    });
  }

  startEdit(index: number, current: string): void {
    this.editingIndex = index;
    this.editForm.setValue({ editMessage: current });
  }

  cancelEdit(): void {
    this.editingIndex = null;
  }

  saveEdit(index: number): void {
    const newMessage = this.editForm.value.editMessage?.trim();
    if (!newMessage) return;

    const updatedMessages = [...this.messages()];
    updatedMessages[index] = { sender: 'user', content: newMessage };

    const botIndex = updatedMessages.findIndex((m, i) => i > index && m.sender === 'bot');
    if (botIndex !== -1) {
      updatedMessages.splice(botIndex, 1);
    }

    this.messages.set(updatedMessages);
    this.editingIndex = null;

    this.isLoading.set(true);
    this.botService.getBotAnswer(newMessage).subscribe((answer) => {
      this.messages.update((msgs) => [
        ...msgs,
        { sender: 'bot', content: this.formatAnswer(answer) },
      ]);
      this.isLoading.set(false);
    });
  }
}
