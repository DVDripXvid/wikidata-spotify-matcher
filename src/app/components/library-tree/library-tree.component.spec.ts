import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryTreeComponent } from './library-tree.component';

describe('LibraryTreeComponent', () => {
  let component: LibraryTreeComponent;
  let fixture: ComponentFixture<LibraryTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibraryTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
