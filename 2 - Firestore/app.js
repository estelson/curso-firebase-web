/**
 * Váriaveis usadas durante o desenvolvimento
 */
var CARD_CONTAINER = document.getElementsByClassName('card-container')[0];
var NOMES = ["Anderson", "Beatriz", "Caio", "Daniela", "Everton", "Fabiana", "Gabriel", "Hortencia", "Igor", "Joana"];

/**
 * Botão para cria um card no card-contaier
 */
function criarCard() {
    var card = {
        nome: NOMES[Math.floor(Math.random() * NOMES.length - 1)],
        idade: Math.floor(Math.random() * 22 + 18),
        curtidas: 0
    };

    /**
     * Insere um documento com o ID literal informado pelo usuário em .doc("1")
     * ------------------------------------------------------------------------
     * .collection("coleção"): Referenciar a coleção
     * .doc("documento"): Referencia o documento
     * .set({dados}): Insere o objeto passado por parâmetro na referência
     */
    // firebase.firestore().collection("cards").doc("1").set(card).then(() => {
    //     console.log("Dados salvos com o id literal informado pelo usuário em .doc("1")");

    //     adicionaCardATela(card, 1);
    // });

    /**
     * Insere um documento com o ID automático de acordo com o timestamp da data/hora atual
     * -------------------------------------------------------------------------------------------------------------
     * .collection("coleção"): Referenciar a coleção
     * .add("documento"): Adiciona os dados dentro de um UID automático de acordo com o timestamp da data/hora atual
     */
    firebase.firestore().collection("cards").add(card).then(() => {
        console.log("Dados salvos com o ID automático de acordo com o timestamp da data/hora atual");

        //adicionaCardATela(card, 1);
    });
};

/**
 * Recebe a referencia do card e exclui do banco de dados
 * @param {String} id Id do card
 */
function deletar(id) {
    var card = document.getElementById(id);

    /** 
     * Remove todo o documento especificado pelo ID
     * !!! Pode ser usado APENAS em documentos (.doc(id)) !!!
     */ 
    firebase.firestore().collection("cards").doc(id).delete().then(() => {
        card.remove();
    });

    /** 
     * Para remover uma propriedade do documento, podemos dar um update() e passamos no objeto
     * a propriedade que será excluída e chamamos o método de .delete() vindo de
     * firebase.firestore.FieldValue
     */ 
    // firebase.firestore().collection("cards").doc(id).update({ curtidas: firebase.firestore.FieldValue.delete() }).then(() => {
    //     console.log("Campo curtidas removido do ID " + id);
    // });
};

/**
 * Incrementa o numero de curtidas
 * @param {String} id Id do card
 */
function curtir(id) {
    var card = document.getElementById(id);
    var count = card.getElementsByClassName("count-number")[0];
    //var countNumber = Number(count.innerText);
    var countNumber = +count.innerText; // Ambos forçam a transformação de um valor em numérico
    countNumber += 1; // incrementa o contador. Semelhante a: countNumber = countNumber + 1;

    /**
     * Comparando com o Realtime Database
    ref.child(id + "/curtidas").set(countNumber).then(() => { 
        count.innerText = countNumber;
    }, err => {
        console.log("Erro ao curtir", err);
    });
     */

    /**
     * .update({ dados }): Atualiza todos os dados passados no parâmetro.
     * !!! Pode ser usado APENAS em docs !!!
     */
    firebase.firestore().collection("cards").doc(id).update({ curtidas: countNumber }).then(() => {
        count.innerText = countNumber;
    });
};

/**
 * Decrementa o numero de curtidas
 * @param {String} id Id do card
 */
function descurtir(id) {
    var card = document.getElementById(id);
    var count = card.getElementsByClassName("count-number")[0];
    //var countNumber = Number(count.innerText);
    var countNumber = +count.innerText; // Ambos forçam a transformação de um valor em numérico

    if(countNumber > 0) {
        countNumber -= 1; // decrementa o contador. Semelhante a: countNumber = countNumber + 1;

        firebase.firestore().collection("cards").doc(id).update({ curtidas: countNumber }).then(() => {
            count.innerText = countNumber;
        }).catch((err) => {
            console.log("Erro ao descurtir", err);
        });
    } else {
        window.alert("Não pode ter quantidades negativas de curtidas!");
    }
};

/**
 * Espera o evento de que a DOM está pronta para executar algo
 */
