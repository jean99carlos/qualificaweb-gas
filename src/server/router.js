class RequestHandlerInterface {
  handleRequest(request) {}
}
class HttpRequestHandler extends RequestHandlerInterface {
  constructor(router) {
    super();
    this.router = router;
  }

  handleRequest(request) {
    const path = request.pathInfo;
    if (path == [] || path == null) {
      return HtmlService.createTemplateFromFile(
        templates.public.login
      ).evaluate();
    }
    if (this.router.hasRoute(path)) {
      const route = this.router.getRoute(path);
      if (route.isPrivate) {
        const user = getLoginToken();
        if (!user) {
          return HtmlService.createTemplateFromFile(
            templates.public.login
          ).evaluate();
        } else {
          if (!temPermissao(route)) {
            return HtmlService.createTemplateFromFile(
              templates.error["401"]
            ).evaluate();
          }
        }
      }
      return route.handler(request);
    } else {
      return HtmlService.createTemplateFromFile(
        templates.error["404"]
      ).evaluate();
    }
  }
}

// Router class to manage routes
class Router {
  constructor() {
    this.routes = {};
    this.paths = {};
  }

  addRoute(route, path, handler, isPrivate = false) {
    this.routes[route] = { route, handler, isPrivate };
    this.paths[route] = path;
  }

  getRoute(path) {
    return this.routes[path];
  }

  hasRoute(path) {
    return this.routes.hasOwnProperty(path);
  }

  getPath(route) {
    return this.paths[route];
  }
}

// View templates
const templates = {
  public: {
    login: "src/views/public/login/index",
    validacaoCertificado: "src/views/public/validarCertificado/index",
  },
  private: {
    inicio: "src/views/private/inicio/index",
    frequencia: "src/views/private/frequencia/index",
    certificado: "src/views/private/certificado/index",
    pagamento: "src/views/private/pagamento/index",
  },
  error: {
    404: "src/views/error/404",
    401: "src/views/error/401",
  },
};

const router = new Router();

router.addRoute("login", templates.public.login, (request) => {
  return HtmlService.createTemplateFromFile(templates.public.login).evaluate();
});
router.addRoute(
  "validacao-certificado",
  templates.public.validacaoCertificado,
  (request) => {
    return HtmlService.createTemplateFromFile(
      templates.public.validacaoCertificado
    ).evaluate();
  }
);
router.addRoute("usercallback", null, (request) => {
  authCallback();
});

router.addRoute(
  "inicio",
  templates.private.inicio,
  () => {
    return HtmlService.createTemplateFromFile(templates.private.inicio)
      .evaluate()
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  },
  true
);

router.addRoute(
  "frequencia",
  templates.private.frequencia,
  (request) => {
    return HtmlService.createTemplateFromFile(
      templates.private.frequencia
    ).evaluate();
  },
  true
);

router.addRoute(
  "certificado",
  templates.private.certificado,
  (request) => {
    return HtmlService.createTemplateFromFile(
      templates.private.certificado
    ).evaluate();
  },
  true
);

router.addRoute(
  "pagamento",
  templates.private.pagamento,
  (request) => {
    return HtmlService.createTemplateFromFile(
      templates.private.pagamento
    ).evaluate();
  },
  true
);

const requestHandler = new HttpRequestHandler(router);
function doGet(request) {
  CacheService.getUserCache().put('permissoes',getPermissoes())
  return requestHandler.handleRequest(request);
}

