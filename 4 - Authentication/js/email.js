var currentUser;

/**
 * Função para cadastro com email e senha
 */
function createLogin() {
    var email = document.getElementById("email").value;
    var senha = document.getElementById("senha").value;

    firebase.auth().createUserWithEmailAndPassword(email, senha).then(user => {
        console.log("usuario", user);

        alert("Usuério criado e logado com e-Mail e senha");
    }).catch(err => {
        console.log("Erro ao criar usuário", err);
    });
}

/**
 * Função para login
 */
function loginEmail() {
    var email = document.getElementById("email").value;
    var senha = document.getElementById("senha").value;

    firebase.auth().signInWithEmailAndPassword(email, senha).then(() => {
        alert("Usuário logado com e-Mail e senha");
    }).catch(err => {
        console.log("Erro ao logar com e-Mail e senha", err);
    });
}

/**
 * Listener de dom ready
 */
document.addEventListener("DOMContentLoaded", function () {
    // Observa se há um usuário e verifica se tem mudanças na autenticação com e-Mail e senha (login e logout)
    firebase.auth().onAuthStateChanged((usuario) => {
        if(usuario) {
            console.log("Usuário logado com e-Mail e senha", usuario);

            currentUser = usuario;

            // Método 1: Mudando o idioma do Firebase para envio de e-Mail em português
            firebase.auth().laguageCode = 'pt';
            // Método 2: Muda o idioma, porém utilizando o idioma do aparelho
            firebase.auth().useDeviceLanguage();

            if(!usuario.emailVerified) {
                // Envia um e-Mail ao usuário para verificar/confirmar a conta dele
                // usuario.sendEmailVerification().then(() => {
                //     alert("e-Mail de verificação enviado")
                // });
            }

            // Envia um e-mail para mudança de senha ao e-Mail passado por parâmetro
            // firebase.auth().sendPasswordResetEmail(usuario.email).then(() => {
            //     alert("e-Mail para reset de senha enviado");
            // });
        } else {
            console.log("Nenhum usuário logado");
        }
    });

    currentUser = firebase.auth().currentUser;
    if(currentUser) {
        console.log("Usuário atual", currentUser);

        //Métodos para update de dados de usuários criados no auth()
        currentUser.updateProfile({
            displayName: "Estelson Medeiros Pereira",
            photoURL: ""
        });

        // currentUser.updateEmail("estelson@gmail.com");
        // currentUser.updatePassword("123456");
        // currentUser.updatePhoneNumber("+5561XXXXXXXXX");
    }
});

/**
 * Exclui um usuário
 */
function deletaUsuario() {
    if(currentUser) {
        currentUser.delete().then(() => {
            alert("Usuário excluído");
        });
    }
}