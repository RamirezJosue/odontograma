package pe.odontograma.bean;

import pe.odontograma.model.Hallazgo;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.ViewScoped;

@ManagedBean(name = "altaOdontologicoBean")
@ViewScoped
public class AltaOdontologicoBean implements Serializable {

    private static final long serialVersionUID = 1L;

    // TODO: reemplazar con datos reales desde BD
    private Date    fechaAlta;
    private String  profesional;
    private String  estadoAtencion;

    private List<Hallazgo> hallazgosAlta;

    public AltaOdontologicoBean() {
        // Datos de cabecera
        fechaAlta      = new Date();
        profesional    = "Dra. Soto Valencia Irene";
        estadoAtencion = "Finalizada";

        hallazgosAlta = new ArrayList<>();

        // TODO: reemplazar con consulta a BD
        Hallazgo hIMP = new Hallazgo("16", "Implante Dental", "IMP", "—", 1, "");
        hIMP.setEstado("No Aplica");
        hallazgosAlta.add(hIMP);

        Hallazgo hAM = new Hallazgo("24", "Amalgama Dental", "AM", "—", 4, "");
        hAM.setEstado("No Aplica");
        hallazgosAlta.add(hAM);

        Hallazgo hDEX = new Hallazgo("14", "Diente Extraído por Caries", "DEX", "—", 1, "");
        hDEX.setEstado("No Aplica");
        hallazgosAlta.add(hDEX);

        Hallazgo hCDP = new Hallazgo("11", "Caries a Nivel de la Pulpa", "CDP", "—", 2, "");
        hCDP.setEstado("Atendido");
        hallazgosAlta.add(hCDP);

        Hallazgo hPPF = new Hallazgo("33-36", "Prótesis Parcial Fija", "PPF", "33-36", 1, "");
        hPPF.setEstado("Atendido");
        hallazgosAlta.add(hPPF);

        Hallazgo hPPR = new Hallazgo("42-48", "Prótesis Parcial Removible", "PPR", "42-48", 1, "");
        hPPR.setEstado("Atendido");
        hallazgosAlta.add(hPPR);
    }

    public int getTotalHallazgos() {
        if (hallazgosAlta == null) return 0;
        int total = 0;
        for (Hallazgo h : hallazgosAlta) {
            if ("Atendido".equals(h.getEstado())) {
                total += h.getCantidad();
            }
        }
        return total;
    }

    public List<Hallazgo> getHallazgosAlta() {
        return hallazgosAlta;
    }

    public void setHallazgosAlta(List<Hallazgo> hallazgosAlta) {
        this.hallazgosAlta = hallazgosAlta;
    }

    public Date getFechaAlta() { return fechaAlta; }
    public void setFechaAlta(Date fechaAlta) { this.fechaAlta = fechaAlta; }

    public String getProfesional() { return profesional; }
    public void setProfesional(String profesional) { this.profesional = profesional; }

    public String getEstadoAtencion() { return estadoAtencion; }
    public void setEstadoAtencion(String estadoAtencion) { this.estadoAtencion = estadoAtencion; }
}