function includeByRoute(route) {
  routeObj = router.getRoute(route);
  if (routeObj.isPrivate) {
    if (!temPermissao(route)) {
      return HtmlService.createTemplateFromFile(templates.error["401"])
        .evaluate()
        .getContent();
    }
  }
  return include(router.getPath(route));
}
function getMenu() {
  const permissoes =  CacheService.getUserCache().get('permissoes')
  const menuItens = [
    {
      title: "Dashboard",
      iconClass: "fas fa-fw fa-tachometer-alt",
      link: "inicio",
      active: true,
    },
    {
      title: "Acadêmico",
      iconClass: "fas fa-fw fa-book",
      submenu: [
        {
          title:"Calendário",
          link:"calendario",
        },
        {
          title:"Turma",
          link:"turma",
        },
        {
          title: "Frequência",
          link: "frequencia",
        },
        {
          title: "Certificado",
          link: "certificado",
        },
        {
          title: "Pagamento",
          link: "pagamento",
        },
      ],
    },
    {
      title: "Validar Certificado",
      iconClass: "fas fa-fw fa-folder",
      submenu: [],
    },
  ];
  const filteredMenu = menuItens.filter(menuItem => {
    if (menuItem.submenu) {
      const filteredSubmenu = menuItem.submenu.filter(submenuItem => {
        return permissoes.includes(submenuItem.link);
      });
      if (filteredSubmenu.length > 0) {
        menuItem.submenu = filteredSubmenu;
        return true;
      }
    } else {
      return permissoes.includes(menuItem.link);
    }
  });
  return filteredMenu;
}

