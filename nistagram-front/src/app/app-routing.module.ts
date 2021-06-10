import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditComponent } from './accounts/edit/edit.component';
import { LoginComponent } from './login/login.component';
import { NewPostComponent } from './new-post/new-post.component';
import { PostPageComponent } from './posts/post-page/post-page.component';
import { PostsComponent } from './posts/posts.component';
import { ProfileComponent } from './profile/profile.component';
import { SavedComponent } from './profile/saved/saved.component';
import { StoryPageComponent } from './profile/story-page/story-page.component';
import { RegistrationComponent } from './registration/registration.component';
import { SearchComponent } from './search/search.component';

<<<<<<< HEAD
const routes: Routes = [
  {path:'', component:PostsComponent},
  {path:'profile', component:ProfileComponent},
  {path:'new-post', component:NewPostComponent},
  {path:'post/:id', component:PostPageComponent},
  {path:'story/:id', component:StoryPageComponent},
  {path:'saved', component:SavedComponent},
  {path:'search/:option/:searchWord', component:SearchComponent},
	{
=======
import { EditComponent } from './accounts/edit/edit.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
    {
>>>>>>> develop
        path: "accounts/edit",
        component: EditComponent
    },
    {
        path: "registration",
        component: RegistrationComponent
    },
    {
      path: 'login',
      component: LoginComponent
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
