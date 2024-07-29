import { IContexto } from "./IContexto";

export abstract class ContextoBase implements IContexto {
  contexto: any;
  constructor(contexto: any) {
    this.contexto = contexto;
  }
  abstract get(): any[];
  abstract getById(id: any): any;
}
