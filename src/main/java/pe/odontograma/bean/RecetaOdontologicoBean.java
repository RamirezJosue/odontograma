package pe.odontograma.bean;

import pe.odontograma.model.Diagnostico;
import pe.odontograma.model.Receta;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.ViewScoped;
import javax.faces.event.AjaxBehaviorEvent;

@ManagedBean(name = "recetaOdontologicoBean")
@ViewScoped
public class RecetaOdontologicoBean implements Serializable {

    private static final long serialVersionUID = 1L;

    private List<Diagnostico> diagnosticos;
    private List<Receta> recetas;
    private String medicamentoSeleccionado;

    // TODO: cargar desde BD
    private List<String> medicamentosDisponibles;

    public RecetaOdontologicoBean() {
        diagnosticos = new ArrayList<>();
        diagnosticos.add(new Diagnostico(1, "K02.0", "Caries de la dentina"));
        diagnosticos.add(new Diagnostico(2, "K04.0", "Pulpitis"));

        recetas = new ArrayList<>();
        recetas.add(new Receta("DICLOXACILINA", "TAB", 15, 5, "Tomar 1 tableta cada 8 horas por 5 días."));

        medicamentosDisponibles = new ArrayList<>();
        medicamentosDisponibles.add("AMOXICILINA 500mg");
        medicamentosDisponibles.add("DICLOXACILINA 500mg");
        medicamentosDisponibles.add("IBUPROFENO 400mg");
        medicamentosDisponibles.add("PARACETAMOL 500mg");
        medicamentosDisponibles.add("CLORHEXIDINA 0.12%");
        medicamentosDisponibles.add("METRONIDAZOL 500mg");
    }

    public void agregarMedicamento(AjaxBehaviorEvent event) {
        if (medicamentoSeleccionado != null && !medicamentoSeleccionado.isEmpty()) {
            recetas.add(new Receta(medicamentoSeleccionado, "TAB", 1, 1, ""));
            medicamentoSeleccionado = null;
        }
    }

    public void agregarOtroMedicamento() {
        recetas.add(new Receta("", "TAB", 1, 1, ""));
    }

    public void eliminarReceta(Receta r) {
        recetas.remove(r);
    }

    public void registrarReceta() {
        // TODO: persistir en BD
        System.out.println("=== Registrando receta con " + recetas.size() + " medicamentos ===");
    }

    public List<Diagnostico> getDiagnosticos() {
        return diagnosticos;
    }

    public void setDiagnosticos(List<Diagnostico> diagnosticos) {
        this.diagnosticos = diagnosticos;
    }

    public List<Receta> getRecetas() {
        return recetas;
    }

    public void setRecetas(List<Receta> recetas) {
        this.recetas = recetas;
    }

    public String getMedicamentoSeleccionado() {
        return medicamentoSeleccionado;
    }

    public void setMedicamentoSeleccionado(String m) {
        this.medicamentoSeleccionado = m;
    }

    public List<String> getMedicamentosDisponibles() {
        return medicamentosDisponibles;
    }
}
