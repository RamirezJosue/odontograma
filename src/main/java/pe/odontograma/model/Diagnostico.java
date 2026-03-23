package pe.odontograma.model;

import java.io.Serializable;

public class Diagnostico implements Serializable {
    private static final long serialVersionUID = 1L;

    private int numero;
    private String cie10;
    private String descripcion;
    private String detalle;

    public Diagnostico() {
    }

    public Diagnostico(int numero, String cie10, String descripcion) {
        this.numero = numero;
        this.cie10 = cie10;
        this.descripcion = descripcion;
        this.detalle = "";
    }

    public int getNumero() {
        return numero;
    }

    public void setNumero(int n) {
        this.numero = n;
    }

    public String getCie10() {
        return cie10;
    }

    public void setCie10(String c) {
        this.cie10 = c;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String d) {
        this.descripcion = d;
    }

    public String getDetalle() {
        return detalle;
    }

    public void setDetalle(String d) {
        this.detalle = d;
    }
}