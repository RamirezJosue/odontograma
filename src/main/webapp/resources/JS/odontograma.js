/**
 * Odontograma Dental - Funciones principales
 */

// Configuración
const CONFIG = {
    toothWidth: 60,
    toothHeight: 80,
    spacing: 10,
    svgWidth: 1200,
    colors: {
        normal: 'white',
        hover: '#e8f4f8',
        selected: '#b3e0ff',
        stroke: '#333',
        selectedStroke: '#0066cc'
    }
};

// Datos de dientes por tipo de dentición
const DENTICION_DATA = {
    mixta: [
        { teeth: [18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28], y: 50, isUpper: true },
        { teeth: [55,54,53,52,51,61,62,63,64,65], y: 200, isUpper: true },
        { teeth: [85,84,83,82,81,71,72,73,74,75], y: 350, isUpper: false },
        { teeth: [48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38], y: 500, isUpper: false }
    ],
    permanente: [
        { teeth: [18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28], y: 150, isUpper: true },
        { teeth: [48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38], y: 450, isUpper: false }
    ],
    decidua: [
        { teeth: [55,54,53,52,51,61,62,63,64,65], y: 150, isUpper: true },
        { teeth: [85,84,83,82,81,71,72,73,74,75], y: 450, isUpper: false }
    ]
};

/**
 * Inicializa el odontograma
 */
function initOdontograma() {
    console.log('Inicializando odontograma...');
    
    const svg = document.getElementById('odontograma-svg');
    if (!svg) {
        console.error('Elemento SVG no encontrado');
        return;
    }
    
    const tipo = getSelectedDenticion();
    drawOdontograma(svg, tipo);
    
    // Agregar event listeners para cambios en los radios
    document.querySelectorAll('input[name$="denticion"]').forEach(radio => {
        radio.addEventListener('change', () => {
            const newType = getSelectedDenticion();
            drawOdontograma(svg, newType);
        });
    });
}

/**
 * Obtiene el tipo de dentición seleccionado
 */
function getSelectedDenticion() {
    const radios = document.querySelectorAll('input[name$="denticion"]:checked');
    return radios.length > 0 ? radios[0].value : 'permanente';
}

/**
 * Dibuja el odontograma completo
 */
function drawOdontograma(svg, tipo) {
    // Limpiar SVG
    while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
    }
    
    // Configurar tamaño
    const rows = DENTICION_DATA[tipo] || DENTICION_DATA.permanente;
    const svgHeight = tipo === 'mixta' ? 800 : 600;
    
    svg.setAttribute('viewBox', `0 0 ${CONFIG.svgWidth} ${svgHeight}`);
    svg.setAttribute('height', svgHeight);
    
    // Dibujar cada fila
    rows.forEach(row => {
        drawToothRow(svg, row.teeth, row.y, row.isUpper);
    });
    
    console.log(`Odontograma ${tipo} dibujado`);
}

/**
 * Dibuja una fila de dientes
 */
function drawToothRow(svg, teeth, y, isUpper) {
    const totalWidth = teeth.length * (CONFIG.toothWidth + CONFIG.spacing) - CONFIG.spacing;
    const startX = (CONFIG.svgWidth - totalWidth) / 2;
    
    teeth.forEach((toothNumber, index) => {
        const x = startX + index * (CONFIG.toothWidth + CONFIG.spacing);
        
        // Dibujar diente
        drawTooth(svg, toothNumber, x, y, isUpper);
    });
}

/**
 * Dibuja un diente individual
 */
function drawTooth(svg, toothNumber, x, y, isUpper) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('class', 'tooth-group');
    group.setAttribute('data-tooth', toothNumber);
    
    // Rectángulo base (clickeable)
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    rect.setAttribute('width', CONFIG.toothWidth);
    rect.setAttribute('height', CONFIG.toothHeight);
    rect.setAttribute('class', 'tooth-rect');
    rect.setAttribute('data-tooth', toothNumber);
    
    rect.addEventListener('click', () => selectTooth(toothNumber));
    rect.addEventListener('mouseover', () => {
        rect.style.fill = CONFIG.colors.hover;
    });
    rect.addEventListener('mouseout', () => {
        if (!rect.classList.contains('tooth-selected')) {
            rect.style.fill = CONFIG.colors.normal;
        }
    });
    
    group.appendChild(rect);
    
    // Etiqueta con número
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', x + CONFIG.toothWidth / 2);
    label.setAttribute('y', isUpper ? y + CONFIG.toothHeight + 20 : y - 10);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('class', 'tooth-label');
    label.setAttribute('data-tooth', toothNumber);
    label.textContent = toothNumber;
    
    label.addEventListener('click', () => selectTooth(toothNumber));
    
    group.appendChild(label);
    
    // Forma del diente
    drawToothShape(group, toothNumber, x, y, isUpper);
    
    svg.appendChild(group);
}

