import { Usuario } from "../../domain/base/Usuario";
import { ContextoFirestore } from "../contexto/ContextoFirestore";
import { RepositorioBase } from "./RepositorioBase";

export class UsuarioRepositorio extends RepositorioBase<Usuario> {
  constructor() {
    super(new ContextoFirestore(null, "usuario"));
  }
  static map(obj: any): any {
    const parse = {
      email: obj.name.split("/").pop(),
      grupo: obj.fields.grupo.referenceValue.split("/").pop(),
    };
    return parse;
  }
  get(): Usuario[] {
    let data: any[] = this.contexto.get();
    let users: Usuario[] = data.map((usuario: any) => {
      let { email, grupo } = UsuarioRepositorio.map(usuario);
      return new Usuario(email, grupo);
    });
    return users;
  }
  getById(id: any): Usuario {
    let data: any[] = this.contexto.getById(id);
    let { email, grupo } = UsuarioRepositorio.map(data[0]);
    const user = new Usuario(email, grupo);
    return user;
  }
}
