// ============================================================
// ODONTOGRAMA JS - Versión Corregida
// Fixes: condición de carrera, bugs de tipo, var e=getElementById
// ============================================================

var svg = document.getElementById("odontograma");
var tipoDenticion = "mixta";
var dienteSeleccionado = null;
var cariesActual = { codigo: null, descripcion: null, color: "#cc0000", bicolor: false, sinTexto: false, superficies: [] };
var restauracionActual = { codigo: null, descripcion: null, color: "#0055aa", superficies: [] };

var CODIGOS_CARIES = {
	CE:  { color: "#cc0000", descripcion: "Caries en esmalte",  codigo: "CE" },
	CD:  { color: "#cc0000", descripcion: "Caries en dentina",  codigo: "CD" },
	CDP: { color: "#cc0000", descripcion: "Caries profunda",    codigo: "CDP" },
	MB:  { color: "#cc0000", descripcion: "Mancha blanca",      codigo: "MB" },
	CDT: { color: "#cc0000", descripcion: "Caries Dental",      codigo: "CDT", sinTexto: true },
	CR:  { color: "#cc0000", descripcion: "Caries Recurrente",  codigo: "CR",  sinTexto: true, bicolor: true }
};

var CONFIG = {
	STROKE_WIDTH: 0.5,
	DIENTE: { alto: 58 },
	ESPACIADO: {
		inicioY: 10,
		anchoSVG: 1200,
		vertical: { mixta: [170, 250, 170, 250], permanente: 270, decidua: 270, default: 270 }
	}
};

