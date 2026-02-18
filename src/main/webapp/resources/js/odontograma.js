const svg = document.getElementById("odontograma");
// Variable global para dentición - se sincroniza con PrimeFaces
var tipoDenticion = "mixta";

const CONFIG = {
  STROKE_WIDTH: 0.5,
  DIENTE: { alto: 58 },
  ESPACIADO: {
    inicioY: 10,
    anchoSVG: 1200,
    vertical: {
      mixta: [170, 250, 170, 250],
      permanente: 270,
      decidua: 270,
      default: 270
    }
  }
};

const FILAS_POR_DENTICION = {
  mixta: [
    [18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28],
    [55,54,53,52,51,61,62,63,64,65],
    [85,84,83,82,81,71,72,73,74,75],
    [48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38]
  ],
  permanente: [
    [18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28],
    [48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38]
  ],
  decidua: [
    [55,54,53,52,51,61,62,63,64,65],
    [85,84,83,82,81,71,72,73,74,75]
  ]
};

const REGLAS_DIENTES = {
  molarSup:   { nums: [18,17,16,26,27,28], fn: null, ancho: 54 },
  premSup:    { nums: [15,25], fn: null, ancho: 54 },
  bicSup:     { nums: [14,24], fn: null, ancho: 54 },
  premInf:    { nums: [45,44,35,34], fn: null, ancho: 54 },
  mol46:      { nums: [46], fn: null, ancho: 54 },
  mol36:      { nums: [36], fn: null, ancho: 54 },
  molInf:     { nums: [48,47,37,38], fn: null, ancho: 54 },
  molTempSup: { nums: [55,65], fn: null, ancho: 54 },
  molTempSupsin: { nums: [54,64], fn: null, ancho: 54 },
  mol85_75:   { nums: [85,75], fn: null, ancho: 54 },
  mol84_74:   { nums: [84,74], fn: null, ancho: 54 },
  incSup:     { nums: [13,12,11,21,22,23], fn: null, ancho: 45 },
  incInf:     { nums: [43,42,41,31,32,33], fn: null, ancho: 45 },
  incTempSup: { nums: [53,52,51,61,62,63], fn: null, ancho: 45 },
  incTempInf: { nums: [83,73,82,72,81,71], fn: null, ancho: 45 }
};

const SVG_NS = "http://www.w3.org/2000/svg";
const mapaDientes = {};

const FILAS_INFERIORES = {
  mixta: [2, 3],
  permanente: [1],
  decidua: [1]
};

function obtenerAnchoDiente(n) {
  for (var k in REGLAS_DIENTES) {
    if (REGLAS_DIENTES[k].nums.indexOf(n) !== -1) {
      return REGLAS_DIENTES[k].ancho;
    }
  }
  return 54;
}

function crearElemento(tipo, attrs) {
  var el = document.createElementNS(SVG_NS, tipo);
  if (attrs) {
    for (var k in attrs) {
      if (attrs.hasOwnProperty(k)) {
        el.setAttribute(k, attrs[k]);
      }
    }
  }
  return el;
}

// MODIFICADO: crearGrupo ahora acepta numDiente y asigna data-diente
function crearGrupo(x, y, numDiente) {
  var g = crearElemento("g", { transform: "translate(" + x + ", " + y + ") scale(0.7)" });
  if (numDiente) {
    g.setAttribute("data-diente", numDiente);
  }
  return g;
}

var GROSOR_CAJA = CONFIG.STROKE_WIDTH;
var GROSOR_DIENTE = CONFIG.STROKE_WIDTH / 0.7;

function crearLinea(g, x1, y1, x2, y2) {
  var line = crearElemento("line", {
    x1: x1, y1: y1, x2: x2, y2: y2,
    stroke: "black",
    "stroke-width": GROSOR_DIENTE
  });
  g.appendChild(line);
  return line;
}

