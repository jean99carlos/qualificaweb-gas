import { Ano } from "../../domain/academico/Ano";
import { ContextoFirestore } from "../contexto/ContextoFirestore";
import { RepositorioBase } from "../base/RepositorioBase";

export class AnoRepositorio extends RepositorioBase<Ano> {
  constructor() {
    super(new ContextoFirestore(null, "ano"));
  }
  static map(obj: any) {
    const parse = {
      ano: obj.name.split("/").pop(),
    };
    return parse;
  }
  get(): Ano[] {
    const data: any[] = this.contexto.get();
    const grupos: Ano[] = data.map((grupo: any) => {
      let { ano } = AnoRepositorio.map(grupo);
      return new Ano(ano);
    });
    return grupos;
  }
  getById(id: any): Ano {
    let data: any[] = this.contexto.getById(id);
    let { ano } = AnoRepositorio.map(data[0]);
    const user = new Ano(ano);
    return user;
  }
}
