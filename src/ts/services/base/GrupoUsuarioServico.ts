import { GrupoUsuario } from "../../domain/base/GrupoUsuario";
import { GrupoUsuarioRepositorio } from "../../repositorio/base/GrupoUsuarioRepositorio";
import { ServicoBase } from "./ServicoBase";


export class GrupoUsuarioServico extends ServicoBase<GrupoUsuario> {
  constructor() {
    super(new GrupoUsuarioRepositorio());
  }
  getAll() {
    return this.repositorio.get();
  }
  getById(id: any): GrupoUsuario {
    throw new Error("Method not implemented.");
  }
}