function aplicarEventosCajon(el) {
  if (el.dataset.clickableCajon) return;
  el.dataset.clickableCajon = "true";
  el.style.cursor = "pointer";
  el.style.transition = "fill 0.2s ease";
  
  el.addEventListener("click", function(e) {
    e.stopPropagation();
    var texto = prompt("Ingrese texto (máximo 3 letras):", "");
    if (!texto) return;
    
    var textoLimitado = texto.substring(0, 3).toUpperCase();
    var parent = el.parentNode;
    var x = parseFloat(el.getAttribute("x"));
    var y = parseFloat(el.getAttribute("y"));
    var ancho = parseFloat(el.getAttribute("width"));
    var alto = parseFloat(el.getAttribute("height"));
    
    var oldText = parent.querySelector("[data-cajon-text=\"" + el.dataset.cajonId + "\"]");
    if (oldText) oldText.remove();
    
    var textEl = crearElemento("text", {
      x: x + ancho / 2,
      y: y + alto / 2 + 4,
      "text-anchor": "middle",
      "dominant-baseline": "middle",
      "font-size": "14px",
      "font-weight": "bold",
      "font-family": "Arial, sans-serif",
      fill: "#333",
      "data-cajon-text": el.dataset.cajonId
    });
    textEl.textContent = textoLimitado;
    parent.appendChild(textEl);
  });
}

function aplicarEventosSuperficie(el) {
  if (el.dataset.clickable) return;
  
  el.dataset.clickable = "true";
  el.style.cursor = "pointer";
  el.style.transition = "fill 0.2s ease";
  
  el.addEventListener("mouseenter", function() {
    if (!el.dataset.usuarioColor) {
      el.dataset.originalFill = el.getAttribute("fill") || "white";
      el.setAttribute("fill", "#f0f0f0");
    }
  });
  
  el.addEventListener("mouseleave", function() {
    if (!el.dataset.usuarioColor) {
      el.setAttribute("fill", el.dataset.originalFill || "white");
    }
  });
  
  // MODIFICADO: Evento click para obtener el número del diente
  el.addEventListener("click", function(e) {
      e.stopPropagation();

      var g = el.closest("g");
      var diente = null;

      if (g && g.dataset.diente) {
          diente = g.dataset.diente;
      }

      console.log("Diente seleccionado:", diente);

      window.superficieSeleccionada = el;

      // 🔥 Enviar número al Bean
      enviarDiente([{name:'dienteSeleccionado', value:diente}]);

      PF('dlgServicio').show();
  });

}


function pintarTexto(valor) {

    if (!window.superficieSeleccionada || !valor) {
        return;
    }

    var bbox = window.superficieSeleccionada.getBBox();
    var svg = window.superficieSeleccionada.ownerSVGElement;

    var nuevoTexto = document.createElementNS("http://www.w3.org/2000/svg", "text");

    nuevoTexto.setAttribute("x", bbox.x + bbox.width / 2);
    nuevoTexto.setAttribute("y", bbox.y + bbox.height / 2);
    nuevoTexto.setAttribute("text-anchor", "middle");
    nuevoTexto.setAttribute("dominant-baseline", "middle");
    nuevoTexto.setAttribute("font-size", "10");
    nuevoTexto.setAttribute("fill", "black");

    nuevoTexto.textContent = valor;

    svg.appendChild(nuevoTexto);
}



function aplicarColorSeleccionado(color) {
  if (!window.superficieSeleccionada) return;

  var el = window.superficieSeleccionada;

  el.setAttribute("fill", color);
  el.dataset.usuarioColor = color;
  el.dataset.originalFill = color;

  // cerrar modal
  PF('dlgServicio').hide();
}

function crearSuperficie(g, tipo, attrs) {
  var attrsCompletos = {};
  for (var k in attrs) {
    if (attrs.hasOwnProperty(k)) {
      attrsCompletos[k] = attrs[k];
    }
  }
  attrsCompletos.stroke = "black";
  attrsCompletos.fill = "white";
  attrsCompletos["stroke-width"] = GROSOR_DIENTE;
  
  var el = crearElemento(tipo, attrsCompletos);
  aplicarEventosSuperficie(el);
  g.appendChild(el);
  return el;
}

var s = crearSuperficie;
var l = crearLinea;

