package pe.odontograma.bean;

import pe.odontograma.model.Hallazgo;
import java.io.Serializable;
import java.util.List;
import java.util.ArrayList;
import java.util.Date;

import javax.annotation.PostConstruct;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.ViewScoped;

@ManagedBean
@ViewScoped
public class OdontogramaBean implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    private List<Hallazgo> hallazgos;
    private Hallazgo hallazgoSeleccionado;
    private String tipoDenticion = "permanente";
    private Date fechaCreacion = new Date();
    
    @PostConstruct
    public void init() {
        hallazgos = new ArrayList<>();
        // Agregar datos de ejemplo
        hallazgos.add(new Hallazgo("18", "Caries", 1, "Caries profunda"));
        hallazgos.add(new Hallazgo("16", "Restauración", 2, "Amalgama"));
    }
    
    public void adicionarHallazgo() {
        if (hallazgos == null) {
            hallazgos = new ArrayList<>();
        }
        hallazgos.add(new Hallazgo());
    }
    
    public void eliminarHallazgo(Hallazgo hallazgo) {
        if (hallazgos != null && hallazgo != null) {
            hallazgos.remove(hallazgo);
        }
    }
    
    public int getTotalHallazgos() {
        return hallazgos != null ? hallazgos.size() : 0;
    }
    
    // Getters y Setters
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
}