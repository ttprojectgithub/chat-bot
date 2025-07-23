import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, switchMap, map, catchError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BotService {
  private keywords = [
    'אנגולר',
    'angular',
    'קומפוננטה',
    'קומפוננטות',
    'מודול',
    'מודולים',
    'pipe',
    'pipes',
    'directive',
    'שירות',
    'service',
    'RxJS',
    'forms',
    'template',
    'ng',
    'injector',
    'component',
    'module',
    'httpclient',
    'standalone',
  ];
  

  constructor(private http: HttpClient) {}

  getBotAnswer(question: string): Observable<string> {
    const lowered = question.toLowerCase();
    const hasKeyword = this.keywords.some((kw) => lowered.includes(kw));
  
    if (hasKeyword) {
      return this.askGpt(question);
    }
  
    return this.http
      .post<{ result: string }>('/api/is-angular', { question })
      .pipe(
        switchMap((res) => {
          const normalized = res.result?.trim().replace(/["“”]/g, '');
          const isAngular = normalized === 'כן';
          if (!isAngular) {
            return of('🤖 שאלה זו לא קשורה ל-Angular.');
          }
          return this.askGpt(question);
        }),
        catchError((err) => {
          console.error('שגיאה בפנייה ל־GPT:', err);
          return of('⚠️ שגיאה בעת יצירת תגובה מהבוט.');
        })
      );
  }
  

  private askGpt(question: string): Observable<string> {
    return this.http
      .post<{ result: string }>('/api/answer', { question })
      .pipe(map((res) => res.result ?? '🤖 לא הצלחתי להבין את השאלה.'));
  }
}
