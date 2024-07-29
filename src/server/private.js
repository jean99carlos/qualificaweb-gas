/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Diretorio": () => (/* binding */ Diretorio),
/* harmony export */   "abrePlanilhaAlunos": () => (/* binding */ abrePlanilhaAlunos),
/* harmony export */   "abrePlanilhaFrequencia": () => (/* binding */ abrePlanilhaFrequencia),
/* harmony export */   "convertePlanilhaEmJSON": () => (/* binding */ convertePlanilhaEmJSON),
/* harmony export */   "copiaAlunosParaFrequencia": () => (/* binding */ copiaAlunosParaFrequencia),
/* harmony export */   "getCertificado": () => (/* binding */ getCertificado),
/* harmony export */   "getFrequencia": () => (/* binding */ getFrequencia),
/* harmony export */   "getOrCreatePlanilha": () => (/* binding */ getOrCreatePlanilha),
/* harmony export */   "getToken": () => (/* binding */ getToken),
/* harmony export */   "getUserAndToken": () => (/* binding */ getUserAndToken),
/* harmony export */   "getUserInfo": () => (/* binding */ getUserInfo),
/* harmony export */   "setFrequencia": () => (/* binding */ setFrequencia)
/* harmony export */ });
function convertePlanilhaEmJSON(arquivoPlanilha) {
    const planilha = SpreadsheetApp.open(arquivoPlanilha);
    const matriz = planilha.getDataRange().getValues();
    const json = {};
    matriz.forEach((linha) => {
        const [chave, valor] = linha;
        if (chave.startsWith("json"))
            json[chave] = JSON.parse(valor);
        else if (chave.startsWith("list"))
            json[chave] = valor.split(",");
        else
            json[chave] = valor;
    });
    const jsonString = JSON.stringify(json);
    return jsonString;
}
class Diretorio {
    static getFolderId(folderName) {
        var query = "mimeType='application/vnd.google-apps.folder' and trashed=false and name='" +
            folderName +
            "'";
        var options = {
            method: "GET",
            headers: {
                Authorization: "Bearer " + ScriptApp.getOAuthToken(),
            },
        };
        var response = UrlFetchApp.fetch("https://www.googleapis.com/drive/v3/files?q=" +
            encodeURIComponent(query), options);
        var result = JSON.parse(response.getContentText());
        if (result.files.length == 0) {
            throw new Error("Pasta não encontrada: " + folderName);
        }
        else {
            return result.files[0].id;
        }
    }
    static listFoldersInDirectory(parentFolderName, isId = false) {
        var _a;
        if (!isId)
            parentFolderName = Diretorio.getFolderId(parentFolderName);
        const query = (parentFolderName == "root" ? "root" : '"' + parentFolderName + '"') +
            ' in parents and trashed = false and mimeType = "application/vnd.google-apps.folder"';
        let folders;
        let pageToken = null;
        let foldersList = [];
        do {
            try {
                folders = (_a = Drive.Files) === null || _a === void 0 ? void 0 : _a.list({
                    q: query,
                    maxResults: 100,
                    pageToken: pageToken,
                });
                if (!folders || !folders.items || folders.items.length === 0) {
                    throw new Error("Nenhuma pasta encontrada em " + parentFolderName);
                }
                for (let i = 0; i < folders.items.length; i++) {
                    const folder = folders.items[i];
                    foldersList.push({ title: folder.title, id: folder.id });
                }
                pageToken = folders.nextPageToken;
            }
            catch (err) {
                Logger.log(err);
                throw new Error("Arquivo não encontrado.");
            }
        } while (pageToken);
        return foldersList;
    }
    static createFolderInsideAnother(folderName, parentFolderId) {
        parentFolderId = Diretorio.getFolderId(parentFolderId);
        var folder = {
            name: folderName,
            mimeType: "application/vnd.google-apps.folder",
            parents: [parentFolderId],
        };
        var options = {
            method: "POST",
            headers: {
                Authorization: "Bearer " + ScriptApp.getOAuthToken(),
                "Content-Type": "application/json",
            },
            payload: JSON.stringify(folder),
        };
        var response = UrlFetchApp.fetch("https://www.googleapis.com/drive/v3/files", options);
        var result = JSON.parse(response.getContentText());
        return result.id;
    }
    static createFolderInRoot(folderName) {
        folderName = "Banco de Dados";
        var folder = {
            name: folderName,
            mimeType: "application/vnd.google-apps.folder",
        };
        var options = {
            method: "POST",
            headers: {
                Authorization: "Bearer " + ScriptApp.getOAuthToken(),
                "Content-Type": "application/json",
            },
            payload: JSON.stringify(folder),
        };
        var response = UrlFetchApp.fetch("https://www.googleapis.com/drive/v3/files", options);
        var result = JSON.parse(response.getContentText());
        return result.id;
    }
    static listRootFolders() {
        var _a;
        const query = '"root" in parents and trashed = false and mimeType = "application/vnd.google-apps.folder"';
        let folders;
        let pageToken = null;
        let folderList = [];
        do {
            try {
                folders = (_a = Drive.Files) === null || _a === void 0 ? void 0 : _a.list({
                    q: query,
                    maxResults: 100,
                    pageToken: pageToken,
                });
                if (!folders || !folders.items || folders.items.length === 0) {
                    throw new Error("No folders found.");
                }
                for (let i = 0; i < folders.items.length; i++) {
                    const folder = folders.items[i];
                    folderList.push({ title: folder.title, id: folder.id });
                }
                pageToken = folders.nextPageToken;
            }
            catch (err) {
                throw new Error(err.message);
            }
        } while (pageToken);
        return folderList;
    }
    static abrir(pastaOrigem, nomePastaDestino, subpastas = true) {
        let pastas = pastaOrigem.filter((x) => x.title == nomePastaDestino);
        if (pastas.length > 0 && pastas[0].id) {
            if (!subpastas)
                return pastas[0];
            else
                return Diretorio.listFoldersInDirectory(pastas[0].id, true);
        }
        else {
            throw new Error(`Não foi possível abrir ${nomePastaDestino}!`);
        }
    }
    static porCaminho(caminho, subpastas = true) {
        const itens = caminho.split("/");
        const pos = itens[itens.length - 1] == "" ? itens.length - 2 : itens.length - 1;
        let pasta = Diretorio.abrir(Diretorio.root, "Banco de Dados");
        for (let i = 1; i <= pos; i++) {
            if (!subpastas && i == pos)
                pasta = Diretorio.abrir(pasta, itens[i], false);
            else
                pasta = Diretorio.abrir(pasta, itens[i]);
        }
        return pasta;
    }
    static subpastasEmJson(pasta) {
        const subpastas = pasta;
        let json = [];
        subpastas.forEach((subpasta) => {
            if (subpasta.title)
                json.push(subpasta.title);
        });
        return json;
    }
}
Diretorio.root = Diretorio.listRootFolders();

