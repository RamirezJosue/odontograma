package pe.odontograma.model;

import java.io.Serializable;

public class ExamenLaboratorio implements Serializable {

    private static final long serialVersionUID = 1L;

    private String examen;
    private String indicaciones;

    public ExamenLaboratorio() {
    }

    public ExamenLaboratorio(String examen, String indicaciones) {
        this.examen = examen;
        this.indicaciones = indicaciones;
    }

    public String getExamen() {
        return examen;
    }

    public void setExamen(String e) {
        this.examen = e;
    }

    public String getIndicaciones() {
        return indicaciones;
    }

    public void setIndicaciones(String i) {
        this.indicaciones = i;
    }
}
