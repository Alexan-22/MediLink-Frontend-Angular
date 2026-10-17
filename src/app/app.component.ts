import { Component, HostListener, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'medilink-frontend';
  menuAbierto = false;
  pantallaCompacta = window.innerWidth <= 1024;

  @ViewChild('menuButton') menuButton?: ElementRef<HTMLButtonElement>;

  constructor(public authService: AuthService) {}

  alternarMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenu(): void {
    if (!this.menuAbierto) return;
    this.menuAbierto = false;
    this.menuButton?.nativeElement.focus();
  }

  @HostListener('window:resize')
  ajustarPantalla(): void {
    this.pantallaCompacta = window.innerWidth <= 1024;
    if (!this.pantallaCompacta) this.menuAbierto = false;
  }

  @HostListener('document:keydown.escape')
  cerrarConEscape(): void {
    this.cerrarMenu();
  }
}