import { Usuario } from "../../domain/base/Usuario";
import { GrupoUsuarioRepositorio } from "../../repositorio/base/GrupoUsuarioRepositorio";
import { UsuarioRepositorio } from "../../repositorio/base/UsuarioRepositorio";
import { ServicoBase } from "./ServicoBase";

export class UsuarioServico extends ServicoBase<Usuario> {
  constructor() {
    super(new UsuarioRepositorio());
  }
  getAll() {
    return this.repositorio.get();
  }
  getById(id: any): Usuario {
    return this.repositorio.getById(id);
  }
  getAtivo() {
    const ativo = this.repositorio.getById(Session.getActiveUser().getEmail());
    return ativo;
  }
  getPermissoes(id:string){
    const ativo = this.repositorio.getById(id);
    const grupo = new GrupoUsuarioRepositorio().getById(ativo.grupo);
    return grupo.permissoes
  }
}
