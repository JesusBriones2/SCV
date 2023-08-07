// Función para obtener el valor de la cookie del token CSRF
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}






// Desactivar caché para las páginas de tu sitio
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        window.location.reload();
    }
});



document.querySelector('.backgroundUser')?.addEventListener('click', () => {
    document.getElementById('user-checkbox').checked = false;
})
