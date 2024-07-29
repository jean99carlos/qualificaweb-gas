import { IRepositorio } from "../../repositorio/base/IRepositorio";
import { IServico } from "./IServico";

export abstract class ServicoBase<T> implements IServico<T> {
  repositorio: IRepositorio<T>;
  constructor(repositorio: IRepositorio<T>) {
    this.repositorio = repositorio;
  }
  getAll(): T[] {
    throw new Error("Method not implemented.");
  }
  getById(id: any): T {
    throw new Error("Method not implemented.");
  }
}