var FILAS_POR_DENTICION = {
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

var REGLAS_DIENTES = {
	molarSup:      { nums: [18,17,16,26,27,28],      fn: null, ancho: 54 },
	premSup:       { nums: [15,25],                  fn: null, ancho: 54 },
	bicSup:        { nums: [14,24],                  fn: null, ancho: 54 },
	premInf:       { nums: [45,44,35,34],            fn: null, ancho: 54 },
	mol46:         { nums: [46],                     fn: null, ancho: 54 },
	mol36:         { nums: [36],                     fn: null, ancho: 54 },
	molInf:        { nums: [48,47,37,38],            fn: null, ancho: 54 },
	molTempSup:    { nums: [55,65],                  fn: null, ancho: 54 },
	molTempSupsin: { nums: [54,64],                  fn: null, ancho: 54 },
	mol85_75:      { nums: [85,75],                  fn: null, ancho: 54 },
	mol84_74:      { nums: [84,74],                  fn: null, ancho: 54 },
	incSup:        { nums: [13,12,11,21,22,23],      fn: null, ancho: 45 },
	incInf:        { nums: [43,42,41,31,32,33],      fn: null, ancho: 45 },
	incTempSup:    { nums: [53,52,51,61,62,63],      fn: null, ancho: 45 },
	incTempInf:    { nums: [83,73,82,72,81,71],      fn: null, ancho: 45 }
};

var SVG_NS = "http://www.w3.org/2000/svg";
var mapaDientes = {};
var FILAS_INFERIORES = { mixta: [2,3], permanente: [1], decidua: [1] };

// ===== UTILIDADES =====
function obtenerAnchoDiente(n) {
	for (var k in REGLAS_DIENTES)
		if (REGLAS_DIENTES[k].nums.indexOf(n) !== -1) return REGLAS_DIENTES[k].ancho;
	return 54;
}

function $svg(tipo, attrs) {
	attrs = attrs || {};
	var el = document.createElementNS(SVG_NS, tipo);
	for (var k in attrs) { if (attrs.hasOwnProperty(k)) el.setAttribute(k, attrs[k]); }
	return el;
}

function grupo(x, y) {
	return $svg("g", { transform: "translate(" + x + ", " + y + ") scale(0.7)" });
}

var GROSOR_CAJA   = CONFIG.STROKE_WIDTH;
var GROSOR_DIENTE = CONFIG.STROKE_WIDTH / 0.7;

function linea(g, x1, y1, x2, y2) {
	g.appendChild($svg("line", { x1:x1, y1:y1, x2:x2, y2:y2, stroke:"black", "stroke-width": GROSOR_DIENTE }));
}

function cambiarColorNumeroDiente(dienteId, color) {
	// dienteId puede ser number o string — normalizar
	var idStr = String(dienteId);
	var textos = document.querySelectorAll('text');
	for (var i = 0; i < textos.length; i++) {
		if (textos[i].textContent === idStr) {
			textos[i].setAttribute('fill', color);
			textos[i].setAttribute('font-weight', 'bold');
		}
	}
}

function aplicarTextoAlCajon(el, texto, color) {
	color = color || "#333";
	var cajonId  = el.getAttribute("data-cajon-id");
	var dienteId = el.getAttribute("data-diente-id");
	var elX = el.getAttribute("x"), elY = el.getAttribute("y");
	var elW = el.getAttribute("width"), elH = el.getAttribute("height");

	console.log("[CAJON] INICIO texto=" + texto + " color=" + color
		+ " | cajonId=" + cajonId + " dienteId=" + dienteId
		+ " | x=" + elX + " y=" + elY + " w=" + elW + " h=" + elH);

	if (!elX || !elY || !elW || !elH) {
		console.error("[CAJON] ERROR: el rect no tiene atributos x/y/w/h. Nodo:", el.tagName, el.outerHTML ? el.outerHTML.substring(0,200) : "no outerHTML");
		return;
	}

	if (cajonId) {
		var viejos = svg.querySelectorAll('[data-cajon-text="' + cajonId + '"]');
		console.log("[CAJON] eliminando " + viejos.length + " textos viejos");
		viejos.forEach(function(v) { v.remove(); });
	}

	var cx = parseFloat(elX) + parseFloat(elW) / 2;
	var cy = parseFloat(elY) + parseFloat(elH) / 2 + 2;
	console.log("[CAJON] posición texto cx=" + cx + " cy=" + cy);

	var text = $svg("text", {
		x: cx, y: cy,
		"text-anchor": "middle",
		"dominant-baseline": "middle",
		"font-size": "13px",
		"font-weight": "bold",
		"font-family": "Arial, sans-serif",
		fill: color,
		"pointer-events": "none"
	});
	if (cajonId) text.setAttribute("data-cajon-text", cajonId);
	text.textContent = texto;

	var svgActual = document.getElementById("odontograma");
	console.log("[CAJON] svgActual en DOM:", !!svgActual, "viewBox:", svgActual ? svgActual.getAttribute("viewBox") : "N/A");
	console.log("[CAJON] variable global svg === svgActual:", svg === svgActual);

	// Usar siempre el SVG del DOM, no la variable global (puede estar desactualizada)
	var svgTarget = svgActual || svg;
	svgTarget.appendChild(text);
	console.log("[CAJON] ÉXITO: texto appendeado. Total hijos SVG:", svgTarget.childElementCount);
}

// ===== RESETEAR DIENTE =====
// FIX: normalizar dienteId a número para comparaciones consistentes
function limpiarTextosCajon(cajonId) {
	// Helper: elimina todos los textos SVG de un cajón dado su data-cajon-id
	if (!cajonId) return;
	var nodos = svg.querySelectorAll('[data-cajon-text="' + cajonId + '"]');
	for (var i = nodos.length - 1; i >= 0; i--) {
		nodos[i].parentNode.removeChild(nodos[i]);
	}
}

function resetearDiente(dienteId) {
	var id    = parseInt(dienteId, 10);
	var idStr = String(id);

	// 1. Limpiar colores de superficies
	var sups = svg.querySelectorAll('[data-superficie^="' + idStr + '_"]');
	for (var i = 0; i < sups.length; i++) {
		sups[i].setAttribute('fill', 'white');
		delete sups[i].dataset.usuarioColor;
		delete sups[i].dataset.cariesCodigo;
	}

	// 2. Limpiar texto del cajón principal
	var caja = svg.querySelector('[data-diente-id="' + idStr + '"][data-cajon-id]');
	if (!caja) caja = document.querySelector('[data-diente-id="' + idStr + '"]');
	if (caja) {
		limpiarTextosCajon(caja.getAttribute('data-cajon-id'));
		delete caja.dataset.estado;
		delete caja.dataset.estadoColor;
		delete caja.dataset.cariesInfo;
		caja.classList.remove('diente-ausente');
	}

	// 3. Limpiar marca de diente ausente/extracción
	var xAus = svg.querySelector('[data-ausente-x="' + idStr + '"]');
	if (xAus) xAus.parentNode.removeChild(xAus);

	// 4. Limpiar prótesis completa (toda la fila)
	if (caja) {
		var fy = parseFloat(caja.getAttribute('y'));
		var protCompl = svg.querySelectorAll('[data-protesis-completa]');
		for (var pi = protCompl.length - 1; pi >= 0; pi--) {
			var pc = protCompl[pi];
			if (Math.abs(parseFloat(pc.getAttribute('data-protesis-completa')) - fy) < 2) {
				// limpiar todos los cajones de esa fila
				var todosEnFila = svg.querySelectorAll('[data-diente-id]');
				for (var fi = 0; fi < todosEnFila.length; fi++) {
					var cf = todosEnFila[fi];
					if (!cf.getAttribute('data-cajon-id')) continue;
					if (Math.abs(parseFloat(cf.getAttribute('y')) - fy) < 2 &&
						parseInt(cf.getAttribute('data-diente-id'), 10) !== id) {
						limpiarTextosCajon(cf.getAttribute('data-cajon-id'));
						delete cf.dataset.estado;
						delete cf.dataset.estadoColor;
						cambiarColorNumeroDiente(parseInt(cf.getAttribute('data-diente-id'), 10), '#333');
					}
				}
				pc.parentNode.removeChild(pc);
			}
		}
	}

	// 5. Limpiar puente fijo y prótesis removible
	var puentesYRemovibles = svg.querySelectorAll('[data-puente-fijo], [data-protesis-removible]');
	for (var ri = puentesYRemovibles.length - 1; ri >= 0; ri--) {
		var el = puentesYRemovibles[ri];
		var attrName = el.hasAttribute('data-puente-fijo') ? 'data-puente-fijo' : 'data-protesis-removible';
		var rawVal = el.getAttribute(attrName);
		if (!rawVal) continue;
		var ids = rawVal.split(',').map(function(x) { return parseInt(x, 10); });
		if (ids.indexOf(id) !== -1) {
			// limpiar todos los cajones del rango excepto el actual
			for (var ii = 0; ii < ids.length; ii++) {
				if (ids[ii] === id) continue;
				var co = svg.querySelector('[data-diente-id="' + ids[ii] + '"][data-cajon-id]');
				if (!co) co = document.querySelector('[data-diente-id="' + ids[ii] + '"]');
				if (co) {
					limpiarTextosCajon(co.getAttribute('data-cajon-id'));
					delete co.dataset.estado;
					delete co.dataset.estadoColor;
					cambiarColorNumeroDiente(ids[ii], '#333');
				}
			}
			el.parentNode.removeChild(el);
		}
	}

	// 6. Resetear color del número del diente actual
	cambiarColorNumeroDiente(id, '#333');
}

// ===== EVENTOS SVG =====
// FIX PRINCIPAL: setear dienteSeleccionado en JS inmediatamente (no esperar el round-trip Ajax)
// luego disparar enviarDiente para sincronizar el bean en servidor
function aplicarEventosCajon(el) {
	if (el.dataset.clickableCajon) return;
	el.dataset.clickableCajon = "true";
	el.style.cursor = "pointer";
	el.addEventListener("click", function(e) {
		e.stopPropagation();
		var idDiente = el.getAttribute("data-diente-id");

		// ✅ FIX: asignar localmente de inmediato — no depender del callback Ajax
		dienteSeleccionado = idDiente;
		window.dienteSeleccionado = idDiente; // compartir entre scopes

		// Sincronizar con el bean (async, no bloqueante)
		if (typeof enviarDiente === 'function') {
			enviarDiente([{ name: 'dienteSeleccionado', value: idDiente }]);
		}

		// Abrir dialog y actualizar header de inmediato
		var hdr = document.getElementById('dienteInfoHeader');
		if (hdr) hdr.textContent = 'Diente: ' + idDiente;

		mostrarPanel('panelServiciosPF');

		if (typeof PF === 'function') PF('dlgServicio').show();
	});
}

function aplicarEventosSuperficie(el, dienteId, superficieTipo) {
	if (el.dataset.clickable) return;
	el.dataset.clickable = "true";
	el.style.cursor = "pointer";
	el.style.transition = "fill 0.2s ease";
	el.setAttribute('data-superficie', dienteId + '_' + superficieTipo);
	el.addEventListener("mouseenter", function() {
		if (!el.dataset.usuarioColor) {
			el.dataset.originalFill = el.getAttribute("fill") || "white";
			el.setAttribute("fill", "#f0f0f0");
		}
	});
	el.addEventListener("mouseleave", function() {
		if (!el.dataset.usuarioColor) el.setAttribute("fill", el.dataset.originalFill || "white");
	});
	el.addEventListener("click", function(e) {
		e.stopPropagation();
		var idDiente = String(dienteId);

		// ✅ FIX: mismo fix que en clic de cajón
		dienteSeleccionado = idDiente;
		window.dienteSeleccionado = idDiente; // compartir entre scopes

		if (typeof enviarDiente === 'function') {
			enviarDiente([{ name: 'dienteSeleccionado', value: idDiente }]);
		}

		var hdr = document.getElementById('dienteInfoHeader');
		if (hdr) hdr.textContent = 'Diente: ' + idDiente;

		mostrarPanel('panelServiciosPF');

		if (typeof PF === 'function') PF('dlgServicio').show();
	});
}

function superficie(g, tipo, attrs, dienteId, superficieTipo) {
	var a = {};
	for (var k in attrs) { if (attrs.hasOwnProperty(k)) a[k] = attrs[k]; }
	a.stroke = "black"; a.fill = "white"; a["stroke-width"] = GROSOR_DIENTE;
	var el = $svg(tipo, a);
	if (dienteId && superficieTipo) aplicarEventosSuperficie(el, dienteId, superficieTipo);
	g.appendChild(el); return el;
}

function s(g, tipo, attrs) {
	var el = $svg(tipo, attrs);
	el.setAttribute("stroke", "black"); el.setAttribute("fill", "white");
	el.setAttribute("stroke-width", GROSOR_DIENTE); el.setAttribute("pointer-events", "none");
	g.appendChild(el); return el;
}
var l = linea;

// ===== CREACIÓN DE DIENTES =====
function crearMolar(x, y, dienteId) {
	var g = grupo(x, y); if (dienteId) g.setAttribute("data-diente-id", dienteId);
	superficie(g, "polygon", { points: "30,45 42,5 55,45" },    dienteId, "O1");
	superficie(g, "polygon", { points: "55,45 68,5 80,45" },    dienteId, "O2");
	s(g, "polygon", { points: "48,25 55,5 62,25 55,45" });
	superficie(g, "polygon", { points: "25,45 40,55 40,80 25,90" },  dienteId, "M");
	superficie(g, "polygon", { points: "70,55 85,45 85,90 70,80" },  dienteId, "D");
	superficie(g, "polygon", { points: "40,55 70,55 85,45 25,45" },  dienteId, "O");
	superficie(g, "polygon", { points: "25,90 40,80 70,80 85,90" },  dienteId, "L");
	superficie(g, "rect", { x:40, y:55, width:15, height:12.5 }, dienteId, "V1");
	superficie(g, "rect", { x:55, y:55, width:15, height:12.5 }, dienteId, "V2");
	superficie(g, "rect", { x:40, y:67.5, width:15, height:12.5 }, dienteId, "V3");
	superficie(g, "rect", { x:55, y:67.5, width:15, height:12.5 }, dienteId, "V4");
	l(g, 55,55,55,80); l(g, 40,67.5,70,67.5);
	g.centroOffset = 38.5; return g;
}

function crearMolarCentroMixto(x, y, dienteId) {
	var g = grupo(x, y); if (dienteId) g.setAttribute("data-diente-id", dienteId);
	superficie(g, "polygon", { points: "30,45 42,5 55,45" },    dienteId, "O1");
	superficie(g, "polygon", { points: "55,45 68,5 80,45" },    dienteId, "O2");
	s(g, "polygon", { points: "48,25 55,5 62,25 55,45" });
	superficie(g, "polygon", { points: "25,45 40,55 40,80 25,90" },  dienteId, "M");
	superficie(g, "polygon", { points: "70,55 85,45 85,90 70,80" },  dienteId, "D");
	superficie(g, "polygon", { points: "40,55 70,55 85,45 25,45" },  dienteId, "O");
	superficie(g, "polygon", { points: "25,90 40,80 70,80 85,90" },  dienteId, "L");
	superficie(g, "rect", { x:40, y:55, width:15, height:12.5 },    dienteId, "V1");
	superficie(g, "rect", { x:55, y:55, width:15, height:12.5 },    dienteId, "V2");
	superficie(g, "rect", { x:40, y:67.5, width:30, height:12.5 },  dienteId, "V");
	l(g, 55,55,55,67.5); l(g, 40,67.5,70,67.5);
	g.centroOffset = 38.5; return g;
}

function crearPremolar(x, y, dienteId) {
	var g = grupo(x, y); if (dienteId) g.setAttribute("data-diente-id", dienteId);
	superficie(g, "polygon", { points: "40,45 55,5 70,45 55,45" },  dienteId, "O");
	superficie(g, "polygon", { points: "25,45 40,55 40,80 25,90" }, dienteId, "M");
	superficie(g, "polygon", { points: "70,55 85,45 85,90 70,80" }, dienteId, "D");
	superficie(g, "polygon", { points: "25,45 85,45 70,55 40,55" }, dienteId, "V");
	superficie(g, "polygon", { points: "25,90 40,80 70,80 85,90" }, dienteId, "L");
	superficie(g, "rect", { x:40, y:55, width:30, height:12.5 },   dienteId, "V1");
	superficie(g, "rect", { x:40, y:67.5, width:30, height:12.5 }, dienteId, "V2");
	l(g, 40,67.5,70,67.5);
	g.centroOffset = 38.5; return g;
}

function crearBicuspideSuperior(x, y, dienteId) {
	var g = grupo(x, y); if (dienteId) g.setAttribute("data-diente-id", dienteId);
	superficie(g, "polygon", { points: "33,45 44,5 55,45" },       dienteId, "O1");
	superficie(g, "polygon", { points: "55,45 66,5 77,45" },       dienteId, "O2");
	superficie(g, "polygon", { points: "25,45 40,55 40,80 25,90" }, dienteId, "M");
	superficie(g, "polygon", { points: "70,55 85,45 85,90 70,80" }, dienteId, "D");
	superficie(g, "polygon", { points: "25,45 40,55 70,55 85,45" }, dienteId, "V");
	superficie(g, "polygon", { points: "25,90 40,80 70,80 85,90" }, dienteId, "L");
	superficie(g, "rect", { x:40, y:55, width:30, height:12.5 },   dienteId, "V1");
	superficie(g, "rect", { x:40, y:67.5, width:30, height:12.5 }, dienteId, "V2");
	l(g, 40,67.5,70,67.5);
	g.centroOffset = 38.5; return g;
}

function crearIncisivoSuperior(x, y, dienteId) {
	var g = grupo(x, y); if (dienteId) g.setAttribute("data-diente-id", dienteId);
	superficie(g, "polygon", { points: "26,45 48,5 69.1,45" },          dienteId, "I");
	superficie(g, "polygon", { points: "25,45 38.2,67.8 38.5,67 25,90" }, dienteId, "M");
	superficie(g, "polygon", { points: "70,45 58,68 58,67 70,90" },     dienteId, "D");
	superficie(g, "polygon", { points: "25,45 70,45 58,68 38.2,67.8" }, dienteId, "L");
	superficie(g, "polygon", { points: "25,90 38.5,67 58,67 70,90" },   dienteId, "V");
	l(g, 38,67.5,58,67.5);
	g.centroOffset = 33.25; return g;
}

function crearMolarInferior46(x, y, dienteId) {
	var g = grupo(x, y); if (dienteId) g.setAttribute("data-diente-id", dienteId);
	superficie(g, "polygon", { points: "30,90 42,135 55,90" },  dienteId, "L1");
	superficie(g, "polygon", { points: "55,90 68,135 80,90" },  dienteId, "L2");
	superficie(g, "polygon", { points: "25,45 40,55 40,80 25,90" },  dienteId, "M");
	superficie(g, "polygon", { points: "70,55 85,45 85,90 70,80" },  dienteId, "D");
	superficie(g, "polygon", { points: "25,45 85,45 70,55 40,55" },  dienteId, "O");
	superficie(g, "polygon", { points: "25,90 40,80 70,80 85,90" },  dienteId, "L");
	superficie(g, "rect", { x:40, y:55, width:8,  height:25   }, dienteId, "V1");
	superficie(g, "rect", { x:48, y:55, width:11, height:12.5 }, dienteId, "V2");
	superficie(g, "rect", { x:48, y:67.5, width:11, height:12.5 }, dienteId, "V3");
	superficie(g, "rect", { x:59, y:55, width:11, height:12.5 }, dienteId, "V4");
	superficie(g, "rect", { x:59, y:67.5, width:11, height:12.5 }, dienteId, "V5");
	l(g, 48,55,48,80); l(g, 59,55,59,80); l(g, 48,67.5,70,67.5);
	g.centroOffset = 38.5; return g;
}

function crearMolarInferior36(x, y, dienteId) {
	var g = grupo(x, y); if (dienteId) g.setAttribute("data-diente-id", dienteId);
	superficie(g, "polygon", { points: "30,90 42,135 55,90" },  dienteId, "L1");
	superficie(g, "polygon", { points: "55,90 68,135 80,90" },  dienteId, "L2");
	superficie(g, "polygon", { points: "25,45 40,55 40,80 25,90" },  dienteId, "M");
	superficie(g, "polygon", { points: "70,55 85,45 85,90 70,80" },  dienteId, "D");
	superficie(g, "polygon", { points: "25,45 85,45 70,55 40,55" },  dienteId, "O");
	superficie(g, "polygon", { points: "25,90 40,80 70,80 85,90" },  dienteId, "L");
	superficie(g, "rect", { x:40, y:55, width:11, height:12.5 }, dienteId, "V1");
	superficie(g, "rect", { x:40, y:67.5, width:11, height:12.5 }, dienteId, "V2");
	superficie(g, "rect", { x:51, y:55, width:11, height:12.5 }, dienteId, "V3");
	superficie(g, "rect", { x:51, y:67.5, width:11, height:12.5 }, dienteId, "V4");
	superficie(g, "rect", { x:62, y:55, width:8,  height:25   }, dienteId, "V5");
	l(g, 51,55,51,80); l(g, 62,55,62,80); l(g, 40,67.5,62,67.5);
	g.centroOffset = 38.5; return g;
}

function crearPremolarInferior(x, y, dienteId) {
	var g = grupo(x, y); if (dienteId) g.setAttribute("data-diente-id", dienteId);
	superficie(g, "polygon", { points: "40,90 55,135 70,90 55,90" }, dienteId, "L");
	superficie(g, "polygon", { points: "25,45 40,55 40,80 25,90" },  dienteId, "M");
	superficie(g, "polygon", { points: "70,55 85,45 85,90 70,80" },  dienteId, "D");
	superficie(g, "polygon", { points: "25,45 85,45 70,55 40,55" },  dienteId, "O");
	superficie(g, "polygon", { points: "25,90 40,80 70,80 85,90" },  dienteId, "V");
	superficie(g, "rect", { x:40, y:55, width:30, height:12.5 },    dienteId, "V1");
	superficie(g, "rect", { x:40, y:67.5, width:30, height:12.5 },  dienteId, "V2");
	l(g, 40,67.5,70,67.5);
	g.centroOffset = 38.5; return g;
}

function crearIncisivoInferior(x, y, dienteId) {
	var g = grupo(x, y); if (dienteId) g.setAttribute("data-diente-id", dienteId);
	superficie(g, "polygon", { points: "26,90 48,135 69.1,90" },        dienteId, "I");
	superficie(g, "polygon", { points: "25,45 70,45 58,68 38.2,67.8" }, dienteId, "L");
	superficie(g, "polygon", { points: "25,45 38.2,67.8 38.5,67 25,90" }, dienteId, "M");
	superficie(g, "polygon", { points: "70,45 58,68 58,67 70,90" },     dienteId, "D");
	superficie(g, "polygon", { points: "25,90 38.5,67 58,67 70,90" },   dienteId, "V");
	l(g, 38,67.5,58,67.5);
	g.centroOffset = 33.25; return g;
}

function crearMolar85_75(x, y, dienteId) {
	var g = grupo(x, y); if (dienteId) g.setAttribute("data-diente-id", dienteId);
	superficie(g, "polygon", { points: "30,90 42,135 55,90" },  dienteId, "L1");
	superficie(g, "polygon", { points: "55,90 68,135 80,90" },  dienteId, "L2");
	superficie(g, "polygon", { points: "25,45 40,55 40,80 25,90" }, dienteId, "M");
	superficie(g, "polygon", { points: "70,55 85,45 85,90 70,80" }, dienteId, "D");
	superficie(g, "polygon", { points: "25,45 40,55 70,55 85,45" }, dienteId, "O");
	superficie(g, "polygon", { points: "25,90 40,80 70,80 85,90" }, dienteId, "L");
	superficie(g, "rect", { x:40, y:55,   width:15, height:12.5 }, dienteId, "V1");
	superficie(g, "rect", { x:55, y:55,   width:15, height:12.5 }, dienteId, "V2");
	superficie(g, "rect", { x:40, y:67.5, width:8,  height:12.5 }, dienteId, "V3");
	superficie(g, "rect", { x:48, y:67.5, width:14, height:12.5 }, dienteId, "V4");
	superficie(g, "rect", { x:62, y:67.5, width:8,  height:12.5 }, dienteId, "V5");
	l(g, 55,55,55,68); l(g, 40,67.5,70,67.5); l(g, 48,67.5,48,80); l(g, 62,67.5,62,80);
	g.centroOffset = 38.5; return g;
}

function crearMolarInferiorPermanente(x, y, dienteId) {
	var g = grupo(x, y); if (dienteId) g.setAttribute("data-diente-id", dienteId);
	superficie(g, "polygon", { points: "30,90 42,135 55,90" },  dienteId, "L1");
	superficie(g, "polygon", { points: "55,90 68,135 80,90" },  dienteId, "L2");
	superficie(g, "polygon", { points: "25,45 40,55 40,80 25,90" }, dienteId, "M");
	superficie(g, "polygon", { points: "70,55 85,45 85,90 70,80" }, dienteId, "D");
	superficie(g, "polygon", { points: "25,45 40,55 70,55 85,45" }, dienteId, "O");
	superficie(g, "polygon", { points: "25,90 40,80 70,80 85,90" }, dienteId, "L");
	superficie(g, "rect", { x:40, y:55,   width:15, height:12.5 }, dienteId, "V1");
	superficie(g, "rect", { x:55, y:55,   width:15, height:12.5 }, dienteId, "V2");
	superficie(g, "rect", { x:40, y:67.5, width:15, height:12.5 }, dienteId, "V3");
	superficie(g, "rect", { x:55, y:67.5, width:15, height:12.5 }, dienteId, "V4");
	l(g, 55,55,55,80); l(g, 40,67.5,70,67.5);
	g.centroOffset = 38.5; return g;
}

REGLAS_DIENTES.molarSup.fn      = crearMolar;
REGLAS_DIENTES.premSup.fn       = crearPremolar;
REGLAS_DIENTES.bicSup.fn        = crearBicuspideSuperior;
REGLAS_DIENTES.premInf.fn       = crearPremolarInferior;
REGLAS_DIENTES.mol46.fn         = crearMolarInferior46;
REGLAS_DIENTES.mol36.fn         = crearMolarInferior36;
REGLAS_DIENTES.molInf.fn        = crearMolarInferiorPermanente;
REGLAS_DIENTES.molTempSup.fn    = crearMolar;
REGLAS_DIENTES.molTempSupsin.fn = crearMolarCentroMixto;
REGLAS_DIENTES.mol85_75.fn      = crearMolar85_75;
REGLAS_DIENTES.mol84_74.fn      = crearMolarInferiorPermanente;
REGLAS_DIENTES.incSup.fn        = crearIncisivoSuperior;
REGLAS_DIENTES.incInf.fn        = crearIncisivoInferior;
REGLAS_DIENTES.incTempSup.fn    = crearIncisivoSuperior;
REGLAS_DIENTES.incTempInf.fn    = crearIncisivoInferior;

// ===== ESPACIADO =====
function obtenerEspaciadoVertical(i) {
	var v = CONFIG.ESPACIADO.vertical;
	if (tipoDenticion === "mixta" && Array.isArray(v.mixta)) return v.mixta[i] !== undefined ? v.mixta[i] : v.default;
	return v[tipoDenticion] !== undefined ? v[tipoDenticion] : v.default;
}

function calcularAltoTotal(filas) {
	var a = CONFIG.ESPACIADO.inicioY;
	for (var i = 0; i < filas.length; i++) {
		a += CONFIG.DIENTE.alto;
		if (i < filas.length - 1) a += obtenerEspaciadoVertical(i);
	}
	var inf = FILAS_INFERIORES[tipoDenticion];
	a += (inf && inf.indexOf(filas.length - 1) !== -1) ? 30 : 40;
	return a;
}

// ===== ACTUALIZAR ODONTOGRAMA =====
function actualizarOdontograma() {
	svg = document.getElementById("odontograma");
	if (!svg) { console.error("SVG no encontrado"); return; }
	while (svg.firstChild) svg.removeChild(svg.firstChild);

	var filas = FILAS_POR_DENTICION[tipoDenticion];
	svg.setAttribute("viewBox", "0 0 1200 " + calcularAltoTotal(filas));

	for (var k in mapaDientes) delete mapaDientes[k];
	for (var k2 in REGLAS_DIENTES) {
		var reg = REGLAS_DIENTES[k2];
		for (var i = 0; i < reg.nums.length; i++) mapaDientes[reg.nums[i]] = reg.fn;
	}

	function esInf(idx) { var inf = FILAS_INFERIORES[tipoDenticion]; return inf ? inf.indexOf(idx) !== -1 : false; }

	var y = CONFIG.ESPACIADO.inicioY;
	for (var idx = 0; idx < filas.length; idx++) {
		var fila = filas[idx], anchoTotal = 0;
		for (var i = 0; i < fila.length; i++) anchoTotal += obtenerAnchoDiente(fila[i]);
		var x = (CONFIG.ESPACIADO.anchoSVG - anchoTotal) / 2;
		var inf = esInf(idx);

		for (var i2 = 0; i2 < fila.length; i2++) {
			var num = fila[i2], w = obtenerAnchoDiente(num), id = num + "_" + idx + "_" + i2;
			var caja = $svg("rect", {
				x: x, y: y, width: w, height: CONFIG.DIENTE.alto,
				fill: "white", stroke: "black", "stroke-width": GROSOR_CAJA,
				"data-cajon-id": id, "data-diente-id": num
			});
			aplicarEventosCajon(caja);
			svg.appendChild(caja);

			var etiq = $svg("text", {
				x: x + w / 2,
				y: inf ? y - 8 : y + CONFIG.DIENTE.alto + 18,
				"text-anchor": "middle",
				"font-size": w === 45 ? "10px" : "11px",
				"font-weight": "bold", "font-family": "Arial, sans-serif", fill: "#333"
			});
			etiq.textContent = num;
			svg.appendChild(etiq);

			var fn = mapaDientes[num];
			if (fn) {
				var centro = x + w / 2;
				var tmp = fn(0, 0, num);
				var offset = tmp.centroOffset || 38.5;
				var yPos = inf ? y - 125 : y + CONFIG.DIENTE.alto + 30;
				var gd = fn(centro - offset, yPos, num);
				gd.setAttribute('data-diente-id', num);
				svg.appendChild(gd);
			}
			x += w;
		}
		if (idx < filas.length - 1) y += obtenerEspaciadoVertical(idx);
	}
}

// ===== VISORES =====
// FIX: reemplazado "var e = document.getElementById" por getElementById directo
function abrirVisorCaries(codigoCaries) {
	var _diente = getDienteActivo();
	if (!_diente) {
		console.warn("abrirVisorCaries: no hay diente seleccionado");
		return;
	}
	dienteSeleccionado = _diente;
	window.dienteSeleccionado = _diente;
	cariesActual = {
		codigo:      codigoCaries,
		descripcion: CODIGOS_CARIES[codigoCaries].descripcion,
		color:       CODIGOS_CARIES[codigoCaries].color,
		bicolor:     CODIGOS_CARIES[codigoCaries].bicolor  || false,
		sinTexto:    CODIGOS_CARIES[codigoCaries].sinTexto || false,
		superficies: []
	};

	var n    = document.getElementById('cariesDienteNumero');
	var c    = document.getElementById('cariasCodigo');
	var d    = document.getElementById('cariasDescripcion');
	var lista = document.getElementById('superficiesAfectadasLista');
	var ini  = document.getElementById('inicialesTexto');

	if (n)    n.textContent = dienteSeleccionado;
	if (c)    c.textContent = codigoCaries;
	if (d)    d.textContent = CODIGOS_CARIES[codigoCaries].descripcion;
	if (lista) lista.innerHTML = '<span class="superficie-tag">Ninguna</span>';
	if (ini)  ini.textContent = '';

	mostrarPanel('cariesVisorContainer');
	setTimeout(function() { dibujarDienteAmpliado(dienteSeleccionado, 'caries'); }, 150);
}

function abrirVisorRestauracion(codigo, estado) {
	var _diente = getDienteActivo();
	if (!_diente) {
		console.warn("abrirVisorRestauracion: no hay diente seleccionado");
		return;
	}
	dienteSeleccionado = _diente;
	window.dienteSeleccionado = _diente;
	var color = estado === 'bueno' ? '#0055aa' : '#cc0000';
	restauracionActual = { codigo: codigo, descripcion: codigo, color: color, superficies: [] };

	var n    = document.getElementById('restauracionDienteNumero');
	var c    = document.getElementById('restauracionCodigo');
	var d    = document.getElementById('restauracionDescripcion');
	var lista = document.getElementById('superficiesRestauracionLista');
	var ini  = document.getElementById('inicialesRestauracionTexto');

	if (n)    n.textContent = dienteSeleccionado;
	if (c)  { c.textContent = codigo; c.style.color = color; }
	if (d)    d.textContent = codigo;
	if (lista) lista.innerHTML = '<span class="superficie-tag">Ninguna</span>';
	if (ini)  ini.textContent = '';

	mostrarPanel('restauracionVisorContainer');
	setTimeout(function() { dibujarDienteAmpliado(dienteSeleccionado, 'restauracion'); }, 150);
}

function mostrarPanel(id) {
	['panelServiciosPF', 'cariesVisorContainer', 'restauracionVisorContainer'].forEach(function(pid) {
		var el = document.getElementById(pid);
		if (el) el.style.display = pid === id ? 'block' : 'none';
	});
}

function volverAlPanelServicios() {
	mostrarPanel('panelServiciosPF');
	cariesActual      = { codigo: null, descripcion: null, color: '#cc0000', bicolor: false, sinTexto: false, superficies: [] };
	restauracionActual = { codigo: null, descripcion: null, color: '#0055aa', superficies: [] };
}

// ===== DIBUJAR DIENTE AMPLIADO EN VISOR =====
function dibujarDienteAmpliado(dienteId, modo) {
	modo = modo || 'caries';
	var cid  = modo === 'restauracion' ? 'restauracionDienteSVG' : 'cariesDienteSVG';
	var cont = document.getElementById(cid); if (!cont) return;
	cont.innerHTML = '';

	var svgT = document.createElementNS(SVG_NS, 'svg');
	svgT.setAttribute('width', '100%');
	svgT.setAttribute('height', '280');
	svgT.setAttribute('preserveAspectRatio', 'xMidYMid meet');
	svgT.style.cssText = 'background:white;border-radius:8px;border:1px solid #ddd;';

	var fn = mapaDientes[parseInt(dienteId, 10)];
	if (!fn) { cont.appendChild(svgT); return; }

	var gOrig = fn(0, 0, parseInt(dienteId, 10));
	var gD    = gOrig.cloneNode(true);
	gD.setAttribute('transform', 'translate(0,0)');
	svgT.appendChild(gD);
	cont.appendChild(svgT);

	var bbox;
	try { bbox = gD.getBBox(); } catch(e) { bbox = { x:0, y:0, width:100, height:100 }; }
	cont.removeChild(svgT);

	var pad = 20;
	svgT.setAttribute('viewBox',
		(bbox.x - pad) + ' ' + (bbox.y - pad) + ' ' +
		(bbox.width + pad*2) + ' ' + (bbox.height + pad*2)
	);
	svgT.appendChild(gD);
	cont.appendChild(svgT);

	var actual     = modo === 'restauracion' ? restauracionActual : cariesActual;
	var colorHover = modo === 'restauracion' ? '#e0f0ff' : '#ffe0e0';
	var RAIZ       = ['O1','O2','L1','L2','I'];
	var etiquetas  = [];
	var fillColor  = actual.color;

	if (actual.bicolor) {
		var defs = document.createElementNS(SVG_NS, 'defs');
		var grad = document.createElementNS(SVG_NS, 'linearGradient');
		grad.setAttribute('id', 'gradBicolor');
		grad.setAttribute('x1', '0%'); grad.setAttribute('y1', '0%');
		grad.setAttribute('x2', '100%'); grad.setAttribute('y2', '0%');
		var st1 = document.createElementNS(SVG_NS, 'stop');
		st1.setAttribute('offset', '50%'); st1.setAttribute('stop-color', '#cc0000');
		var st2 = document.createElementNS(SVG_NS, 'stop');
		st2.setAttribute('offset', '50%'); st2.setAttribute('stop-color', '#0055aa');
		grad.appendChild(st1); grad.appendChild(st2); defs.appendChild(grad);
		svgT.insertBefore(defs, svgT.firstChild);
		fillColor = 'url(#gradBicolor)';
	}

	var elems = svgT.querySelectorAll('polygon, rect');
	for (var i = 0; i < elems.length; i++) {
		(function(sup) {
			var sa = sup.getAttribute('data-superficie'); if (!sa) { sup.style.pointerEvents = 'none'; return; }
			var tipo = sa.split('_')[1] || '?';
			sup.setAttribute('data-tipo', tipo);
			sup.setAttribute('stroke', '#333');
			try {
				var sb = sup.getBBox();
				if (sb.width > 3 && sb.height > 3) etiquetas.push({ tipo: tipo, cx: sb.x + sb.width/2, cy: sb.y + sb.height/2 });
			} catch(e) {}

			if (RAIZ.indexOf(tipo) !== -1) {
				sup.style.pointerEvents = 'none';
				sup.style.cursor = 'default';
				sup.setAttribute('fill', '#f5f5f5');
				return;
			}

			sup.style.cursor     = 'pointer';
			sup.style.transition = 'fill 0.15s ease';

			sup.addEventListener('mouseenter', function() {
				if (!this.classList.contains('afectada')) this.setAttribute('fill', colorHover);
			});
			sup.addEventListener('mouseleave', function() {
				if (!this.classList.contains('afectada')) this.setAttribute('fill', 'white');
			});
			sup.addEventListener('click', function(e) {
				e.preventDefault(); e.stopPropagation();
				var t = this.getAttribute('data-tipo');
				this.setAttribute('fill', fillColor);
				this.classList.add('afectada');
				if (actual.superficies.indexOf(t) === -1) actual.superficies.push(t);
				modo === 'restauracion' ? actualizarListaRestauracion() : actualizarListaSuperficies();
			});
			sup.addEventListener('contextmenu', function(e) {
				e.preventDefault(); e.stopPropagation();
				var t = this.getAttribute('data-tipo');
				this.setAttribute('fill', 'white');
				this.classList.remove('afectada');
				var ix = actual.superficies.indexOf(t);
				if (ix > -1) actual.superficies.splice(ix, 1);
				modo === 'restauracion' ? actualizarListaRestauracion() : actualizarListaSuperficies();
			});
		})(elems[i]);
	}

	etiquetas.forEach(function(et) {
		var lbl = document.createElementNS(SVG_NS, 'text');
		lbl.setAttribute('x', et.cx); lbl.setAttribute('y', et.cy + 1);
		lbl.setAttribute('text-anchor', 'middle'); lbl.setAttribute('dominant-baseline', 'middle');
		lbl.setAttribute('font-size', '6'); lbl.setAttribute('font-weight', 'bold');
		lbl.setAttribute('fill', '#bbb'); lbl.setAttribute('pointer-events', 'none');
		lbl.setAttribute('font-family', 'Arial, sans-serif');
		lbl.textContent = et.tipo;
		gD.appendChild(lbl);
	});
}

function actualizarListaSuperficies() {
	var lista = document.getElementById('superficiesAfectadasLista');
	var ini   = document.getElementById('inicialesTexto');
	if (!lista || !ini) return;
	lista.innerHTML = '';
	if (cariesActual.superficies.length === 0) {
		lista.innerHTML = '<span class="superficie-tag">Ninguna</span>';
		ini.textContent = '';
		return;
	}
	cariesActual.superficies.sort().forEach(function(sup) {
		var t = document.createElement('span');
		t.className   = 'superficie-tag afectada';
		t.textContent = sup;
		lista.appendChild(t);
	});
	ini.textContent = cariesActual.codigo + '(' + cariesActual.superficies.sort().join('') + ')';
}

function actualizarListaRestauracion() {
	var lista  = document.getElementById('superficiesRestauracionLista');
	var texto  = document.getElementById('inicialesRestauracionTexto');
	if (!lista || !texto) return;
	lista.innerHTML = '';
	if (restauracionActual.superficies.length === 0) {
		lista.innerHTML = '<span class="superficie-tag">Ninguna</span>';
		texto.textContent = '';
		return;
	}
	restauracionActual.superficies.sort().forEach(function(sup) {
		var t = document.createElement('span');
		t.className = 'superficie-tag afectada';
		t.style.backgroundColor = restauracionActual.color;
		t.style.borderColor     = restauracionActual.color;
		t.style.color           = 'white';
		t.textContent = sup;
		lista.appendChild(t);
	});
	texto.textContent = restauracionActual.codigo + '(' + restauracionActual.superficies.sort().join('') + ')';
	texto.style.color = restauracionActual.color;
}

// ===== GUARDAR CARIES → Bean =====
function guardarCaries() {
	var _diente = getDienteActivo();
	if (!_diente || !cariesActual.codigo) { volverAlPanelServicios(); return; }
	dienteSeleccionado = _diente;
	resetearDiente(parseInt(_diente, 10));
	var caja = document.querySelector('[data-diente-id="' + _diente + '"]');
	var cfg  = CODIGOS_CARIES[cariesActual.codigo] || {};

	if (caja && cariesActual.superficies.length > 0) {
		if (cfg.bicolor) {
			var de = svg.querySelector('defs');
			if (!de) { de = document.createElementNS(SVG_NS, 'defs'); svg.insertBefore(de, svg.firstChild); }
			if (!de.querySelector('#gradBicolorOdonto')) {
				var gr = document.createElementNS(SVG_NS, 'linearGradient');
				gr.setAttribute('id', 'gradBicolorOdonto');
				gr.setAttribute('x1','0%'); gr.setAttribute('y1','0%');
				gr.setAttribute('x2','100%'); gr.setAttribute('y2','0%');
				var s1 = document.createElementNS(SVG_NS, 'stop');
				s1.setAttribute('offset','50%'); s1.setAttribute('stop-color','#cc0000');
				var s2 = document.createElementNS(SVG_NS, 'stop');
				s2.setAttribute('offset','50%'); s2.setAttribute('stop-color','#0055aa');
				gr.appendChild(s1); gr.appendChild(s2); de.appendChild(gr);
			}
		}
		var so = document.querySelectorAll('[data-superficie^="' + dienteSeleccionado + '_"]');
		for (var i = 0; i < so.length; i++) {
			var tp = so[i].getAttribute('data-superficie').split('_')[1];
			if (cariesActual.superficies.indexOf(tp) !== -1) {
				var cf = cfg.bicolor ? 'url(#gradBicolorOdonto)' : cariesActual.color;
				so[i].setAttribute('fill', cf);
				so[i].dataset.usuarioColor  = cf;
				so[i].dataset.cariesCodigo  = cariesActual.codigo;
			}
		}
		if (!cfg.sinTexto) aplicarTextoAlCajon(caja, cariesActual.codigo, cariesActual.color);
		caja.dataset.estado     = 'caries';
		caja.dataset.cariesInfo = JSON.stringify({ codigo: cariesActual.codigo, superficies: cariesActual.superficies });
	}

	if (typeof guardarServicioBean === 'function') {
		guardarServicioBean([
		    { name: 'hallazgoTipo',   value: 'caries' },
		    { name: 'hallazgoCodigo', value: cariesActual.codigo },
		    { name: 'numDientes',     value: cariesActual.superficies.sort().join(',') },
		    { name: 'dienteId',       value: dienteSeleccionado }
		]);
	}
	volverAlPanelServicios();
	if (typeof PF === 'function') PF('dlgServicio').hide();
}

// ===== GUARDAR RESTAURACIÓN → Bean =====
function guardarRestauracion() {
	var _diente = getDienteActivo();
	if (!_diente || !restauracionActual.codigo) { volverAlPanelServicios(); return; }
	dienteSeleccionado = _diente;
	resetearDiente(parseInt(_diente, 10));
	var caja = document.querySelector('[data-diente-id="' + _diente + '"]');

	if (caja && restauracionActual.superficies.length > 0) {
		var so = document.querySelectorAll('[data-superficie^="' + dienteSeleccionado + '_"]');
		for (var i = 0; i < so.length; i++) {
			var tp = so[i].getAttribute('data-superficie').split('_')[1];
			if (restauracionActual.superficies.indexOf(tp) !== -1) {
				so[i].setAttribute('fill', restauracionActual.color);
				so[i].dataset.usuarioColor = restauracionActual.color;
			}
		}
		aplicarTextoAlCajon(caja, restauracionActual.codigo, restauracionActual.color);
		caja.dataset.estado = 'restauracion';
	}

	if (typeof guardarServicioBean === 'function') {
		guardarServicioBean([
		    { name: 'hallazgoTipo',   value: 'restauracion' },
		    { name: 'hallazgoCodigo', value: restauracionActual.codigo },
		    { name: 'colorServicio',  value: restauracionActual.color },
		    { name: 'numDientes',     value: restauracionActual.superficies.sort().join(',') },
		    { name: 'dienteId',       value: dienteSeleccionado }
		]);
	}
	volverAlPanelServicios();
	if (typeof PF === 'function') PF('dlgServicio').hide();
}


// ===== OBTENER DIENTE ACTIVO (robusto, múltiples fuentes) =====
function getDienteActivo() {
	// Fuente 1: variable global JS
	if (dienteSeleccionado && String(dienteSeleccionado).trim() !== '') {
		console.log("[DIENTE] desde variable global:", dienteSeleccionado);
		return String(dienteSeleccionado).trim();
	}
	// Fuente 2: header del dialog visible
	var hdr = document.getElementById('dienteInfoHeader');
	if (hdr) {
		var txt = hdr.textContent || '';
		var m = txt.match(/\d+/);
		if (m) {
			console.log("[DIENTE] desde header dialog:", m[0]);
			dienteSeleccionado = m[0]; // sincronizar
			return m[0];
		}
	}
	// Fuente 3: window.dienteSeleccionado (por si otro scope lo seteó)
	if (window.dienteSeleccionado && String(window.dienteSeleccionado).trim() !== '') {
		console.log("[DIENTE] desde window.dienteSeleccionado:", window.dienteSeleccionado);
		dienteSeleccionado = String(window.dienteSeleccionado).trim();
		return dienteSeleccionado;
	}
	console.error("[DIENTE] No se pudo obtener diente de ninguna fuente");
	return null;
}

// ===== IMPLANTE =====
function aplicarImplante(estado) {
	var _diente = getDienteActivo();
	console.log("[IMPLANTE] estado=" + estado + " diente resuelto=" + _diente);
	if (!_diente) { console.error("[IMPLANTE] ABORTADO: sin diente activo"); return; }
	dienteSeleccionado = _diente;
	var id    = parseInt(_diente, 10);
	var color = estado === 'bueno' ? '#0055aa' : '#cc0000';
	console.log("[IMPLANTE] id=" + id + " color=" + color);
	resetearDiente(id);
	var caja = document.querySelector('[data-diente-id="' + _diente + '"]');
	console.log("[IMPLANTE] caja encontrada:", !!caja);
	if (!caja) {
		console.warn("[IMPLANTE] rect no encontrado, buscando alternativa...");
		console.log("Todos los cajon IDs:", Array.from(document.querySelectorAll('[data-diente-id]')).map(function(e){return e.getAttribute('data-diente-id');}));
	}
	if (caja) {
		caja.dataset.estado      = 'implante';
		caja.dataset.estadoColor = color;
		cambiarColorNumeroDiente(id, color);
		aplicarTextoAlCajon(caja, 'IMP', color);
	}
	if (typeof guardarServicioBean === 'function') {
		guardarServicioBean([
		    { name: 'hallazgoTipo',   value: 'implante' },
		    { name: 'hallazgoCodigo', value: estado === 'bueno' ? 'IMPA' : 'IMPR' },
		    { name: 'numDientes',     value: '' },
		    { name: 'dienteId',       value: dienteSeleccionado }
		]);
	}
	if (typeof PF === 'function') PF('dlgServicio').hide();
}

// ===== DIENTE AUSENTE =====
function aplicarDienteAusente(codigo) {
	var _diente = getDienteActivo();
	if (!_diente) return;
	dienteSeleccionado = _diente;
	var id    = parseInt(_diente, 10);
	var idStr = String(id);
	resetearDiente(id);
	var caja = document.querySelector('[data-diente-id="' + idStr + '"]');
	if (caja) {
		var color = '#0055aa';
		caja.dataset.estado      = 'ausente';
		caja.dataset.estadoColor = color;
		caja.classList.add('diente-ausente');
		cambiarColorNumeroDiente(id, color);
		aplicarTextoAlCajon(caja, codigo, color);

		var gD = svg.querySelector('g[data-diente-id="' + idStr + '"]');
		if (gD) {
			var bbox;
			try { bbox = gD.getBBox(); } catch(e) { bbox = { x:0, y:0, width:60, height:90 }; }
			var gX = document.createElementNS(SVG_NS, 'g');
			gX.setAttribute('data-ausente-x', idStr);
			gX.setAttribute('transform', gD.getAttribute('transform'));
			var p = 3, x1 = bbox.x+p, y1 = bbox.y+p, x2 = bbox.x+bbox.width-p, y2 = bbox.y+bbox.height-p;
			[[x1,y1,x2,y2],[x2,y1,x1,y2]].forEach(function(pts) {
				var ln = document.createElementNS(SVG_NS, 'line');
				ln.setAttribute('x1', pts[0]); ln.setAttribute('y1', pts[1]);
				ln.setAttribute('x2', pts[2]); ln.setAttribute('y2', pts[3]);
				ln.setAttribute('stroke', color); ln.setAttribute('stroke-width', '2');
				ln.setAttribute('pointer-events', 'none');
				gX.appendChild(ln);
			});
			svg.appendChild(gX);
		}
	}
	if (typeof guardarServicioBean === 'function') {
		guardarServicioBean([
		    { name: 'hallazgoTipo',   value: 'dienteAusente' },
		    { name: 'hallazgoCodigo', value: codigo },
		    { name: 'numDientes',     value: '' },
		    { name: 'dienteId',       value: dienteSeleccionado }
		]);
	}
	if (typeof PF === 'function') PF('dlgServicio').hide();
}

// ===== EXTRACCIÓN =====
function aplicarExtraccion() {
	var _diente = getDienteActivo();
	if (!_diente) return;
	dienteSeleccionado = _diente;
	var id    = parseInt(_diente, 10);
	var idStr = String(id);
	resetearDiente(id);
	var caja = document.querySelector('[data-diente-id="' + idStr + '"]');
	if (caja) {
		var color = '#cc0000';
		caja.dataset.estado      = 'extraccion';
		caja.dataset.estadoColor = color;
		caja.classList.add('diente-ausente');
		cambiarColorNumeroDiente(id, color);

		var gD = svg.querySelector('g[data-diente-id="' + idStr + '"]');
		if (gD) {
			var bbox;
			try { bbox = gD.getBBox(); } catch(e) { bbox = { x:0, y:0, width:60, height:90 }; }
			var gX = document.createElementNS(SVG_NS, 'g');
			gX.setAttribute('data-ausente-x', idStr);
			gX.setAttribute('transform', gD.getAttribute('transform'));
			var p = 3, x1 = bbox.x+p, y1 = bbox.y+p, x2 = bbox.x+bbox.width-p, y2 = bbox.y+bbox.height-p;
			[[x1,y1,x2,y2],[x2,y1,x1,y2]].forEach(function(pts) {
				var ln = document.createElementNS(SVG_NS, 'line');
				ln.setAttribute('x1', pts[0]); ln.setAttribute('y1', pts[1]);
				ln.setAttribute('x2', pts[2]); ln.setAttribute('y2', pts[3]);
				ln.setAttribute('stroke', color); ln.setAttribute('stroke-width', '3');
				ln.setAttribute('pointer-events', 'none');
				gX.appendChild(ln);
			});
			svg.appendChild(gX);
		}
	}
	if (typeof guardarServicioBean === 'function') {
		guardarServicioBean([
			{ name: 'hallazgoTipo',   value: 'extraccion' },
			{ name: 'hallazgoCodigo', value: 'EX' },
			{ name: 'numDientes',    value: '' },
			{ name: 'dienteId',       value: dienteSeleccionado }
		]);
	}
	if (typeof PF === 'function') PF('dlgServicio').hide();
}

// ===== PRÓTESIS =====
function aplicarProtesis(simbolo, estado) {
	var _diente = getDienteActivo();
	if (!_diente) return;
	dienteSeleccionado = _diente;
	var id    = parseInt(_diente, 10);
	var color = estado === 'bueno' ? '#0055aa' : '#cc0000';

	if (simbolo === 'P') {
		resetearDiente(id);
		var caja = document.querySelector('[data-diente-id="' + dienteSeleccionado + '"]');
		if (caja) {
			caja.dataset.estado      = 'protesis';
			caja.dataset.estadoColor = color;
			cambiarColorNumeroDiente(id, color);
			aplicarTextoAlCajon(caja, 'P', color);
		}
		if (typeof PF === 'function') PF('dlgServicio').hide();
	} else if (simbolo === '=') {
		resetearDiente(id);
		dibujarProtesisCompleta(id, color);
		if (typeof PF === 'function') PF('dlgServicio').hide();
	} else if (simbolo === '--') {
		if (typeof PF === 'function') PF('dlgServicio').hide();
		abrirModalPuente(id, color); return;
	} else if (simbolo === '*') {
		if (typeof PF === 'function') PF('dlgServicio').hide();
		abrirModalRemovible(id, color); return;
	}

	if (typeof guardarServicioBean === 'function') {
		guardarServicioBean([
		    { name: 'hallazgoTipo',   value: 'protesis' },
		    { name: 'hallazgoCodigo', value: simbolo },
		    { name: 'numDientes',     value: '' },
		    { name: 'dienteId',       value: dienteSeleccionado }
		]);
	}
}

function calcularYProtesis(cajasRango) {
	var c  = cajasRango[0];
	var cy = parseFloat(c.getAttribute('y'));
	var ch = parseFloat(c.getAttribute('height'));
	var gr = svg.querySelector('g[data-diente-id="' + c.getAttribute("data-diente-id") + '"]');
	var esInf = false;
	if (gr) {
		var tr = gr.getAttribute('transform') || '';
		var m  = tr.match(/translate\([^,]+,\s*([^)]+)\)/);
		var gy = m ? parseFloat(m[1]) : 0;
		esInf = gy < cy;
	}
	return { y: esInf ? cy - 30 : cy + ch + 28 };
}

