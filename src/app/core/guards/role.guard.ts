import { Injectable } from '@angular/core';

import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router
} from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot
  ): boolean {

    const role =
      this.authService.getRole();

    const allowedRoles =
      route.data['roles'];

    if (
      role &&
      allowedRoles.includes(role)
    ) {
      return true;
    }

    this.router.navigate([
      '/dashboard'
    ]);

    return false;
  }
}