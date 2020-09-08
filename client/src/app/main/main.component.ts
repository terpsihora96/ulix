import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/categories/category.service';
import { AuthService } from '../services/auth/auth.service';

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
  category: any;

  constructor(
    private categoryService: CategoryService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.category = this.categoryService
      .getCategory(2)
      .subscribe((category) => console.log(category));
  }

  // TODO
  addNewCategory(): void {
    console.log(this.auth.getAccessToken());
    this.categoryService.createCategory({
      favorite: true,
      note: 'shfkshfk',
      name: 'shfkshfk',
    });
  }
  // TODO
  addNewTopic(): void {
    this.categoryService.createCategory({
      favorite: true,
      note: 'shfkshfk',
      name: 'shfkshfk',
    });
  }
}