function abrirModalPuente(dI, color) {
	var ov = document.createElement('div'); ov.id = 'modalPuente';
	ov.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;display:flex;justify-content:center;align-items:center;';
	ov.innerHTML = '<div style="background:white;padding:25px;border-radius:10px;max-width:420px;width:90%;box-shadow:0 4px 20px rgba(0,0,0,0.3);">'
		+ '<h3 style="margin:0 0 15px;color:#333;border-bottom:2px solid #eee;padding-bottom:10px;">Prótesis Parcial Fija</h3>'
		+ '<p style="margin:0 0 10px;color:#555;font-size:14px;">Pilar inicial: <strong>' + dI + '</strong></p>'
		+ '<p style="margin:0 0 15px;color:#555;font-size:14px;">Ingrese el número del diente pilar final:</p>'
		+ '<input id="inputDienteFinal" type="number" min="11" max="85" placeholder="Ej: 46" style="width:100%;padding:10px;border:2px solid #ccc;border-radius:5px;font-size:16px;box-sizing:border-box;margin-bottom:15px;"/>'
		+ '<div style="display:flex;gap:10px;">'
		+ '<button onclick="confirmarPuente(' + dI + ',\'' + color + '\')" style="flex:1;padding:12px;background:' + color + ';color:white;border:none;border-radius:5px;font-size:15px;font-weight:bold;cursor:pointer;">Aplicar</button>'
		+ '<button onclick="document.getElementById(\'modalPuente\').remove()" style="flex:1;padding:12px;background:#6c757d;color:white;border:none;border-radius:5px;font-size:15px;font-weight:bold;cursor:pointer;">Cancelar</button>'
		+ '</div></div>';
	document.body.appendChild(ov);
	document.getElementById('inputDienteFinal').focus();
}

