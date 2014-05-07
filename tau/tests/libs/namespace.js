if (window.ej === undefined && window.tau) {
    window.ej = window.tau._export;
}

if (window.ej === undefined && window.$ && window.$.tizen) {
    window.ej = window.$.tizen._export;
}