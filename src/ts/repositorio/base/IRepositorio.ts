import { IContexto } from "../contexto/IContexto";

export declare interface IRepositorio<T>{
    contexto:IContexto;
    get():T[];
    getById(id:any):T;
}