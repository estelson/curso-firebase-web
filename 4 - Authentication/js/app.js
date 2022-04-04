function logout() {
    firebase.auth().signOut().then(() => {
        alert("Usuário não está mais logado");
    });
}