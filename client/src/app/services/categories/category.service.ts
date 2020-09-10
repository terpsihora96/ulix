import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../users/user.service';
import { map } from 'rxjs/operators';

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
  constructor(public http: HttpClient, public user: UserService) {}

  private readonly categoriesUrl = 'http://localhost:8080/categories';

  public getCategories(): Observable<any> {
    return this.http.get(
      `${this.categoriesUrl}/users/${this.user.getUserId()}`
    );
  }

  public getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.categoriesUrl}/${id}`);
  }

  public createCategory(data: Category): Observable<{ id: number }> {
    return this.http
      .post<{ id: number }>(this.categoriesUrl, data, {
        observe: 'response',
      })
      .pipe(
        map((response) => {
          if (response.ok) {
            return response.body;
          }
          return null;
        })
      );
  }

  public deleteCategory(id: number): Observable<{ id: number }> {
    return this.http.delete<{ id: number }>(`${this.categoriesUrl}/${id}`);
  }

  public updateCategory(data: Category): Observable<{ id: number }> {
    const id = data.id;
    delete data.id;
    return this.http.put<{ id: number }>(`${this.categoriesUrl}/${id}`, data);
  }
}
