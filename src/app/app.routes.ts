import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { UsersListComponent } from './components/user/users-list/users-list.component';
import { UserDetailsComponent } from './components/user/user-details/user-details.component';
import { ItemsListComponent } from './components/item/items-list/items-list.component';
import { ItemDetailsComponent } from './components/item/item-details/item-details.component';
import { UserEditComponent } from './components/user/user-edit/user-edit.component';

export const routes: Routes = [
  { path: 'utilisateur', component: UsersListComponent },
  { path: 'utilisateur/:idUtlisateur', component: UserDetailsComponent },
  { path: 'edit/utilisateur/:idUtilisateur', component: UserEditComponent },
  { path: 'jeuDepot', component: ItemsListComponent },
  { path: 'jeuDepot/:idJeuDepot', component: ItemDetailsComponent },
  { path: 'edit/jeuDepot/:idJeuDepot', component: ItemDetailsComponent },
  { path: 'App', component: AppComponent },
  { path: '', redirectTo: '/App', pathMatch: 'full' }
];
