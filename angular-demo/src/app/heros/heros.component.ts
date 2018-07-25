import { Component, OnInit } from '@angular/core';
import { Hero } from '../heros';//导入的Hero;作用是规定写入数据的类型。
//import { HEROES } from '../mock-heroes';

import { HeroService } from '../hero.service';

@Component({
    selector:'hero-root',
    templateUrl:'./heros.component.html',
    styleUrls:['./heros.component.css']
})

export class HerosComponent implements OnInit {
    //下面是该组件的属性，Hero限制数据的类型
    // hero: Hero = {
    //     id:1,
    //     name:'shibaiyong'
    // };
    selectHero:Hero = {//视图层的selectHero未定义。会报错,ngIf可以解决;2.或者给一个默认值。
        id:1,
        name:'shibaiyong'
    };

    heroes : Hero[];

    constructor(private heroService:HeroService){

    };

    ngOnInit(){
        this.getHeroes();
    };

    getHeroes(): void {
        //this.heroes = this.heroService.getHeroes();//这是同步调用。实际应用中都是异步的。
        this.heroService.getHeroes()
                        .subscribe(heroes => this.heroes=heroes)//这是异步的
    }

    onSelect(hero:Hero):void{//void还没有研究。写不写不影响
        this.selectHero=hero;
    }
}