// MODIFICADO: Todas las funciones ahora aceptan numDiente y lo pasan a crearGrupo
function crearMolar(x, y, numDiente) {
  var g = crearGrupo(x, y, numDiente);
  
  s(g, "polygon", { points: "25,45 40,5 55,45" });
  s(g, "polygon", { points: "55,45 70,5 85,45" });
  s(g, "polygon", { points: "47.5,25 55,5 62.5,25 55,45" });
  s(g, "polygon", { points: "25,45 40,55 40,80 25,90" });
  s(g, "polygon", { points: "70,55 85,45 85,90 70,80" });
  s(g, "polygon", { points: "40,55 70,55 85,45 25,45" });
  s(g, "polygon", { points: "25,90 40,80 70,80 85,90" });
  s(g, "rect", { x: 40, y: 55, width: 15, height: 12.5 });
  s(g, "rect", { x: 55, y: 55, width: 15, height: 12.5 });
  s(g, "rect", { x: 40, y: 67.5, width: 15, height: 12.5 });
  s(g, "rect", { x: 55, y: 67.5, width: 15, height: 12.5 });
  l(g, 55, 55, 55, 80);
  l(g, 40, 67.5, 70, 67.5);
  
  g.centroOffset = 38.5;
  return g;
}

function crearMolarCentroMixto(x, y, numDiente) {
  var g = crearGrupo(x, y, numDiente);
  
  s(g, "polygon", { points: "25,45 40,5 55,45" });
  s(g, "polygon", { points: "55,45 70,5 85,45" });
  s(g, "polygon", { points: "47.5,25 55,5 62.5,25 55,45" });
  s(g, "polygon", { points: "25,45 40,55 40,80 25,90" });
  s(g, "polygon", { points: "70,55 85,45 85,90 70,80" });
  s(g, "polygon", { points: "40,55 70,55 85,45 25,45" });
  s(g, "polygon", { points: "25,90 40,80 70,80 85,90" });
  s(g, "rect", { x: 40, y: 55, width: 15, height: 12.5 });
  s(g, "rect", { x: 55, y: 55, width: 15, height: 12.5 });
  s(g, "rect", { x: 40, y: 67.5, width: 30, height: 12.5 });
  l(g, 55, 55, 55, 67.5);
  l(g, 40, 67.5, 70, 67.5);
  
  g.centroOffset = 38.5;
  return g;
}

function crearPremolar(x, y, numDiente) {
  var g = crearGrupo(x, y, numDiente);
  
  s(g, "polygon", { points: "40,45 55,5 70,45 55,45" });
  s(g, "polygon", { points: "25,45 40,55 40,80 25,90" });
  s(g, "polygon", { points: "70,55 85,45 85,90 70,80" });
  s(g, "polygon", { points: "25,45 85,45 70,55 40,55" });
  s(g, "polygon", { points: "25,90 40,80 70,80 85,90" });
  s(g, "rect", { x: 40, y: 55, width: 30, height: 12.5 });
  s(g, "rect", { x: 40, y: 67.5, width: 30, height: 12.5 });
  l(g, 40, 67.5, 70, 67.5);
  
  g.centroOffset = 38.5;
  return g;
}

function crearBicuspideSuperior(x, y, numDiente) {
  var g = crearGrupo(x, y, numDiente);
  
  s(g, "polygon", { points: "50,45 65,5 80,45" });
  s(g, "polygon", { points: "30,45 45,5 60,45" });
  s(g, "polygon", { points: "25,45 40,55 40,80 25,90" });
  s(g, "polygon", { points: "70,55 85,45 85,90 70,80" });
  s(g, "polygon", { points: "25,45 40,55 70,55 85,45" });
  s(g, "polygon", { points: "25,90 40,80 70,80 85,90" });
  s(g, "rect", { x: 40, y: 55, width: 30, height: 12.5 });
  s(g, "rect", { x: 40, y: 67.5, width: 30, height: 12.5 });
  l(g, 40, 67.5, 70, 67.5);
  
  g.centroOffset = 38.5;
  return g;
}

