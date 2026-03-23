package pe.odontograma.bean;

import pe.odontograma.model.Diagnostico;
import pe.odontograma.model.Hallazgo;
import pe.odontograma.model.Paciente;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.ViewScoped;
import javax.faces.context.FacesContext;
import javax.annotation.PostConstruct;

@ManagedBean(name = "odontogramaBean")
@ViewScoped
public class OdontogramaBean implements Serializable {

	private static final long serialVersionUID = 1L;

	private String tipoDenticion = "mixta";
	private Date fechaCreacion = new Date();

	private String dienteSeleccionado; // número FDI, ej: "18"
	private String hallazgoTipo; // "caries", "restauracion", "implante", ...
	private String hallazgoCodigo; // "CE", "AM", "IMP", etc.
	private String numDientes; // "1 O 2"
	private String colorServicio; // "#0055aa" | "#cc0000"

	private List<Hallazgo> hallazgos;
	private List<Hallazgo> hallazgosEvo;
	private String servicioSeleccionado;
	private String subtipoSeleccionado;

	private Paciente paciente;

	private String diagnosticoSeleccionado;
	private List<Diagnostico> diagnosticos = new ArrayList<>();
	private static final Map<String, String> DESCRIPCIONES_CIE10 = new HashMap<>();
	static {
		DESCRIPCIONES_CIE10.put("K02", "Caries dental");
		DESCRIPCIONES_CIE10.put("K03", "Otras enfermedades de los tejidos dentales duros");
		DESCRIPCIONES_CIE10.put("K04", "Enfermedades de la pulpa y tejidos periapicales");
		DESCRIPCIONES_CIE10.put("K05", "Gingivitis y enfermedades periodontales");
		DESCRIPCIONES_CIE10.put("K06", "Otros trastornos de la encía y zona edéntula");
		DESCRIPCIONES_CIE10.put("K07", "Anomalías dentofaciales");
		DESCRIPCIONES_CIE10.put("K08", "Otros trastornos de los dientes");
		DESCRIPCIONES_CIE10.put("K09", "Quistes de la región bucal");
		DESCRIPCIONES_CIE10.put("K10", "Otros trastornos de los maxilares");
		DESCRIPCIONES_CIE10.put("K11", "Enfermedades de las glándulas salivales");
		DESCRIPCIONES_CIE10.put("K12", "Estomatitis y lesiones afines");
		DESCRIPCIONES_CIE10.put("K13", "Otras enfermedades del labio y mucosa bucal");
		DESCRIPCIONES_CIE10.put("K14", "Enfermedades de la lengua");
	}
	@PostConstruct
	public void init() {
		paciente = new Paciente();

		hallazgos = new ArrayList<>();
		hallazgosEvo = new ArrayList<>();

		// 👤 PACIENTE FAKE
		paciente.setApellidosNombres("GARCIA PEREZ, JUAN CARLOS");
		paciente.setDocumento("12345678");
		paciente.setFechaNacimiento(new Date());
		paciente.setGenero("Masculino");
		paciente.setCorreo("juan.perez@email.com");
		paciente.setCelular("987654321");
		paciente.setSucursal("PRINCIPAL");
		paciente.setFechaAdmision(new Date());

		// 🟢 TABLA PRINCIPAL (FAKE)
		Hallazgo h1 = new Hallazgo();
		h1.setPiezaDental("11");
		h1.setHallazgo("Caries");
		h1.setCodigo("K02");
		h1.setNumDientes("1");
		h1.setCantidad(1);
		h1.setNota("");
		h1.setEstado("Pendiente");
		hallazgos.add(h1);

		// 🔵 TABLA EVOLUCIÓN (FAKE)
		Hallazgo e1 = new Hallazgo();
		e1.setPiezaDental("11");
		e1.setHallazgo("Control");
		e1.setCodigo("EV1");
		e1.setNumDientes("1");
		e1.setCantidad(1);
		e1.setNota("Seguimiento de caries");

		hallazgosEvo.add(e1);

		System.out.println("=== OdontogramaBean inicializado con DATA FAKE ===");
	}