function temPermissao(route) {
  const permissoes =  CacheService.getUserCache().get('permissoes')
  return permissoes.includes(route);
}
/*
  router.addRoute('emissaocertificado','src/template/template_certificado', (request) => {
    var t = HtmlService.createTemplateFromFile('src/template/template_certificado');
    t.data = {
      nome: "Jean Carlos Santos Serafini de Sousa",
      cpf: "090.367.706-70",
      codigo:'',
      link:'',
      
      curso: "ELETRICISTA DE SISTEMAS DE ENERGIAS RENOVAVEIS (INSTALADOR DE PAINEIS FOTOVOLTAICOS)",
      cargaHoraria: "200",
    
      programa: "QUALIFICA MAIS ENERGIF",
      logoPrograma: 'https://lh3.googleusercontent.com/fife/APg5EOZlJprHyo8px76ryT8p-QsCffne8Q-ilBteM7omyN80-VhaZ5uCnAsRC-36aClLnnJMo9KGmbiJdWY1jODBuRYVfjcURaYFIYkDSjyDEQoZh1u6sZhsj7kTVH3Auw2KRbBSCzqwVk8EMH0SyE5j58awDUsvuifbFBSN2XGJpvpJ_e7Ze5CS7xvGTIUvdxhGK9bzYYCx-qpnCGKeOa-BNFnQ09hlbEF-E3P9fplKVpSRW6u2HMMHGdjWD36sFu0JqJm00ib_iblWQnxKrJ_EmWXTgzI4z5E5vQ39UmmAuKwxkwJn1ILbIsKIdOYDSz-awQOF4uMmwiZN2wzmtxSnmVv9M18XushwNt0L2_WkoUP7swEwjTY-iPVBI8OuIXeeJ7igHF9wdmrvOI7480jk7ha9VHdi5h1iseb_hhEkZXeZ2uvbq_DJuKYFAvwgTMjUf6rJiv3iRSur6hm5fGOKFWfIrAdYIj7PlBmIjopMoOg_OzKyqmDuaqdh3HrO4znRWJE5ywA2GaRB79ThZkGUYc2TShxkIzQ4fS8tgb08urL3KhIFU0IvzQTCQ4nJcudUITmLbWxH-C058eu6V_gZHD_L-U4ewhoXoS0e2-IqhY6k2OzoiS2ANugolbtuRelFQ58YoB6mkX5GLpECnMVOmzxzmmusrpFMxXAdGYqqRccG1aUZ5VRUL4AVg2GoKD_wLSX9lic7O5ycbv9FNKU1YwypFLXme7shBuzsB1XBqip-1HUOQfbYYRksWUsZrTA-LSlj2DhQwpJ1tR3iXb-ie_D8CvPebNNYDQZXJ463HriYXilzg1TLYUg09yhTrCd0MnyQYc7ULmFV17fvLXZ7qLhJNk12WQ0giqMYbY7Da_w5iWUI40XAZwMjsqcJva0OqGc1e0NI28j5Z9chHjOy3YvYW8pyxg3Fsm_hEtCIxtDmOSLChvTbKupIENmeD-Yzh_vG_TP0KCs2gV-3gqI5Q_EO4CIZuCpOQBlccP7mjfrY8Dn_HYq_p8hFFvyjJt2c3LpPiiphuGc9dTmzGxi898Kv79oGvCGsIhRviLQLQwWtvG_1H9fSY8KzQbJlNe76tU0122c5Kw0hVfFAMIxDlqmpHX3Fka3bhVUqgBaUHpzz6N6gVaZCfXyRHixWTf4eJy3DYI59nf-e4nmRghP-6pnGjJDArHt00ZCRRHcP24YWzDBstY14MbnZRHsmKtIBFtJnuPJJHp0FPKH3fI6LkcOQE0D37v-9tNMqFSm8-RKbq--TwFsFeuSUOdakE6TrBREcYYcqTlY1PJ4yZBiwZdizlCZNye7hzWy-yXYp-lO_Z73p00_z2IA3q1uzG7DH3uRWZXyyvfmsslpF_znPHfAQy2MpLRrzjSagTru13CsaaYeG__no4H6WmHWbzWrK996FzonfJQ6YD3Nlu4sVShX3_izYbNi_NC7RbDbYVYkLsG_eXspLRARJ3T2KPVIzKTfXVvWcNWMkGtqy2eo9lI9YlbRU=w1297-h932',
      logoUfv: 'https://lh3.googleusercontent.com/fife/APg5EOYwQTuU0Lij00vAHkmt40cMLI122WDhEDXap_lKObKnlUlQcrs0Jj39Ux0zbQl8yLSAKq4fUUhf4eiCrB9puX83Wz_oFW0BIp3ZBqqdN5Xj9D_LGZyDEP6uuyp1USZXR2yiT0-yDkjeQ3FA0mvVpXTh1rq6USp0o0MSR_xI3vVzm2F02oCzSLHczeD6Ap47V0c78Z1hKjeABVNZDAvousAaaqp3ExjONC8e2VYwGOSniICbcy7vDyVhHi-HynheOWMYLpmIyFrMvpKR4tZHaM-PQy5CQy69opbui3cK2S6p8306AOMM2fqCFTusiKivd0tKcqEVvh1yRxHsqgx8-VeYfw4CQ6mD_Sse1DNH1uuzVkzslqu35zuUWwcg2jVF-QRj_F1KtrcuB3jcW5zNKhgsOnj9tNw-QckmT28magmqhQ5TAHkHWOaD1HCmcn-mlaOaPENNPfcCxe8MFCI4U3Cw8r2uEz2eJN1TO1vbqzgEOzRzefiEk8UQOr0V-aywSVLH8-3VwOlqVI6ZrGXvrfFgx_LMFG-IZFm97yQuu58gnjRM9rR70rmzAeeuh7nNr1teM8QNeZMFvV-jJzgvOf9HsslG28vYsjFaP1nNWL1pNCUX9twRjWGDlSxDjCwcB3r2extPIha4zFd7TCEVtBvnnSDtHBo92SJLfbWaxwKs1AVmcvqAqYNtA9EP1TRJGoCUm5YyOoDyVwvtsSEIkOfemqAIZPhUTqo0viVe-DtQx2mjO5OMByLoPrhr6qOdaOMjk19bVL8RA8C9bAlwv4L67xJSATWpu2jPGYKKWY1FtCcqyP3Kp-Gpb0bCpjZVAxhHcMXG0OAUTPOckur3eV_sRDqK1_kqJ6GIcTV6nk_W0mzOldNKkVaI9uBqZZC6RrmtxIucmJhIstn8AS7L1S5j_zUtMAfDaQn5bqzmYSNDw7nqJE6HWzGnE4RktuX-hzDlJKrfYn1kYKycEA2aHLL9FjqLIl-7IsdUlRW86rpnrl1dqUe2lwTsBhYpCzmICxdkOgMkDXnu3_0RscecYoS4XhVzyg249mHN5SLRv0dTmSU38a4VbNuA0jnqKGG4qxTUvCWZ8DKAuj1tbl_YSxvBy4-fMCS7yk2TL63YIOZOyBsToKGOt0MttHeudydCfuU_bmU7h5psuoIa_p3GKmPwjg7MWnKwe113eQHXRMlTzmbl8mE79SLUlAC6rcAro0NMRBMiMIc9R3XUbx5xAWfVKtbxR1zpQXNcyJ5NeksqVzt41VblE_7ii4mLH9oRSuuGx2FQe143aAQ-3tIpOlXhgqjmbb_R9i6iRm9mfFCqELGxLxJwixPcLw7FLzw-hNCySYr3b7GbmDkiCMlka2MpFjExXCv1vH7gJ9O77Z64KdEcTQwj4fJthJBJZGVKKcNHoAphbh7jj1PArzgpIbKKdnTYYJxpsNcVxvEea7lSfKgKnOROOimFGsAV4xjE_8sBs1-ON6OQTT1_ZlopA0HX3Etm=w1297-h932',
      logoGoverno: 'https://lh3.googleusercontent.com/fife/APg5EOZG4meQbo3Gyqe77NuF8LAilzHZ_Rzfd6QzY30u2KZVvhrWcOsZrywWRXKUSZIipcUcjVpqJdSxH1ccUleMFygIH1NJ8r9hopzrePrS2mMfcG58_IEkugub_M8ARUPKwBAe9W1c2p8O14N7cLGURXFjFH1ODNAvjGusV4MLKWBFUutoBZw1Gjh8romqxYqUtmQbUs6B-Lzltq3A8jumCaRafv4a0X447u6VP4bhWL9aiVZCxh_zQyMh4__o__w5yCB6lHoCyMTdiz5J-xnQFzFsGMfcI4kUE4nD7EjdL44Aq0mtJ98Pi4ILsf4j9WaBJw7uiccm53Io4CA2XVDCJaAIwJP4gvWdGQhq0Gs67GziImwksPSS881d5zQZ4WRoB1IbqLzWQK9R-Zzy6w-RxEn9ViyVyRzyAsfA7FU32Zccs7A0MQdipt0JEmTXmW2U4e156qxnPyHWHOvvs1thoad4r--8ikPb6pEXvz6OyqN-Sr9Cvo80QWrOOin1BHtfEeHdd_83IH0nUS_NzKMO_niWUb8WZC6Bc_JEfBA6iuwS_EtfQZxK3M6joVwIGVmxoe5pnO4ZOcQJ8eQ13I-cDVikHrwJonWA3w5VlYnQzwiFF4Aj1Xb4KcaO_2pcjQFG3UoO-6n-HWoxXrk448Qr5cnmVwDFJqvH31FUVZxRVSTtkvVDH6BjimMMIrgVMtrfMs1ZCLjGU2NhRCFihmph5tEnxIS9pHFOI6Lqi-aIg8j83m-oWByybPpCVUr-4xBgF9rTwjaKxoXcznuwlBoxwxKv9HoWVdWAjYOwBdJ5NCMuj0fFLDrP_wFCrGmhyJY27JChBXv3EZrZo9rpEGwsp2-oMTztS0DvW1Axs81mdhSC63PqfOgDGr3tchVocHyR34ktQ8IbFtFGytjdGOhbNEgrRphxFZ0Y6dFb3z1EE7EM4ne5wibh324sNwckHns6CgEeQosaw1IzTC2acbwj5jXHmg5lFDz-sl0taKAi-0CKqcp-Wc4bBi2IuRBlJjKCiXCflMgQ2cGR7fTQRrNCMzRapBO5y25b0peeord7uzSr2xoJ2Gk6Ol_WaEARHcOc_c6Z9OVm48axIvKoQkbHQoDEkt7hxJiXeTRY4YKqT_fXoON0YZvhzOfADahJi0s8747eSnZNoiCMLzj9Atgzg55txelPWdrggSX7KtW_fj9yiP-yyV-cIqx-Tb1FkS9pCvExZZK1KezfIcmtTAcQjdYi5A8Hy1i-6P4FA41w6gPGA25P7KHy7wVx8RNppIJEY2CPZRdBGGHHP11TXn6BdDo98JEiWSEjSw2ckS6UQurp80XcxBPc1wMJoO4Sl-mABr2OUY2X70qGy6Szn1PLsZPvv80ifr7bbD9WxaDcDISTZCqiLW5v6h7H8ctST6Rp35ZFG8XDm8WXIATCdueazohXXypgsiSEB9BvJcfRjwxPmOAUMKqErrf2MDYUzC7KkrTQzP6FJHd_NasAvyc3Ww1tUNRK=w2000-h1008',
      conteudos: JSON.stringify({
        "modules": [
          {
            "title": "MÓDULO 1",
            "contents": [
              "EMPREENDEDORISMO",
              "FUNDAMENTOS DE ENERGIA SOLAR FOTOVOLTAICA",
              "ELETRICIDADE BÁSICA APLICADA A SISTEMAS FOTOVOLTAICOS - TEORIA",
              "ELETRICIDADE BÁSICA APLICADA A SISTEMAS FOTOVOLTAICOS - PRÁTICA"
            ],
            "total_hours": "80h"
          },
          {
            "title": "MÓDULO 2",
            "contents": [
              "TECNOLOGIA FOTOVOLTAICA: MÓDULOS, ARRANJOS, CÉLULA",
              "SISTEMAS FOTOVOLTAICOS: ISOLADOS, CONECTADOS À REDE, HÍBRIDOS, BOMBEAMENTO DE ÁGUA",
              "MEDIDAS DE SEGURANÇA DO TRABALHO APLICADAS AO SETOR FOTOVOLTAICO",
              "MONTAGEM DE SISTEMAS FOTOVOLTAICOS (TEORIA)",
              "MONTAGEM DE SISTEMAS FOTOVOLTAICOS (PRÁTICA)"
            ],
            "total_hours": "120h"
          }
        ],
        "total_hours": {
          "title": "TOTAL",
          "value": " 200h"
        }
      }),
  
      inicio: "18/04/2023",
      fim: "30/07/2023",
    };
    return t.evaluate();
    
  });
  
  router.addRoute('frequenciacomvalidacao','src/views/private/frequencia', (request) => {
    try {
      Logger.log(Session.getActiveUser().getEmail())
      const service = getOAuthService();
      Logger.log(service.hasAccess() ? 'Acesso concedido' : 'Acesso negado');
      if (service.hasAccess()) {
        if (service.getAccessToken() == null) {
          Logger.log('Token expirado');
          service.refresh();
        }
        const accessToken = service.getAccessToken();
        PropertiesService.getUserProperties().setProperty('token', accessToken)
        try {
          PropertiesService.getUserProperties().setProperty('tokenId', service.getToken().tokenId)
        } catch (ex) { 
          Logger.log(ex) 
        }
        Logger.log('Token de acesso: ' + accessToken);
        const authInfo = ScriptApp.getAuthorizationInfo(ScriptApp.AuthMode.FULL);
        if (authInfo.getAuthorizationStatus() == 'REQUIRED')
          Logger.log('Link Script Authorization: ' + authInfo.getAuthorizationUrl());
        return HtmlService.createTemplateFromFile('src/views/private/frequencia').evaluate();
      } else {
        const authorizationUrl = service.getAuthorizationUrl();
        Logger.log('Autorização necessária.Link...' + authorizationUrl);
        return HtmlService.createHtmlOutput('Authorization required. <a href="' + authorizationUrl + '">Authorize</a>');
      }
    } catch (ex) {
      Logger.log(ex);
      return HtmlService.createHtmlOutput("Error 401 - Unauthorized<br>" + ex);
    }
  });
  
*/
