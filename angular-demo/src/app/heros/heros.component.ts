import { Component, OnInit } from '@angular/core';
import {Hero} from './heros';
@Component({
    selector:'hero-root',
    templateUrl:'./heros.component.html',
    styleUrls:['./heros.component.css']
})

export class HerosComponent implements OnInit {
    hero: Hero = {
        id:1,
        name:'shibaiyong'
    };

    constructor(){

    };

    ngOnInit(){
        
    }


}