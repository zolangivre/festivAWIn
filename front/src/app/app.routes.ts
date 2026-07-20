import { Routes } from '@angular/router';
import { UsersListComponent } from './components/user/users-list/users-list.component';
import { ItemsListComponent } from './components/item/items-list/items-list.component';
import { UserAddComponent } from './components/user/user-add/user-add.component';
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
import { UserVenteListComponent } from './components/user/user-vente-list/user-vente-list.component';
import { BilanGeneralComponent } from './components/bilan/bilan-general/bilan-general.component';

export const routes: Routes = [
  { path: 'accueil', component: AppComponent },
  { path: 'login', component: LoginComponent },
  { path: 'session/add', component: AddSessionComponent, canActivate: [AuthGuard] },
  { path: 'session', component: SessionComponent, canActivate: [AuthGuard] },
  { path: 'bilan/:idSession', component: BilanGeneralComponent, canActivate: [AuthGuard] },
  { path: 'utilisateur', component: UsersListComponent, canActivate: [SessionGuard, AuthGuard] },
  { path: 'utilisateur/depot/:idUtilisateur', component: UserDepotComponent, canActivate: [SessionGuard, AuthGuard] },
  { path: 'utilisateur/jeu/:idUtilisateur', component: UserJeuComponent, canActivate: [SessionGuard, AuthGuard] },
  { path: 'utilisateur/achat/:idUtilisateur', component: UserVenteComponent, canActivate: [SessionGuard, AuthGuard] },
  { path: 'utilisateur/liste-achat/:idUtilisateur', component: UserAchatListComponent, canActivate: [SessionGuard, AuthGuard] },
  { path: 'utilisateur/liste-vente/:idUtilisateur', component: UserVenteListComponent, canActivate: [SessionGuard, AuthGuard] },
  { path: 'utilisateur/add', component: UserAddComponent, canActivate: [SessionGuard, AuthGuard] },
  { path: 'vente', component: VenteListComponent, canActivate: [SessionGuard] },
  { path: 'jeuDepot', component: ItemsListComponent, canActivate: [SessionGuard] },
  { path: '', redirectTo: 'accueil', pathMatch: 'full' },
  { path: '**', redirectTo: 'accueil', pathMatch: 'full' }
];
