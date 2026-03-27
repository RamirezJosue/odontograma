package pe.odontograma.bean;

import pe.odontograma.model.Hallazgo;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.ViewScoped;

import org.primefaces.PrimeFaces;
import org.primefaces.event.RowEditEvent;

import javax.annotation.PostConstruct;

@ManagedBean(name = "odontogramaEvolucionBean")
@ViewScoped
public class OdontogramaEvolucionBean implements Serializable {

    private static final long serialVersionUID = 1L;

    private List<Hallazgo> hallazgosEvo;

    @PostConstruct
    public void init() {
        hallazgosEvo = new ArrayList<>();

        Hallazgo hIMP = new Hallazgo("16", "Implante Dental",            "IMP", "—", 1, "");
        hIMP.setEstado("No Aplica");
        hallazgosEvo.add(hIMP);

        Hallazgo hAM = new Hallazgo("24", "Amalgama Dental",            "AM",  "—", 4, "");
        hAM.setEstado("No Aplica");
        hallazgosEvo.add(hAM);

        Hallazgo hDEX = new Hallazgo("14", "Diente Extraído por Caries", "DEX", "—", 1, "");
        hDEX.setEstado("No Aplica");
        hallazgosEvo.add(hDEX);

        Hallazgo hCDP = new Hallazgo("11", "Caries a Nivel de la Pulpa", "CDP", "—", 2, "");
        hCDP.setEstado("Pendiente");
        hallazgosEvo.add(hCDP);

        Hallazgo hLinea = new Hallazgo("33-36", "Prótesis Parcial Fija", "PPF", "33-36", 1, "");
        hLinea.setEstado("Pendiente");
        hallazgosEvo.add(hLinea);

        Hallazgo hPPR = new Hallazgo("42-48", "Prótesis Parcial Removible", "PPR", "42-48", 1, "");
        hPPR.setEstado("Pendiente");
        hallazgosEvo.add(hPPR);

        System.out.println("=== OdontogramaEvolucionBean inicializado con DATA FAKE ===");
    }

    public String darDeAlta() {
        System.out.println("=== Dar de Alta ejecutado ===");
        return null;
    }

    public void eliminarHallazgoEvo(Hallazgo h) {
        hallazgosEvo.remove(h);
    }

    public String adicionarHallazgoEvo() {
        hallazgosEvo.add(new Hallazgo());
        return null;
    }

    public void onRowEdit(RowEditEvent<Hallazgo> event) {
        Hallazgo h = event.getObject();
        System.out.println("Fila evolución editada: " + h.getPiezaDental());
        PrimeFaces.current().executeScript(
            "repintarDiente('" + h.getPiezaDental() + "','" + h.getCodigo() + "','" + h.getEstado() + "')"
        );
    }

    public void onRowCancel(RowEditEvent<Hallazgo> event) {
        System.out.println("Edición evolución cancelada");
    }

    // GETTERS & SETTERS

    public List<Hallazgo> getHallazgosEvo() {
        return hallazgosEvo;
    }

    public void setHallazgosEvo(List<Hallazgo> hallazgosEvo) {
        this.hallazgosEvo = hallazgosEvo;
    }

    public int getTotalHallazgosEvo() {
        if (hallazgosEvo == null) return 0;
        int total = 0;
        for (Hallazgo h : hallazgosEvo) {
            if ("Pendiente".equals(h.getEstado())) {
                total += h.getCantidad();
            }
        }
        return total;
    }
}