/**
 * Dibuja la forma específica del diente
 */
function drawToothShape(group, toothNumber, x, y, isUpper) {
    const shape = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    shape.setAttribute('class', 'tooth-shape');
    
    let path = '';
    const centerX = x + CONFIG.toothWidth / 2;
    const centerY = y + CONFIG.toothHeight / 2;
    
    // Diferentes formas según tipo de diente
    if ((toothNumber >= 16 && toothNumber <= 18) || 
        (toothNumber >= 26 && toothNumber <= 28) ||
        (toothNumber >= 36 && toothNumber <= 38) || 
        (toothNumber >= 46 && toothNumber <= 48)) {
        // Molares
        path = `M ${x + 10} ${y + 10} 
                L ${centerX} ${isUpper ? y + 20 : y + CONFIG.toothHeight - 20} 
                L ${x + CONFIG.toothWidth - 10} ${y + 10}
                L ${centerX} ${isUpper ? y + CONFIG.toothHeight - 20 : y + 20} Z`;
    } else if ((toothNumber >= 11 && toothNumber <= 15) || 
               (toothNumber >= 21 && toothNumber <= 25) ||
               (toothNumber >= 31 && toothNumber <= 35) || 
               (toothNumber >= 41 && toothNumber <= 45)) {
        // Premolares e incisivos
        path = `M ${x + 15} ${y + 5} 
                L ${x + CONFIG.toothWidth - 15} ${y + 5}
                L ${x + CONFIG.toothWidth - 5} ${y + CONFIG.toothHeight - 5}
                L ${x + 5} ${y + CONFIG.toothHeight - 5} Z`;
    } else {
        // Temporales u otros
        path = `M ${x + 10} ${y + 10} 
                L ${x + CONFIG.toothWidth - 10} ${y + 10}
                L ${x + CONFIG.toothWidth - 10} ${y + CONFIG.toothHeight - 10}
                L ${x + 10} ${y + CONFIG.toothHeight - 10} Z`;
    }
    
    shape.setAttribute('d', path);
    group.appendChild(shape);
}

/**
 * Maneja la selección de un diente
 */
function selectTooth(toothNumber) {
    console.log(`Diente seleccionado: ${toothNumber}`);
    
    // Remover selección anterior
    document.querySelectorAll('.tooth-selected').forEach(el => {
        el.classList.remove('tooth-selected');
        el.style.fill = CONFIG.colors.normal;
    });
    
    // Aplicar nueva selección
    document.querySelectorAll(`[data-tooth="${toothNumber}"]`).forEach(el => {
        if (el.tagName === 'rect') {
            el.classList.add('tooth-selected');
            el.style.fill = CONFIG.colors.selected;
        }
    });
    
    // Llamar a función de PrimeFaces para agregar a tabla
    if (window.PF && PF('agregarHallazgoBtn')) {
        addToothToTable(toothNumber);
    } else {
        // Fallback
        alert(`Diente ${toothNumber} seleccionado. Debería agregarse a la tabla.`);
    }
}

/**
 * Agrega diente a la tabla via PrimeFaces
 */
function addToothToTable(toothNumber) {
    // Hacer clic en botón de agregar
    PF('agregarHallazgoBtn').jq.click();
    
    // Esperar y llenar campo
    setTimeout(() => {
        const inputs = document.querySelectorAll('input[id*="piezaDental"]');
        if (inputs.length > 0) {
            const lastInput = inputs[inputs.length - 1];
            lastInput.value = toothNumber;
            
            // Disparar eventos
            lastInput.dispatchEvent(new Event('input', { bubbles: true }));
            lastInput.dispatchEvent(new Event('change', { bubbles: true }));
            
            // Notificación
            if (PF('growl')) {
                PF('growl').show([{
                    severity: 'info',
                    summary: 'Diente agregado',
                    detail: `Diente ${toothNumber} agregado a la tabla`
                }]);
            }
        }
    }, 300);
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOdontograma);
} else {
    initOdontograma();
}