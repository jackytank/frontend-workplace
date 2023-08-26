import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.css']
})
export class ChildComponent implements OnInit {
  @Input() childMessages: string = '';
  @Output() messageEvent = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  sendMessage() {
    this.messageEvent.emit('Hello from child');
  }
}
