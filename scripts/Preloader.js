export function showPreloader() {
    document.body.classList.remove('loaded');
    document.body.classList.add('l');
}

export function hidePreloader() {
    document.body.classList.add('loaded_hiding');
    document.body.classList.remove('l');
    window.setTimeout(function () {
        document.body.classList.add('loaded');
        document.body.classList.remove('loaded_hiding');
    }, 500);
}