import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RoleGuard } from './core/guards/role.guard';

// Core
import { AuthGuard } from './core/guards/auth.guard';
import { NoAuthGuard } from './core/guards/no-auth.guard';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';

// Shared components
import { HeaderComponent } from './shared/components/header/header.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { ToastNotificationsComponent } from './shared/components/toast-notifications/toast-notifications.component';

// Services
import { AuthService } from './services/auth.service';
import { PatientService } from './services/patient.service';
import { DoctorService } from './services/doctor.service';
import { AppointmentService } from './services/appointment.service';
import { NotificationService } from './services/notification.service';
import { ReportService } from './services/report.service';
import { LoadingService } from './services/loading.service';
import { ToastService } from './services/toast.service';
import { UserService } from './services/user.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    LoadingSpinnerComponent,
    ToastNotificationsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    AuthGuard,
    NoAuthGuard,
    AuthService,
    PatientService,
    DoctorService,
    RoleGuard,
    UserService,
    AppointmentService,
    NotificationService,
    ReportService,
    LoadingService,
    ToastService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
