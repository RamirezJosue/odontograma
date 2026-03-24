package pe.odontograma.bean;

import pe.odontograma.model.Hallazgo;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.ViewScoped;

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

        Hallazgo e1 = new Hallazgo();
        e1.setPiezaDental("11");
        e1.setHallazgo("Control");
        e1.setCodigo("EV1");
        e1.setNumDientes("1");
        e1.setCantidad(1);
        e1.setNota("Seguimiento de caries");

        hallazgosEvo.add(e1);

        System.out.println("=== OdontogramaEvolucionBean inicializado con DATA FAKE ===");
    }

    public void eliminarHallazgoEvo(Hallazgo h) {
        hallazgosEvo.remove(h);
    }

    public String adicionarHallazgoEvo() {
        hallazgosEvo.add(new Hallazgo());
        return null;
    }

    public void onRowEdit(RowEditEvent<Hallazgo> event) {
        System.out.println("Fila evolución editada: " + event.getObject().getPiezaDental());
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
        return hallazgosEvo != null ? hallazgosEvo.size() : 0;
    }
}