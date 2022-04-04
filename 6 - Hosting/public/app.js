/**
 * Váriaveis usadas durante o desenvolvimento
 */
var CARD_CONTAINER = document.getElementsByClassName('card-container')[0];
var NOMES = ["Anderson", "Beatriz", "Caio", "Daniela", "Everton", "Fabiana", "Gabriel", "Hortencia", "Igor", "Joana"];
var cards = [];
/**
* firebase: objeto global
* database(): método para acess ao realtime database
* ref(): url em string para a referência ao caminho do banco
*/
var ref = firebase.database().ref("card");

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
     * child(): acessa o nó filho passado por parâmetro
     * set(): método que cria dados na url informada (não fornece um ID automático, sendo necessário criá-lo manualmente)
     */
    // ref.child(card.nome).set(card).then(() => {
    //     adicionaCardATela(card);
    // })

    /**
     * push(): método que cria dados na url informada (fornece um ID automático, não sendo necessário criá-lo manualmente)
     *         o ID é um hash do timestamp da data/hora atual
     */
    ref.push(card).then(snapshot => {
        adicionaCardATela(card, snapshot.key);
    })
};

/**
 * Recebe a referencia do card e exclui do banco de dados
 * @param {String} id Id do card
 */
function deletar(id) {
    // Utilizando o método remove(): remove também todos os nós filhos dentro do nó pai
    // Exclui o registro do BD
    ref.child(id).remove().then(() => {
        // Atualiza a tela devido ao registro excluído
        var card = document.getElementById(id);
        card.remove();
    })

    // Utilizando o método set(): seta nulo o id do nó e pela regra do Firebase esse nó nulo é excluído
    // var card = document.getElementById(id);
    // // Exclui o registro do BD
    // ref.child(id).set(null).then(() => {
    //     // Atualiza a tela devido ao registro excluído
    //     card.remove();
    // })
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
    countNumber += 1; // incrementa o contador

    // utilizando set()
    ref.child(id + "/curtidas").set(countNumber).then(() => { 
        count.innerText = countNumber;
    }, err => {
        console.log("Erro ao curtir", err);
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
        countNumber -= 1; // decrementa o contador

        // utilizando update
        ref.child(id).update({curtidas: countNumber}).then(() => {
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
     * Ativa os logs detalhados de retorno de transações do Firebase
     */
    firebase.database.enableLogging(function(message) {
        console.log("[Firebase]", message);
    });

    /**
     * once(): retorna os dados lidos de uma url
     * snapshot: objeto retornado pela leitura
     */
    ref.once("value").then(snapshot => {
        // console.log("Lista de registros no BD...");
        // console.log(snapshot.val());
        // console.log(" ");

        // console.log("Obtém um determinado registro pelo ID...");
        // console.log("child:", snapshot.child("-MzhKxJcbbh_Ghn6GOOy").val());
        // console.log(" ");
        
        // console.log("Verifica se existe o registro pelo ID retornando true/false...");
        // console.log("exists()", snapshot.exists());
        // console.log(" ");

        // console.log("Verifica se existe um registro filho com valor...");
        // console.log("hasChild() nome", snapshot.hasChild("-MzhKxJcbbh_Ghn6GOOy/nome"));
        // console.log("hasChild() comentario", snapshot.hasChild("-MzhKxJcbbh_Ghn6GOOy/comentario"));
        // console.log(" ");

        // console.log("Verifica se tem algum filho no nó informado...");
        // console.log("hasChildren() /", snapshot.child("-MzhKxJcbbh_Ghn6GOOy").hasChildren());
        // console.log("hasChildren() nome", snapshot.child("-MzhKxJcbbh_Ghn6GOOy/nome").hasChildren());
        // console.log(" ");

        // console.log("Retorna o número de registros...");
        // console.log("numChildren()", snapshot.numChildren());
        // console.log(" ");

        // console.log("chave raiz: ", snapshot.key);

        // Lista os valores que constam no BD
        snapshot.forEach(value => {
            // console.log("chave: ", value.key);
            adicionaCardATela(value.val(), value.key);
        });
    });

    // Observers em tempo real com .on()
    // método .on(): atualiza a tela a cada mudança no BD
    // ref.on("value", snapshot => {
    //     snapshot.forEach(value => {
    //         adicionaCardATela(value.val(), value.key);
    //     });
    // });

    // método .on("child_added"): atualiza a tela a cada insert no BD
    // ref.on("child_added", snapshot => {
    //     console.log("added: ", snapshot.val(), snapshot.key);
    // });

    // método .on("child_changed"): atualiza a tela a cada update no BD
    // ref.on("child_changed", (snapshot, uid) => {
    //     console.log("changed: ", snapshot.key, uid);
    // });

    // método .on("child_removed"): atualiza a tela a cada exclusão no BD
    // ref.on("child_removed", snapshot => {
    //     console.log("removed: ", snapshot.key);
    // });

    /**
     * ORDENAÇÃO
     * !!! Verificar outros métodos de ordenação na aula 20 !!!
     */
    // ref.orderByChild("nome").on("child_added", snapshot => {
    //     adicionaCardATela(snapshot.val(), snapshot.key);
    // });

    /**
     * FILTRO
     * !!! Aula 21 !!!
     */

    /**
     * LIMITAR A UMA QUANTIDADE X DE REGISTROS
     * !!! Aula 22 !!!
     */

    /**
     * REMOVENDO UM OBSERVÁVEL (ATUALIZAÇÃO DA PÁGINA) A CADA EVENTO 
     * !!! Aula 24 !!!
     */

    /**
     * BUSCANDO DADOS VIA HTTP
     * !!! Aula 27 !!!
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