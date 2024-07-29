import * as functions from './functions';
import * as aplication from './aplication';

(global as any).getPermissoes = aplication.getPermissoes;
(global as any).getAnosFirebase = aplication.getAnosFirebase;

(global as any).abrePlanilhaFrequencia = functions.abrePlanilhaFrequencia;
(global as any).copiaAlunosParaFrequencia=functions.copiaAlunosParaFrequencia;

(global as any).Diretorio = functions.Diretorio;

(global as any).getOrCreatePlanilha = functions.getOrCreatePlanilha;
(global as any).convertePlanilhaEmJSON = functions.convertePlanilhaEmJSON;
