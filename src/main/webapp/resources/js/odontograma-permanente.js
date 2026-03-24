(function () {
  var svgPerm = null;
  var SVG_NS = "http://www.w3.org/2000/svg";

  var FILAS_PERMANENTE = [
    [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28],
    [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38],
  ];

  var CONFIG_PERM = {
    STROKE_WIDTH: 0.5,
    DIENTE: { alto: 58 },
    ESPACIADO: { inicioY: 10, anchoSVG: 1200, vertical: 270 },
  };

  var FILAS_INFERIORES_PERM = [1];

  var REGLAS_PERM = {
    molarSup: { nums: [18, 17, 16, 26, 27, 28], fn: null, ancho: 54 },
    premSup: { nums: [15, 25], fn: null, ancho: 54 },
    bicSup: { nums: [14, 24], fn: null, ancho: 54 },
    incSup: { nums: [13, 12, 11, 21, 22, 23], fn: null, ancho: 45 },
    premInf: { nums: [45, 44, 35, 34], fn: null, ancho: 54 },
    mol46: { nums: [46], fn: null, ancho: 54 },
    mol36: { nums: [36], fn: null, ancho: 54 },
    molInf: { nums: [48, 47, 37, 38], fn: null, ancho: 54 },
    incInf: { nums: [43, 42, 41, 31, 32, 33], fn: null, ancho: 45 },
  };

  var mapaDientesPerm = {};

  var GROSOR_CAJA = CONFIG_PERM.STROKE_WIDTH;
  var GROSOR_DIENTE = CONFIG_PERM.STROKE_WIDTH / 0.7;

  function $s(tipo, attrs) {
    var el = document.createElementNS(SVG_NS, tipo);
    for (var k in attrs) if (attrs.hasOwnProperty(k)) el.setAttribute(k, attrs[k]);
    return el;
  }

  function grupo(x, y) {
    return $s("g", { transform: "translate(" + x + ", " + y + ") scale(0.7)" });
  }

  function linea(g, x1, y1, x2, y2) {
    g.appendChild($s("line", { x1: x1, y1: y1, x2: x2, y2: y2, stroke: "black", "stroke-width": GROSOR_DIENTE }));
  }

  function sup(g, tipo, attrs) {
    var a = {};
    for (var k in attrs) if (attrs.hasOwnProperty(k)) a[k] = attrs[k];
    a.stroke = "black";
    a.fill = "white";
    a["stroke-width"] = GROSOR_DIENTE;
    var el = $s(tipo, a);
    g.appendChild(el);
    return el;
  }

  // ===== FUNCIONES DE DIENTES =====
  function crearMolar(x, y) {
    var g = grupo(x, y);
    sup(g, "polygon", { points: "30,45 42,5 55,45" });
    sup(g, "polygon", { points: "55,45 68,5 80,45" });
    sup(g, "polygon", { points: "25,45 40,55 40,80 25,90" });
    sup(g, "polygon", { points: "70,55 85,45 85,90 70,80" });
    sup(g, "polygon", { points: "40,55 70,55 85,45 25,45" });
    sup(g, "polygon", { points: "25,90 40,80 70,80 85,90" });
    sup(g, "rect", { x: 40, y: 55, width: 15, height: 12.5 });
    sup(g, "rect", { x: 55, y: 55, width: 15, height: 12.5 });
    sup(g, "rect", { x: 40, y: 67.5, width: 15, height: 12.5 });
    sup(g, "rect", { x: 55, y: 67.5, width: 15, height: 12.5 });
    linea(g, 55, 55, 55, 80);
    linea(g, 40, 67.5, 70, 67.5);
    g.centroOffset = 38.5;
    return g;
  }

  function crearPremolar(x, y) {
    var g = grupo(x, y);
    sup(g, "polygon", { points: "40,45 55,5 70,45 55,45" });
    sup(g, "polygon", { points: "25,45 40,55 40,80 25,90" });
    sup(g, "polygon", { points: "70,55 85,45 85,90 70,80" });
    sup(g, "polygon", { points: "25,45 85,45 70,55 40,55" });
    sup(g, "polygon", { points: "25,90 40,80 70,80 85,90" });
    sup(g, "rect", { x: 40, y: 55, width: 30, height: 12.5 });
    sup(g, "rect", { x: 40, y: 67.5, width: 30, height: 12.5 });
    linea(g, 40, 67.5, 70, 67.5);
    g.centroOffset = 38.5;
    return g;
  }

  function crearBicuspide(x, y) {
    var g = grupo(x, y);
    sup(g, "polygon", { points: "33,45 44,5 55,45" });
    sup(g, "polygon", { points: "55,45 66,5 77,45" });
    sup(g, "polygon", { points: "25,45 40,55 40,80 25,90" });
    sup(g, "polygon", { points: "70,55 85,45 85,90 70,80" });
    sup(g, "polygon", { points: "25,45 40,55 70,55 85,45" });
    sup(g, "polygon", { points: "25,90 40,80 70,80 85,90" });
    sup(g, "rect", { x: 40, y: 55, width: 30, height: 12.5 });
    sup(g, "rect", { x: 40, y: 67.5, width: 30, height: 12.5 });
    linea(g, 40, 67.5, 70, 67.5);
    g.centroOffset = 38.5;
    return g;
  }

  function crearIncisivoSup(x, y) {
    var g = grupo(x, y);
    sup(g, "polygon", { points: "26,45 48,5 69.1,45" });
    sup(g, "polygon", { points: "25,45 38.2,67.8 38.5,67 25,90" });
    sup(g, "polygon", { points: "70,45 58,68 58,67 70,90" });
    sup(g, "polygon", { points: "25,45 70,45 58,68 38.2,67.8" });
    sup(g, "polygon", { points: "25,90 38.5,67 58,67 70,90" });
    linea(g, 38, 67.5, 58, 67.5);
    g.centroOffset = 33.25;
    return g;
  }

  function crearMolarInferior46(x, y) {
    var g = grupo(x, y);
    sup(g, "polygon", { points: "30,90 42,135 55,90" });
    sup(g, "polygon", { points: "55,90 68,135 80,90" });
    sup(g, "polygon", { points: "25,45 40,55 40,80 25,90" });
    sup(g, "polygon", { points: "70,55 85,45 85,90 70,80" });
    sup(g, "polygon", { points: "25,45 85,45 70,55 40,55" });
    sup(g, "polygon", { points: "25,90 40,80 70,80 85,90" });
    sup(g, "rect", { x: 40, y: 55, width: 8, height: 25 });
    sup(g, "rect", { x: 48, y: 55, width: 11, height: 12.5 });
    sup(g, "rect", { x: 48, y: 67.5, width: 11, height: 12.5 });
    sup(g, "rect", { x: 59, y: 55, width: 11, height: 12.5 });
    sup(g, "rect", { x: 59, y: 67.5, width: 11, height: 12.5 });
    linea(g, 48, 55, 48, 80);
    linea(g, 59, 55, 59, 80);
    linea(g, 48, 67.5, 70, 67.5);
    g.centroOffset = 38.5;
    return g;
  }

  function crearMolarInferior36(x, y) {
    var g = grupo(x, y);
    sup(g, "polygon", { points: "30,90 42,135 55,90" });
    sup(g, "polygon", { points: "55,90 68,135 80,90" });
    sup(g, "polygon", { points: "25,45 40,55 40,80 25,90" });
    sup(g, "polygon", { points: "70,55 85,45 85,90 70,80" });
    sup(g, "polygon", { points: "25,45 85,45 70,55 40,55" });
    sup(g, "polygon", { points: "25,90 40,80 70,80 85,90" });
    sup(g, "rect", { x: 40, y: 55, width: 11, height: 12.5 });
    sup(g, "rect", { x: 40, y: 67.5, width: 11, height: 12.5 });
    sup(g, "rect", { x: 51, y: 55, width: 11, height: 12.5 });
    sup(g, "rect", { x: 51, y: 67.5, width: 11, height: 12.5 });
    sup(g, "rect", { x: 62, y: 55, width: 8, height: 25 });
    linea(g, 51, 55, 51, 80);
    linea(g, 62, 55, 62, 80);
    linea(g, 40, 67.5, 62, 67.5);
    g.centroOffset = 38.5;
    return g;
  }

  function crearPremolarInf(x, y) {
    var g = grupo(x, y);
    sup(g, "polygon", { points: "40,90 55,135 70,90 55,90" });
    sup(g, "polygon", { points: "25,45 40,55 40,80 25,90" });
    sup(g, "polygon", { points: "70,55 85,45 85,90 70,80" });
    sup(g, "polygon", { points: "25,45 85,45 70,55 40,55" });
    sup(g, "polygon", { points: "25,90 40,80 70,80 85,90" });
    sup(g, "rect", { x: 40, y: 55, width: 30, height: 12.5 });
    sup(g, "rect", { x: 40, y: 67.5, width: 30, height: 12.5 });
    linea(g, 40, 67.5, 70, 67.5);
    g.centroOffset = 38.5;
    return g;
  }

  function crearIncisivoInf(x, y) {
    var g = grupo(x, y);
    sup(g, "polygon", { points: "26,90 48,135 69.1,90" });
    sup(g, "polygon", { points: "25,45 70,45 58,68 38.2,67.8" });
    sup(g, "polygon", { points: "25,45 38.2,67.8 38.5,67 25,90" });
    sup(g, "polygon", { points: "70,45 58,68 58,67 70,90" });
    sup(g, "polygon", { points: "25,90 38.5,67 58,67 70,90" });
    linea(g, 38, 67.5, 58, 67.5);
    g.centroOffset = 33.25;
    return g;
  }

  function crearMolarInfPerm(x, y) {
    var g = grupo(x, y);
    sup(g, "polygon", { points: "30,90 42,135 55,90" });
    sup(g, "polygon", { points: "55,90 68,135 80,90" });
    sup(g, "polygon", { points: "25,45 40,55 40,80 25,90" });
    sup(g, "polygon", { points: "70,55 85,45 85,90 70,80" });
    sup(g, "polygon", { points: "25,45 40,55 70,55 85,45" });
    sup(g, "polygon", { points: "25,90 40,80 70,80 85,90" });
    sup(g, "rect", { x: 40, y: 55, width: 15, height: 12.5 });
    sup(g, "rect", { x: 55, y: 55, width: 15, height: 12.5 });
    sup(g, "rect", { x: 40, y: 67.5, width: 15, height: 12.5 });
    sup(g, "rect", { x: 55, y: 67.5, width: 15, height: 12.5 });
    linea(g, 55, 55, 55, 80);
    linea(g, 40, 67.5, 70, 67.5);
    g.centroOffset = 38.5;
    return g;
  }

  // Asignar funciones
  REGLAS_PERM.molarSup.fn = crearMolar;
  REGLAS_PERM.premSup.fn = crearPremolar;
  REGLAS_PERM.bicSup.fn = crearBicuspide;
  REGLAS_PERM.incSup.fn = crearIncisivoSup;
  REGLAS_PERM.premInf.fn = crearPremolarInf;
  REGLAS_PERM.mol46.fn = crearMolarInferior46;
  REGLAS_PERM.mol36.fn = crearMolarInferior36;
  REGLAS_PERM.molInf.fn = crearMolarInfPerm;
  REGLAS_PERM.incInf.fn = crearIncisivoInf;

  function obtenerAncho(n) {
    for (var k in REGLAS_PERM) if (REGLAS_PERM[k].nums.indexOf(n) !== -1) return REGLAS_PERM[k].ancho;
    return 54;
  }

  function calcularAlto() {
    return (
      CONFIG_PERM.ESPACIADO.inicioY +
      CONFIG_PERM.DIENTE.alto +
      CONFIG_PERM.ESPACIADO.vertical +
      CONFIG_PERM.DIENTE.alto +
      30
    );
  }

  function iniciarPermanente() {
    svgPerm = document.getElementById("odontogramaPermanente");
    if (!svgPerm) {
      setTimeout(iniciarPermanente, 100);
      return;
    }

    while (svgPerm.firstChild) svgPerm.removeChild(svgPerm.firstChild);
    svgPerm.setAttribute("viewBox", "0 0 1200 " + calcularAlto());

    // Construir mapa
    for (var k in REGLAS_PERM)
      for (var i = 0; i < REGLAS_PERM[k].nums.length; i++) mapaDientesPerm[REGLAS_PERM[k].nums[i]] = REGLAS_PERM[k].fn;

    var y = CONFIG_PERM.ESPACIADO.inicioY;

    for (var idx = 0; idx < FILAS_PERMANENTE.length; idx++) {
      var fila = FILAS_PERMANENTE[idx];
      var esInf = FILAS_INFERIORES_PERM.indexOf(idx) !== -1;

      var anchoTotal = 0;
      for (var i = 0; i < fila.length; i++) anchoTotal += obtenerAncho(fila[i]);
      var x = (CONFIG_PERM.ESPACIADO.anchoSVG - anchoTotal) / 2;

      for (var i2 = 0; i2 < fila.length; i2++) {
        var num = fila[i2];
        var w = obtenerAncho(num);

        // Cajón
        var caja = $s("rect", {
          x: x,
          y: y,
          width: w,
          height: CONFIG_PERM.DIENTE.alto,
          fill: "white",
          stroke: "black",
          "stroke-width": GROSOR_CAJA,
        });
        svgPerm.appendChild(caja);

        // Etiqueta número
        var etiq = $s("text", {
          x: x + w / 2,
          y: esInf ? y - 8 : y + CONFIG_PERM.DIENTE.alto + 18,
          "text-anchor": "middle",
          "font-size": w === 45 ? "10px" : "11px",
          "font-weight": "bold",
          "font-family": "Arial, sans-serif",
          fill: "#333",
        });
        etiq.textContent = num;
        svgPerm.appendChild(etiq);

        // Figura del diente
        var fn = mapaDientesPerm[num];
        if (fn) {
          var centro = x + w / 2;
          var tmp = fn(0, 0);
          var offset = tmp.centroOffset || 38.5;
          var yPos = esInf ? y - 125 : y + CONFIG_PERM.DIENTE.alto + 30;
          var gd = fn(centro - offset, yPos);
          svgPerm.appendChild(gd);
        }
        x += w;
      }

      if (idx < FILAS_PERMANENTE.length - 1) y += CONFIG_PERM.DIENTE.alto + CONFIG_PERM.ESPACIADO.vertical;
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarPermanente);
  } else {
    iniciarPermanente();
  }

  window.iniciarOdontogramaPermanente = iniciarPermanente;
})();
