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

@ManagedBean
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
	private String servicioSeleccionado;
	private String subtipoSeleccionado;

	@PostConstruct
	public void init() {
		hallazgos = new ArrayList<>();
		System.out.println("=== OdontogramaBean inicializado ===");
	}

	public String guardarServicioCompleto() {
	    Map<String, String> params = FacesContext.getCurrentInstance().getExternalContext().getRequestParameterMap();

	    String tipo = params.getOrDefault("hallazgoTipo", "");
	    String codigo = params.getOrDefault("hallazgoCodigo", "");
	    String sups = params.getOrDefault("numDientes", "");
	    String diente = params.getOrDefault("dienteId", dienteSeleccionado != null ? dienteSeleccionado : "");
	    String colorParam = params.getOrDefault("colorServicio", "");

	    System.out.println("=== guardarServicioCompleto ===");
	    System.out.println("  Diente    : " + diente);
	    System.out.println("  Tipo      : " + tipo);
	    System.out.println("  Código    : " + codigo);

	    if (diente == null || diente.trim().isEmpty()) {
	        System.out.println("  WARN: Diente vacío, ignorado.");
	        return null;
	    }
	    if (tipo == null || tipo.trim().isEmpty()) {
	        System.out.println("  WARN: Tipo vacío, ignorado.");
	        return null;
	    }

	    this.dienteSeleccionado = diente;
	    this.hallazgoTipo = tipo;
	    this.hallazgoCodigo = codigo;
	    this.numDientes = sups;
	    if (!colorParam.isEmpty())
	        this.colorServicio = colorParam;

	    String hallazgoNombre = buildHallazgoNombre(tipo);

	    hallazgos.removeIf(h -> h.getPiezaDental() != null && h.getPiezaDental().equals(diente)
	            && h.getHallazgo() != null && h.getHallazgo().equals(hallazgoNombre));

	    Hallazgo nuevo = new Hallazgo();
	    nuevo.setPiezaDental(diente);
	    nuevo.setHallazgo(hallazgoNombre);
	    nuevo.setCodigo(codigo);
	    nuevo.setNumDientes(sups.isEmpty() ? "—" : sups);
	    nuevo.setCantidad(1);
	    nuevo.setNota(buildNota(tipo, codigo, sups));

	    hallazgos.add(nuevo);

	    System.out.println("  Hallazgo agregado. Total: " + hallazgos.size());
	    return null;
	}

	
	private String buildHallazgoNombre(String tipo) {
	    switch (tipo) {
	        case "caries":        return "Caries";
	        case "restauracion":  return "Restauración";
	        case "implante":      return "Implante";
	        case "dienteAusente": return "Diente Ausente";
	        case "extraccion":    return "Extracción";
	        case "protesis":      return "Prótesis";
	        default:              return tipo;
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

	public String getDienteSeleccionado() {
		return dienteSeleccionado;
	}

	public String adicionarHallazgo() {
		hallazgos.add(new Hallazgo());
		return null;
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
}