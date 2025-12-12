import { ChangeDetectorRef, Component } from '@angular/core';
import { ApiService } from '../../servicio/servicios';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

export interface Usuario {
  id?: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
}

@Component({
  selector: 'app-pagina-principal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pagina-principal.html',
  styleUrls: ['./pagina-principal.scss'],
})
export class PaginaPrincipal {
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  numeroUsuarios: number[] = [1, 5, 7, 10];
  tamanoPaginas = 5;
  paginaPrincipal = 1;
  textoBusqueda = '';
  modoEditar = false;
  usuarioSeleccionado: Usuario = this.usuarioVacio();

  constructor(private apiService: ApiService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.consultaUsuarios();
  }

  consultaUsuarios() {
    this.apiService.get('users').subscribe({
      next: (response: any) => {
        this.usuarios = response.map((u: any, i: number) => ({
          id: u.id ?? i + 1,
          name: u.name,
          username: u.username,
          email: u.email,
          phone: u.phone,
          website: u.website,
        }));

        this.usuariosFiltrados = [...this.usuarios];
        this.actualizarPaginado();
        //Sirve para actualizar la vista después de la llamada
        this.cd.detectChanges();
      },
      error: (err) => console.error('Error:', err),
    });
  }

  buscarUsuario() {
    const texto = this.textoBusqueda.toLowerCase();

    this.usuariosFiltrados = this.usuarios.filter(
      (u) =>
        u.name.toLowerCase().includes(texto) ||
        u.username.toLowerCase().includes(texto) ||
        u.email.toLowerCase().includes(texto) ||
        u.phone.toLowerCase().includes(texto) ||
        u.website.toLowerCase().includes(texto)
    );

    this.paginaPrincipal = 1;
    this.actualizarPaginado();
  }

  get usuariosPaginados(): Usuario[] {
    const start = (this.paginaPrincipal - 1) * this.tamanoPaginas;
    return this.usuariosFiltrados.slice(start, start + this.tamanoPaginas);
  }

  cambiarCantidadUsuarios(event: any) {
    this.tamanoPaginas = Number(event.target.value);
    this.paginaPrincipal = 1;
    this.actualizarPaginado();
  }

  cambiarPagina(n: number) {
    if (n >= 1 && n <= this.totalPaginas) {
      this.paginaPrincipal = n;
    }
  }

  actualizarPaginado() {}

  get totalPaginas() {
    return Math.ceil(this.usuariosFiltrados.length / this.tamanoPaginas);
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  usuarioVacio(): Usuario {
    return {
      name: '',
      username: '',
      email: '',
      phone: '',
      website: '',
    };
  }

  abrirNuevoUsuario() {
    this.modoEditar = false;
    this.usuarioSeleccionado = this.usuarioVacio();
  }

  abrirEditar(usuario: Usuario) {
    this.modoEditar = true;
    this.usuarioSeleccionado = { ...usuario };
  }

  guardarUsuario() {
    if (!this.usuarioSeleccionado.name.trim()) {
      Swal.fire('Error', 'El nombre es obligatorio', 'error');
      return;
    }

    if (this.modoEditar) {
      this.editarUsuario();
    } else {
      this.crearUsuario();
    }
  }

  crearUsuario() {
    const nuevoId = Math.max(...this.usuarios.map((u) => u.id || 0), 0) + 1;
    const nuevoUsuario = { ...this.usuarioSeleccionado, id: nuevoId };
    this.usuarios.push(nuevoUsuario);
    this.buscarUsuario();

    Swal.fire('Éxito', 'Usuario creado correctamente', 'success');
  }

  editarUsuario() {
    this.usuarios = this.usuarios.map((u) =>
      u.id === this.usuarioSeleccionado.id ? this.usuarioSeleccionado : u
    );

    this.buscarUsuario();

    Swal.fire('Editado', 'Usuario actualizado', 'success');
  }

  eliminarUsuario(id: number) {
    Swal.fire({
      title: '¿Eliminar usuario?',
      text: 'Esto no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((res) => {
      if (res.isConfirmed) {
        this.usuarios = this.usuarios.filter((u) => u.id !== id);
        this.buscarUsuario();

        Swal.fire('Eliminado', 'Usuario eliminado', 'success');
      }
    });
  }
}