	public String guardarServicioCompleto() {

		if (hallazgos == null)
			hallazgos = new ArrayList<>();
		if (hallazgosEvo == null)
			hallazgosEvo = new ArrayList<>();

		Map<String, String> params = FacesContext.getCurrentInstance().getExternalContext().getRequestParameterMap();

		String tipo     = params.getOrDefault("hallazgoTipo",   "");
		String codigo   = params.getOrDefault("hallazgoCodigo", "");
		String sups     = params.getOrDefault("numDientes",     "");
		String diente   = params.getOrDefault("dienteId", dienteSeleccionado != null ? dienteSeleccionado : "");
		String colorParam = params.getOrDefault("colorServicio", "");

		System.out.println("=== guardarServicioCompleto ===");
		System.out.println("  Diente    : " + diente);
		System.out.println("  Tipo      : " + tipo);
		System.out.println("  Código    : " + codigo);
		System.out.println("  Sups      : " + sups);

		if (diente == null || diente.trim().isEmpty()) {
			System.out.println("  WARN: Diente vacío, ignorado.");
			return null;
		}
		if (tipo == null || tipo.trim().isEmpty()) {
			System.out.println("  WARN: Tipo vacío, ignorado.");
			return null;
		}

		this.dienteSeleccionado = diente;
		this.hallazgoTipo       = tipo;
		this.hallazgoCodigo     = codigo;
		this.numDientes         = sups;
		if (!colorParam.isEmpty())
			this.colorServicio  = colorParam;

		String hallazgoNombre = buildHallazgoNombre(tipo, codigo);

		boolean esProtesisRango = tipo.equals("protesis") 
								&& sups != null 
								&& sups.contains("-");
		String piezaDental = esProtesisRango ? sups : diente;
	
		if (esProtesisRango) {
			hallazgos.removeIf(h ->
				h.getCodigo() != null && h.getCodigo().equals(codigo));
		} else {
			hallazgos.removeIf(h ->
				h.getPiezaDental() != null && h.getPiezaDental().equals(diente)
				&& h.getCodigo() != null && h.getCodigo().equals(codigo));
		}

		Hallazgo nuevo = new Hallazgo();
		nuevo.setPiezaDental(piezaDental);
		nuevo.setHallazgo(hallazgoNombre);
		nuevo.setCodigo(codigo);
		nuevo.setNumDientes(sups.isEmpty() ? "—" : sups);
		nuevo.setCantidad(calcularCantidad(tipo, sups));
		// nuevo.setNota(buildNota(tipo, codigo, sups));
		nuevo.setNota("");
		nuevo.setEstado(determinarEstado(tipo, codigo));

		hallazgos.add(nuevo);

		System.out.println("  Pieza     : " + piezaDental);
		System.out.println("  Hallazgo agregado. Total: " + hallazgos.size());
		return null;
	}

	private int calcularCantidad(String tipo, String sups) {
		if ((tipo.equals("caries") || tipo.equals("restauracion")) 
			&& sups != null && !sups.trim().isEmpty() && !sups.equals("—")) {
			return sups.split(",").length;
		}
		return 1;
	}

	private String buildHallazgoNombre(String tipo, String codigo) {
		switch (tipo) {
			case "caries":
				switch (codigo) {
					case "CE":  return "Caries a Nivel del Esmalte";
					case "CD":  return "Caries a Nivel de la Dentina";
					case "CDP": return "Caries a Nivel de la Pulpa";
					case "MB":  return "Mancha Blanca";
					case "CDT": return "Caries Dental";
					case "CR":  return "Caries Recurrente";
					default:    return "Caries";
				}
			case "restauracion":
				switch (codigo) {
					case "AM_bueno": return "Amalgama en Buen Estado";
					case "AM_malo":  return "Amalgama en Mal Estado";
					case "R_bueno":  return "Resina en Buen Estado";
					case "R_malo":   return "Resina en Mal Estado";
					case "IV_bueno": return "Ionómero de Vidrio en Buen Estado";
					case "IV_malo":  return "Ionómero de Vidrio en Mal Estado";
					case "IM_bueno": return "Incrustación Metálica en Buen Estado";
					case "IM_malo":  return "Incrustación Metálica en Mal Estado";
					case "IE_bueno": return "Incrustación Estética en Buen Estado";
					case "IE_malo":  return "Incrustación Estética en Mal Estado";
					case "C_bueno":  return "Carilla en Buen Estado";
					case "C_malo":   return "Carilla en Mal Estado";
					default:         return "Restauración";
				}
			case "implante":
				switch (codigo) {
					case "IMPA": return "Implante en Buen Estado";
					case "IMPR": return "Implante en Mal Estado";
					default:     return "Implante";
				}
			case "dienteAusente":
				switch (codigo) {
					case "DEX": return "Diente Extraído por Caries";
					case "DNE": return "Diente No Erupcionado";
					case "DAO": return "Diente Ausente por Otra Razón";
					default:    return "Diente Ausente";
				}
			case "extraccion": return "Extracción Dental";
			case "protesis":
				switch (codigo) {
					case "P_bueno":  return "Prótesis Dental en Buen Estado";
					case "P_malo":   return "Prótesis Dental en Mal Estado";
					case "--_bueno": return "Prótesis Parcial Fija en Buen Estado";
					case "--_malo":  return "Prótesis Parcial Fija en Mal Estado";
					case "=_bueno":  return "Prótesis Completa en Buen Estado";
					case "=_malo":   return "Prótesis Completa en Mal Estado";
					case "*_bueno":  return "Prótesis Parcial Removible en Buen Estado";
					case "*_malo":   return "Prótesis Parcial Removible en Mal Estado";
					default:         return "Prótesis";
				}
			default: return tipo;
		}
	}