function abrePlanilhaFrequencia(ano, polo, programa, curso, turma, disciplina) {
    const pasta = Diretorio.porCaminho(`/${ano}/${polo}/${programa}/${curso}/${turma}/${disciplina}`, false);
    const urlPlanilha = getOrCreatePlanilha(pasta, "Frequência");
    const planilha = SpreadsheetApp.openByUrl(urlPlanilha);
    return planilha;
}
function abrePlanilhaAlunos(ano, polo, programa, curso, turma) {
    const pasta = Diretorio.porCaminho(`/${ano}/${polo}/${programa}/${curso}/${turma}`, false);
    const urlPlanilha = getOrCreatePlanilha(pasta, "Alunos");
    const planilha = SpreadsheetApp.openByUrl(urlPlanilha);
    return planilha;
}
function getOrCreatePlanilha(pasta, nomeArquivo) {
    const pastaId = pasta.id;
    const accessToken = ScriptApp.getOAuthToken();
    const url = `https://www.googleapis.com/drive/v3/files?q=name='${nomeArquivo}'+and+mimeType='application/vnd.google-apps.spreadsheet'+and+trashed=false+and+'${pastaId}'+in+parents&fields=files(id,name,mimeType,parents,webViewLink)`;
    const headers = { Authorization: `Bearer ${accessToken}` };
    const params = {
        headers: headers,
        method: 'GET',
        contentType: 'application/json',
        muteHttpExceptions: true
    };
    const response = UrlFetchApp.fetch(url, params);
    const files = JSON.parse(response.getContentText()).files;
    if (files.length > 0) {
        console.log(files[0]);
        return files[0].webViewLink;
    }
    const metadata = {
        name: nomeArquivo,
        parents: [pastaId],
        mimeType: 'application/vnd.google-apps.spreadsheet'
    };
    const options = {
        headers: headers,
        method: 'POST',
        contentType: 'application/json',
        payload: JSON.stringify(metadata),
        muteHttpExceptions: true
    };
    const fileResponse = UrlFetchApp.fetch('https://www.googleapis.com/drive/v3/files', options);
    const newFile = JSON.parse(fileResponse.getContentText());
    return newFile.webViewLink;
}
function getCertificado(data) {
    data = {
        nome: "Jean Carlos Santos Serafini de Sousa",
        cpf: "090.367.706-70",
        codigo: "",
        link: "",
        curso: "ELETRICISTA DE SISTEMAS DE ENERGIAS RENOVAVEIS (INSTALADOR DE PAINEIS FOTOVOLTAICOS)",
        cargaHoraria: "200",
        programa: "QUALIFICA MAIS ENERGIF",
        logoPrograma: "https://lh3.googleusercontent.com/fife/APg5EOZlJprHyo8px76ryT8p-QsCffne8Q-ilBteM7omyN80-VhaZ5uCnAsRC-36aClLnnJMo9KGmbiJdWY1jODBuRYVfjcURaYFIYkDSjyDEQoZh1u6sZhsj7kTVH3Auw2KRbBSCzqwVk8EMH0SyE5j58awDUsvuifbFBSN2XGJpvpJ_e7Ze5CS7xvGTIUvdxhGK9bzYYCx-qpnCGKeOa-BNFnQ09hlbEF-E3P9fplKVpSRW6u2HMMHGdjWD36sFu0JqJm00ib_iblWQnxKrJ_EmWXTgzI4z5E5vQ39UmmAuKwxkwJn1ILbIsKIdOYDSz-awQOF4uMmwiZN2wzmtxSnmVv9M18XushwNt0L2_WkoUP7swEwjTY-iPVBI8OuIXeeJ7igHF9wdmrvOI7480jk7ha9VHdi5h1iseb_hhEkZXeZ2uvbq_DJuKYFAvwgTMjUf6rJiv3iRSur6hm5fGOKFWfIrAdYIj7PlBmIjopMoOg_OzKyqmDuaqdh3HrO4znRWJE5ywA2GaRB79ThZkGUYc2TShxkIzQ4fS8tgb08urL3KhIFU0IvzQTCQ4nJcudUITmLbWxH-C058eu6V_gZHD_L-U4ewhoXoS0e2-IqhY6k2OzoiS2ANugolbtuRelFQ58YoB6mkX5GLpECnMVOmzxzmmusrpFMxXAdGYqqRccG1aUZ5VRUL4AVg2GoKD_wLSX9lic7O5ycbv9FNKU1YwypFLXme7shBuzsB1XBqip-1HUOQfbYYRksWUsZrTA-LSlj2DhQwpJ1tR3iXb-ie_D8CvPebNNYDQZXJ463HriYXilzg1TLYUg09yhTrCd0MnyQYc7ULmFV17fvLXZ7qLhJNk12WQ0giqMYbY7Da_w5iWUI40XAZwMjsqcJva0OqGc1e0NI28j5Z9chHjOy3YvYW8pyxg3Fsm_hEtCIxtDmOSLChvTbKupIENmeD-Yzh_vG_TP0KCs2gV-3gqI5Q_EO4CIZuCpOQBlccP7mjfrY8Dn_HYq_p8hFFvyjJt2c3LpPiiphuGc9dTmzGxi898Kv79oGvCGsIhRviLQLQwWtvG_1H9fSY8KzQbJlNe76tU0122c5Kw0hVfFAMIxDlqmpHX3Fka3bhVUqgBaUHpzz6N6gVaZCfXyRHixWTf4eJy3DYI59nf-e4nmRghP-6pnGjJDArHt00ZCRRHcP24YWzDBstY14MbnZRHsmKtIBFtJnuPJJHp0FPKH3fI6LkcOQE0D37v-9tNMqFSm8-RKbq--TwFsFeuSUOdakE6TrBREcYYcqTlY1PJ4yZBiwZdizlCZNye7hzWy-yXYp-lO_Z73p00_z2IA3q1uzG7DH3uRWZXyyvfmsslpF_znPHfAQy2MpLRrzjSagTru13CsaaYeG__no4H6WmHWbzWrK996FzonfJQ6YD3Nlu4sVShX3_izYbNi_NC7RbDbYVYkLsG_eXspLRARJ3T2KPVIzKTfXVvWcNWMkGtqy2eo9lI9YlbRU=w1297-h932",
        logoUfv: "https://lh3.googleusercontent.com/fife/APg5EOYwQTuU0Lij00vAHkmt40cMLI122WDhEDXap_lKObKnlUlQcrs0Jj39Ux0zbQl8yLSAKq4fUUhf4eiCrB9puX83Wz_oFW0BIp3ZBqqdN5Xj9D_LGZyDEP6uuyp1USZXR2yiT0-yDkjeQ3FA0mvVpXTh1rq6USp0o0MSR_xI3vVzm2F02oCzSLHczeD6Ap47V0c78Z1hKjeABVNZDAvousAaaqp3ExjONC8e2VYwGOSniICbcy7vDyVhHi-HynheOWMYLpmIyFrMvpKR4tZHaM-PQy5CQy69opbui3cK2S6p8306AOMM2fqCFTusiKivd0tKcqEVvh1yRxHsqgx8-VeYfw4CQ6mD_Sse1DNH1uuzVkzslqu35zuUWwcg2jVF-QRj_F1KtrcuB3jcW5zNKhgsOnj9tNw-QckmT28magmqhQ5TAHkHWOaD1HCmcn-mlaOaPENNPfcCxe8MFCI4U3Cw8r2uEz2eJN1TO1vbqzgEOzRzefiEk8UQOr0V-aywSVLH8-3VwOlqVI6ZrGXvrfFgx_LMFG-IZFm97yQuu58gnjRM9rR70rmzAeeuh7nNr1teM8QNeZMFvV-jJzgvOf9HsslG28vYsjFaP1nNWL1pNCUX9twRjWGDlSxDjCwcB3r2extPIha4zFd7TCEVtBvnnSDtHBo92SJLfbWaxwKs1AVmcvqAqYNtA9EP1TRJGoCUm5YyOoDyVwvtsSEIkOfemqAIZPhUTqo0viVe-DtQx2mjO5OMByLoPrhr6qOdaOMjk19bVL8RA8C9bAlwv4L67xJSATWpu2jPGYKKWY1FtCcqyP3Kp-Gpb0bCpjZVAxhHcMXG0OAUTPOckur3eV_sRDqK1_kqJ6GIcTV6nk_W0mzOldNKkVaI9uBqZZC6RrmtxIucmJhIstn8AS7L1S5j_zUtMAfDaQn5bqzmYSNDw7nqJE6HWzGnE4RktuX-hzDlJKrfYn1kYKycEA2aHLL9FjqLIl-7IsdUlRW86rpnrl1dqUe2lwTsBhYpCzmICxdkOgMkDXnu3_0RscecYoS4XhVzyg249mHN5SLRv0dTmSU38a4VbNuA0jnqKGG4qxTUvCWZ8DKAuj1tbl_YSxvBy4-fMCS7yk2TL63YIOZOyBsToKGOt0MttHeudydCfuU_bmU7h5psuoIa_p3GKmPwjg7MWnKwe113eQHXRMlTzmbl8mE79SLUlAC6rcAro0NMRBMiMIc9R3XUbx5xAWfVKtbxR1zpQXNcyJ5NeksqVzt41VblE_7ii4mLH9oRSuuGx2FQe143aAQ-3tIpOlXhgqjmbb_R9i6iRm9mfFCqELGxLxJwixPcLw7FLzw-hNCySYr3b7GbmDkiCMlka2MpFjExXCv1vH7gJ9O77Z64KdEcTQwj4fJthJBJZGVKKcNHoAphbh7jj1PArzgpIbKKdnTYYJxpsNcVxvEea7lSfKgKnOROOimFGsAV4xjE_8sBs1-ON6OQTT1_ZlopA0HX3Etm=w1297-h932",
        logoGoverno: "https://lh3.googleusercontent.com/fife/APg5EOZG4meQbo3Gyqe77NuF8LAilzHZ_Rzfd6QzY30u2KZVvhrWcOsZrywWRXKUSZIipcUcjVpqJdSxH1ccUleMFygIH1NJ8r9hopzrePrS2mMfcG58_IEkugub_M8ARUPKwBAe9W1c2p8O14N7cLGURXFjFH1ODNAvjGusV4MLKWBFUutoBZw1Gjh8romqxYqUtmQbUs6B-Lzltq3A8jumCaRafv4a0X447u6VP4bhWL9aiVZCxh_zQyMh4__o__w5yCB6lHoCyMTdiz5J-xnQFzFsGMfcI4kUE4nD7EjdL44Aq0mtJ98Pi4ILsf4j9WaBJw7uiccm53Io4CA2XVDCJaAIwJP4gvWdGQhq0Gs67GziImwksPSS881d5zQZ4WRoB1IbqLzWQK9R-Zzy6w-RxEn9ViyVyRzyAsfA7FU32Zccs7A0MQdipt0JEmTXmW2U4e156qxnPyHWHOvvs1thoad4r--8ikPb6pEXvz6OyqN-Sr9Cvo80QWrOOin1BHtfEeHdd_83IH0nUS_NzKMO_niWUb8WZC6Bc_JEfBA6iuwS_EtfQZxK3M6joVwIGVmxoe5pnO4ZOcQJ8eQ13I-cDVikHrwJonWA3w5VlYnQzwiFF4Aj1Xb4KcaO_2pcjQFG3UoO-6n-HWoxXrk448Qr5cnmVwDFJqvH31FUVZxRVSTtkvVDH6BjimMMIrgVMtrfMs1ZCLjGU2NhRCFihmph5tEnxIS9pHFOI6Lqi-aIg8j83m-oWByybPpCVUr-4xBgF9rTwjaKxoXcznuwlBoxwxKv9HoWVdWAjYOwBdJ5NCMuj0fFLDrP_wFCrGmhyJY27JChBXv3EZrZo9rpEGwsp2-oMTztS0DvW1Axs81mdhSC63PqfOgDGr3tchVocHyR34ktQ8IbFtFGytjdGOhbNEgrRphxFZ0Y6dFb3z1EE7EM4ne5wibh324sNwckHns6CgEeQosaw1IzTC2acbwj5jXHmg5lFDz-sl0taKAi-0CKqcp-Wc4bBi2IuRBlJjKCiXCflMgQ2cGR7fTQRrNCMzRapBO5y25b0peeord7uzSr2xoJ2Gk6Ol_WaEARHcOc_c6Z9OVm48axIvKoQkbHQoDEkt7hxJiXeTRY4YKqT_fXoON0YZvhzOfADahJi0s8747eSnZNoiCMLzj9Atgzg55txelPWdrggSX7KtW_fj9yiP-yyV-cIqx-Tb1FkS9pCvExZZK1KezfIcmtTAcQjdYi5A8Hy1i-6P4FA41w6gPGA25P7KHy7wVx8RNppIJEY2CPZRdBGGHHP11TXn6BdDo98JEiWSEjSw2ckS6UQurp80XcxBPc1wMJoO4Sl-mABr2OUY2X70qGy6Szn1PLsZPvv80ifr7bbD9WxaDcDISTZCqiLW5v6h7H8ctST6Rp35ZFG8XDm8WXIATCdueazohXXypgsiSEB9BvJcfRjwxPmOAUMKqErrf2MDYUzC7KkrTQzP6FJHd_NasAvyc3Ww1tUNRK=w2000-h1008",
        conteudos: JSON.stringify({
            modules: [
                {
                    title: "MÓDULO 1",
                    contents: [
                        "EMPREENDEDORISMO",
                        "FUNDAMENTOS DE ENERGIA SOLAR FOTOVOLTAICA",
                        "ELETRICIDADE BÁSICA APLICADA A SISTEMAS FOTOVOLTAICOS - TEORIA",
                        "ELETRICIDADE BÁSICA APLICADA A SISTEMAS FOTOVOLTAICOS - PRÁTICA",
                    ],
                    total_hours: "80h",
                },
                {
                    title: "MÓDULO 2",
                    contents: [
                        "TECNOLOGIA FOTOVOLTAICA: MÓDULOS, ARRANJOS, CÉLULA",
                        "SISTEMAS FOTOVOLTAICOS: ISOLADOS, CONECTADOS À REDE, HÍBRIDOS, BOMBEAMENTO DE ÁGUA",
                        "MEDIDAS DE SEGURANÇA DO TRABALHO APLICADAS AO SETOR FOTOVOLTAICO",
                        "MONTAGEM DE SISTEMAS FOTOVOLTAICOS (TEORIA)",
                        "MONTAGEM DE SISTEMAS FOTOVOLTAICOS (PRÁTICA)",
                    ],
                    total_hours: "120h",
                },
            ],
            total_hours: {
                title: "TOTAL",
                value: " 200h",
            },
        }),
        inicio: "18/04/2023",
        fim: "30/07/2023",
    };
    var t = HtmlService.createTemplateFromFile("src/template/certificado");
    t.data = data;
    return t.evaluate().getContent();
}
function getUserInfo() {
    const peopleObj = People.People;
    const people = peopleObj.getBatchGet({
        resourceNames: ["people/me"],
        personFields: "names,photos",
    });
    if (people.responses[0].httpStatusCode == 200) {
        const json = {
            nome: people.responses[0].person.names[0].unstructuredName,
            foto: people.responses[0].person.photos[0].url,
        };
        return json;
    }
    return null;
}
function getUserAndToken() {
    return {
        user: Session.getActiveUser().getEmail(),
        token: ScriptApp.getOAuthToken(),
    };
}
function getToken() {
    return ScriptApp.getOAuthToken();
}
function copiaAlunosParaFrequencia(ano, polo, programa, curso, turma) {
    const planilhaAluno = abrePlanilhaAlunos(ano, polo, programa, curso, turma).getSheets()[0];
    const alunos = planilhaAluno.getRange("A:A").getValues();
    const disciplinas = getDisciplinas(ano, polo, programa, curso, turma);
    disciplinas.forEach((disciplina) => {
        const planilhaDisciplina = abrePlanilhaFrequencia(ano, polo, programa, curso, turma, disciplina).getSheets()[0];
        const transposedAlunos = alunos.map((aluno) => [aluno[0]]);
        console.log(planilhaDisciplina.getName());
        planilhaDisciplina
            .getRange(1, 1, alunos.length, 1)
            .setValues(transposedAlunos);
    });
}
function getFrequencia(ano, polo, programa, curso, turma, disciplina) {
    copiaAlunosParaFrequencia(ano, polo, programa, curso, turma);
    const planilha = abrePlanilhaFrequencia(ano, polo, programa, curso, turma, disciplina).getSheets()[0];
    const matriz = planilha.getDataRange().getValues();
    const [cabecalho, ...linhas] = matriz;
    const json = linhas.map((linha) => Object.fromEntries(linha.map((valor, index) => [cabecalho[index], valor])));
    return JSON.stringify(json);
}
function setFrequencia(ano, polo, programa, curso, turma, disciplina, jsonString) {
    const json = JSON.parse(jsonString);
    const diasAula = Array.from(new Set(json.map((item) => Object.keys(item.Data)).flat()));
    const matriz = [["Nome", ...diasAula]];
    json.forEach((item) => {
        const linha = [item.Nome];
        diasAula.forEach((data) => {
            linha.push(item.Data[data] || "");
        });
        matriz.push(linha);
    });
    const planilha = abrePlanilhaFrequencia(ano, polo, programa, curso, turma, disciplina).getSheets()[0];
    const ultimaLinha = planilha.getLastRow();
    if (ultimaLinha > 1) {
        planilha
            .getRange(2, 1, ultimaLinha - 1, planilha.getLastColumn())
            .clearContent();
    }
    if (matriz.length > 1) {
        const intervalo = planilha.getRange(2, 1, matriz.length - 1, matriz[0].length);
        intervalo.clearContent();
        intervalo.setValues(matriz.slice(1));
        return;
    }
    throw new Error("Ocorreu um problema ao salvar os dados");
}


