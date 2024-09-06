const estadoObjetivo = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 0]
];

let estadoInicial = [
    [1, 5, 2],
    [0, 3, 6],
    [7, 8, 4]
];

// Función que verifica si el estado actual es el objetivo
function esObjetivo(estado) {
    return JSON.stringify(estado) === JSON.stringify(estadoObjetivo);
}

// Encuentra la posición del espacio vacío (0)
function encontrarCero(estado) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (estado[i][j] === 0) {
                return [i, j];
            }
        }
    }
}

// Genera estados vecinos moviendo el espacio vacío
function obtenerVecinos(estado) {
    const vecinos = [];
    const [filaCero, colCero] = encontrarCero(estado);
    const direcciones = [
        [0, 1], [1, 0], [0, -1], [-1, 0]
    ];

    direcciones.forEach(([dFila, dCol]) => {
        const nuevaFila = filaCero + dFila;
        const nuevaCol = colCero + dCol;
        if (nuevaFila >= 0 && nuevaFila < 3 && nuevaCol >= 0 && nuevaCol < 3) {
            const nuevoEstado = estado.map(fila => fila.slice());
            [nuevoEstado[filaCero][colCero], nuevoEstado[nuevaFila][nuevaCol]] = 
            [nuevoEstado[nuevaFila][nuevaCol], nuevoEstado[filaCero][colCero]];
            vecinos.push(nuevoEstado);
        }
    });

    return vecinos;
}

// Resuelve el puzzle utilizando búsqueda en anchura
function resolverPuzzle() {
    const cola = [{ estado: estadoInicial, movimientos: [] }];
    const explorados = new Set();

    while (cola.length > 0) {
        const { estado, movimientos } = cola.shift();

        if (esObjetivo(estado)) {
            console.log("¡Solución encontrada!");
            mostrarCaminoEnConsola(movimientos);
            renderizarSolucion(movimientos);
            return;
        }

        explorados.add(JSON.stringify(estado));
        const vecinos = obtenerVecinos(estado);

        vecinos.forEach(vecino => {
            if (!explorados.has(JSON.stringify(vecino))) {
                cola.push({ estado: vecino, movimientos: [...movimientos, vecino] });
                explorados.add(JSON.stringify(vecino));
            }
        });
    }

    alert("No tiene solución.");
    console.log("No se encontró solución.");
}

// Muestra el camino de la solución en la consola
function mostrarCaminoEnConsola(movimientos) {
    console.log("Camino de la solución:");
    movimientos.forEach((movimiento, index) => {
        console.log(`Paso ${index + 1}:`);
        movimiento.forEach(fila => console.log(fila));
    });
}

// Renderiza la solución paso a paso en el HTML
function renderizarSolucion(movimientos) {
    let indice = 0;
    const intervalo = setInterval(() => {
        if (indice < movimientos.length) {
            renderizarEstado(movimientos[indice]);
            indice++;
        } else {
            clearInterval(intervalo);
        }
    }, 1000);
}

// Renderiza el estado actual del puzzle en el contenedor HTML
function renderizarEstado(estado) {
    const contenedor = document.getElementById('puzzle-container');
    contenedor.innerHTML = '';
    estado.forEach(fila => {
        fila.forEach(valor => {
            const ficha = document.createElement('div');
            ficha.classList.add('puzzle-tile');
            if (valor === 0) {
                ficha.classList.add('empty');
            } else {
                ficha.textContent = valor;
            }
            contenedor.appendChild(ficha);
        });
    });
}

// Inicializa la visualización con el estado inicial
renderizarEstado(estadoInicial);

