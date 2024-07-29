import { GrupoUsuario } from "./GrupoUsuario";

export class Usuario {
  email: string;
  grupo: GrupoUsuario;
  constructor(email: string, grupo: GrupoUsuario) {
    this.email = email;
    this.grupo = grupo;
  }
}