/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getAnosFirebase": () => (/* binding */ getAnosFirebase),
/* harmony export */   "getPermissoes": () => (/* binding */ getPermissoes)
/* harmony export */ });
/* harmony import */ var _services_academico_AnoServico__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _services_base_UsuarioServico__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(10);


function getAnosFirebase() {
    return new _services_academico_AnoServico__WEBPACK_IMPORTED_MODULE_0__.AnoServico().getAll();
}
function getPermissoes() {
    return new _services_base_UsuarioServico__WEBPACK_IMPORTED_MODULE_1__.UsuarioServico().getPermissoes(Session.getActiveUser().getEmail());
}


/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AnoServico": () => (/* binding */ AnoServico)
/* harmony export */ });
/* harmony import */ var _repositorio_academico_AnoRepositorio__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _base_ServicoBase__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9);


class AnoServico extends _base_ServicoBase__WEBPACK_IMPORTED_MODULE_1__.ServicoBase {
    constructor() {
        super(new _repositorio_academico_AnoRepositorio__WEBPACK_IMPORTED_MODULE_0__.AnoRepositorio());
    }
    getAll() {
        return this.repositorio.get();
    }
    getById(id) {
        return this.repositorio.getById(id);
    }
}


/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AnoRepositorio": () => (/* binding */ AnoRepositorio)
/* harmony export */ });
/* harmony import */ var _domain_academico_Ano__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _contexto_ContextoFirestore__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);
/* harmony import */ var _base_RepositorioBase__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8);



