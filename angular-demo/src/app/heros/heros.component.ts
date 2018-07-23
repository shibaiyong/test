import { Component, OnInit } from '@angular/core';
import {Hero} from '../heros';
import { HEROES } from '../mock-heroes';

@Component({
    selector:'hero-root',
    templateUrl:'./heros.component.html',
    styleUrls:['./heros.component.css']
})

export class HerosComponent implements OnInit {
    //下面是该组件的属性
    hero: Hero = {
        id:1,
        name:'shibaiyong'
    };
    heroes = HEROES;
    constructor(){

    };

    ngOnInit(){

    }


}