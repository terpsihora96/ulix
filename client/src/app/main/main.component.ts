import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  categories = [
    {
      name: 'Movies',
      topics: [
        {
          name: 'All About Eve',
          note:
            'hsfkhfshjfsljsflijlsfkjjslfhlksjfljfsljfs;ljsfljlfsljsflsfhslsfjk',
        },
      ],
    },
    {
      name: 'My notes',
      topics: [
        {
          name: 'topic2',
          note:
            'hsfkhfshjfsljsflijlsfkjjslfhlksjfljfsljfs;ljsfljlfsljsflsfhslsfjk',
        },
        {
          name: 'topic2',
          note:
            'hsfkh3565273256732763275327fshjfsljsflijlsfkjjslfhlksjfljfsljfs;ljsfljlfsljsflsfhslsfjk',
        },
        {
          name: 'topic2',
          note: 'h35617',
        },
        {
          name: 'topic2',
          note: 'HSFKHFDKJHFDSKJHFKDJSHJDFSK;ljsfljlfsljsflsfhslsfjk',
        },
      ],
    },
  ];
  panelOpenState = false;
  note: string;
  title: string;

  constructor() {}

  ngOnInit(): void {}
}