class AnoRepositorio extends _base_RepositorioBase__WEBPACK_IMPORTED_MODULE_2__.RepositorioBase {
    constructor() {
        super(new _contexto_ContextoFirestore__WEBPACK_IMPORTED_MODULE_1__.ContextoFirestore(null, "ano"));
    }
    static map(obj) {
        const parse = {
            ano: obj.name.split("/").pop(),
        };
        return parse;
    }
    get() {
        const data = this.contexto.get();
        const grupos = data.map((grupo) => {
            let { ano } = AnoRepositorio.map(grupo);
            return new _domain_academico_Ano__WEBPACK_IMPORTED_MODULE_0__.Ano(ano);
        });
        return grupos;
    }
    getById(id) {
        let data = this.contexto.getById(id);
        let { ano } = AnoRepositorio.map(data[0]);
        const user = new _domain_academico_Ano__WEBPACK_IMPORTED_MODULE_0__.Ano(ano);
        return user;
    }
}


/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Ano": () => (/* binding */ Ano)
/* harmony export */ });
class Ano {
    constructor(ano) {
        this.ano = ano;
    }
}


/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ContextoFirestore": () => (/* binding */ ContextoFirestore)
/* harmony export */ });
/* harmony import */ var _ContextoBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);

class ContextoFirestore extends _ContextoBase__WEBPACK_IMPORTED_MODULE_0__.ContextoBase {
    constructor(config = null, entity) {
        config = config = {
            type: "service_account",
            project_id: "qualifica-web-383414",
            private_key_id: "a0dbfbc63426816461ac6a722679145df166df5a",
            private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDaGMWTeS9dKET+\n+I2W/nCSL5TJIen4Gaezdbe8+1TXHU14wLPVHKXJLb5ixL3LAG9Op1YR8Bm4xJDt\nJ4HdgTPyFzEiTwYmxTOB9/H9AJLqkGh7++mehbwT0tj/uTZJSCin+L8u8VVykD90\nsJ+q3kQJvqbT12riOJ5pGt+KswGIUshb0WjFZ3603p8vaF1bavu1RvFFFTLeW4ae\n4WRltTJ5qOmPuEi91Ub7iJP/WKibdUTV4FgWVnvHGwND7RmzAPxFjuCbvbMmRmWb\nhSl4+OG+YMPsr52Oq1MGTYPiY9RsoKMT0vpyJxjwtX4RibjIpQ+FrkYVNeQQhPFZ\n7DXKS1RNAgMBAAECggEADLDBJbQOZ5EytekLE288ks5eIzehYwcad79gtghO1xHf\nV+h986eDgGRfGLqsy4LmjHusBFuwTMzH8mYTMQB2Cr8YOWWX7J9wFZQymmo94j8N\ntrHWwHC03AIaZS48WdZvIoT/b5EUi9fCZX0V3ANWZKsZZH1l/KysOl6ZWtCl2m4m\nhvy9C+Oe2g0FXAapQd/c9lPJ38lbBZzu/CRHjUyW0D+wLv3a59jwUSTxlEOzf+x2\nO5pOh+MLZawAzovVyZMhEC/N6SBITcuFlqoSBrci4IRbzqSb20/AJ590xh8QNi1i\nfzoVzoREXs1p3m4miQV0A5YOgYeWkVfd3ybMaoEwQQKBgQD1qHjLDGbNwBI47tI1\nHcVjNKNXt/mk4Nw6shRXhtRM4u4/+8PS6SYr7/b9LFm2ylQepyiV8rb6jae+D1GQ\nW2iVz58kOJN9GiXEec2yCuevPQzAQEv0zHNiz/Yc9j/S5OhIR0DwuspLHVfF2P9f\n7lMTLnAHQdBCHwmgdW70mPKBDQKBgQDjR0N3qtlhfTfN80tndZwNOFPKF+XHSfrM\n87ym0H3hs1DZ4MufkT0T2GnzKSEHlNv4joi2cI/Q7a1DGUaK4vuEHf32EbAe3uMS\neHe9jUiXXYxQ2h30V8CJROg2HkgtuzE3+ndOY/PP/0X6J4V0U3Q8tLrlinJi+RmU\no1lld9bQQQKBgQDHeG/09/H1+ZMSVaGsbascfd5wWLvGDKvmoTjxRVLXx6CLpcQB\nWz2aibQ1KTEDwtCBP1wuPbIkSqe9JTUmkYKfusHPKH1iJLwsCHdkrYQo/9p9tPe4\nI9dBkfmW1MFIXoTaQ7lQf2vJiF8AEM50N9GPDrL6wY74UbmAaDqbNCIddQKBgHmp\nijoi4N7I8vhyRmkJkhGZl3DVPhFiTrkruE7ryJbrMFqRdS7jxng7HuwlliLC0sXJ\nNvHCa5oBwP/sJdDvFIhyraHtcgP0eEVI64AygytTzmrxd5t25gAVPODLcQPZ8szu\nbLMv2jH7inAQe+X7Tnu4m1uIsxa8Fa91icNBVWKBAoGACgflQIVOVVPj1rEedHLH\n88bu3f6MvtdDxdeIY8y6EOwNLwRvHIMvycUaYw0P3m3U5Q8z4Ik1Aunqsm0TaIDW\nRWsfsaZPdCc5nkeXP6i+f/6v4/0RUu9aYjP2hhfs3snPDq9utR12Kl4PpSaiC5bq\nLx02M3QoQ2j4ns9S5YEkHk4=\n-----END PRIVATE KEY-----\n",
            client_email: "firestore@qualifica-web-383414.iam.gserviceaccount.com",
            client_id: "113962947588477688686",
            auth_uri: "https://accounts.google.com/o/oauth2/auth",
            token_uri: "https://oauth2.googleapis.com/token",
            auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
            client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firestore%40qualifica-web-383414.iam.gserviceaccount.com",
        };
        let contexto = FirestoreApp.getFirestore(config.client_email, config.private_key, config.project_id);
        super(contexto);
        this.entity = entity;
        this.base = 'projects/qualifica-web-383414/databases/(default)/documents/';
    }
    get() {
        return this.contexto.getDocuments(this.entity);
    }
    getById(id) {
        return this.contexto.getDocuments(this.entity, [id]);
    }
    getReference(ref) {
        const reference = ref.split(this.base)[1];
        return this.contexto.getDocument(reference);
    }
}


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ContextoBase": () => (/* binding */ ContextoBase)
/* harmony export */ });
class ContextoBase {
    constructor(contexto) {
        this.contexto = contexto;
    }
}