function crearIncisivoSuperior(x, y, numDiente) {
  var g = crearGrupo(x, y, numDiente);
  
  s(g, "polygon", { points: "26,45 48,5 69.1,45" });
  s(g, "polygon", { points: "25,45 38.2,67.8 38.5,67 25,90" });
  s(g, "polygon", { points: "70,45 58,68 58,67 70,90" });
  s(g, "polygon", { points: "25,45 70,45 58,68 38.2,67.8" });
  s(g, "polygon", { points: "25,90 38.5,67 58,67 70,90" });
  l(g, 38, 67.5, 58, 67.5);
  
  g.centroOffset = 33.25;
  return g;
}

function crearMolarInferior46(x, y, numDiente) {
  var g = crearGrupo(x, y, numDiente);
  
  s(g, "polygon", { points: "25,90 40,135 55,90" });
  s(g, "polygon", { points: "55,90 70,135 85,90" });
  s(g, "polygon", { points: "25,45 40,55 40,80 25,90" });
  s(g, "polygon", { points: "70,55 85,45 85,90 70,80" });
  s(g, "polygon", { points: "25,45 85,45 70,55 40,55" });
  s(g, "polygon", { points: "25,90 40,80 70,80 85,90" });
  s(g, "rect", { x: 40, y: 55, width: 8, height: 25 });
  s(g, "rect", { x: 48, y: 55, width: 11, height: 12.5 });
  s(g, "rect", { x: 48, y: 67.5, width: 11, height: 12.5 });
  s(g, "rect", { x: 59, y: 55, width: 11, height: 12.5 });
  s(g, "rect", { x: 59, y: 67.5, width: 11, height: 12.5 });
  l(g, 48, 55, 48, 80);
  l(g, 59, 55, 59, 80);
  l(g, 48, 67.5, 70, 67.5);
  
  g.centroOffset = 38.5;
  return g;
}

function crearMolarInferior36(x, y, numDiente) {
  var g = crearGrupo(x, y, numDiente);
  
  s(g, "polygon", { points: "25,90 40,135 55,90" });
  s(g, "polygon", { points: "55,90 70,135 85,90" });
  s(g, "polygon", { points: "25,45 40,55 40,80 25,90" });
  s(g, "polygon", { points: "70,55 85,45 85,90 70,80" });
  s(g, "polygon", { points: "25,45 85,45 70,55 40,55" });
  s(g, "polygon", { points: "25,90 40,80 70,80 85,90" });
  s(g, "rect", { x: 40, y: 55, width: 11, height: 12.5 });
  s(g, "rect", { x: 40, y: 67.5, width: 11, height: 12.5 });
  s(g, "rect", { x: 51, y: 55, width: 11, height: 12.5 });
  s(g, "rect", { x: 51, y: 67.5, width: 11, height: 12.5 });
  s(g, "rect", { x: 62, y: 55, width: 8, height: 25 });
  l(g, 51, 55, 51, 80);
  l(g, 62, 55, 62, 80);
  l(g, 40, 67.5, 62, 67.5);
  
  g.centroOffset = 38.5;
  return g;
}

function crearPremolarInferior(x, y, numDiente) {
  var g = crearGrupo(x, y, numDiente);
  
  s(g, "polygon", { points: "40,90 55,135 70,90 55,90" });
  s(g, "polygon", { points: "25,45 40,55 40,80 25,90" });
  s(g, "polygon", { points: "70,55 85,45 85,90 70,80" });
  s(g, "polygon", { points: "25,45 85,45 70,55 40,55" });
  s(g, "polygon", { points: "25,90 40,80 70,80 85,90" });
  s(g, "rect", { x: 40, y: 55, width: 30, height: 12.5 });
  s(g, "rect", { x: 40, y: 67.5, width: 30, height: 12.5 });
  l(g, 40, 67.5, 70, 67.5);
  
  g.centroOffset = 38.5;
  return g;
}

function crearIncisivoInferior(x, y, numDiente) {
  var g = crearGrupo(x, y, numDiente);
  
  s(g, "polygon", { points: "26,90 48,135 69.1,90" });
  s(g, "polygon", { points: "25,45 70,45 58,68 38.2,67.8" });
  s(g, "polygon", { points: "25,45 38.2,67.8 38.5,67 25,90" });
  s(g, "polygon", { points: "70,45 58,68 58,67 70,90" });
  s(g, "polygon", { points: "25,90 38.5,67 58,67 70,90" });
  l(g, 38, 67.5, 58, 67.5);
  
  g.centroOffset = 33.25;
  return g;
}

