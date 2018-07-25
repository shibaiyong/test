import { Component, OnInit, Input } from "@angular/core"
import { Hero } from "../heros"
import { HeroService } from '../hero.service';


import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component ({
    selector:'heroes-details',
    templateUrl:'./heroes-details.html',
    styleUrls:['./heroes-details.css']
})

export class HeroesDetailComponent implements OnInit {

    @Input()hero:Hero

    constructor(private heroService:HeroService,private route: ActivatedRoute,private location: Location){

    }

    ngOnInit(){

    }

    getHero(): void {
        const id = +this.route.snapshot.paramMap.get('id');
        this.heroService.getHeroes()
          .subscribe(hero => this.hero = hero);
      }
}