/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RepositorioBase": () => (/* binding */ RepositorioBase)
/* harmony export */ });
class RepositorioBase {
    constructor(contexto) {
        this.contexto = contexto;
    }
    get() {
        throw new Error("Method not implemented.");
    }
    getById(id) {
        throw new Error("Method not implemented.");
    }
}


/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ServicoBase": () => (/* binding */ ServicoBase)
/* harmony export */ });
class ServicoBase {
    constructor(repositorio) {
        this.repositorio = repositorio;
    }
    getAll() {
        throw new Error("Method not implemented.");
    }
    getById(id) {
        throw new Error("Method not implemented.");
    }
}


/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UsuarioServico": () => (/* binding */ UsuarioServico)
/* harmony export */ });
/* harmony import */ var _repositorio_base_GrupoUsuarioRepositorio__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);
/* harmony import */ var _repositorio_base_UsuarioRepositorio__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(13);
/* harmony import */ var _ServicoBase__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9);



class UsuarioServico extends _ServicoBase__WEBPACK_IMPORTED_MODULE_2__.ServicoBase {
    constructor() {
        super(new _repositorio_base_UsuarioRepositorio__WEBPACK_IMPORTED_MODULE_1__.UsuarioRepositorio());
    }
    getAll() {
        return this.repositorio.get();
    }
    getById(id) {
        return this.repositorio.getById(id);
    }
    getAtivo() {
        const ativo = this.repositorio.getById(Session.getActiveUser().getEmail());
        return ativo;
    }
    getPermissoes(id) {
        const ativo = this.repositorio.getById(id);
        const grupo = new _repositorio_base_GrupoUsuarioRepositorio__WEBPACK_IMPORTED_MODULE_0__.GrupoUsuarioRepositorio().getById(ativo.grupo);
        return grupo.permissoes;
    }
}


