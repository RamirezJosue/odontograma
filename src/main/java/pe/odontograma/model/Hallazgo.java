package pe.odontograma.model;

import java.io.Serializable;

public class Hallazgo implements Serializable {

	private static final long serialVersionUID = 1L;

	private String piezaDental;
	private String tipo; // "caries", "restauracion", "implante", ...
	private String descripcion; // código: "CE", "AM", "IMP", ...
	private String superficies; // "M,D,O" o "—"
	private int cantidad;
	private String nota;

	// Constructor vacío
	public Hallazgo() {
	}

	// Constructor básico (compatible con código existente)
	public Hallazgo(String piezaDental, String descripcion, int cantidad, String nota) {
		this.piezaDental = piezaDental;
		this.descripcion = descripcion;
		this.cantidad = cantidad;
		this.nota = nota;
		this.superficies = "—";
	}

	// Constructor completo (nuevo)
	public Hallazgo(String piezaDental, String tipo, String descripcion, String superficies, int cantidad,
			String nota) {
		this.piezaDental = piezaDental;
		this.tipo = tipo;
		this.descripcion = descripcion;
		this.superficies = superficies;
		this.cantidad = cantidad;
		this.nota = nota;
	}

	// Getters y Setters
	public String getPiezaDental() {
		return piezaDental;
	}

	public void setPiezaDental(String p) {
		this.piezaDental = p;
	}

	public String getTipo() {
		return tipo;
	}

	public void setTipo(String t) {
		this.tipo = t;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String d) {
		this.descripcion = d;
	}

	public String getSuperficies() {
		return superficies != null ? superficies : "—";
	}

	public void setSuperficies(String s) {
		this.superficies = s;
	}

	public int getCantidad() {
		return cantidad;
	}

	public void setCantidad(int c) {
		this.cantidad = c;
	}

	public String getNota() {
		return nota;
	}

	public void setNota(String n) {
		this.nota = n;
	}
}