document.addEventListener("DOMContentLoaded", function () {
    /**
     * .get(): Busca um resultado apenas uma vez
     */
    //firebase.firestore().collection("cards").get().then(snapshot => {
        /**
         * Variações de métodos de snapshot:
         * ========================================================================================
         * Os documentos dentro da minha coleção retornam um objeto e deve-se utilizar um forEach()
         * snapshot.docs()
         * ----------------------------------------------------------------------------------------
         * Uma propriedade que retorna um booleano se o snapshot estiver vazio
         * snapshot.empty()
         * ----------------------------------------------------------------------------------------
         * São os metadados da coleção
         * snapshot.metadata
         * ----------------------------------------------------------------------------------------
         * Retorna a query utilizada no filtro para o get()
         * snapshot.query()
         * ----------------------------------------------------------------------------------------
         * Retorna o nr. de documentos dentro de uma coleção
         * snapshot.size()
         * ----------------------------------------------------------------------------------------
         * Retorna um array com as mudanças que essa coleção sofreu desde a última leitura
         * snapshot.docChanges()
         */

        /**
         * @Param card.data(): Retorna os dados do documento
         * @Param card.id: Retorna a UID do documento
         * ----------------------------------------------------------------------
         * Caso seja necessário comparar 2 cards se são iguais ou não utilizamos:
         * card.isEqual(doc)
         * !!! Serve para docs e collections !!!
         */
        //snapshot.docs.forEach(card => {
            //adicionaCardATela(card.data(), card.id);
        //});
    //});

    /**
     * .onSnapshot(): Obtém os dados em tempo real
     */
    // firebase.firestore().collection("cards").onSnapshot(snapshot => {
    //     // Usar dessa forma é equivalente ao .on("value") do Realtime Database(RD)
    //     // snapshot.docs.foreach();

    //     // Traz todos os dados com o evento "added" na primeira chamada e depois
    //     // traz apenas os novos documentos ou documentos que sofreram alterações
    //     snapshot.docChanges().forEach(card => {
    //         if(card.type == "added") {
    //             adicionaCardATela(card.doc.data(), card.doc.id);

    //             console.log("Incluído");
    //         }

    //         if(card.type == "modified") {
    //             console.log("Modificado");
    //         }

    //         if(card.type == "removed") {
    //             console.log("Removido");
    //         }
    //     });
    // });

    /**
     * Consultas
     * *************************************************************************************************
     */

    /**
     * .where(campo, operador, valor) Retorna registros que obedeçam a condição informada nos parâmetros
     * !!! Não aceita (||), (&&) e nem (!=) !!!
     */
    // firebase.firestore().collection("cards").where("idade", "<=", 24).get().then(snapshot => {
    //     snapshot.docs.forEach(card => {
    //         adicionaCardATela(card.data(), card.id);
    //     });
    // });

    firebase.firestore().collection("cards").where("curtidas", "<", 7).get().then(snapshot => {
        snapshot.docs.forEach(card => {
            adicionaCardATela(card.data(), card.id);
        });
    });

    /**
     * ORDENAÇÃO: Vide aula 39
     */

    /**
     * LIMITAÇÃO: Vide aula 40
     */

    /**
     * FILTROS/CURSORES: Vide aula 41
     */

    /**
     * GRAVAÇÕES EM LOTE: Vide aula 42
     */
});

/**
 * Adiciona card na tela
 * @param {Object} informacao Objeto contendo dados do card
 * @param {String} id UID do objeto inserido/consultado
 */
function adicionaCardATela(informacao, id) {
    /**
     * HEADER DO CARD
     */
    let header = document.createElement("h2");
    header.innerText = informacao.nome;
    header.classList.add('card-title');
    // ===================================

    /**
     * CONTENT DO CARD
     */
    let content = document.createElement("p");
    content.classList.add('card-text');
    content.innerText = informacao.idade + ' anos.';
    // ===================================

    /**
     * BOTÕES DO CARD
     */
    let inner = document.createElement("div");
    inner.classList.add('row')
    // Botão adicionar
    let button_add = document.createElement("button");
    button_add.classList.add('btn', 'btn-link', 'col-3');
    button_add.setAttribute('onclick', "curtir('" + id + "')");
    button_add.innerText = '+';
    inner.appendChild(button_add);

    // Contador de curtidas
    let counter = document.createElement("span");
    counter.innerHTML = informacao.curtidas;
    counter.classList.add('col-3', 'text-center', 'count-number');
    inner.appendChild(counter);

    // Botão de subtrair
    let button_sub = document.createElement("button");
    button_sub.classList.add('btn', 'btn-link', 'col-3');
    button_sub.setAttribute('onclick', "descurtir('" + id + "')");
    button_sub.innerText = '-';
    inner.appendChild(button_sub);
    // ===================================

    // Botão de excluir
    let button_del = document.createElement("button");
    button_del.classList.add('btn', 'btn-danger', 'col-3');
    button_del.setAttribute('onclick', "deletar('" + id + "')");
    button_del.innerText = 'x';
    inner.appendChild(button_del);
    // ===================================

    /**
     * CARD
     */
    let card = document.createElement("div");
    card.classList.add('card');
    card.id = id;
    let card_body = document.createElement("div");
    card_body.classList.add('card-body');
    // ===================================

    // popula card
    card_body.appendChild(header);
    card_body.appendChild(content);
    card_body.appendChild(inner);
    card.appendChild(card_body);

    // insere no container
    CARD_CONTAINER.appendChild(card);
}