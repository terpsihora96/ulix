import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface Category {
  id?: number;
  favorite: boolean;
  created_at?: string;
  last_update?: string;
  note: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(public http: HttpClient) {}

  private readonly categoriesUrl = 'http://localhost:8080/categories';

  public getCategories(): Observable<Category[] | null> {
    return this.http.get<Category[]>(this.categoriesUrl);
  }

  public getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.categoriesUrl}/${id}`);
  }

  public createCategory(data: Category): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(this.categoriesUrl, data);
  }

  public deleteCategory(id: number): Observable<{ id: number }> {
    return this.http.delete<{ id: number }>(`${this.categoriesUrl}/${id}`);
  }
}
