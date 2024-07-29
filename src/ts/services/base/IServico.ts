import { IRepositorio } from "../../repositorio/base/IRepositorio";

export declare interface IServico<T>{
    repositorio:IRepositorio<T>;
    getAll():T[];
    getById(id:any):T;    
}