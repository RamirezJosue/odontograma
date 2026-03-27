package pe.odontograma.bean;

import pe.odontograma.model.Diagnostico;
import pe.odontograma.model.ExamenLaboratorio;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.ViewScoped;
import javax.faces.event.AjaxBehaviorEvent;

@ManagedBean(name = "examenLaboratorioBean")
@ViewScoped
public class ExamenLaboratorioOdontogramaBean implements Serializable {

    private static final long serialVersionUID = 1L;

    private List<Diagnostico> diagnosticos;
    private List<ExamenLaboratorio> examenes;
    private String examenSeleccionado;

    // TODO: cargar desde BD
    private List<String> examenesDisponibles;

    public ExamenLaboratorioOdontogramaBean() {
        diagnosticos = new ArrayList<>();
        diagnosticos.add(new Diagnostico(1, "K02.0", "Caries de la dentina"));
        diagnosticos.add(new Diagnostico(2, "K04.0", "Pulpitis"));

        examenes = new ArrayList<>();
        examenes.add(new ExamenLaboratorio("HEMOGRAMA COMPLETO", ""));

        examenesDisponibles = new ArrayList<>();
        examenesDisponibles.add("HEMOGRAMA COMPLETO");
        examenesDisponibles.add("GLUCOSA EN SANGRE");
        examenesDisponibles.add("TIEMPO DE COAGULACIÓN");
        examenesDisponibles.add("TIEMPO DE SANGRÍA");
        examenesDisponibles.add("PERFIL DE COAGULACIÓN");
        examenesDisponibles.add("GRUPO SANGUÍNEO Y FACTOR RH");
        examenesDisponibles.add("VIH (ELISA)");
        examenesDisponibles.add("HEPATITIS B (HBsAg)");
    }

    public void agregarExamen(AjaxBehaviorEvent event) {
        if (examenSeleccionado != null && !examenSeleccionado.isEmpty()) {
            examenes.add(new ExamenLaboratorio(examenSeleccionado, ""));
            examenSeleccionado = null;
        }
    }

    public void agregarOtroExamen() {
        examenes.add(new ExamenLaboratorio("", ""));
    }

    public void eliminarExamen(ExamenLaboratorio e) {
        examenes.remove(e);
    }

    public void registrarExamen() {
        // TODO: persistir en BD
        System.out.println("=== Registrando " + examenes.size() + " exámenes ===");
    }

    public List<Diagnostico> getDiagnosticos() {
        return diagnosticos;
    }

    public void setDiagnosticos(List<Diagnostico> diagnosticos) {
        this.diagnosticos = diagnosticos;
    }

    public List<ExamenLaboratorio> getExamenes() {
        return examenes;
    }

    public void setExamenes(List<ExamenLaboratorio> examenes) {
        this.examenes = examenes;
    }

    public String getExamenSeleccionado() {
        return examenSeleccionado;
    }

    public void setExamenSeleccionado(String e) {
        this.examenSeleccionado = e;
    }

    public List<String> getExamenesDisponibles() {
        return examenesDisponibles;
    }
}
