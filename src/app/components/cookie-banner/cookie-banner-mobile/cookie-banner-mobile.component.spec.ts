import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookieBannerMobileComponent } from './cookie-banner-mobile.component';

describe('CookieBannerMobileComponent', () => {
  let component: CookieBannerMobileComponent;
  let fixture: ComponentFixture<CookieBannerMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CookieBannerMobileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CookieBannerMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
