import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/categories/category.service';
import { TopicService } from '../services/topics/topic.service';
import { SessionService } from '../services/session/session.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  constructor(
    private categoryService: CategoryService,
    private topicService: TopicService,
    public dialog: MatDialog,
    private session: SessionService
  ) {
    this.note = this.session.getNote();
    this.title = this.session.getTitle();
    this.categoryId = +this.session.getCategoryId();
    this.topicId = +this.session.getTopicId();
  }
  categories: any;
  panelOpenState = false;

  note: string;
  title: string;
  categoryId: number;
  topicId: number;

  noteBind: any;
  titleBind: any;

  ngOnInit(): void {
    this.getCategories();
  }

  public onNoteChange(div: any): void {
    this.session.setNote(div.innerText);
    this.topicService
      .updateTopic({
        id: +this.topicId,
        category_id: +this.categoryId,
        note: div.innerText,
        name: this.title,
        favorite: false,
      })
      .subscribe((res) => this.getCategories());
  }

  public onTitleChange(header: any): void {
    this.session.setTitle(header.innerText);
    this.topicService
      .updateTopic({
        id: +this.topicId,
        category_id: +this.categoryId,
        note: this.note,
        name: header.innerText,
        favorite: false,
      })
      .subscribe((res) => this.getCategories());
  }

  private getCategories(): void {
    this.categoryService
      .getCategories()
      .subscribe((value) => (this.categories = value));
  }

  setTopic(name: string, note: string, id: number): void {
    this.session.setTitle(name);
    this.title = name;
    this.session.setNote(note);
    this.note = note;
    this.session.setTopicId(id);
    this.topicId = id;
  }

  setCategoryId(categoryId: number): void {
    this.session.setCategoryId(categoryId);
    this.categoryId = categoryId;
  }

  addNewCategory(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { type: 'category' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.categoryService
        .createCategory({
          name: result || 'Untitled',
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
          name: result || 'New topic',
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
