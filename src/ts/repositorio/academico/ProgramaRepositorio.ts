import { Programa } from "../../domain/academico/Programa";
import { RepositorioBase } from "../base/RepositorioBase";
import { ContextoFirestore } from "../contexto/ContextoFirestore";

export class ProgramaRepositorio extends RepositorioBase<Programa> {
  constructor() {
    super(new ContextoFirestore(null, ""));
  }
  static map(obj: any) {
    const parse = {
      id: obj.name.split("/").pop(),
      nome: obj.fields.nome.stringValue,
    };
    return parse;
  }
  getByAnoAndPolo(ano: string,poloId:string): Programa[] {
    (this.contexto as ContextoFirestore).entity = `ano/${ano}/polo/${poloId}`;
    const data: any[] = this.contexto.get();
    const grupos: Programa[] = data.map((grupo: any) => {
      let { id, nome } = ProgramaRepositorio.map(grupo);
      return new Programa(id,nome);
    });
    return grupos;
  }
  getByAnoAndPoloAndId(ano:string,poloId:string,id: any): Programa {
    (this.contexto as ContextoFirestore).entity = `ano/${ano}/polo/${poloId}`;
    let data: any[] = this.contexto.getById(id);
    let { nome } = ProgramaRepositorio.map(data[0]);
    const user = new Programa(id, nome);
    return user;
  }
}
