package pe.odontograma.model;

import java.io.Serializable;

public class Hallazgo implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    private String piezaDental;
    private String descripcion;
    private Integer cantidad;
    private String nota;
    
    // Constructor vacío
    public Hallazgo() {
        this.cantidad = 1;
    }
    
    // Constructor con parámetros
    public Hallazgo(String piezaDental, String descripcion, Integer cantidad, String nota) {
        this.piezaDental = piezaDental;
        this.descripcion = descripcion;
        this.cantidad = cantidad;
        this.nota = nota;
    }

	public String getPiezaDental() {
		return piezaDental;
	}

	public void setPiezaDental(String piezaDental) {
		this.piezaDental = piezaDental;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public Integer getCantidad() {
		return cantidad;
	}

	public void setCantidad(Integer cantidad) {
		this.cantidad = cantidad;
	}

	public String getNota() {
		return nota;
	}

	public void setNota(String nota) {
		this.nota = nota;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}
    
    // Getters y Setters...
    
    
}