function confirmarPuente(dI, color) {
	var v = parseInt(document.getElementById('inputDienteFinal').value, 10);
	document.getElementById('modalPuente').remove();
	if (!v) return;
	dibujarPuenteFijo(dI, v, color);
}

function dibujarPuenteFijo(dI, dF, color) {
	var tc = Array.prototype.slice.call(svg.querySelectorAll('[data-diente-id]'));
	var cI = tc.filter(function(c) { return parseInt(c.getAttribute("data-diente-id"), 10) === dI; })[0];
	var cF = tc.filter(function(c) { return parseInt(c.getAttribute("data-diente-id"), 10) === dF; })[0];
	if (!cI || !cF) return;

	var fy   = parseFloat(cI.getAttribute('y'));
	var fila = tc.filter(function(c) { return Math.abs(parseFloat(c.getAttribute('y')) - fy) < 2; })
				  .sort(function(a, b) { return parseFloat(a.getAttribute('x')) - parseFloat(b.getAttribute('x')); });
	var ii = fila.indexOf(cI), fi = fila.indexOf(cF);
	if (ii < 0 || fi < 0) return;

	var rango = fila.slice(Math.min(ii, fi), Math.max(ii, fi) + 1);
	svg.querySelectorAll('[data-puente-fijo]').forEach(function(el) {
		var ids = el.getAttribute('data-puente-fijo').split(',').map(Number);
		if (ids.indexOf(dI) !== -1 || ids.indexOf(dF) !== -1) el.remove();
	});

	var yL = calcularYProtesis(rango).y;
	var gP = document.createElementNS(SVG_NS, 'g');
	gP.setAttribute('data-puente-fijo', rango.map(function(c) { return c.getAttribute("data-diente-id"); }).join(','));

	var x1 = parseFloat(rango[0].getAttribute('x'));
	var x2 = parseFloat(rango[rango.length-1].getAttribute('x')) + parseFloat(rango[rango.length-1].getAttribute('width'));
	gP.appendChild($svg('line', { x1:x1, y1:yL, x2:x2, y2:yL, stroke:color, 'stroke-width':2.5, 'pointer-events':'none' }));

	[rango[0], rango[rango.length-1]].forEach(function(c) {
		var cx = parseFloat(c.getAttribute('x')) + parseFloat(c.getAttribute('width')) / 2;
		gP.appendChild($svg('line', { x1:cx, y1:yL-8, x2:cx, y2:yL+8, stroke:color, 'stroke-width':2.5, 'pointer-events':'none' }));
	});

	rango.forEach(function(c) {
		var did = parseInt(c.getAttribute("data-diente-id"), 10);
		resetearDiente(did);
		c.dataset.estado      = 'protesis';
		c.dataset.estadoColor = color;
		cambiarColorNumeroDiente(did, color);
	});
	svg.appendChild(gP);
}

