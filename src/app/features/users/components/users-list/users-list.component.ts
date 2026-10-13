import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../../../../core/models/usuario.model';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  usuarios: Usuario[] = [];

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.userService.listar().subscribe(data => this.usuarios = data);
  }

  nuevoUsuario(): void {
    this.router.navigate(['/users/new']);
  }

  editar(id: number): void {
    this.router.navigate(['/users/edit', id]);
  }

  password(id: number): void {
    this.router.navigate(['/users/password', id]);
  }

  eliminar(id: number): void {
    if (confirm('¿Eliminar usuario?')) {
      this.userService.eliminar(id).subscribe(() => this.cargarUsuarios());
    }
  }
}
