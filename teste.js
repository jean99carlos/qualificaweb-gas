class Diretorio {

  static getFolderId(folderName) {
    var query = "mimeType='application/vnd.google-apps.folder' and trashed=false and name='" + folderName + "'";
    var options = {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + ScriptApp.getOAuthToken()
      }
    };
    var response = UrlFetchApp.fetch('https://www.googleapis.com/drive/v3/files?q=' + encodeURIComponent(query), options);
    var result = JSON.parse(response.getContentText());
    if (result.files.length == 0) {
      throw new Error('Pasta não encontrada: ' + folderName);
    } else {
      return result.files[0].id;
    }
  }
  static listFoldersInDirectory(parentFolderName, isId = false) {
    // Get the ID of the parent directory
    if (!isId)
      parentFolderName = Diretorio.getFolderId(parentFolderName);

    // Construct the query to list folders within the parent directory
    const query = (parentFolderName == 'root' ? 'root' : '"' + parentFolderName + '"') + ' in parents and trashed = false and mimeType = "application/vnd.google-apps.folder"';

    let folders;
    let pageToken = null;
    let foldersList = []
    do {
      try {
        folders = Drive.Files.list({
          q: query,
          maxResults: 100,
          pageToken: pageToken
        });
        if (!folders.items || folders.items.length === 0) {
          throw new Error('Nenhuma pasta encontrada em ' + parentFolderName);
        }
        for (let i = 0; i < folders.items.length; i++) {
          const folder = folders.items[i];
          foldersList.push({ title: folder.title, id: folder.id })
        }
        pageToken = folders.nextPageToken;
      } catch (err) {
        throw new Error('Arquivo não encontrado.');
        Logger.log(err);
      }
    } while (pageToken);
    return foldersList;
  }
  static createFolderInsideAnother(folderName, parentFolderId) {
    parentFolderId = Diretorio.getFolderId(parentFolderId)
    var folder = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentFolderId]
    };
    var options = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + ScriptApp.getOAuthToken(),
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(folder)
    };
    var response = UrlFetchApp.fetch('https://www.googleapis.com/drive/v3/files', options);
    var result = JSON.parse(response.getContentText());
    return result.id;
  }
  static createFolderInRoot(folderName) {
    folderName = 'Banco de Dados'
    var folder = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder'
    };
    var options = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + ScriptApp.getOAuthToken(),
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(folder)
    };
    var response = UrlFetchApp.fetch('https://www.googleapis.com/drive/v3/files', options);
    var result = JSON.parse(response.getContentText());
    return result.id;
  }
  static listRootFolders() {
    const query = '"root" in parents and trashed = false and mimeType = "application/vnd.google-apps.folder"';
    let folders;
    let pageToken = null;
    let folderList = []
    do {
      try {
        folders = Drive.Files.list({
          q: query,
          maxResults: 100,
          pageToken: pageToken
        });
        if (!folders.items || folders.items.length === 0) {
          throw new Error('No folders found.');
        }
        for (let i = 0; i < folders.items.length; i++) {
          const folder = folders.items[i];
          folderList.push({ title: folder.title, id: folder.id });
          //console.log('%s (ID: %s)', folder.title, folder.id);
        }
        pageToken = folders.nextPageToken;
      } catch (err) {
        throw new Error(err.message)
      }
    } while (pageToken);
    return folderList
  }
  static abrir(pastaOrigem, nomePastaDestino) {
    let pastas = pastaOrigem.filter(x => x.title == nomePastaDestino);
    if (pastas.length > 0) {
      return Diretorio.listFoldersInDirectory(pastas[0].id, true);
    } else {
      throw new Error(`Não foi possível abrir ${nomePastaDestino}!`);
    }
  }
  static porCaminho(caminho) {
    const itens = caminho.split("/");
    const pos =
      itens[itens.length - 1] == "" ? itens.length - 2 : itens.length - 1;
    let pasta =Diretorio.abrir(Diretorio.root,"Banco de Dados");
    for (let i = 1; i <= pos; i++) {
      pasta = Diretorio.abrir(pasta, itens[i]);
    }
    return pasta;
  }
  static subpastasEmJson(pasta) {
    const subpastas = pasta;
    let json = [];
    subpastas.forEach(subpasta => {
      json.push(subpasta.title);
    })
    return json;
  }
}

Diretorio.root = Diretorio.listRootFolders()

function teste() {
  const pasta = Diretorio.porCaminho(`/`);
  console.log(Diretorio.subpastasEmJson(pasta));

}