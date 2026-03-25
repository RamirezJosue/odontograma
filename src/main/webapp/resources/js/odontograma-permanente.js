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
    ESPACIADO: { inicioY: 10, anchoSVG: 1200, vertical: 240 },
  };

  var FILAS_INFERIORES_PERM = [1];

  var REGLAS_PERM = {
    molarSup: { nums: [18, 17, 16, 26, 27, 28], fn: null, ancho: 54 },
    premSup:  { nums: [15, 25],                 fn: null, ancho: 54 },
    bicSup:   { nums: [14, 24],                 fn: null, ancho: 54 },
    incSup:   { nums: [13, 12, 11, 21, 22, 23], fn: null, ancho: 45 },
    premInf:  { nums: [45, 44, 35, 34],         fn: null, ancho: 54 },
    mol46:    { nums: [46],                     fn: null, ancho: 54 },
    mol36:    { nums: [36],                     fn: null, ancho: 54 },
    molInf:   { nums: [48, 47, 37, 38],         fn: null, ancho: 54 },
    incInf:   { nums: [43, 42, 41, 31, 32, 33], fn: null, ancho: 45 },
  };

  var mapaDientesPerm = {};
  var GROSOR_CAJA   = CONFIG_PERM.STROKE_WIDTH;
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
    g.appendChild($s("line", { x1:x1, y1:y1, x2:x2, y2:y2, stroke:"black", "stroke-width": GROSOR_DIENTE }));
  }

  function sup(g, tipo, attrs) {
    var a = {};
    for (var k in attrs) if (attrs.hasOwnProperty(k)) a[k] = attrs[k];
    a.stroke = "black"; a.fill = "white"; a["stroke-width"] = GROSOR_DIENTE;
    var el = $s(tipo, a);
    g.appendChild(el); return el;
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
    sup(g, "rect", { x:40, y:55,   width:15, height:12.5 });
    sup(g, "rect", { x:55, y:55,   width:15, height:12.5 });
    sup(g, "rect", { x:40, y:67.5, width:15, height:12.5 });
    sup(g, "rect", { x:55, y:67.5, width:15, height:12.5 });
    linea(g, 55,55,55,80); linea(g, 40,67.5,70,67.5);
    g.centroOffset = 38.5; return g;
  }

  function crearPremolar(x, y) {
    var g = grupo(x, y);
    sup(g, "polygon", { points: "40,45 55,5 70,45 55,45" });
    sup(g, "polygon", { points: "25,45 40,55 40,80 25,90" });
    sup(g, "polygon", { points: "70,55 85,45 85,90 70,80" });
    sup(g, "polygon", { points: "25,45 85,45 70,55 40,55" });
    sup(g, "polygon", { points: "25,90 40,80 70,80 85,90" });
    sup(g, "rect", { x:40, y:55,   width:30, height:12.5 });
    sup(g, "rect", { x:40, y:67.5, width:30, height:12.5 });
    linea(g, 40,67.5,70,67.5);
    g.centroOffset = 38.5; return g;
  }

  function crearBicuspide(x, y) {
    var g = grupo(x, y);
    sup(g, "polygon", { points: "33,45 44,5 55,45" });
    sup(g, "polygon", { points: "55,45 66,5 77,45" });
    sup(g, "polygon", { points: "25,45 40,55 40,80 25,90" });
    sup(g, "polygon", { points: "70,55 85,45 85,90 70,80" });
    sup(g, "polygon", { points: "25,45 40,55 70,55 85,45" });
    sup(g, "polygon", { points: "25,90 40,80 70,80 85,90" });
    sup(g, "rect", { x:40, y:55,   width:30, height:12.5 });
    sup(g, "rect", { x:40, y:67.5, width:30, height:12.5 });
    linea(g, 40,67.5,70,67.5);
    g.centroOffset = 38.5; return g;
  }

  function crearIncisivoSup(x, y) {
    var g = grupo(x, y);
    sup(g, "polygon", { points: "26,45 48,5 69.1,45" });
    sup(g, "polygon", { points: "25,45 38.2,67.8 38.5,67 25,90" });
    sup(g, "polygon", { points: "70,45 58,68 58,67 70,90" });
    sup(g, "polygon", { points: "25,45 70,45 58,68 38.2,67.8" });
    sup(g, "polygon", { points: "25,90 38.5,67 58,67 70,90" });
    linea(g, 38,67.5,58,67.5);
    g.centroOffset = 33.25; return g;
  }

  function crearMolarInferior46(x, y) {
    var g = grupo(x, y);
    sup(g, "polygon", { points: "30,90 42,135 55,90" });
    sup(g, "polygon", { points: "55,90 68,135 80,90" });
    sup(g, "polygon", { points: "25,45 40,55 40,80 25,90" });
    sup(g, "polygon", { points: "70,55 85,45 85,90 70,80" });
    sup(g, "polygon", { points: "25,45 85,45 70,55 40,55" });
    sup(g, "polygon", { points: "25,90 40,80 70,80 85,90" });
    sup(g, "rect", { x:40, y:55,   width:8,  height:25   });
    sup(g, "rect", { x:48, y:55,   width:11, height:12.5 });
    sup(g, "rect", { x:48, y:67.5, width:11, height:12.5 });
    sup(g, "rect", { x:59, y:55,   width:11, height:12.5 });
    sup(g, "rect", { x:59, y:67.5, width:11, height:12.5 });
    linea(g, 48,55,48,80); linea(g, 59,55,59,80); linea(g, 48,67.5,70,67.5);
    g.centroOffset = 38.5; return g;
  }

  function crearMolarInferior36(x, y) {
    var g = grupo(x, y);
    sup(g, "polygon", { points: "30,90 42,135 55,90" });
    sup(g, "polygon", { points: "55,90 68,135 80,90" });
    sup(g, "polygon", { points: "25,45 40,55 40,80 25,90" });
    sup(g, "polygon", { points: "70,55 85,45 85,90 70,80" });
    sup(g, "polygon", { points: "25,45 85,45 70,55 40,55" });
    sup(g, "polygon", { points: "25,90 40,80 70,80 85,90" });
    sup(g, "rect", { x:40, y:55,   width:11, height:12.5 });
    sup(g, "rect", { x:40, y:67.5, width:11, height:12.5 });
    sup(g, "rect", { x:51, y:55,   width:11, height:12.5 });
    sup(g, "rect", { x:51, y:67.5, width:11, height:12.5 });
    sup(g, "rect", { x:62, y:55,   width:8,  height:25   });
    linea(g, 51,55,51,80); linea(g, 62,55,62,80); linea(g, 40,67.5,62,67.5);
    g.centroOffset = 38.5; return g;
  }

  function crearPremolarInf(x, y) {
    var g = grupo(x, y);
    sup(g, "polygon", { points: "40,90 55,135 70,90 55,90" });
    sup(g, "polygon", { points: "25,45 40,55 40,80 25,90" });
    sup(g, "polygon", { points: "70,55 85,45 85,90 70,80" });
    sup(g, "polygon", { points: "25,45 85,45 70,55 40,55" });
    sup(g, "polygon", { points: "25,90 40,80 70,80 85,90" });
    sup(g, "rect", { x:40, y:55,   width:30, height:12.5 });
    sup(g, "rect", { x:40, y:67.5, width:30, height:12.5 });
    linea(g, 40,67.5,70,67.5);
    g.centroOffset = 38.5; return g;
  }

  function crearIncisivoInf(x, y) {
    var g = grupo(x, y);
    sup(g, "polygon", { points: "26,90 48,135 69.1,90" });
    sup(g, "polygon", { points: "25,45 70,45 58,68 38.2,67.8" });
    sup(g, "polygon", { points: "25,45 38.2,67.8 38.5,67 25,90" });
    sup(g, "polygon", { points: "70,45 58,68 58,67 70,90" });
    sup(g, "polygon", { points: "25,90 38.5,67 58,67 70,90" });
    linea(g, 38,67.5,58,67.5);
    g.centroOffset = 33.25; return g;
  }

  function crearMolarInfPerm(x, y) {
    var g = grupo(x, y);
    sup(g, "polygon", { points: "30,90 42,135 55,90" });
    sup(g, "polygon", { points: "55,90 68,135 80,90" });
    sup(g, "polygon", { points: "25,45 40,55 40,80 25,90" });
    sup(g, "polygon", { points: "70,55 85,45 85,90 70,80" });
    sup(g, "polygon", { points: "25,45 40,55 70,55 85,45" });
    sup(g, "polygon", { points: "25,90 40,80 70,80 85,90" });
    sup(g, "rect", { x:40, y:55,   width:15, height:12.5 });
    sup(g, "rect", { x:55, y:55,   width:15, height:12.5 });
    sup(g, "rect", { x:40, y:67.5, width:15, height:12.5 });
    sup(g, "rect", { x:55, y:67.5, width:15, height:12.5 });
    linea(g, 55,55,55,80); linea(g, 40,67.5,70,67.5);
    g.centroOffset = 38.5; return g;
  }

  // Asignar funciones
  REGLAS_PERM.molarSup.fn = crearMolar;
  REGLAS_PERM.premSup.fn  = crearPremolar;
  REGLAS_PERM.bicSup.fn   = crearBicuspide;
  REGLAS_PERM.incSup.fn   = crearIncisivoSup;
  REGLAS_PERM.premInf.fn  = crearPremolarInf;
  REGLAS_PERM.mol46.fn    = crearMolarInferior46;
  REGLAS_PERM.mol36.fn    = crearMolarInferior36;
  REGLAS_PERM.molInf.fn   = crearMolarInfPerm;
  REGLAS_PERM.incInf.fn   = crearIncisivoInf;

  function obtenerAncho(n) {
    for (var k in REGLAS_PERM)
      if (REGLAS_PERM[k].nums.indexOf(n) !== -1) return REGLAS_PERM[k].ancho;
    return 54;
  }

  function calcularAlto() {
    return CONFIG_PERM.ESPACIADO.inicioY
         + CONFIG_PERM.DIENTE.alto
         + CONFIG_PERM.ESPACIADO.vertical
         + CONFIG_PERM.DIENTE.alto + 30;
  }

  // ===== PINTAR HALLAZGO =====
  // ← FUERA de iniciarPermanente, al mismo nivel
  function pintarHallazgo(dienteId, tipo, color) {
    var idStr = String(dienteId);

    // Colorear etiqueta número del diente
    var textos = svgPerm.querySelectorAll('text');
    for (var i = 0; i < textos.length; i++) {
      if (textos[i].textContent === idStr) {
        textos[i].setAttribute('fill', color);
        textos[i].setAttribute('font-weight', 'bold');
      }
    }

    // Localizar caja del diente
    var cajas = svgPerm.querySelectorAll('rect');
    var caja = null;
    for (var j = 0; j < cajas.length; j++) {
      if (cajas[j].getAttribute('data-diente-id') === idStr) {
        caja = cajas[j]; break;
      }
    }
    if (!caja) return;

    // Localizar grupo SVG del diente
    var grupo = svgPerm.querySelector('[data-grupo-diente="' + idStr + '"]');

    // Caries: solo superficies centrales (diamante/lazo). Restauraciones: todas las superficies de corona.
    var TIPOS_CARIES = ['CE', 'CD', 'CDP', 'CDT', 'CR', 'MB'];
    var TIPOS_REST   = ['AM', 'R', 'IV', 'IM', 'IE', 'C'];
    var esCaries = TIPOS_CARIES.indexOf(tipo) !== -1;
    var esRest   = TIPOS_REST.indexOf(tipo) !== -1;

    if ((esCaries || esRest) && grupo) {
      var tieneRects = grupo.querySelectorAll('rect').length > 0;
      var shapes = grupo.querySelectorAll('polygon, rect');
      for (var s = 0; s < shapes.length; s++) {
        var el = shapes[s];
        var tag = el.tagName.toLowerCase();

        if (tag === 'rect') {
          // Rects: solo para caries en dientes CON rects (molares/premolares)
          if (esCaries && tieneRects) el.setAttribute('fill', color);
          continue;
        }

        // Polígonos: calcular bounds
        var pts = el.getAttribute('points') || '';
        var coords = pts.match(/[\d.]+/g) || [];
        var maxY = 0, minY = 9999, minX = 9999, maxX = 0;
        for (var c = 0; c < coords.length; c++) {
          var val = parseFloat(coords[c]);
          if (c % 2 === 0) { minX = Math.min(minX, val); maxX = Math.max(maxX, val); }
          else              { minY = Math.min(minY, val); maxY = Math.max(maxY, val); }
        }
        if (maxY > 90) continue;   // raíz → saltar siempre
        if (minY < 35) continue;   // cúspide/triángulo superior → saltar siempre

        if (esCaries) {
          // Caries: solo polígonos anchos (diamante central) en dientes sin rects
          if (tieneRects)         continue;
          if ((maxX - minX) < 35) continue;
        }
        // esRest (AM, etc.): pintar todos los polígonos laterales (no cúspide, no raíz)
        el.setAttribute('fill', color);
      }
    }

    // DEX / diente ausente: dibujar X cruzada sobre el grupo del diente
    var TIPOS_AUSENTE = ['DEX', 'DNE', 'DAO'];
    if (TIPOS_AUSENTE.indexOf(tipo) !== -1 && grupo) {
      grupo.appendChild($s('line', { x1:'25', y1:'5',  x2:'85', y2:'90', stroke: color, 'stroke-width': '4', 'stroke-linecap': 'round' }));
      grupo.appendChild($s('line', { x1:'85', y1:'5',  x2:'25', y2:'90', stroke: color, 'stroke-width': '4', 'stroke-linecap': 'round' }));
    }

    // Texto del código en la caja
    var cx = parseFloat(caja.getAttribute('x')) + parseFloat(caja.getAttribute('width'))  / 2;
    var cy = parseFloat(caja.getAttribute('y')) + parseFloat(caja.getAttribute('height')) / 2 + 2;

    var txt = $s("text", {
      x: cx, y: cy,
      "text-anchor": "middle",
      "dominant-baseline": "middle",
      "font-size": "11px",
      "font-weight": "bold",
      "font-family": "Arial, sans-serif",
      fill: color,
      "pointer-events": "none",
      "data-hallazgo-texto": idStr
    });
    txt.textContent = tipo;
    svgPerm.appendChild(txt);
  }

  // ===== LIMPIAR DIENTE (resetear pintado) =====
  function limpiarDiente(dienteId) {
    var idStr = String(dienteId);

    // Resetear color etiqueta número
    var textos = svgPerm.querySelectorAll('text');
    for (var i = 0; i < textos.length; i++) {
      if (textos[i].textContent === idStr) {
        textos[i].setAttribute('fill', '#333');
        textos[i].removeAttribute('font-weight');
      }
    }

    // Eliminar texto overlay del código
    var overlays = svgPerm.querySelectorAll('[data-hallazgo-texto="' + idStr + '"]');
    for (var o = 0; o < overlays.length; o++) svgPerm.removeChild(overlays[o]);

    // Eliminar carita feliz si existe
    var caritas = svgPerm.querySelectorAll('[data-carita="' + idStr + '"]');
    for (var c = 0; c < caritas.length; c++) svgPerm.removeChild(caritas[c]);

    // Resetear fills y eliminar líneas X del grupo
    var grupo = svgPerm.querySelector('[data-grupo-diente="' + idStr + '"]');
    if (grupo) {
      var shapes = grupo.querySelectorAll('polygon, rect');
      for (var s = 0; s < shapes.length; s++) shapes[s].setAttribute('fill', 'white');
      var lines = grupo.querySelectorAll('line');
      for (var l = lines.length - 1; l >= 0; l--) grupo.removeChild(lines[l]);
    }
  }

  // ===== CARITA FELIZ (estado Atendido) =====
  function dibujarCaritaFeliz(dienteId) {
    var idStr = String(dienteId);
    var cajas = svgPerm.querySelectorAll('rect');
    var caja = null;
    for (var j = 0; j < cajas.length; j++) {
      if (cajas[j].getAttribute('data-diente-id') === idStr) { caja = cajas[j]; break; }
    }
    if (!caja) return;

    var cx    = parseFloat(caja.getAttribute('x')) + parseFloat(caja.getAttribute('width'))  / 2;
    var cajaY = parseFloat(caja.getAttribute('y'));
    var cajaH = parseFloat(caja.getAttribute('height'));
    var esInf = parseInt(idStr, 10) >= 30;   // dientes inferiores: 31-48
    // Superior: número en cajaH+12, carita en cajaH+30, diente en cajaH+50
    // Inferior: número en -12, carita en -28, diente en -150
    var cy    = esInf ? cajaY - 28 : cajaY + cajaH + 30;
    var r     = 11;

    var g = $s('g', { 'data-carita': idStr, 'pointer-events': 'none' });

    // Círculo verde
    g.appendChild($s('circle', { cx: cx, cy: cy, r: r,
      fill: '#e8f5e9', stroke: '#43a047', 'stroke-width': '1.8' }));

    // Ojos
    g.appendChild($s('circle', { cx: cx - 3.5, cy: cy - 3, r: 1.5, fill: '#333' }));
    g.appendChild($s('circle', { cx: cx + 3.5, cy: cy - 3, r: 1.5, fill: '#333' }));

    // Sonrisa
    var d = 'M ' + (cx - 4.5) + ' ' + (cy + 2) +
            ' Q ' + cx + ' ' + (cy + 6.5) + ' ' + (cx + 4.5) + ' ' + (cy + 2);
    g.appendChild($s('path', { d: d, stroke: '#333', 'stroke-width': '1.5',
      fill: 'none', 'stroke-linecap': 'round' }));

    svgPerm.appendChild(g);
  }

  // ===== REPINTAR DIENTE (llamado desde el bean via PrimeFaces) =====
  window.repintarDiente = function(piezaDental, codigo, estado) {
    var color = estado === 'Pendiente' ? '#cc0000' : '#0055aa';
    limpiarDiente(piezaDental);
    pintarHallazgo(parseInt(piezaDental, 10), codigo, color);
    if (estado === 'Atendido') dibujarCaritaFeliz(piezaDental);
  };

  // ===== INICIAR =====
  function iniciarPermanente() {
    svgPerm = document.getElementById("odontogramaPermanente");
    if (!svgPerm) { setTimeout(iniciarPermanente, 100); return; } // ← return correcto aquí

    while (svgPerm.firstChild) svgPerm.removeChild(svgPerm.firstChild);
    svgPerm.setAttribute("viewBox", "0 0 1200 " + calcularAlto());

    for (var k in REGLAS_PERM)
      for (var i = 0; i < REGLAS_PERM[k].nums.length; i++)
        mapaDientesPerm[REGLAS_PERM[k].nums[i]] = REGLAS_PERM[k].fn;

    var y = CONFIG_PERM.ESPACIADO.inicioY;

    for (var idx = 0; idx < FILAS_PERMANENTE.length; idx++) {
      var fila  = FILAS_PERMANENTE[idx];
      var esInf = FILAS_INFERIORES_PERM.indexOf(idx) !== -1;

      var anchoTotal = 0;
      for (var i = 0; i < fila.length; i++) anchoTotal += obtenerAncho(fila[i]);
      var x = (CONFIG_PERM.ESPACIADO.anchoSVG - anchoTotal) / 2;

      for (var i2 = 0; i2 < fila.length; i2++) {
        var num = fila[i2];
        var w   = obtenerAncho(num);

        var caja = $s("rect", {
          x: x, y: y, width: w, height: CONFIG_PERM.DIENTE.alto,
          fill: "white", stroke: "black",
          "stroke-width": GROSOR_CAJA,
          "data-diente-id": String(num)
        });
        svgPerm.appendChild(caja);

        var etiq = $s("text", {
          x: x + w / 2,
          y: esInf ? y - 12 : y + CONFIG_PERM.DIENTE.alto + 12,
          "text-anchor": "middle",
          "font-size": w === 45 ? "10px" : "11px",
          "font-weight": "bold",
          "font-family": "Arial, sans-serif",
          fill: "#333"
        });
        etiq.textContent = num;
        svgPerm.appendChild(etiq);

        var fn = mapaDientesPerm[num];
        if (fn) {
          var centro = x + w / 2;
          var tmp    = fn(0, 0);
          var offset = tmp.centroOffset || 38.5;
          var yPos   = esInf ? y - 150 : y + CONFIG_PERM.DIENTE.alto + 50;
          var gd     = fn(centro - offset, yPos);
          gd.setAttribute('data-grupo-diente', String(num));
          svgPerm.appendChild(gd);
        }
        x += w;
      }

      if (idx < FILAS_PERMANENTE.length - 1)
        y += CONFIG_PERM.DIENTE.alto + CONFIG_PERM.ESPACIADO.vertical;
    }

    // ← HALLAZGOS AL FINAL, después de dibujar todo
    setTimeout(function() {
      pintarHallazgo(16, 'IMP', '#0055aa');
      pintarHallazgo(24, 'AM',  '#0055aa');
      pintarHallazgo(14, 'DEX', '#0055aa');
      pintarHallazgo(11, 'CDP', '#cc0000');
    }, 200);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarPermanente);
  } else {
    iniciarPermanente();
  }

  window.iniciarOdontogramaPermanente = iniciarPermanente;
})();