function dibujarProtesisCompleta(dId, color) {
	var tc  = Array.prototype.slice.call(svg.querySelectorAll('[data-diente-id]'));
	var cR  = tc.filter(function(c) { return parseInt(c.getAttribute("data-diente-id"), 10) === dId; })[0];
	if (!cR) return;

	var fy   = parseFloat(cR.getAttribute('y'));
	var fila = tc.filter(function(c) { return Math.abs(parseFloat(c.getAttribute('y')) - fy) < 2; })
				  .sort(function(a, b) { return parseFloat(a.getAttribute('x')) - parseFloat(b.getAttribute('x')); });

	svg.querySelectorAll('[data-protesis-completa]').forEach(function(el) {
		if (Math.abs(parseFloat(el.getAttribute("data-protesis-completa")) - fy) < 2) el.remove();
	});

	var x1 = parseFloat(fila[0].getAttribute('x'));
	var x2 = parseFloat(fila[fila.length-1].getAttribute('x')) + parseFloat(fila[fila.length-1].getAttribute('width'));
	var yB = calcularYProtesis(fila).y;

	var g = document.createElementNS(SVG_NS, 'g');
	g.setAttribute('data-protesis-completa', fy);
	[-4,4].forEach(function(off) {
		g.appendChild($svg('line', { x1:x1, y1:yB+off, x2:x2, y2:yB+off, stroke:color, 'stroke-width':2.5, 'pointer-events':'none' }));
	});

	fila.forEach(function(c) {
		var did = parseInt(c.getAttribute("data-diente-id"), 10);
		resetearDiente(did);
		c.dataset.estado      = 'protesis';
		c.dataset.estadoColor = color;
		cambiarColorNumeroDiente(did, color);
	});
	svg.appendChild(g);
}

