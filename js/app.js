//variables y selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');
/************** */

//eventos
eventListeners();
function eventListeners(){
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
    formulario.addEventListener('submit', agregarGasto);
}

/********** */

//clases
class Presupuesto{

    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];

    }

    nuevoGasto(gasto){
        this.gastos = [...this.gastos,gasto];
        this.calcularRestante();
    }

    calcularRestante(){
        const gastado = this.gastos.reduce( (total, gasto) =>  total + gasto.inputCantidad, 0 );
        
        this.restante = this.presupuesto - gastado;
        
    }
    
    eliminarGasto(id){
        this.gastos = this.gastos.filter((gasto) => gasto.id !== id);
        this.calcularRestante();
        
    }

    
}

class UI {
    insertarPresupuesto(cantidad){
        //extrayendo los valores
        
        const {presupuesto, restante } = cantidad;

        //agregar el HTML
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje,tipo){
        //crear el div
        const divAlerta = document.createElement('div');
        divAlerta.classList.add('text-center', 'alert');

        switch (tipo) {
            case 'error':
                divAlerta.classList.add('alert-danger');
                break;

            case 'exito':
                divAlerta.classList.add('alert-success');
                break;
        
            default:
                break;
        }
        //mensaje de error
        divAlerta.textContent= mensaje;

        //insertar en el html
        document.querySelector('.primario').insertBefore(divAlerta, formulario);

        //quitar alerta
        setTimeout(() => {
            divAlerta.remove();
        }, 3000);

    }

    mostrarGastos(gastos){
        //elimina el html previo
        this.limpiarHTML();
       //iterar sobre los gastos
        gastos.forEach(gasto => {
           const {inputCantidad, inputNombre, id} = gasto;

           // Crear un LI
            const nuevoGasto = document.createElement('li');
            nuevoGasto.clasName = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id

           //agregar el HTML del gasto
            nuevoGasto.innerHTML = `
                $${inputNombre} <span class ="badge badge-primary badge-pill"> ${inputCantidad}</span>
            `;
           //boton para borrar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.textContent = 'borrar';
            btnBorrar.onclick = () =>{
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);
           
            //agregar al html
            gastoListado.appendChild(nuevoGasto);
       });
    }

    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestObj){
        const {presupuesto, restante} = presupuestObj;
        const restanteDiv = document.querySelector('.restante');
        //comprobar 25%
        if ((presupuesto / 4) > restante) {
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        }else if((presupuesto / 2 ) > restante){
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning')
        }else{
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        //si el total es menor o igual a 0
        if (restante <= 0) {
            ui.imprimirAlerta('el presupuesto se agoto', 'error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        }else{
            formulario.querySelector('button[type="submit"]').disabled = false;
        }
    }

    limpiarHTML(){
        while (gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }
}

//instanciar
const ui = new UI();

let presupuesto;
/************* */

//funciones

function preguntarPresupuesto(){
    const presupuestoUsuario = prompt('¿Cual es tu presupuesto?');
    

    if (presupuestoUsuario ==='' || presupuestoUsuario <= 0 || presupuestoUsuario === null || isNaN(presupuestoUsuario) ) {
        window.location.reload();
    }
    //presupuesto valido
    presupuesto = new Presupuesto(presupuestoUsuario);
    

    ui.insertarPresupuesto(presupuesto);
}

//agrega gastos
function agregarGasto(e){
    e.preventDefault();
    const inputNombre = document.querySelector('#gasto').value;
    const inputCantidad = Number(document.querySelector('#cantidad').value);

    //Validar
    if (inputNombre === '' || inputCantidad === '' ) {
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
        return;
    }else if(inputCantidad <= 0 || isNaN(inputCantidad)){
        ui.imprimirAlerta('Cantidad no valida', 'error');
        return;
    }

    // generar objeto con el gasto
    const gasto = {inputNombre, inputCantidad, id: Date.now()};

    //añade un nuevo gasto
    
    presupuesto.nuevoGasto(gasto);

    //alerta de exito
    ui.imprimirAlerta('Gasto agregado Correctamente','exito');

    //imprimir los gastos
    const {gastos, restante} = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);

    //reinicia el formulario
    formulario.reset();

}

function eliminarGasto(id){
    //elimina los gastos del objeto
    presupuesto.eliminarGasto(id);

    //elimina los gasots del html
    const {gastos, restante} = presupuesto;
    ui.mostrarGastos(gastos);

    //actualizar el restante
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}
/********* */