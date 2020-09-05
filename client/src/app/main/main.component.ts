import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  categories = [
    { title: '1', topics: [{ title: 'topic1' }] },
    { title: '2', topics: [{ title: 'topic2' }] },
    { title: '2', topics: [{ title: 'topic2' }] },
    { title: '2', topics: [{ title: 'topic2' }] },
    { title: '2', topics: [{ title: 'topic2' }] },
    { title: '2', topics: [{ title: 'topic2' }] },
  ];
  panelOpenState = false;

  constructor() {}

  ngOnInit(): void {}
}