function abrirModalRemovible(dI, color) {
	var ov = document.createElement('div'); ov.id = 'modalRemovible';
	ov.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;display:flex;justify-content:center;align-items:center;';
	ov.innerHTML = '<div style="background:white;padding:25px;border-radius:10px;max-width:420px;width:90%;box-shadow:0 4px 20px rgba(0,0,0,0.3);">'
		+ '<h3 style="margin:0 0 15px;color:#333;border-bottom:2px solid #eee;padding-bottom:10px;">Prótesis Parcial Removible</h3>'
		+ '<p style="margin:0 0 10px;color:#555;font-size:14px;">Diente inicial: <strong>' + dI + '</strong></p>'
		+ '<p style="margin:0 0 15px;color:#555;font-size:14px;">Ingrese el número del diente final:</p>'
		+ '<input id="inputDienteFinalRem" type="number" min="11" max="85" placeholder="Ej: 46" style="width:100%;padding:10px;border:2px solid #ccc;border-radius:5px;font-size:16px;box-sizing:border-box;margin-bottom:15px;"/>'
		+ '<div style="display:flex;gap:10px;">'
		+ '<button onclick="confirmarRemovible(' + dI + ',\'' + color + '\')" style="flex:1;padding:12px;background:' + color + ';color:white;border:none;border-radius:5px;font-size:15px;font-weight:bold;cursor:pointer;">Aplicar</button>'
		+ '<button onclick="document.getElementById(\'modalRemovible\').remove()" style="flex:1;padding:12px;background:#6c757d;color:white;border:none;border-radius:5px;font-size:15px;font-weight:bold;cursor:pointer;">Cancelar</button>'
		+ '</div></div>';
	document.body.appendChild(ov);
	document.getElementById('inputDienteFinalRem').focus();
}

