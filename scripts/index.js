let discos = [];

function cargar() {
    const nombre = prompt("Nombre del disco:");
    if (!nombre) {
        alert("El nombre del disco no puede quedar vacío.");
        return;
    }

    const autor = prompt("Autor o banda del disco:");
    if (!autor) {
        alert("El autor no puede quedar vacío.");
        return;
    }

    const portada = prompt("URL de la portada (opcional):");
    
    let codigo;
    while (true) {
        codigo = parseInt(prompt("Código numérico único (1-999):"));
        
        if (isNaN(codigo) || codigo < 1 || codigo > 999) {
            alert("El código debe ser un número entre 1 y 999.");
            continue;
        }
        
        if (discos.some(d => d.codigo === codigo)) {
            alert("Este código ya está en uso. Por favor ingrese otro.");
            continue;
        }
        
        break;
    }

    const disco = new Disco(nombre, autor, portada, codigo);

    let cargarMasPistas = true;
    while (cargarMasPistas) {
        const nombrePista = prompt("Nombre de la pista:");
        if (!nombrePista) {
            alert("El nombre de la pista no puede quedar vacío.");
            continue;
        }

        let duracionPista;
        while (true) {
            duracionPista = parseInt(prompt("Duración en segundos (0-7200):"));
            if (isNaN(duracionPista)) {
                alert("La duración debe ser un número.");
                continue;
            }
            if (duracionPista < 0 || duracionPista > 7200) {
                alert("La duración debe estar entre 0 y 7200 segundos.");
                continue;
            }
            break;
        }

        disco.agregarPista(new Pista(nombrePista, duracionPista));
        cargarMasPistas = confirm("¿Querés agregar otra pista?");
    }

    discos.push(disco);
    alert("Disco agregado correctamente!");
}

function mostrar(orden = null) {
    const contenedor = document.getElementById("discos-container");
    const ordenarBotones = document.getElementById("ordenar-botones");
    
    
    ordenarBotones.style.display = "flex";
    contenedor.innerHTML = "";

    if (discos.length === 0) {
        contenedor.innerHTML = "<p>No hay discos cargados.</p>";
        ordenarBotones.style.display = "none";
        return;
    }

    let discosMostrados = [...discos];
    if (orden === 'ordenCodigo') {
        discosMostrados.sort((a, b) => a.codigo - b.codigo);
    } else if (orden === 'ordenArtista') {
        discosMostrados.sort((a, b) => a.autor.localeCompare(b.autor));
    }

    const totalPistas = discosMostrados.reduce((total, disco) => total + disco.getTotalPistas(), 0);
    const duracionTotal = discosMostrados.reduce((total, disco) => total + disco.getDuracionTotal(), 0);
    const discoAux = new Disco("", "", "", 0);
    const duracionFormateada = discoAux.getDuracionTotalFormateada(duracionTotal);

    const resumenHTML = `
        <div class="resumen">
            <h3>Resumen de la colección</h3>
                <p><i class="fas fa-record-vinyl"></i> <strong>Total de discos:</strong> ${discos.length}</p>
                <p><i class="fas fa-music"></i> <strong>Total de pistas:</strong> ${totalPistas}</p>
                <p><i class="fas fa-clock"></i> <strong>Duración total:</strong> ${duracionFormateada}</p>
                ${orden ? `<p><i class="fas fa-sort"></i> <strong>Ordenado por:</strong> ${orden === 'ordenCodigo' ? 'Código' : 'Artista'}</p>` : ''}
        </div>
    <hr>
    `;
    document.getElementById("resumen-container").innerHTML = resumenHTML;

    const maxDuracion = Math.max(...discosMostrados.map(d => d.getDuracionTotal()));

    discosMostrados.forEach(disco => {
        const discoElement = document.createElement("div");
        discoElement.className = "disco";

        let portadaHTML = "";
        if (disco.portada) {
            portadaHTML = `<img src="${disco.portada}" alt="Portada" class="portada">`;
        }

        discoElement.innerHTML = `
            <div class="disco-header">
                ${portadaHTML}
                <div>
                    <h3>${disco.nombre}</h3>
                    <p>${disco.autor} | Código: ${disco.codigo}</p>
                </div>
            </div>
            <ol>
                ${disco.pistas.map(pista => `
                    <li class="pista ${pista.duracion > 180 ? 'destacado' : ''}">
                    ${pista.nombre} - ${pista.getDuracionFormateada()}
                    </li>
                `).join("")}
            </ol>
            <div class="metrics">
                <div class="metric">Número de pistas: ${disco.getTotalPistas()}</div>
                <div class="metric">Duración total del disco: ${disco.getDuracionTotalFormateada()}</div>
                <div class="metric">Duración de pista promedio: ${disco.getDuracionPromedioFormateada()}</div>
                <div class="metric">Pista más larga: ${disco.getPistaMasLarga().nombre} (${disco.getPistaMasLarga().getDuracionFormateada()})</div>
                ${disco.getDuracionTotal() === maxDuracion ? '<div class="metric destacado">★ Disco más largo de la colección ★</div>' : ''}
            </div>
        `;
        contenedor.appendChild(discoElement);
    });
}

function buscarPorCodigo() {
    const ordenarBotones = document.getElementById("ordenar-botones");
    ordenarBotones.style.display = "none";

    const codigoInput = document.getElementById("codigo-busqueda");
    const codigo = parseInt(codigoInput.value);

    if (isNaN(codigo)) {
        alert("Por favor ingrese un código numérico válido.");
        return;
    }

    const disco = discos.find(d => d.codigo === codigo);

    if (!disco) {
        alert(`No se encontró un disco con el código ${codigo}`);
        return;
    }

    const contenedor = document.getElementById("discos-container");
    contenedor.innerHTML = "";

    const discoElement = document.createElement("div");
    discoElement.className = "disco";

    let portadaHTML = "";
    if (disco.portada) {
        portadaHTML = `<img src="${disco.portada}" alt="Portada" class="portada">`;
    }

    discoElement.innerHTML = `
        <div class="disco-header">
            ${portadaHTML}
            <div>
                <h3>${disco.nombre}</h3>
                <p>${disco.autor} | Código: ${disco.codigo}</p>
            </div>
        </div>
        <ul>
            ${disco.pistas.map(pista => `
                <li class="pista ${pista.duracion > 180 ? 'destacado' : ''}">
                    ${pista.nombre} - ${pista.getDuracionFormateada()}
                </li>
            `).join("")}
        </ul>
        <div class="metrics">
            <div class="metric">Total pistas: ${disco.getTotalPistas()}</div>
            <div class="metric">Duración total: ${disco.getDuracionTotalFormateada()}</div>
            <div class="metric">Duración promedio: ${disco.getDuracionPromedioFormateada()}</div>
            <div class="metric">Pista más larga: ${disco.getPistaMasLarga().nombre} (${disco.getPistaMasLarga().getDuracionFormateada()})</div>
        </div>
    `;

    contenedor.appendChild(discoElement);
}

fetch('discos.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(d => {
            const disco = new Disco(d.nombre, d.autor, d.portada, d.codigo);
            d.pistas.forEach(p => {
                disco.agregarPista(new Pista(p.nombre, p.duracion));
            });
            discos.push(disco);
        });
    })
    .catch(error => console.log("No se pudo cargar discos.json", error));