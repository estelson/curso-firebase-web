/**
 * Para fazer login com o Google é necessário colocar o projeto em produção em algum host.
 * O Firebase não permite autenticação por uma página que está na máquina local, greando o erro: 
 * This operation is not supported in the environment…chrome-extension and web storage must be enabled.
 */

var provider = new firebase.auth.GoogleAuthProvider();

function loginGoogle() {
    firebase.auth().signInWithPopup(provider).then(resposta => {
        console.log("usuario", resposta.user);
        console.log("token", resposta.credential.accessToken);
    }).catch(erro => {
        console.log("erro", erro);
    });
}