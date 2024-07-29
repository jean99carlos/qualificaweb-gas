import { Permissao } from "./Permissao";

export class GrupoUsuario {
  nome: string;
  permissoes: Permissao[];
  ativo: boolean;
  constructor(nome: string, permissoes: Permissao[], ativo: boolean) {
    this.nome = nome;
    this.permissoes = permissoes;
    this.ativo = ativo;
  }
  temPermissao(nomePermissao: string) {
    return this.permissoes.some((permissao) => permissao.nome == nomePermissao);
  }
}
