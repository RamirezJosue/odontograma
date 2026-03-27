(function () {
  var svgAlta = null;
  var SVG_NS = "http://www.w3.org/2000/svg";

  var FILAS_ALTA = [
    [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28],
    [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38],
  ];

  var CONFIG_ALTA = {
    STROKE_WIDTH: 0.5,
    DIENTE: { alto: 58 },
    ESPACIADO: { inicioY: 10, anchoSVG: 1200, vertical: 240 },
  };

  var FILAS_INFERIORES_ALTA = [1];

  var REGLAS_ALTA = {
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

  var mapaDientesAlta = {};
  var GROSOR_CAJA   = CONFIG_ALTA.STROKE_WIDTH;
  var GROSOR_DIENTE = CONFIG_ALTA.STROKE_WIDTH / 0.7;

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

  REGLAS_ALTA.molarSup.fn = crearMolar;
  REGLAS_ALTA.premSup.fn  = crearPremolar;
  REGLAS_ALTA.bicSup.fn   = crearBicuspide;
  REGLAS_ALTA.incSup.fn   = crearIncisivoSup;
  REGLAS_ALTA.premInf.fn  = crearPremolarInf;
  REGLAS_ALTA.mol46.fn    = crearMolarInferior46;
  REGLAS_ALTA.mol36.fn    = crearMolarInferior36;
  REGLAS_ALTA.molInf.fn   = crearMolarInfPerm;
  REGLAS_ALTA.incInf.fn   = crearIncisivoInf;

  function obtenerAncho(n) {
    for (var k in REGLAS_ALTA)
      if (REGLAS_ALTA[k].nums.indexOf(n) !== -1) return REGLAS_ALTA[k].ancho;
    return 54;
  }

  function calcularAlto() {
    return CONFIG_ALTA.ESPACIADO.inicioY
         + CONFIG_ALTA.DIENTE.alto
         + CONFIG_ALTA.ESPACIADO.vertical
         + CONFIG_ALTA.DIENTE.alto + 30;
  }

  function pintarHallazgo(dienteId, tipo, color) {
    var idStr = String(dienteId);
    var textos = svgAlta.querySelectorAll('text');
    for (var i = 0; i < textos.length; i++) {
      if (textos[i].textContent === idStr) {
        textos[i].setAttribute('fill', color);
        textos[i].setAttribute('font-weight', 'bold');
      }
    }
    var cajas = svgAlta.querySelectorAll('rect');
    var caja = null;
    for (var j = 0; j < cajas.length; j++) {
      if (cajas[j].getAttribute('data-diente-id') === idStr) { caja = cajas[j]; break; }
    }
    if (!caja) return;

    var grp = svgAlta.querySelector('[data-grupo-diente="' + idStr + '"]');
    var TIPOS_CARIES = ['CE', 'CD', 'CDP', 'CDT', 'CR', 'MB'];
    var TIPOS_REST   = ['AM', 'R', 'IV', 'IM', 'IE', 'C'];
    var esCaries = TIPOS_CARIES.indexOf(tipo) !== -1;
    var esRest   = TIPOS_REST.indexOf(tipo) !== -1;

    if ((esCaries || esRest) && grp) {
      var tieneRects = grp.querySelectorAll('rect').length > 0;
      var shapes = grp.querySelectorAll('polygon, rect');
      for (var s = 0; s < shapes.length; s++) {
        var el = shapes[s];
        var tag = el.tagName.toLowerCase();
        if (tag === 'rect') {
          if (esCaries && tieneRects) el.setAttribute('fill', color);
          continue;
        }
        var pts = el.getAttribute('points') || '';
        var coords = pts.match(/[\d.]+/g) || [];
        var maxY = 0, minY = 9999, minX = 9999, maxX = 0;
        for (var c = 0; c < coords.length; c++) {
          var val = parseFloat(coords[c]);
          if (c % 2 === 0) { minX = Math.min(minX, val); maxX = Math.max(maxX, val); }
          else              { minY = Math.min(minY, val); maxY = Math.max(maxY, val); }
        }
        if (maxY > 90) continue;
        if (minY < 35) continue;
        if (esCaries) {
          if (tieneRects) continue;
          if ((maxX - minX) < 35) continue;
        }
        el.setAttribute('fill', color);
      }
    }

    var TIPOS_AUSENTE = ['DEX', 'DNE', 'DAO'];
    if (TIPOS_AUSENTE.indexOf(tipo) !== -1 && grp) {
      grp.appendChild($s('line', { x1:'25', y1:'5',  x2:'85', y2:'90', stroke: color, 'stroke-width': '4', 'stroke-linecap': 'round' }));
      grp.appendChild($s('line', { x1:'85', y1:'5',  x2:'25', y2:'90', stroke: color, 'stroke-width': '4', 'stroke-linecap': 'round' }));
    }

    var cx = parseFloat(caja.getAttribute('x')) + parseFloat(caja.getAttribute('width'))  / 2;
    var cy = parseFloat(caja.getAttribute('y')) + parseFloat(caja.getAttribute('height')) / 2 + 2;
    var txt = $s("text", {
      x: cx, y: cy,
      "text-anchor": "middle", "dominant-baseline": "middle",
      "font-size": "11px", "font-weight": "bold",
      "font-family": "Arial, sans-serif",
      fill: color, "pointer-events": "none",
      "data-hallazgo-texto": idStr
    });
    txt.textContent = tipo;
    svgAlta.appendChild(txt);
  }

  function dibujarCaritaFeliz(dienteId) {
    var idStr = String(dienteId);
    var cajas = svgAlta.querySelectorAll('rect');
    var caja = null;
    for (var j = 0; j < cajas.length; j++) {
      if (cajas[j].getAttribute('data-diente-id') === idStr) { caja = cajas[j]; break; }
    }
    if (!caja) return;
    var cx    = parseFloat(caja.getAttribute('x')) + parseFloat(caja.getAttribute('width'))  / 2;
    var cajaY = parseFloat(caja.getAttribute('y'));
    var cajaH = parseFloat(caja.getAttribute('height'));
    var esInf = parseInt(idStr, 10) >= 30;
    var cy    = esInf ? cajaY - 28 : cajaY + cajaH + 30;
    var r     = 11;
    var g = $s('g', { 'data-carita': idStr, 'pointer-events': 'none' });
    g.appendChild($s('circle', { cx: cx, cy: cy, r: r, fill: '#e8f5e9', stroke: '#43a047', 'stroke-width': '1.8' }));
    g.appendChild($s('circle', { cx: cx - 3.5, cy: cy - 3, r: 1.5, fill: '#333' }));
    g.appendChild($s('circle', { cx: cx + 3.5, cy: cy - 3, r: 1.5, fill: '#333' }));
    var d = 'M ' + (cx - 4.5) + ' ' + (cy + 2) + ' Q ' + cx + ' ' + (cy + 6.5) + ' ' + (cx + 4.5) + ' ' + (cy + 2);
    g.appendChild($s('path', { d: d, stroke: '#333', 'stroke-width': '1.5', fill: 'none', 'stroke-linecap': 'round' }));
    svgAlta.appendChild(g);
  }

  function pintarLinea(idInicio, idFin, color) {
    var cajaInicio = null, cajaFin = null;
    var cajas = svgAlta.querySelectorAll('rect');
    for (var j = 0; j < cajas.length; j++) {
      var did = cajas[j].getAttribute('data-diente-id');
      if (did === String(idInicio)) cajaInicio = cajas[j];
      if (did === String(idFin))    cajaFin    = cajas[j];
    }
    if (!cajaInicio || !cajaFin) return;
    var x1    = parseFloat(cajaInicio.getAttribute('x')) + parseFloat(cajaInicio.getAttribute('width'))  / 2;
    var x2    = parseFloat(cajaFin.getAttribute('x'))    + parseFloat(cajaFin.getAttribute('width'))    / 2;
    var cajaY = parseFloat(cajaInicio.getAttribute('y'));
    var cajaH = parseFloat(cajaInicio.getAttribute('height'));
    var esInf = idInicio >= 30;
    var lineY = esInf ? cajaY - 33 : cajaY + cajaH + 33;
    var tick  = 7;
    var lineaId = String(idInicio) + '-' + String(idFin);
    var g = $s('g', { 'data-linea': lineaId, 'pointer-events': 'none' });
    g.appendChild($s('line', { x1: x1, y1: lineY,          x2: x2, y2: lineY,          stroke: color, 'stroke-width': '2' }));
    g.appendChild($s('line', { x1: x1, y1: lineY - tick/2, x2: x1, y2: lineY + tick/2, stroke: color, 'stroke-width': '2' }));
    g.appendChild($s('line', { x1: x2, y1: lineY - tick/2, x2: x2, y2: lineY + tick/2, stroke: color, 'stroke-width': '2' }));
    svgAlta.appendChild(g);
  }

  function pintarLineaGuiones(idInicio, idFin, color) {
    var cajaInicio = null, cajaFin = null;
    var cajas = svgAlta.querySelectorAll('rect');
    for (var j = 0; j < cajas.length; j++) {
      var did = cajas[j].getAttribute('data-diente-id');
      if (did === String(idInicio)) cajaInicio = cajas[j];
      if (did === String(idFin))    cajaFin    = cajas[j];
    }
    if (!cajaInicio || !cajaFin) return;
    var xA = Math.min(parseFloat(cajaInicio.getAttribute('x')), parseFloat(cajaFin.getAttribute('x')));
    var xB = Math.max(
      parseFloat(cajaInicio.getAttribute('x')) + parseFloat(cajaInicio.getAttribute('width')),
      parseFloat(cajaFin.getAttribute('x'))    + parseFloat(cajaFin.getAttribute('width'))
    );
    var cajaY = parseFloat(cajaInicio.getAttribute('y'));
    var cajaH = parseFloat(cajaInicio.getAttribute('height'));
    var esInf = idInicio >= 30;
    var midY  = esInf ? cajaY - 33 : cajaY + cajaH + 33;
    var gap = 5, dash = '8,5', tick = 10;
    var lineaId = String(idInicio) + '-' + String(idFin);
    var g = $s('g', { 'data-linea': lineaId, 'pointer-events': 'none' });
    g.appendChild($s('line', { x1: xA, y1: midY - gap/2, x2: xB, y2: midY - gap/2, stroke: color, 'stroke-width': '1.8', 'stroke-dasharray': dash }));
    g.appendChild($s('line', { x1: xA, y1: midY + gap/2, x2: xB, y2: midY + gap/2, stroke: color, 'stroke-width': '1.8', 'stroke-dasharray': dash }));
    g.appendChild($s('line', { x1: xA, y1: midY - tick/2, x2: xA, y2: midY + tick/2, stroke: color, 'stroke-width': '2' }));
    g.appendChild($s('line', { x1: xB, y1: midY - tick/2, x2: xB, y2: midY + tick/2, stroke: color, 'stroke-width': '2' }));
    svgAlta.appendChild(g);
  }

  function iniciarOdontogramaAlta() {
    svgAlta = document.getElementById("odontogramaAlta");
    if (!svgAlta) { setTimeout(iniciarOdontogramaAlta, 100); return; }

    while (svgAlta.firstChild) svgAlta.removeChild(svgAlta.firstChild);
    svgAlta.setAttribute("viewBox", "0 0 1200 " + calcularAlto());

    for (var k in REGLAS_ALTA)
      for (var i = 0; i < REGLAS_ALTA[k].nums.length; i++)
        mapaDientesAlta[REGLAS_ALTA[k].nums[i]] = REGLAS_ALTA[k].fn;

    var y = CONFIG_ALTA.ESPACIADO.inicioY;

    for (var idx = 0; idx < FILAS_ALTA.length; idx++) {
      var fila  = FILAS_ALTA[idx];
      var esInf = FILAS_INFERIORES_ALTA.indexOf(idx) !== -1;

      var anchoTotal = 0;
      for (var i = 0; i < fila.length; i++) anchoTotal += obtenerAncho(fila[i]);
      var x = (CONFIG_ALTA.ESPACIADO.anchoSVG - anchoTotal) / 2;

      for (var i2 = 0; i2 < fila.length; i2++) {
        var num = fila[i2];
        var w   = obtenerAncho(num);

        var caja = $s("rect", {
          x: x, y: y, width: w, height: CONFIG_ALTA.DIENTE.alto,
          fill: "white", stroke: "black",
          "stroke-width": GROSOR_CAJA,
          "data-diente-id": String(num)
        });
        svgAlta.appendChild(caja);

        var etiq = $s("text", {
          x: x + w / 2,
          y: esInf ? y - 12 : y + CONFIG_ALTA.DIENTE.alto + 12,
          "text-anchor": "middle",
          "font-size": w === 45 ? "10px" : "11px",
          "font-weight": "bold",
          "font-family": "Arial, sans-serif",
          fill: "#333"
        });
        etiq.textContent = num;
        svgAlta.appendChild(etiq);

        var fn = mapaDientesAlta[num];
        if (fn) {
          var centro = x + w / 2;
          var tmp    = fn(0, 0);
          var offset = tmp.centroOffset || 38.5;
          var yPos   = esInf ? y - 150 : y + CONFIG_ALTA.DIENTE.alto + 50;
          var gd     = fn(centro - offset, yPos);
          gd.setAttribute('data-grupo-diente', String(num));
          svgAlta.appendChild(gd);
        }
        x += w;
      }

      if (idx < FILAS_ALTA.length - 1)
        y += CONFIG_ALTA.DIENTE.alto + CONFIG_ALTA.ESPACIADO.vertical;
    }

    // ===== HALLAZGOS ATENDIDOS (todos en azul) =====
    setTimeout(function() {
      pintarHallazgo(16, 'IMP', '#0055aa');
      pintarHallazgo(24, 'AM',  '#0055aa');
      pintarHallazgo(14, 'DEX', '#0055aa');
      pintarHallazgo(11, 'CDP', '#0055aa'); dibujarCaritaFeliz('11');
      pintarLinea(33, 36, '#0055aa');
      pintarLineaGuiones(42, 48, '#0055aa');
    }, 200);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarOdontogramaAlta);
  } else {
    iniciarOdontogramaAlta();
  }

  window.iniciarOdontogramaAlta = iniciarOdontogramaAlta;
})();