	private String determinarEstado(String tipo, String codigo) {
		switch (tipo) {
			case "implante":
				// bueno = IMPA → No Aplica | fallido = IMPR → Pendiente
				return "IMPA".equals(codigo) ? "No Aplica" : "Pendiente";

			case "caries":
				return "Pendiente";

			case "dienteAusente":
				return "No Aplica";

			case "extraccion":
				return "Pendiente";

			case "protesis":
				 if (codigo == null) return "Pendiente";
            		return codigo.contains("bueno") ? "No Aplica" : "Pendiente";

			case "restauracion":
				  if (codigo == null) return "Pendiente";
					return codigo.contains("bueno") ? "No Aplica" : "Pendiente";

			default:
				return "Pendiente";
		}
	}

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
				if (sups != null && !sups.isEmpty() && sups.contains("-")) {
					sb.append(" (dientes ").append(sups).append(")");
				}
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

	public void setDienteSeleccionado(String dienteSeleccionado) {
		this.dienteSeleccionado = dienteSeleccionado;
		System.out.println("Diente capturado: " + dienteSeleccionado);
	}

	public String recibirDiente() {
		Map<String, String> params = FacesContext.getCurrentInstance().getExternalContext().getRequestParameterMap();
		String diente = params.get("dienteSeleccionado");
		if (diente != null && !diente.trim().isEmpty()) {
			this.dienteSeleccionado = diente.trim();
			System.out.println("Diente recibido via remoteCommand: " + this.dienteSeleccionado);
		}
		return null;
	}

	public void eliminarHallazgo(Hallazgo h) {
		hallazgos.remove(h);
	}

	public String adicionarHallazgo() {
		hallazgos.add(new Hallazgo());
		return null;
	}

	public void agregarDiagnostico() {
		if (diagnosticoSeleccionado == null || diagnosticoSeleccionado.trim().isEmpty())
			return;

		// Verificar que no esté duplicado
		boolean existe = diagnosticos.stream()
				.anyMatch(d -> d.getCie10().equals(diagnosticoSeleccionado));
		if (existe)
			return;

		String descripcion = DESCRIPCIONES_CIE10.getOrDefault(diagnosticoSeleccionado, diagnosticoSeleccionado);
		Diagnostico nuevo = new Diagnostico(diagnosticos.size() + 1, diagnosticoSeleccionado, descripcion);
		diagnosticos.add(nuevo);
		diagnosticoSeleccionado = null; // limpiar combo
	}

	public void eliminarDiagnostico(Diagnostico d) {
		diagnosticos.remove(d);
		// Renumerar
		for (int i = 0; i < diagnosticos.size(); i++) {
			diagnosticos.get(i).setNumero(i + 1);
		}
	}

	public void limpiarDiagnosticos() {
		diagnosticos.clear();
		diagnosticoSeleccionado = null;
	}

	// SET AND GETTERS
	
	public String getDienteSeleccionado() {
		return dienteSeleccionado;
	}

	public int getTotalHallazgos() {
		return hallazgos != null ? hallazgos.size() : 0;
	}

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

	public String getHallazgoTipo() {
		return hallazgoTipo;
	}

	public void setHallazgoTipo(String s) {
		this.hallazgoTipo = s;
	}

	public String getHallazgoCodigo() {
		return hallazgoCodigo;
	}

	public void setHallazgoCodigo(String s) {
		this.hallazgoCodigo = s;
	}

	public String getNumDientes() {
		return numDientes;
	}

	public void setNumDientes(String s) {
		this.numDientes = s;
	}

	public String getColorServicio() {
		return colorServicio;
	}

	public void setColorServicio(String c) {
		this.colorServicio = c;
	}

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

	public Paciente getPaciente() {
		return paciente;
	}

	public void setPaciente(Paciente paciente) {
		this.paciente = paciente;
	}

	public List<Hallazgo> getHallazgosEvo() {
		return hallazgosEvo;
	}

	public int getTotalHallazgosEvo() {
		return hallazgosEvo != null ? hallazgosEvo.size() : 0;
	}

	public String getDiagnosticoSeleccionado() {
		return diagnosticoSeleccionado;
	}

	public void setDiagnosticoSeleccionado(String d) {
		this.diagnosticoSeleccionado = d;
	}

	public List<Diagnostico> getDiagnosticos() {
		return diagnosticos;
	}

	public void setDiagnosticos(List<Diagnostico> list) {
		this.diagnosticos = list;
	}
	
}