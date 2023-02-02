import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() isSignedIn?: boolean = false;
  notifier = new Subject();
  isList?: boolean;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.router.events.pipe(
      takeUntil(this.notifier),
      filter(event => event instanceof NavigationEnd)
      ).subscribe((e:any)=>{
        if(e.url.includes('shoppinglist')) this.isList = true;
        else this.isList = false;
    })
  }

  ngOnDestroy(): void {
    this.notifier.next(null);
    this.notifier.complete();
  }

  signOut(){
    this.authService.signOut()
  }
}
