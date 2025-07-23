import { TestBed } from '@angular/core/testing';
import { BotService } from './bot.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('BotService', () => {
  let service: BotService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BotService],
    });
    service = TestBed.inject(BotService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // מוודא שאין בקשות מיותרות
  });

  it('should send question directly to GPT if keyword is found', () => {
    const question = 'מה זה קומפוננטה באנגולר?';

    service.getBotAnswer(question).subscribe((answer) => {
      expect(answer).toBe('זו תשובה של GPT');
    });

    const req = httpMock.expectOne('/api/answer');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.question).toBe(question);
    req.flush({ result: 'זו תשובה של GPT' });
  });

  it('should ask is-angular first if no keyword is found', () => {
    const question = 'מה זה SPA?';

    service.getBotAnswer(question).subscribe((answer) => {
      expect(answer).toBe('זו תשובה של GPT על SPA');
    });

    const isAngularReq = httpMock.expectOne('/api/is-angular');
    expect(isAngularReq.request.method).toBe('POST');
    isAngularReq.flush({ result: 'כן' });

    const gptReq = httpMock.expectOne('/api/answer');
    gptReq.flush({ result: 'זו תשובה של GPT על SPA' });
  });

  it('should return a message if question is not related to Angular', () => {
    const question = 'מה מזג האוויר בתל אביב?';

    service.getBotAnswer(question).subscribe((answer) => {
      expect(answer).toBe('🤖 שאלה זו לא קשורה ל-Angular.');
    });

    const isAngularReq = httpMock.expectOne('/api/is-angular');
    isAngularReq.flush({ result: 'לא' });
  });

  it('should handle error from GPT gracefully', () => {
    const question = 'שאלה בעייתית';

    service.getBotAnswer(question).subscribe((answer) => {
      expect(answer).toBe('⚠️ שגיאה בעת יצירת תגובה מהבוט.');
    });

    const isAngularReq = httpMock.expectOne('/api/is-angular');
    isAngularReq.flush({}, { status: 500, statusText: 'Server Error' });
  });
});
