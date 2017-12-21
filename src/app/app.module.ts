import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule,
         HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './routing/app-routing.module';

import { AuthUserGuard,
         AuthVisitorGuard } from './_guards';
import { AuthenticationService,
         TokenInterceptor,
         RedirectPreviousUrl,
         DatasetsService,
         NotificationsService } from './_services';

import { AppComponent } from './app.component';
import { RegisterComponent,
         RegisterNotfoundComponent } from './register';
import { LoginComponent } from './login';
import { ProfileComponent } from './profile';
import { HeaderComponent,
         FooterComponent,
         PasswordCheckComponent } from './shared';
import { HomeComponent } from './home';
import { DatasetComponent,
         DatasetformComponent,
         DatasetDirective,
         GeneralinfoComponent,
         DatasetlogComponent,
         HistoryComponent,
         ActionbarComponent } from './dataset';
import { DashboardComponent,
         DashboardactionsComponent } from './dashboard';
import { PageNotFoundComponent } from './page-not-found';

import { UsersComponent,
         UserDetailComponent } from './users';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    RegisterNotfoundComponent,
    LoginComponent,
    ProfileComponent,
    PageNotFoundComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    DatasetComponent,
    DashboardComponent,
    DatasetformComponent,
    DatasetDirective,
    PasswordCheckComponent,
    UsersComponent,
    UserDetailComponent,
    GeneralinfoComponent,
    DashboardactionsComponent,
    ActionbarComponent,
    HistoryComponent,
    DatasetlogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,    
    HttpClientModule,
    AppRoutingModule    
  ],
  entryComponents: [ DatasetformComponent, HistoryComponent ],
  providers: [
    AuthVisitorGuard,
    AuthUserGuard,
    AuthenticationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    RedirectPreviousUrl,
    DatasetsService,
    NotificationsService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