/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GrupoUsuarioRepositorio": () => (/* binding */ GrupoUsuarioRepositorio)
/* harmony export */ });
/* harmony import */ var _domain_base_GrupoUsuario__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(12);
/* harmony import */ var _contexto_ContextoFirestore__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);
/* harmony import */ var _RepositorioBase__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8);



class GrupoUsuarioRepositorio extends _RepositorioBase__WEBPACK_IMPORTED_MODULE_2__.RepositorioBase {
    constructor() {
        super(new _contexto_ContextoFirestore__WEBPACK_IMPORTED_MODULE_1__.ContextoFirestore(null, "grupoUsuario"));
    }
    static map(obj) {
        const parse = {
            nome: obj.name.split("/").pop(),
            permissoes: obj.fields.permissoes.arrayValue.length > 0
                ? {}
                : obj.fields.permissoes.arrayValue.values.map((value) => value.referenceValue.split("/").pop()),
            ativo: obj.fields.ativo.booleanValue,
        };
        return parse;
    }
    get() {
        const data = this.contexto.get();
        const grupos = data.map((grupo) => {
            let { nome, permissoes, ativo } = GrupoUsuarioRepositorio.map(grupo);
            return new _domain_base_GrupoUsuario__WEBPACK_IMPORTED_MODULE_0__.GrupoUsuario(nome, permissoes, ativo);
        });
        return grupos;
    }
    getById(id) {
        let data = this.contexto.getById(id);
        let { nome, permissoes, ativo } = GrupoUsuarioRepositorio.map(data[0]);
        const user = new _domain_base_GrupoUsuario__WEBPACK_IMPORTED_MODULE_0__.GrupoUsuario(nome, permissoes, ativo);
        return user;
    }
}


