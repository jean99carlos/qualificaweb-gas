import { AnoServico } from "./services/academico/AnoServico";
import { UsuarioServico } from "./services/base/UsuarioServico";

export function getAnosFirebase(){
  return new AnoServico().getAll();
}

export function getPermissoes() {
  return new UsuarioServico().getPermissoes(Session.getActiveUser().getEmail());
}
