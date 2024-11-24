import { Routes } from '@angular/router';
import { UsersListComponent } from './components/user/users-list/users-list.component';
import { ItemsListComponent } from './components/item/items-list/items-list.component';
import { UserAddComponent } from './components/user/user-add/user-add.component';
import { AdminComponent } from './components/admin/admin.component';
import { SessionGuard } from './guards/session.guard';
import { AppComponent } from './app.component';
import { UserDepotComponent } from './components/user/user-depot/user-depot.component';
import { UserJeuComponent } from './components/user/user-jeu/user-jeu.component';
import { SessionComponent } from './components/admin/session/session.component';


export const routes: Routes = [
  { path: 'accueil', component: AppComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'session', component: SessionComponent },
  { path: 'utilisateur', component: UsersListComponent, canActivate: [SessionGuard] },
  { path: 'utilisateur/depot/:idUtilisateur', component: UserDepotComponent, canActivate: [SessionGuard] },
  { path: 'utilisateur/jeu/:idUtilisateur', component: UserJeuComponent, canActivate: [SessionGuard] },
  { path: 'add/utilisateur', component: UserAddComponent, canActivate: [SessionGuard] },
  { path: 'jeuDepot', component: ItemsListComponent, canActivate: [SessionGuard] },
  { path: '', redirectTo: 'accueil', pathMatch: 'full' },
  { path: '**', redirectTo: 'accueil', pathMatch: 'full' }
];