/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GrupoUsuario": () => (/* binding */ GrupoUsuario)
/* harmony export */ });
class GrupoUsuario {
    constructor(nome, permissoes, ativo) {
        this.nome = nome;
        this.permissoes = permissoes;
        this.ativo = ativo;
    }
    temPermissao(nomePermissao) {
        return this.permissoes.some((permissao) => permissao.nome == nomePermissao);
    }
}


/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UsuarioRepositorio": () => (/* binding */ UsuarioRepositorio)
/* harmony export */ });
/* harmony import */ var _domain_base_Usuario__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);
/* harmony import */ var _contexto_ContextoFirestore__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);
/* harmony import */ var _RepositorioBase__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8);



class UsuarioRepositorio extends _RepositorioBase__WEBPACK_IMPORTED_MODULE_2__.RepositorioBase {
    constructor() {
        super(new _contexto_ContextoFirestore__WEBPACK_IMPORTED_MODULE_1__.ContextoFirestore(null, "usuario"));
    }
    static map(obj) {
        const parse = {
            email: obj.name.split("/").pop(),
            grupo: obj.fields.grupo.referenceValue.split("/").pop(),
        };
        return parse;
    }
    get() {
        let data = this.contexto.get();
        let users = data.map((usuario) => {
            let { email, grupo } = UsuarioRepositorio.map(usuario);
            return new _domain_base_Usuario__WEBPACK_IMPORTED_MODULE_0__.Usuario(email, grupo);
        });
        return users;
    }
    getById(id) {
        let data = this.contexto.getById(id);
        let { email, grupo } = UsuarioRepositorio.map(data[0]);
        const user = new _domain_base_Usuario__WEBPACK_IMPORTED_MODULE_0__.Usuario(email, grupo);
        return user;
    }
}


