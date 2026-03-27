package pe.odontograma.model;

import java.io.Serializable;

public class Receta implements Serializable {

    private static final long serialVersionUID = 1L;

    private String medicamento;
    private String ff;
    private int cantidad;
    private int duracion;
    private String indicaciones;

    public Receta() {
    }

    public Receta(String medicamento, String ff, int cantidad, int duracion, String indicaciones) {
        this.medicamento = medicamento;
        this.ff = ff;
        this.cantidad = cantidad;
        this.duracion = duracion;
        this.indicaciones = indicaciones;
    }

    public String getMedicamento() {
        return medicamento;
    }

    public void setMedicamento(String medicamento) {
        this.medicamento = medicamento;
    }

    public String getFf() {
        return ff;
    }

    public void setFf(String ff) {
        this.ff = ff;
    }

    public int getCantidad() {
        return cantidad;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }

    public int getDuracion() {
        return duracion;
    }

    public void setDuracion(int duracion) {
        this.duracion = duracion;
    }

    public String getIndicaciones() {
        return indicaciones;
    }

    public void setIndicaciones(String indicaciones) {
        this.indicaciones = indicaciones;
    }
}
