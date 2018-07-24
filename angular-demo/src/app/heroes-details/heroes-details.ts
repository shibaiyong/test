import { Component, OnInit, Input } from "@angular/core"
import { Hero } from "../heros"

@Component ({
    selector:'heroes-details',
    templateUrl:'./heroes-details.html',
    styleUrls:['./heroes-details.css']
})

export class HeroesDetailComponent implements OnInit {


    @Input()hero:Hero

    constructor(){
    };

    ngOnInit(){

    };
}