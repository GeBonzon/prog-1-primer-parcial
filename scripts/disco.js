class Disco {
    constructor(nombre, autor, portada, codigo) {
        this.nombre = nombre;
        this.autor = autor;
        this.portada = portada;
        this.codigo = codigo;
        this.pistas = [];
    }

    agregarPista(pista) {
        this.pistas.push(pista);
    }

    getTotalPistas() {
        return this.pistas.length;
    }

    getDuracionTotal() {
        return this.pistas.reduce((total, pista) => total + pista.duracion, 0);
    }

    getDuracionPromedio() {
        return this.getDuracionTotal() / this.getTotalPistas();
    }

    getPistaMasLarga() {
        return this.pistas.reduce((a, b) => a.duracion > b.duracion ? a : b);
    }

    getDuracionTotalFormateada(totalSegundos = null) {
        const total = totalSegundos !== null ? totalSegundos : this.getDuracionTotal();
        const horas = Math.floor(total / 3600);
        const minutos = Math.floor((total % 3600) / 60);
        const segundos = Math.floor(total % 60);
        return `${horas}:${minutos < 10 ? '0' + minutos : minutos}:${segundos < 10 ? '0' + segundos : segundos}`;
    }

    getDuracionPromedioFormateada() {
        const promedio = this.getDuracionPromedio();
        const horas = Math.floor(promedio / 3600);
        const minutos = Math.floor((promedio % 3600) / 60);
        const segundos = Math.floor(promedio % 60);
        return `${horas}:${minutos < 10 ? '0' + minutos : minutos}:${segundos < 10 ? '0' + segundos : segundos}`;
    }
}