function crearMolar85_75(x, y, numDiente) {
  var g = crearGrupo(x, y, numDiente);
  
  s(g, "polygon", { points: "25,90 40,135 55,90" });
  s(g, "polygon", { points: "55,90 70,135 85,90" });
  s(g, "polygon", { points: "25,45 40,55 40,80 25,90" });
  s(g, "polygon", { points: "70,55 85,45 85,90 70,80" });
  s(g, "polygon", { points: "25,45 40,55 70,55 85,45" });
  s(g, "polygon", { points: "25,90 40,80 70,80 85,90" });
  s(g, "rect", { x: 40, y: 55, width: 15, height: 12.5 });
  s(g, "rect", { x: 55, y: 55, width: 15, height: 12.5 });
  s(g, "rect", { x: 40, y: 67.5, width: 8, height: 12.5 });
  s(g, "rect", { x: 48, y: 67.5, width: 14, height: 12.5 });
  s(g, "rect", { x: 62, y: 67.5, width: 8, height: 12.5 });
  l(g, 55, 55, 55, 68);
  l(g, 40, 67.5, 70, 67.5);
  l(g, 48, 67.5, 48, 80);
  l(g, 62, 67.5, 62, 80);
  
  g.centroOffset = 38.5;
  return g;
}

function crearMolarInferiorPermanente(x, y, numDiente) {
  var g = crearGrupo(x, y, numDiente);
  
  s(g, "polygon", { points: "25,90 40,135 55,90" });
  s(g, "polygon", { points: "55,90 70,135 85,90" });
  s(g, "polygon", { points: "25,45 40,55 40,80 25,90" });
  s(g, "polygon", { points: "70,55 85,45 85,90 70,80" });
  s(g, "polygon", { points: "25,45 40,55 70,55 85,45" });
  s(g, "polygon", { points: "25,90 40,80 70,80 85,90" });
  s(g, "rect", { x: 40, y: 55, width: 15, height: 12.5 });
  s(g, "rect", { x: 55, y: 55, width: 15, height: 12.5 });
  s(g, "rect", { x: 40, y: 67.5, width: 15, height: 12.5 });
  s(g, "rect", { x: 55, y: 67.5, width: 15, height: 12.5 });
  l(g, 55, 55, 55, 80);
  l(g, 40, 67.5, 70, 67.5);
  
  g.centroOffset = 38.5;
  return g;
}

// Asignar funciones a las reglas
REGLAS_DIENTES.molarSup.fn = crearMolar;
REGLAS_DIENTES.premSup.fn = crearPremolar;
REGLAS_DIENTES.bicSup.fn = crearBicuspideSuperior;
REGLAS_DIENTES.premInf.fn = crearPremolarInferior;
REGLAS_DIENTES.mol46.fn = crearMolarInferior46;
REGLAS_DIENTES.mol36.fn = crearMolarInferior36;
REGLAS_DIENTES.molInf.fn = crearMolarInferiorPermanente;
REGLAS_DIENTES.molTempSup.fn = crearMolar;
REGLAS_DIENTES.molTempSupsin.fn = crearMolarCentroMixto;
REGLAS_DIENTES.mol85_75.fn = crearMolar85_75;
REGLAS_DIENTES.mol84_74.fn = crearMolarInferiorPermanente;
REGLAS_DIENTES.incSup.fn = crearIncisivoSuperior;
REGLAS_DIENTES.incInf.fn = crearIncisivoInferior;
REGLAS_DIENTES.incTempSup.fn = crearIncisivoSuperior;
REGLAS_DIENTES.incTempInf.fn = crearIncisivoInferior;

function obtenerEspaciadoVertical(i) {
  var v = CONFIG.ESPACIADO.vertical;
  if (tipoDenticion === "mixta" && v.mixta instanceof Array) {
    return v.mixta[i] !== undefined ? v.mixta[i] : v.default;
  }
  return v[tipoDenticion] !== undefined ? v[tipoDenticion] : v.default;
}

