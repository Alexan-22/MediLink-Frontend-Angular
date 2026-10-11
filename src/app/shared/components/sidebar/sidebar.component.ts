import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  menuItems: any[] = [];

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit(): void {

    const role =
      this.authService.getRole();

    switch (role) {

      case 'ADMIN':

        this.menuItems = [

          {
            path: '/dashboard',
            label: 'Dashboard',
            icon: 'dashboard'
          },

          {
            path: '/patients',
            label: 'Pacientes',
            icon: 'people'
          },

          {
            path: '/doctors',
            label: 'Médicos',
            icon: 'medical_services'
          },

          {
            path: '/appointments',
            label: 'Citas',
            icon: 'calendar_today'
          },

          {
            path: '/notifications',
            label: 'Notificaciones',
            icon: 'notifications'
          },

          {
            path: '/reports',
            label: 'Reportes',
            icon: 'bar_chart'
          },
          {
            path:'/users',
            label:'Usuarios',
            icon:'manage_accounts'
          }
        ];

        break;

      case 'RECEPCIONISTA':

        this.menuItems = [

          {
            path: '/dashboard',
            label: 'Dashboard',
            icon: 'dashboard'
          },

          {
            path: '/patients',
            label: 'Pacientes',
            icon: 'people'
          },

          {
            path: '/doctors',
            label: 'Médicos',
            icon: 'medical_services'
          },

          {
            path: '/appointments',
            label: 'Citas',
            icon: 'calendar_today'
          },

          {
            path: '/notifications',
            label: 'Notificaciones',
            icon: 'notifications'
          }
        ];

        break;

      case 'MEDICO':

        this.menuItems = [

          {
            path: '/dashboard',
            label: 'Dashboard',
            icon: 'dashboard'
          },

          {
            path: '/appointments',
            label: 'Citas',
            icon: 'calendar_today'
          },

          {
            path: '/notifications',
            label: 'Notificaciones',
            icon: 'notifications'
          }
        ];

        break;

      case 'ENFERMERA':

        this.menuItems = [

          {
            path: '/dashboard',
            label: 'Dashboard',
            icon: 'dashboard'
          },

          {
            path: '/patients',
            label: 'Pacientes',
            icon: 'people'
          },

          {
            path: '/appointments',
            label: 'Citas',
            icon: 'calendar_today'
          },

          {
            path: '/notifications',
            label: 'Notificaciones',
            icon: 'notifications'
          }
        ];

        break;

      default:

        this.menuItems = [];
    }
  }
}