package pe.odontograma.model;

import java.io.Serializable;

public class Hallazgo implements Serializable {

	private static final long serialVersionUID = 1L;

	private String piezaDental;
	private String hallazgo; // "caries", "restauracion", "implante", ...
	private String codigo; // código: "CE", "AM", "IMP", ...
	private String numDientes; // "1 O 2"
	private int cantidad;
	private String nota;

	public Hallazgo() {
	}

	public Hallazgo(String piezaDental, String codigo, int cantidad, String nota) {
		this.piezaDental = piezaDental;
		this.codigo = codigo;
		this.cantidad = cantidad;
		this.nota = nota;
		this.numDientes = "—";
	}

	public Hallazgo(String piezaDental, String hallazgo, String codigo, String numDientes, int cantidad, String nota) {
		this.piezaDental = piezaDental;
		this.hallazgo = hallazgo;
		this.codigo = codigo;
		this.numDientes = numDientes;
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

	public String getHallazgo() {
		return hallazgo;
	}

	public void setHallazgo(String h) {
		this.hallazgo = h;
	}

	public String getCodigo() {
		return codigo;
	}

	public void setCodigo(String c) {
		this.codigo = c;
	}

	public String getNumDientes() {
		return numDientes != null ? numDientes : "—";
	}

	public void setNumDientes(String n) {
		this.numDientes = n;
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