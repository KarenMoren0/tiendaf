import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service'; // Importa el servicio de autenticación

@Component({
  selector: 'app-login', // Selector para usar el componente
  templateUrl: './login.component.html', // Ruta al archivo de plantilla HTML
  styleUrls: ['./login.component.css'] // Ruta al archivo de estilos
})
export class LoginComponent {
  loginForm: FormGroup; // FormGroup para manejar el formulario de inicio de sesión

  constructor(private formBuilder: FormBuilder, private authService: AuthService) {
    // Inicializa el formulario con validaciones
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]], // Campo email
      password: ['', [Validators.required, Validators.minLength(6)]] // Campo password
    });
  }

  // Método para manejar el envío del formulario
  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value; // Obtiene los valores del formulario
      this.authService.login(email, password).subscribe({
        next: (response) => {
          console.log('Inicio de sesión exitoso', response);
          // Maneja el inicio de sesión exitoso (redirección, notificación, etc.)
        },
        error: (error) => {
          console.error('Error al iniciar sesión', error);
          // Maneja el error de inicio de sesión
        }
      });
    }
  }
}