/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Usuario": () => (/* binding */ Usuario)
/* harmony export */ });
class Usuario {
    constructor(email, grupo) {
        this.email = email;
        this.grupo = grupo;
    }
}


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _aplication__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);


__webpack_require__.g.getPermissoes = _aplication__WEBPACK_IMPORTED_MODULE_1__.getPermissoes;
__webpack_require__.g.getAnosFirebase = _aplication__WEBPACK_IMPORTED_MODULE_1__.getAnosFirebase;
__webpack_require__.g.abrePlanilhaFrequencia = _functions__WEBPACK_IMPORTED_MODULE_0__.abrePlanilhaFrequencia;
__webpack_require__.g.copiaAlunosParaFrequencia = _functions__WEBPACK_IMPORTED_MODULE_0__.copiaAlunosParaFrequencia;
__webpack_require__.g.Diretorio = _functions__WEBPACK_IMPORTED_MODULE_0__.Diretorio;
__webpack_require__.g.getOrCreatePlanilha = _functions__WEBPACK_IMPORTED_MODULE_0__.getOrCreatePlanilha;
__webpack_require__.g.convertePlanilhaEmJSON = _functions__WEBPACK_IMPORTED_MODULE_0__.convertePlanilhaEmJSON;

})();

/******/ })()
;