function calcularAltoTotal(filas) {
  var a = CONFIG.ESPACIADO.inicioY;
  for (var i = 0; i < filas.length; i++) {
    a += CONFIG.DIENTE.alto;
    if (i < filas.length - 1) {
      a += obtenerEspaciadoVertical(i);
    }
  }
  var inf = FILAS_INFERIORES[tipoDenticion];
  if (inf && inf.indexOf(filas.length - 1) !== -1) {
    a += 30;
  } else {
    a += 40;
  }
  return a;
}

function actualizarOdontograma() {
  // Verificar que el SVG existe
  if (!svg) {
    console.error("SVG no encontrado");
    return;
  }
  
  while (svg.firstChild) {
    svg.removeChild(svg.firstChild);
  }
  
  var filas = FILAS_POR_DENTICION[tipoDenticion];
  svg.setAttribute("viewBox", "0 0 1200 " + calcularAltoTotal(filas));
  
  for (var k in mapaDientes) {
    delete mapaDientes[k];
  }
  
  for (var k2 in REGLAS_DIENTES) {
    var regla = REGLAS_DIENTES[k2];
    for (var i = 0; i < regla.nums.length; i++) {
      mapaDientes[regla.nums[i]] = regla.fn;
    }
  }
  
  function esInferior(i) {
    var inf = FILAS_INFERIORES[tipoDenticion];
    return inf ? inf.indexOf(i) !== -1 : false;
  }
  
  var y = CONFIG.ESPACIADO.inicioY;
  
  for (var idx = 0; idx < filas.length; idx++) {
    var fila = filas[idx];
    var anchoTotal = 0;
    for (var i = 0; i < fila.length; i++) {
      anchoTotal += obtenerAnchoDiente(fila[i]);
    }
    var inicioX = (CONFIG.ESPACIADO.anchoSVG - anchoTotal) / 2;
    var x = inicioX;
    var inf = esInferior(idx);
    
    for (var i2 = 0; i2 < fila.length; i2++) {
      var num = fila[i2];
      var w = obtenerAnchoDiente(num);
      var id = num + "_" + idx + "_" + i2;
      
      var caja = crearElemento("rect", {
        x: x, y: y,
        width: w,
        height: CONFIG.DIENTE.alto,
        fill: "white",
        stroke: "black",
        "stroke-width": GROSOR_CAJA,
        "data-cajon-id": id
      });
      aplicarEventosCajon(caja);
      svg.appendChild(caja);
      
      var etiqY = inf ? y - 8 : y + CONFIG.DIENTE.alto + 18;
      var fontSize = w === 45 ? "10px" : "11px";
      
      var etiq = crearElemento("text", {
        x: x + w / 2,
        y: etiqY,
        "text-anchor": "middle",
        "font-size": fontSize,
        "font-weight": "bold",
        "font-family": "Arial, sans-serif",
        fill: "#333"
      });
      etiq.textContent = num;
      svg.appendChild(etiq);
      
      // MODIFICADO: Pasar el número del diente a la función creadora
      var fn = mapaDientes[num];
      if (fn) {
        var centro = x + w / 2;
        // Llamar a fn(0,0,num) para obtener el grupo temporal y calcular offset
        var tmp = fn(0, 0, num);
        var offset = tmp.centroOffset !== undefined ? tmp.centroOffset : 38.5;
        var yPos = inf ? y - 125 : y + CONFIG.DIENTE.alto + 30;
        // Crear el diente real con el número
        svg.appendChild(fn(centro - offset, yPos, num));
      }
      
      x += w;
    }
    
    if (idx < filas.length - 1) {
      y += obtenerEspaciadoVertical(idx);
    }
  }
}

function iniciar() {
  if (!svg) {
    console.log("Esperando al SVG...");
    setTimeout(iniciar, 100);
    return;
  }
  actualizarOdontograma();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', iniciar);
} else {
  iniciar();
}

window.actualizarOdontograma = actualizarOdontograma;

window.aplicarColorSeleccionado = function(color) {
  console.log("Color:", color);

  if (!window.superficieSeleccionada) return;

  var el = window.superficieSeleccionada;

  el.setAttribute("fill", color);
  el.dataset.usuarioColor = color;

  PF('dlgServicio').hide();
};