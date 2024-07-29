import { Programa } from "../../domain/academico/Programa";
import { ProgramaRepositorio } from "../../repositorio/academico/ProgramaRepositorio";
import { ServicoBase } from "../base/ServicoBase";

export class ProgramaServico extends ServicoBase<Programa> {
  constructor() {
    super(new ProgramaRepositorio());
  }
  getByAnoAndPolo(ano: string, poloId: string): Programa[] {
    return (this.repositorio as ProgramaRepositorio).getByAnoAndPolo(
      ano,
      poloId
    );
  }
  getByAnoAndPoloAndId(ano: string, poloId: string, id: any): Programa {
    return (this.repositorio as ProgramaRepositorio).getByAnoAndPoloAndId(
      ano,
      poloId,
      id
    );
  }
}
