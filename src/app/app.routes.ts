import { Routes } from '@angular/router';
import { UsersListComponent } from './components/user/users-list/users-list.component';
import { ItemsListComponent } from './components/item/items-list/items-list.component';
import { UserAddComponent } from './components/user/user-add/user-add.component';
import { AdminComponent } from './components/admin/admin.component';
import { AddSessionComponent } from './components/admin/add-session/add-session.component';
import { SessionGuard } from './guards/session.guard';
import { AuthGuard } from './guards/auth.guard';
import { AppComponent } from './app.component';
import { UserDepotComponent } from './components/user/user-depot/user-depot.component';
import { UserJeuComponent } from './components/user/user-jeu/user-jeu.component';
import { SessionComponent } from './components/admin/session/session.component';
import { LoginComponent } from './components/login/login.component';
import { UserVenteComponent } from './components/user/user-vente/user-vente.component';
import { VenteListComponent } from './components/vente/vente-list/vente-list.component';
import { UserAchatListComponent } from './components/user/user-achat-list/user-achat-list.component';

export const routes: Routes = [
  { path: 'accueil', component: AppComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  { path: 'addSession', component: AddSessionComponent, canActivate: [AuthGuard] },
  { path: 'session', component: SessionComponent, canActivate: [AuthGuard] },
  { path: 'utilisateur', component: UsersListComponent, canActivate: [SessionGuard] },
  { path: 'utilisateur/depot/:idUtilisateur', component: UserDepotComponent, canActivate: [SessionGuard] },
  { path: 'utilisateur/jeu/:idUtilisateur', component: UserJeuComponent, canActivate: [SessionGuard] },
  { path: 'utilisateur/achat/:idUtilisateur', component: UserVenteComponent, canActivate: [SessionGuard] },
  { path: 'utilisateur/liste-achat/:idUtilisateur', component: UserAchatListComponent, canActivate: [SessionGuard] },
  { path: 'add/utilisateur', component: UserAddComponent, canActivate: [SessionGuard] },
  { path: 'vente', component: VenteListComponent, canActivate: [SessionGuard] },
  { path: 'jeuDepot', component: ItemsListComponent, canActivate: [SessionGuard] },
  { path: '', redirectTo: 'accueil', pathMatch: 'full' },
  { path: '**', redirectTo: 'accueil', pathMatch: 'full' }
];