function confirmarRemovible(dI, color) {
	var v = parseInt(document.getElementById('inputDienteFinalRem').value, 10);
	document.getElementById('modalRemovible').remove();
	if (!v) return;
	dibujarProtesisRemovible(dI, v, color);
}

function dibujarProtesisRemovible(dI, dF, color) {
	var tc = Array.prototype.slice.call(svg.querySelectorAll('[data-diente-id]'));
	var cI = tc.filter(function(c) { return parseInt(c.getAttribute("data-diente-id"), 10) === dI; })[0];
	var cF = tc.filter(function(c) { return parseInt(c.getAttribute("data-diente-id"), 10) === dF; })[0];
	if (!cI || !cF) return;

	var fy   = parseFloat(cI.getAttribute('y'));
	var fila = tc.filter(function(c) { return Math.abs(parseFloat(c.getAttribute('y')) - fy) < 2; })
				  .sort(function(a, b) { return parseFloat(a.getAttribute('x')) - parseFloat(b.getAttribute('x')); });
	var ii = fila.indexOf(cI), fi = fila.indexOf(cF);
	if (ii < 0 || fi < 0) return;

	var rango = fila.slice(Math.min(ii, fi), Math.max(ii, fi) + 1);
	svg.querySelectorAll('[data-protesis-removible]').forEach(function(el) {
		var ids = el.getAttribute('data-protesis-removible').split(',').map(Number);
		if (ids.indexOf(dI) !== -1 || ids.indexOf(dF) !== -1) el.remove();
	});

	var x1 = parseFloat(rango[0].getAttribute('x'));
	var x2 = parseFloat(rango[rango.length-1].getAttribute('x')) + parseFloat(rango[rango.length-1].getAttribute('width'));
	var yB = calcularYProtesis(rango).y;

	var g = document.createElementNS(SVG_NS, 'g');
	g.setAttribute('data-protesis-removible', rango.map(function(c) { return c.getAttribute("data-diente-id"); }).join(','));
	[-4,4].forEach(function(off) {
		g.appendChild($svg('line', { x1:x1, y1:yB+off, x2:x2, y2:yB+off, stroke:color, 'stroke-width':2.5, 'stroke-dasharray':'6,3', 'pointer-events':'none' }));
	});

	rango.forEach(function(c) {
		var did = parseInt(c.getAttribute("data-diente-id"), 10);
		resetearDiente(did);
		c.dataset.estado      = 'protesis';
		c.dataset.estadoColor = color;
		cambiarColorNumeroDiente(did, color);
	});
	svg.appendChild(g);
}

