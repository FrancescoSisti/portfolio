import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsMobileComponent } from './skills-mobile.component';

describe('SkillsMobileComponent', () => {
  let component: SkillsMobileComponent;
  let fixture: ComponentFixture<SkillsMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillsMobileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillsMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
