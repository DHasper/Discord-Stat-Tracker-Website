import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoicechatComponent } from './voicechat.component';

describe('VoicechatComponent', () => {
  let component: VoicechatComponent;
  let fixture: ComponentFixture<VoicechatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoicechatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoicechatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
