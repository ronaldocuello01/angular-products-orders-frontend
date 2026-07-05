import { HttpErrorResponse } from '@angular/common/http';

/**
 * The backend's errorHandler middleware responds with { message: string }.
 * Falls back to a generic message for network errors or unexpected shapes.
 */
export function extractErrorMessage(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    if (error.error && typeof error.error.message === 'string') {
      return error.error.message;
    }
    if (error.status === 0) {
      return 'No se pudo conectar con el servidor. ¿Está corriendo el API?';
    }
  }
  return 'Ocurrió un error inesperado.';
}
