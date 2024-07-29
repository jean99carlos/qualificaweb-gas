import { Ano } from "../../domain/academico/Ano";
import { AnoRepositorio } from "../../repositorio/academico/AnoRepositorio";
import { ServicoBase } from "../base/ServicoBase";

export class AnoServico extends ServicoBase<Ano> {
  constructor() {
    super(new AnoRepositorio());
  }
  getAll() {
    return this.repositorio.get();
  }
  getById(id: any): Ano {
    return this.repositorio.getById(id);
  }
}
