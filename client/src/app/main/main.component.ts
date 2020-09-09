import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/categories/category.service';
import { TopicService } from '../services/topics/topic.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  categories: any;
  panelOpenState = false;
  note: string;
  title: string;
  categoryId: number;

  constructor(
    private categoryService: CategoryService,
    private topicService: TopicService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getCategories();
  }

  private getCategories(): void {
    this.categoryService
      .getCategories()
      .subscribe((value) => (this.categories = value));
  }

  addNewCategory(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { type: 'category' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.categoryService
        .createCategory({
          name: result || '',
          favorite: false,
          note: '',
        })
        .subscribe((res) => {
          if (res) {
            this.getCategories();
          }
        });
    });
  }

  addNewTopic(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { type: 'topic' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.topicService
        .createTopic({
          category_id: this.categoryId,
          name: result || '',
          favorite: false,
          note: '',
        })
        .subscribe((res) => {
          if (res) {
            this.getCategories();
          }
        });
    });
  }
}
