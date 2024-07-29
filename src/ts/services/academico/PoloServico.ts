import { Polo } from "../../domain/academico/Polo";
import { PoloRepositorio } from "../../repositorio/academico/PoloRepositorio";
import { ServicoBase } from "../base/ServicoBase";

export class PoloServico extends ServicoBase<Polo> {
  constructor() {
    super(new PoloRepositorio());
  }
  getByAno(ano: string): Polo[] {
    return (this.repositorio as PoloRepositorio).getByAno(ano);
  }
  getByAnoAndId(ano: string, id: any): Polo {
    return (this.repositorio as PoloRepositorio).getByAnoAndId(ano, id);
  }
}
