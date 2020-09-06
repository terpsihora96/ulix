import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface Topic {
  id?: number;
  topic_id?: number;
  created_at?: string;
  last_update?: string;
  note: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class TopicService {
  constructor(public http: HttpClient) {}

  private readonly topicsUrl = 'http://localhost:8080/topics';

  public getTopics(): Observable<Topic[] | null> {
    return this.http.get<Topic[]>(this.topicsUrl);
  }

  public getTopic(id: number): Observable<Topic> {
    return this.http.get<Topic>(`${this.topicsUrl}/${id}`);
  }

  public createTopic(data: Topic): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(this.topicsUrl, data);
  }

  public deleteTopic(id: number): Observable<{ id: number }> {
    return this.http.delete<{ id: number }>(`${this.topicsUrl}/${id}`);
  }
}
