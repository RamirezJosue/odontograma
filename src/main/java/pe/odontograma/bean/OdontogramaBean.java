package pe.odontograma.bean;

import pe.odontograma.model.Hallazgo;
import java.io.Serializable;
import java.util.List;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.ViewScoped;
import javax.faces.event.AjaxBehaviorEvent;

@SuppressWarnings("unused")
@ManagedBean
@ViewScoped
public class OdontogramaBean implements Serializable {

	private static final long serialVersionUID = 1L;

	private String tipoDenticion = "mixta";
	private List<Hallazgo> hallazgos;
	private Hallazgo hallazgoSeleccionado;
	private Date fechaCreacion = new Date();

	private String servicioSeleccionado;
	private String subtipoSeleccionado;

	private Map<String, Boolean> servicioActivo = new HashMap<>();

	@PostConstruct
	public void init() {
		hallazgos = new ArrayList<>();

		hallazgos.add(new Hallazgo("18", "Caries", 1, "Caries profunda"));
		hallazgos.add(new Hallazgo("16", "Restauración", 2, "Amalgama"));

		System.out.println("=== Bean inicializado ===");
	}

	public void onServicioChange() {
		System.out.println("=== onServicioChange ===");
		System.out.println("Servicio seleccionado: '" + this.servicioSeleccionado + "'");

		this.subtipoSeleccionado = null;

		servicioActivo.clear();
		if (servicioSeleccionado != null && !servicioSeleccionado.isEmpty()) {
			servicioActivo.put(servicioSeleccionado, true);
		}

		System.out.println("Subtipo limpiado, servicio activo: " + servicioSeleccionado);
	}

	public void guardarServicio() {
		System.out.println("=== guardarServicio ===");
		System.out.println("Servicio: '" + servicioSeleccionado + "'");
		System.out.println("Subtipo: '" + subtipoSeleccionado + "'");

		if (servicioSeleccionado == null || servicioSeleccionado.trim().isEmpty()) {
			System.out.println("Debe seleccionar un servicio");
			return;
		}

		if (subtipoSeleccionado == null || subtipoSeleccionado.trim().isEmpty()) {
			System.out.println("Debe seleccionar un subtipo");
			return;
		}

		Hallazgo nuevo = new Hallazgo();
		nuevo.setTipo(servicioSeleccionado);
		nuevo.setDescripcion(subtipoSeleccionado);
		nuevo.setPiezaDental("Pendiente");
		nuevo.setCantidad(1);

		hallazgos.add(nuevo);

		System.out.println("Hallazgo guardado. Total: " + hallazgos.size());

		servicioSeleccionado = null;
		subtipoSeleccionado = null;
		servicioActivo.clear();
	}

	// Getters y Setters
	public String getServicioSeleccionado() {
		return servicioSeleccionado;
	}

	public void setServicioSeleccionado(String servicioSeleccionado) {
		System.out.println("setServicioSeleccionado: '" + servicioSeleccionado + "'");
		this.servicioSeleccionado = servicioSeleccionado;
	}

	public String getSubtipoSeleccionado() {
		return subtipoSeleccionado;
	}

	public void setSubtipoSeleccionado(String subtipoSeleccionado) {
		System.out.println("setSubtipoSeleccionado: '" + subtipoSeleccionado + "'");
		this.subtipoSeleccionado = subtipoSeleccionado;
	}

	public Map<String, Boolean> getServicioActivo() {
		return servicioActivo;
	}

	public boolean isServicioSeleccionado(String servicio) {
		return servicio != null && servicio.equals(this.servicioSeleccionado);
	}

	// Resto de getters y setters...
	public List<Hallazgo> getHallazgos() {
		return hallazgos;
	}

	public void setHallazgos(List<Hallazgo> hallazgos) {
		this.hallazgos = hallazgos;
	}

	public Hallazgo getHallazgoSeleccionado() {
		return hallazgoSeleccionado;
	}

	public void setHallazgoSeleccionado(Hallazgo hallazgoSeleccionado) {
		this.hallazgoSeleccionado = hallazgoSeleccionado;
	}

	public String getTipoDenticion() {
		return tipoDenticion;
	}

	public void setTipoDenticion(String tipoDenticion) {
		this.tipoDenticion = tipoDenticion;
	}

	public Date getFechaCreacion() {
		return fechaCreacion;
	}

	public void setFechaCreacion(Date fechaCreacion) {
		this.fechaCreacion = fechaCreacion;
	}

	public int getTotalHallazgos() {
		return hallazgos != null ? hallazgos.size() : 0;
	}
}