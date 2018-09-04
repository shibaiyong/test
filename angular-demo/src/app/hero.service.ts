import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Hero } from './heros';
import { HEROES } from './mock-heroes';

import { MessageService } from './message.service'

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  constructor(private messageService:MessageService) {  }//利用服务的形式实现数据共享

  getHeroes(): Observable<Hero[]> {
    this.messageService.add('HeroService: fetched heroes')
    return of(HEROES)
  }

  getHero(id:number): Observable<Hero> {
    this.messageService.add(`HeroService: fetched heroes id = ${id}`)
    return of(HEROES.find(hero => hero.id === id))
  }
}

