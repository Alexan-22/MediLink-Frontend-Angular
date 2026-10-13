import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

interface MenuItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  menuItems: MenuItem[] = [];
  username = '';
  role = '';

  private readonly items: Record<string, MenuItem> = {
    dashboard: {
      path: '/dashboard', label: 'Dashboard', icon: 'dashboard'
    },
    patients: {
      path: '/patients', label: 'Pacientes', icon: 'people'
    },
    doctors: {
      path: '/doctors', label: 'Médicos', icon: 'medical_services'
    },
    appointments: {
      path: '/appointments', label: 'Citas', icon: 'calendar_today'
    },
    myAppointments: {
      path: '/appointments/me', label: 'Mis citas', icon: 'event_note'
    },
    notifications: {
      path: '/notifications', label: 'Notificaciones', icon: 'notifications'
    },
    reports: {
      path: '/reports', label: 'Reportes', icon: 'bar_chart'
    },
    users: {
      path: '/users', label: 'Usuarios', icon: 'manage_accounts'
    }
  };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername() || '';
    this.role = this.authService.getRole() || '';

    const menus: Record<string, string[]> = {
      ADMIN: [
        'dashboard', 'patients', 'doctors', 'appointments',
        'notifications', 'reports', 'users'
      ],
      RECEPCIONISTA: [
        'dashboard', 'patients', 'doctors', 'appointments', 'notifications'
      ],
      MEDICO: ['dashboard', 'appointments', 'notifications'],
      ENFERMERA: ['dashboard', 'patients', 'appointments', 'notifications'],
      PACIENTE: ['dashboard', 'myAppointments']
    };

    this.menuItems = (menus[this.role] || []).map(key => ({
      ...this.items[key],
      label: this.role === 'PACIENTE' && key === 'dashboard'
        ? 'Inicio'
        : this.items[key].label
    }));
  }

  get nombreRol(): string {
    const nombres: Record<string, string> = {
      ADMIN: 'Administrador',
      RECEPCIONISTA: 'Recepcionista',
      MEDICO: 'Médico',
      ENFERMERA: 'Enfermera',
      PACIENTE: 'Paciente'
    };

    return nombres[this.role] || 'Usuario';
  }
}