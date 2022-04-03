/**
 * Variáveis com referencias dos inputs
 */
var fileInput = document.getElementById('file-input');
var stringInput = document.getElementById('string-input');

/**
 * Referência para o Firebase Storage criando uma pasta com o nome de "arquivos"
 */
var ref = firebase.storage().ref("arquivos");

/**
 * Metodo que observa mudanças no input de arquivo
 */
fileInput.onchange = function (event) {
    // // .files[0]: permite selecionar apenas 1 arquivo por vez
    var arquivo = event.target.files[0];
    // Cria uma chave única para o nome do arquivo, sem inserir nada no Firebase Realtime Database
    var uid = firebase.database().ref().push().key;
    console.log(uid);

    /**
     * .child(nome): Acessa o caminho para inserir o arquivo
     * .put(arquivo): Insere o arquivo no Firebase Storage
     */

    /**
     * METADADOS
     */
    /**
     * Gravando o arquivo com os metadados
     */
    // ref.child(uid).put(arquivo, {
    //     customMetadata: {
    //         nome: "EJL_Logo_25x38",
    //         descricao: "Logomarca da EJLSistemas",
    //         autor: "Estelson Medeiros Pereira"
    //     } 
    // }).then(snapshot => {
    //     console.log("snapshot", snapshot);

    //     /**
    //      * .getDownloadURL(): Retorna a url para download/apresentação após o arquivo arquivo enviado
    //      */
    //     ref.child(uid).getDownloadURL().then(url => {
    //         console.log("string para download", url);
    //     });

    //     /**
    //      * Obtendo os metadados do arquivo gravado
    //      */
    //     ref.child(uid).getMetadata().then(metadata => {
    //         console.log("Metadados:", metadata.customMetadata.nome + " <br> " + metadata.customMetadata.descricao + " <br> " + metadata.customMetadata.autor);
    //     });
    // });

    /**
     * Atribui a tarefa de upload à variável de tarefaDeUpload e executa essa tarefa ao dar o .put()
     */
    tarefaDeUpload = ref.child(uid).put(arquivo);

    // .on("state_changed", observavel_upload(), completou())
    tarefaDeUpload.on("state_changed", upload => {
        console.log("Mudou o estado", upload);

        // .state: Retorna o estado do upload. Ele pode ser "running", "paused", ou "success"
        if(upload.state == "running") {
            // .upload.bytesTransferred: Bytes transferidos
            // upload.totalBytes: Tamanho total do arquivo
            var progresso = Math.round((upload.bytesTransferred / upload.totalBytes) * 100);
            console.log(`${progresso}%`);
        }
    }, error => {
        console.log("Ocorreu um erro ao fazer upload do arquivo", error);
    }, () => {
        console.log("Completou a tarefa");

        ref.child(uid).getDownloadURL().then(url => {
            console.log(url);
        });
    });

    tarefaDeUpload.then(snapshot => {
        console.log("snapshot", snapshot);
    }).catch(error => {
        // Obtém o erro e informa o cancelamento da tarefa
        console.log("error", error);
    });
}

/**
 * Metodo que observa mudanças no input de string
 */
stringInput.onchange = function (event) {
    // .files[0]: permite selecionar apenas 1 arquivo por vez
    var arquivo = event.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(arquivo);
    reader.onload = function() {
        console.log(reader.result);

        const base64 = reader.result.split("base64,")[1];

        /**
         * putString(string, formato, metadados): grava uma String no Firebase Storage e podemos colocar um formato de
         * imagem para ele converter automaticamente para um .png
         */
        ref.child("imagem").putString(base64, "base64", { contentType: "image/png" }).then( snapshot => {
            console.log("snapshot", snapshot);

            ref.child("imagem").getDownloadURL().then(url => {
                console.log("Imagem em base64 para download", url);
            });
        });
    }
}

/**
 * Exclui um determinado arquivo do Firebase Storage
 */
 deletar = function() {
    ref.child("-MzlVy5OX_O5H_sP0IJx").delete().then(() => {
        console.log("Arquivo excluído com sucesso");
    }).catch(error => {
        console.log("Erro ao excluir o arquivo", error);
    });
}

/**
 * Pausa a tarefa de upload do documento
 */
pausar = function() {
    tarefaDeUpload.pause();
    console.log("Pausou tarefa");
}

/**
 * Continua a tarefa de upload do documento pausada pelo método anterior
 */
continuar = function() {
    tarefaDeUpload.resume();
    console.log("Continuou tarefa");
}

/**
 * Cancela a tarefa de upload do documento
 */
cancelar = function() {
    tarefaDeUpload.cancel();
    console.log("Cancelou tarefa");
}