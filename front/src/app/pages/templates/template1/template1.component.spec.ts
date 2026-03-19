import { TestBed } from '@angular/core/testing';
import { Template1Component } from './template1.component';

describe('Template1Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Template1Component],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(Template1Component);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(Template1Component);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
  });
});
