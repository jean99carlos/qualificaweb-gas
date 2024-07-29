import { ContextoBase } from "../contexto/ContextoBase";
import { IContexto } from "../contexto/IContexto";
import { IRepositorio } from "./IRepositorio";

export abstract class RepositorioBase<T> implements IRepositorio<T> {
  contexto: ContextoBase;
  constructor(contexto: IContexto) {
    this.contexto = contexto;
  }
  get(): T[] {
    throw new Error("Method not implemented.");
  }
  getById(id: any): T {
    throw new Error("Method not implemented.");
  }
}
