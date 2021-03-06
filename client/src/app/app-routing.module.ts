import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AccountComponent } from './account/account.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { MainComponent } from './main/main.component';
import { AuthGuard } from './services/guards/auth-guard.guard';
import { LoggedinGuard } from './services/guards/loggedin.guard';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoggedinGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [LoggedinGuard],
  },
  { path: 'account', component: AccountComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
