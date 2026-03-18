package pe.odontograma.model;

import java.io.Serializable;
import java.util.Date;

public class Paciente implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    private String apellidosNombres;
    private String documento;
    private Date fechaNacimiento;
    private String genero;
    private String correo;
    private String celular;
    private String sucursal;
    private Date fechaAdmision;
    
    public Paciente() {
    }
    
    public Paciente(String apellidosNombres, String documento) {
        this.apellidosNombres = apellidosNombres;
        this.documento = documento;
    }
    
    public String getApellidosNombres() {
        return apellidosNombres;
    }
    
    public void setApellidosNombres(String apellidosNombres) {
        this.apellidosNombres = apellidosNombres;
    }
    
    public String getDocumento() {
        return documento;
    }
    
    public void setDocumento(String documento) {
        this.documento = documento;
    }
    
    public Date getFechaNacimiento() {
        return fechaNacimiento;
    }
    
    public void setFechaNacimiento(Date fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }
    
    public String getGenero() {
        return genero;
    }
    
    public void setGenero(String genero) {
        this.genero = genero;
    }
    
    public String getCorreo() {
        return correo;
    }
    
    public void setCorreo(String correo) {
        this.correo = correo;
    }
    
    public String getCelular() {
        return celular;
    }
    
    public void setCelular(String celular) {
        this.celular = celular;
    }
    
    public String getSucursal() {
        return sucursal;
    }
    
    public void setSucursal(String sucursal) {
        this.sucursal = sucursal;
    }
    
    public Date getFechaAdmision() {
        return fechaAdmision;
    }
    
    public void setFechaAdmision(Date fechaAdmision) {
        this.fechaAdmision = fechaAdmision;
    }
}