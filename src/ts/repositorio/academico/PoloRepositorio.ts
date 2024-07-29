import { Polo } from "../../domain/academico/Polo";
import { RepositorioBase } from "../base/RepositorioBase";
import { ContextoFirestore } from "../contexto/ContextoFirestore";

export class PoloRepositorio extends RepositorioBase<Polo> {
  constructor() {
    super(new ContextoFirestore(null, ""));
  }
  static map(obj: any) {
    const parse = {
      id: obj.name.split("/").pop(),
      polo: obj.fields.polo.stringValue,
    };
    return parse;
  }
  getByAno(ano: string): Polo[] {
    (this.contexto as ContextoFirestore).entity = `ano/${ano}/polo`;
    const data: any[] = this.contexto.get();
    const grupos: Polo[] = data.map((grupo: any) => {
      let { id, polo } = PoloRepositorio.map(grupo);
      return new Polo(id, polo);
    });
    return grupos;
  }
  getByAnoAndId(ano:string,id: any): Polo {
    (this.contexto as ContextoFirestore).entity = `ano/${ano}/polo`;
    let data: any[] = this.contexto.getById(id);
    let { polo } = PoloRepositorio.map(data[0]);
    const user = new Polo(id, polo);
    return user;
  }
}
