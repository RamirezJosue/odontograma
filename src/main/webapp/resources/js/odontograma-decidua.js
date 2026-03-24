// ============================================================
// ODONTOGRAMA DECIDUA - Solo dentición decidua
// ============================================================

(function() {

var svgDec = null;
var SVG_NS = "http://www.w3.org/2000/svg";

var FILAS_DECIDUA = [
    [55,54,53,52,51,61,62,63,64,65],
    [85,84,83,82,81,71,72,73,74,75]
];

var CONFIG_DEC = {
    STROKE_WIDTH: 0.5,
    DIENTE: { alto: 58 },
    ESPACIADO: { inicioY: 10, anchoSVG: 1200, vertical: 270 }
};

var REGLAS_DEC = {
    molTempSup:    { nums: [55,65],             ancho: 54 },
    molTempSupsin: { nums: [54,64],             ancho: 54 },
    incTempSup:    { nums: [53,52,51,61,62,63], ancho: 45 },
    mol85_75:      { nums: [85,75],             ancho: 54 },
    mol84_74:      { nums: [84,74],             ancho: 54 },
    incTempInf:    { nums: [83,73,82,72,81,71], ancho: 45 }
};

var FILAS_INFERIORES_DEC = [1];

function obtenerAncho(n) {
    for (var k in REGLAS_DEC)
        if (REGLAS_DEC[k].nums.indexOf(n) !== -1) return REGLAS_DEC[k].ancho;
    return 54;
}

function $s(tipo, attrs) {
    var el = document.createElementNS(SVG_NS, tipo);
    for (var k in attrs) el.setAttribute(k, attrs[k]);
    return el;
}

function calcularAlto() {
    var a = CONFIG_DEC.ESPACIADO.inicioY;
    a += CONFIG_DEC.DIENTE.alto;
    a += CONFIG_DEC.ESPACIADO.vertical;
    a += CONFIG_DEC.DIENTE.alto;
    a += 30;
    return a;
}

function dibujarCajon(x, y, w, num, esInf) {
    var caja = $s("rect", {
        x: x, y: y, width: w, height: CONFIG_DEC.DIENTE.alto,
        fill: "white", stroke: "black",
        "stroke-width": CONFIG_DEC.STROKE_WIDTH
    });
    svgDec.appendChild(caja);

    var etiq = $s("text", {
        x: x + w / 2,
        y: esInf ? y - 8 : y + CONFIG_DEC.DIENTE.alto + 18,
        "text-anchor": "middle",
        "font-size": w === 45 ? "10px" : "11px",
        "font-weight": "bold",
        "font-family": "Arial, sans-serif",
        fill: "#333"
    });
    etiq.textContent = num;
    svgDec.appendChild(etiq);
}

function iniciarDecidua() {
    svgDec = document.getElementById("odontogramaDecidua");
    if (!svgDec) { setTimeout(iniciarDecidua, 100); return; }

    while (svgDec.firstChild) svgDec.removeChild(svgDec.firstChild);
    svgDec.setAttribute("viewBox", "0 0 1200 " + calcularAlto());

    var y = CONFIG_DEC.ESPACIADO.inicioY;

    for (var idx = 0; idx < FILAS_DECIDUA.length; idx++) {
        var fila = FILAS_DECIDUA[idx];
        var esInf = FILAS_INFERIORES_DEC.indexOf(idx) !== -1;

        var anchoTotal = 0;
        for (var i = 0; i < fila.length; i++) anchoTotal += obtenerAncho(fila[i]);
        var x = (CONFIG_DEC.ESPACIADO.anchoSVG - anchoTotal) / 2;

        for (var i2 = 0; i2 < fila.length; i2++) {
            var num = fila[i2];
            var w = obtenerAncho(num);
            dibujarCajon(x, y, w, num, esInf);
            x += w;
        }

        if (idx < FILAS_DECIDUA.length - 1) {
            y += CONFIG_DEC.DIENTE.alto + CONFIG_DEC.ESPACIADO.vertical;
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciarDecidua);
} else {
    iniciarDecidua();
}

window.iniciarOdontogramaDecidua = iniciarDecidua;

})();