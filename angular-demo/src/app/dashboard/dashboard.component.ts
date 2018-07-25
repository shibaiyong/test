import { Component, OnInit } from '@angular/core';
import { Hero } from '../heros';//导入的Hero;作用是规定写入数据的类型。
//import { HEROES } from '../mock-heroes';

import { HeroService } from '../hero.service';

@Component({
    selector:'dashboard-heroes',
    templateUrl:'./dashboard.component.html',
    styleUrls:['./dashboard.component.css']
})

export class DashBoardComponent implements OnInit {
    
    heroes:Hero[]

    selectHero:Hero = {
        id:1,
        name:'shibaiyong'
    };

    constructor(private heroService: HeroService ){

    };

    ngOnInit(){
        this.getHeroes();
    };

    getHeroes(): void{
        this.heroService.getHeroes()
                        .subscribe(heroes => this.heroes=heroes)
    }
    
    onSelect(hero:Hero): void{
        this.selectHero = hero
    }
}