// ===== CSS DIALOG CENTRADO + SCROLL =====
(function() {
    var style = document.createElement('style');
    style.textContent = [
        /* Contenido del dialog: altura fija + scroll */
        '.ui-dialog .ui-dialog-content {',
        '    height: auto !important;',
        '    max-height: 600px !important;',
        '    overflow-y: auto !important;',
        '    overflow-x: hidden !important;',
        '}',
        /* Centrado absoluto en pantalla */
        '.ui-dialog {',
        '    position: fixed !important;',
        '    top: 50% !important;',
        '    left: 50% !important;',
        '    transform: translate(-50%, -50%) !important;',
        '    margin: 0 !important;',
        '    max-height: 90vh !important;',
        '}'
    ].join('\n');
    document.head.appendChild(style);
})();

// ===== INICIALIZACIÓN =====
function iniciar() {
	svg = document.getElementById("odontograma");
	if (!svg) { setTimeout(iniciar, 100); return; }
	actualizarOdontograma();
}
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', iniciar);
} else {
	iniciar();
}

// ===== GLOBALES =====
window.actualizarOdontograma  = actualizarOdontograma;
window.volverAlPanelServicios = volverAlPanelServicios;
window.abrirVisorCaries       = abrirVisorCaries;
window.guardarCaries          = guardarCaries;
window.abrirVisorRestauracion = abrirVisorRestauracion;
window.guardarRestauracion    = guardarRestauracion;
window.aplicarImplante        = aplicarImplante;
window.aplicarDienteAusente   = aplicarDienteAusente;
window.aplicarExtraccion      = aplicarExtraccion;
window.aplicarProtesis        = aplicarProtesis;
window.confirmarPuente        = confirmarPuente;
window.confirmarRemovible     = confirmarRemovible;

// ===== CALLBACK DEL DIALOG (onShow de PrimeFaces) =====
// FIX: solo actualiza el header con el valor ya seteado localmente
window.onDialogAbierto = function() {
	// Actualizar header con el diente activo
	var hdr = document.getElementById('dienteInfoHeader');
	if (hdr && dienteSeleccionado) hdr.textContent = 'Diente: ' + dienteSeleccionado;

	// Cerrar todos los acordeones al abrir el modal
	var todosBody = document.querySelectorAll('.servicio-body');
	var todasFlechas = document.querySelectorAll('.servicio-header .flecha');
	for (var i = 0; i < todosBody.length; i++) {
		todosBody[i].classList.remove('active');
	}
	for (var j = 0; j < todasFlechas.length; j++) {
		todasFlechas[j].textContent = '▶';
	}

	volverAlPanelServicios();
};

// ===== TOGGLE ACORDEÓN EXCLUSIVO =====
window.toggleServicio = function(header) {
    var body = header.nextElementSibling;
    var flecha = header.querySelector('.flecha');
    var estabaAbierto = body.classList.contains('active');

    // Cerrar todos los paneles
    var todosBody = document.querySelectorAll('.servicio-body');
    var todasFlechas = document.querySelectorAll('.servicio-header .flecha');
    for (var i = 0; i < todosBody.length; i++) {
        todosBody[i].classList.remove('active');
    }
    for (var j = 0; j < todasFlechas.length; j++) {
        todasFlechas[j].textContent = '▶';
    }

    // Si estaba cerrado, abrirlo
    if (!estabaAbierto) {
        body.classList.add('active');
        flecha.textContent = '▼';
    }
};