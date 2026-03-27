package pe.odontograma.model;

import java.io.Serializable;

public class PresupuestoItem implements Serializable {

    private static final long serialVersionUID = 1L;

    private String piezaDental;
    private String hallazgo;
    private int    cantidad;
    private double precioRegular;
    private double descuento;
    private double precioFinal;

    public PresupuestoItem() {}

    public PresupuestoItem(String piezaDental, String hallazgo, int cantidad,
                           double precioRegular, double descuento) {
        this.piezaDental  = piezaDental;
        this.hallazgo     = hallazgo;
        this.cantidad     = cantidad;
        this.precioRegular = precioRegular;
        this.descuento    = descuento;
        this.precioFinal  = (precioRegular * cantidad) - descuento;
    }

    public String getPiezaDental()  { return piezaDental; }
    public void setPiezaDental(String p) { this.piezaDental = p; }

    public String getHallazgo()     { return hallazgo; }
    public void setHallazgo(String h) { this.hallazgo = h; }

    public int getCantidad()        { return cantidad; }
    public void setCantidad(int c)  { this.cantidad = c; }

    public double getPrecioRegular()       { return precioRegular; }
    public void setPrecioRegular(double p) { this.precioRegular = p; }

    public double getDescuento()           { return descuento; }
    public void setDescuento(double d)     { this.descuento = d; }

    public double getPrecioFinal()         { return precioFinal; }
    public void setPrecioFinal(double p)   { this.precioFinal = p; }
}
