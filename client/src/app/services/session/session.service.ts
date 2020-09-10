import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  constructor() {}

  public setTitle(title: string): void {
    sessionStorage.setItem('title', title);
  }

  public getTitle(): string {
    return sessionStorage.getItem('title');
  }

  public setNote(note: string): void {
    sessionStorage.setItem('note', note);
  }

  public getNote(): string {
    return sessionStorage.getItem('note');
  }

  public setCategoryId(categoryId: number): void {
    sessionStorage.setItem('category_id', categoryId.toString());
  }

  public getCategoryId(): string {
    return sessionStorage.getItem('category_id');
  }

  public setTopicId(topicId: number): void {
    sessionStorage.setItem('topic_id', topicId.toString());
  }

  public getTopicId(): string {
    return sessionStorage.getItem('topic_id');
  }
}
