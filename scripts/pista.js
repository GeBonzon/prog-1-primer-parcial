class Pista {
    constructor(nombre, duracion) {
        this.nombre = nombre;
        this.duracion = duracion;
    }

    getDuracionFormateada() {
        const minutos = Math.floor(this.duracion / 60);
        const segundos = this.duracion % 60;
        return `${minutos}:${segundos < 10 ? '0' + segundos : segundos}`;
    }
}