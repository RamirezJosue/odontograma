package pe.odontograma.bean;

import pe.odontograma.model.Hallazgo;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import javax.annotation.PostConstruct;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.ViewScoped;
import javax.faces.context.FacesContext;
import org.primefaces.PrimeFaces;

@ManagedBean
@ViewScoped
public class OdontogramaBean implements Serializable {

	private static final long serialVersionUID = 1L;

	// ── Estado del odontograma ──────────────────────────────────────
	private String tipoDenticion = "mixta";
	private Date fechaCreacion = new Date();

	// ── Servicio seleccionado desde el JS ───────────────────────────
	private String dienteSeleccionado; // número FDI, ej: "18"
	private String servicioTipo; // "caries", "restauracion", "implante", ...
	private String servicioCodigo; // "CE", "AM", "IMP", etc.
	private String superficies; // "M,D,O" (separado por comas)
	private String colorServicio; // "#0055aa" | "#cc0000"

	// ── Tabla de hallazgos ──────────────────────────────────────────
	private List<Hallazgo> hallazgos;

	// ── Variables legacy (compatibilidad con código existente) ──────
	private String servicioSeleccionado;
	private String subtipoSeleccionado;

	@PostConstruct
	public void init() {
		hallazgos = new ArrayList<>();
		// Datos de prueba iniciales
		hallazgos.add(new Hallazgo("18", "Caries", "CE", "M,D", 1, "Caries en esmalte"));
		hallazgos.add(new Hallazgo("16", "Restauración", "AM", "O,V1", 1, "Amalgama en oclusal"));
		System.out.println("=== OdontogramaBean inicializado ===");
	}

	// ════════════════════════════════════════════════════════════════
	// MÉTODO PRINCIPAL: recibe todo desde el JS vía guardarServicioBean
	// ════════════════════════════════════════════════════════════════
	public void guardarServicioCompleto() {
		Map<String, String> params = FacesContext.getCurrentInstance().getExternalContext().getRequestParameterMap();

		// Leer parámetros enviados desde el JS
		String tipo = params.getOrDefault("servicioTipo", "");
		String codigo = params.getOrDefault("servicioCodigo", "");
		String sups = params.getOrDefault("superficies", "");
		String diente = params.getOrDefault("dienteId", dienteSeleccionado != null ? dienteSeleccionado : "");
		String colorParam = params.getOrDefault("colorServicio", "");

		System.out.println("=== guardarServicioCompleto ===");
		System.out.println("  Diente    : " + diente);
		System.out.println("  Tipo      : " + tipo);
		System.out.println("  Código    : " + codigo);
		System.out.println("  Superficies: " + sups);
		System.out.println("  Color     : " + colorParam);

		// Validación básica
		if (diente == null || diente.trim().isEmpty()) {
			System.out.println("  WARN: Diente vacío, ignorado.");
			return;
		}
		if (tipo == null || tipo.trim().isEmpty()) {
			System.out.println("  WARN: Tipo vacío, ignorado.");
			return;
		}

		// Actualizar estado del bean
		this.dienteSeleccionado = diente;
		this.servicioTipo = tipo;
		this.servicioCodigo = codigo;
		this.superficies = sups;
		if (!colorParam.isEmpty())
			this.colorServicio = colorParam;

		// Crear hallazgo legible
		Hallazgo nuevo = new Hallazgo();
		nuevo.setPiezaDental(diente);
		nuevo.setTipo(tipo);
		nuevo.setDescripcion(codigo);
		nuevo.setSuperficies(sups.isEmpty() ? "—" : sups);
		nuevo.setCantidad(1);
		nuevo.setNota(buildNota(tipo, codigo, sups));

		// Reemplazar hallazgo existente del mismo diente (opcional: solo acumula)
		hallazgos.removeIf(h -> h.getPiezaDental() != null && h.getPiezaDental().equals(diente) && h.getTipo() != null
				&& h.getTipo().equals(tipo));

		hallazgos.add(nuevo);

		System.out.println("  ✅ Hallazgo agregado. Total: " + hallazgos.size());
	}

	/** Construye una nota descriptiva legible para la tabla */
	private String buildNota(String tipo, String codigo, String sups) {
		StringBuilder sb = new StringBuilder();
		switch (tipo) {
		case "caries":
			sb.append("Caries");
			break;
		case "restauracion":
			sb.append("Restauración");
			break;
		case "implante":
			sb.append("Implante");
			break;
		case "dienteAusente":
			sb.append("Diente ausente");
			break;
		case "extraccion":
			sb.append("Extracción");
			break;
		case "protesis":
			sb.append("Prótesis");
			break;
		default:
			sb.append(tipo);
			break;
		}
		sb.append(" [").append(codigo).append("]");
		if (sups != null && !sups.isEmpty() && !sups.equals("—")) {
			sb.append(" - Sup: ").append(sups);
		}
		return sb.toString();
	}

	// ════════════════════════════════════════════════════════════════
	// setDienteSeleccionado — llamado por p:remoteCommand "enviarDiente"
	// ════════════════════════════════════════════════════════════════
	public void setDienteSeleccionado(String dienteSeleccionado) {
		this.dienteSeleccionado = dienteSeleccionado;
		System.out.println("Diente capturado: " + dienteSeleccionado);
	}

	public String getDienteSeleccionado() {
		return dienteSeleccionado;
	}

	// ════════════════════════════════════════════════════════════════
	// Tabla de hallazgos
	// ════════════════════════════════════════════════════════════════
	public void adicionarHallazgo() {
		hallazgos.add(new Hallazgo());
	}

	public int getTotalHallazgos() {
		return hallazgos != null ? hallazgos.size() : 0;
	}

	// ════════════════════════════════════════════════════════════════
	// Getters / Setters
	// ════════════════════════════════════════════════════════════════
	public List<Hallazgo> getHallazgos() {
		return hallazgos;
	}

	public void setHallazgos(List<Hallazgo> h) {
		this.hallazgos = h;
	}

	public String getTipoDenticion() {
		return tipoDenticion;
	}

	public void setTipoDenticion(String t) {
		this.tipoDenticion = t;
	}

	public Date getFechaCreacion() {
		return fechaCreacion;
	}

	public void setFechaCreacion(Date d) {
		this.fechaCreacion = d;
	}

	public String getServicioTipo() {
		return servicioTipo;
	}

	public void setServicioTipo(String s) {
		this.servicioTipo = s;
	}

	public String getServicioCodigo() {
		return servicioCodigo;
	}

	public void setServicioCodigo(String s) {
		this.servicioCodigo = s;
	}

	public String getSuperficies() {
		return superficies;
	}

	public void setSuperficies(String s) {
		this.superficies = s;
	}

	public String getColorServicio() {
		return colorServicio;
	}

	public void setColorServicio(String c) {
		this.colorServicio = c;
	}

	// Legacy - por compatibilidad si otros formularios los usan
	public String getServicioSeleccionado() {
		return servicioSeleccionado;
	}

	public void setServicioSeleccionado(String s) {
		this.servicioSeleccionado = s;
	}

	public String getSubtipoSeleccionado() {
		return subtipoSeleccionado;
	}

	public void setSubtipoSeleccionado(String s) {
		this.subtipoSeleccionado = s;
	}
}