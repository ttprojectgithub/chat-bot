import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
       <div class="loading" role="status" aria-label="טוען...">
      <span class="dot" aria-hidden="true"></span>
      <span class="dot" aria-hidden="true"></span>
      <span class="dot" aria-hidden="true"></span>
    </div>
  `,
  styleUrls: ['./loading-spinner.component.scss'],
})
export class LoadingSpinnerComponent {}