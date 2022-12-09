import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import { AuthGuard } from './auth.guard';
import { RegisterComponent } from './register/register.component';
import { MinesComponent } from './mines/mines.component';
import { RelicsComponent } from './relics/relics.component';
import { RssComponent } from './rss/rss.component';
import { NavbarComponent } from './navbar/navbar.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'relics', component: RelicsComponent, canActivate: [AuthGuard]},
  { path: 'rss', component: RssComponent, canActivate: [AuthGuard]},
  { path: 'mines', component: MinesComponent, canActivate: [AuthGuard]}
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ]
})

export class AppRoutingModule { }
