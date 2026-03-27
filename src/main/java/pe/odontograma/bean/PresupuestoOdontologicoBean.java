package pe.odontograma.bean;

import pe.odontograma.model.Diagnostico;
import pe.odontograma.model.PresupuestoItem;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.ViewScoped;
import javax.faces.event.AjaxBehaviorEvent;

@ManagedBean(name = "presupuestoOdontologicoBean")
@ViewScoped
public class PresupuestoOdontologicoBean implements Serializable {

    private static final long serialVersionUID = 1L;

    private List<Diagnostico>    diagnosticos;
    private List<PresupuestoItem> items;
    private String servicioSeleccionado;
    private Date   fechaValidaHasta;
    private boolean aplicarIGV;

    // TODO: cargar desde BD
    private List<String> serviciosDisponibles;

    public PresupuestoOdontologicoBean() {
        // Diagnósticos de ejemplo
        diagnosticos = new ArrayList<>();
        diagnosticos.add(new Diagnostico(1, "K02.0", "Caries de la dentina"));

        // Fecha válida por defecto: hoy + 30 días
        fechaValidaHasta = new Date(System.currentTimeMillis() + 30L * 24 * 60 * 60 * 1000);

        // Ítems de presupuesto de ejemplo
        items = new ArrayList<>();
        items.add(new PresupuestoItem("16", "Caries",                      2, 200, 20));
        items.add(new PresupuestoItem("21", "Caries",                      1, 100,  0));
        items.add(new PresupuestoItem("47", "Diente ausente por otra razón", 1, 150, 50));

        // Servicios disponibles
        serviciosDisponibles = new ArrayList<>();
        serviciosDisponibles.add("Extracción Simple");
        serviciosDisponibles.add("Extracción Quirúrgica");
        serviciosDisponibles.add("Restauración con Resina");
        serviciosDisponibles.add("Endodoncia Unirradicular");
        serviciosDisponibles.add("Endodoncia Birradicular");
        serviciosDisponibles.add("Limpieza Dental");
        serviciosDisponibles.add("Implante Dental");
        serviciosDisponibles.add("Prótesis Parcial Fija");
        serviciosDisponibles.add("Prótesis Parcial Removible");
    }

    public void agregarServicio(AjaxBehaviorEvent event) {
        if (servicioSeleccionado != null && !servicioSeleccionado.isEmpty()) {
            items.add(new PresupuestoItem("", servicioSeleccionado, 1, 0, 0));
            servicioSeleccionado = null;
        }
    }

    public void agregarOtroServicio() {
        items.add(new PresupuestoItem("", "", 1, 0, 0));
    }

    public void eliminarItem(PresupuestoItem item) {
        items.remove(item);
    }

    public void registrarPresupuesto() {
        // TODO: persistir en BD
        System.out.println("=== Registrando presupuesto: S/ " + getSaldoTotal() + " ===");
    }

    public double getSubtotal() {
        if (items == null) return 0;
        double total = 0;
        for (PresupuestoItem i : items) total += i.getPrecioFinal();
        return total;
    }

    public double getIgvMonto() {
        return aplicarIGV ? getSubtotal() * 0.18 : 0;
    }

    public double getSaldoTotal() {
        return getSubtotal() + getIgvMonto();
    }

    public List<Diagnostico> getDiagnosticos()    { return diagnosticos; }
    public void setDiagnosticos(List<Diagnostico> d) { this.diagnosticos = d; }

    public List<PresupuestoItem> getItems()        { return items; }
    public void setItems(List<PresupuestoItem> i)  { this.items = i; }

    public String getServicioSeleccionado()        { return servicioSeleccionado; }
    public void setServicioSeleccionado(String s)  { this.servicioSeleccionado = s; }

    public Date getFechaValidaHasta()              { return fechaValidaHasta; }
    public void setFechaValidaHasta(Date f)        { this.fechaValidaHasta = f; }

    public boolean isAplicarIGV()                  { return aplicarIGV; }
    public void setAplicarIGV(boolean a)           { this.aplicarIGV = a; }

    public List<String> getServiciosDisponibles()  { return serviciosDisponibles; }
}
