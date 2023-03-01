//Variables
// const
const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const listaCursos = document.querySelector('#lista-cursos');

// lets
let articulosCarrito = [];



//Se regista todos los event listeners
cargarEventListeners();
function cargarEventListeners() {
      //cuando se agrega un curso presionando "Agregar al carrito"
      listaCursos.addEventListener('click', agregarCurso);

      //Elimina cursos individuales del carrito
      carrito.addEventListener('click', eliminarCurso);

      document.addEventListener('DOMContentLoaded', () => {

            //Vaciar todo el carrito
            vaciarCarritoBtn.addEventListener('click', () => {
                  articulosCarrito = [];
                  limpiarHTML();
            });

            //cargar la lista con local storage
            agregarLocalStorage();

      });
}

//Agregar data a local storage
function agregarLocalStorage() {
      articulosCarrito = JSON.parse(localStorage.getItem('listaCarrito')) || [];
      carritoHTML();
}

//funciones

function agregarCurso(e) {
      // console.log('Precionando en cursos');
      e.preventDefault();
      if (e.target.classList.contains('agregar-carrito')) {
            // console.log(e.target);
            const cursoSeleccionado = e.target.parentElement.parentElement;
            leerDatosCurso(cursoSeleccionado);
      }
      // console.log(e.target.classList);

}

//Elimina un curso del carrito
function eliminarCurso(e) {
      // console.log('eliminando');
      // console.log(e.target.classList);
      if (e.target.classList.contains('borrar-curso')) {
            const cursoID = e.target.getAttribute('data-id');

            //Revisar si la cantidad es mayor a 1

            const cantidad = articulosCarrito.find(art => art.id === cursoID);

            if (cantidad.cantidad > 1) {

                  console.log(cantidad);
                  eliminarUnCurso();
            } else {

                  articulosCarrito = articulosCarrito.filter(articulo => articulo.id !== cursoID);
                  //Elimina del arreglo articulosCarrito por el data-id
                  carritoHTML();//itera nuevamente e imprime la lista original
                  SincronizarLocalStorage();
            }
      }





}

//Valida si cantidad es mas de 1 para eliminar cantidades
function eliminarUnCurso() {
      const articulosLS = JSON.parse(localStorage.getItem('listaCarrito'));

      const cursoMod = articulosLS.map(art => {
            let { cantidad, id } = art;

            if (cantidad > 1) {
                  art.cantidad--;

                  return art;
            } else {

                  return art;
            }
      });
      articulosCarrito = [...cursoMod];
      carritoHTML();//itera nuevamente e imprime la lista original
      SincronizarLocalStorage();
}


// Lee el contenido del HTML al que le dimos click y extrae la info del curso 

function leerDatosCurso(curso) {
      // console.log(curso);

      //Creo un objeto con el sontenido del curso actual
      const infoCurso = {
            imagen: curso.querySelector('img').src,
            titulo: curso.querySelector('h4').textContent,
            precio: curso.querySelector('.precio span').textContent,
            id: curso.querySelector('a').getAttribute('data-id'),
            cantidad: 1
      };
      //     console.log(infoCurso); 
      // Agrega elementos al arreglo de carrito

      agregarACarrito(infoCurso);
}

// Agregar al carrito
function agregarACarrito(infoArticulo) {

      const existe = articulosCarrito.some(articulo => articulo.id === infoArticulo.id);
      if (existe) {
            //Actualizamos la cantidad
            const cursos = articulosCarrito.map(articulo => {

                  if (articulo.id === infoArticulo.id) {
                        articulo.cantidad++;
                        return articulo; //retorna el objeto actualizado
                  } else {
                        return articulo;//retorna los objetos que no son duplicados
                  }
            });
            articulosCarrito = [...cursos];
      } else {
            //Agregamos a la lista de articulos del carrito
            articulosCarrito = [...articulosCarrito, infoArticulo];
      }



      console.log(articulosCarrito);

      //mostrat en el carrito
      carritoHTML();

      //Sincroniza Local Storage
      SincronizarLocalStorage();
}

function SincronizarLocalStorage() {
      localStorage.setItem('listaCarrito', JSON.stringify(articulosCarrito));
}

//Muestra el articulo en el carrito de compras

function carritoHTML() {

      //limpiar el HTML
      limpiarHTML();

      //Recorre la lista de articulos
      articulosCarrito.forEach(articulo => {

            const { imagen, titulo, precio, cantidad, id } = articulo;
            const row = document.createElement('TR');

            row.innerHTML = `
                  <td>
                       <img src= '${imagen}' alt='Imagen articulo' width='100'>
                  </td>
                  <td>
                        ${titulo}
                  </td>
                  <td>
                        ${precio}
                  </td>
                  <td>
                        <input type="number" min="1" max= ${cantidad} value=${cantidad}>
                        
                  </td>
                  <td>
                        <a href="#" class="borrar-curso" data-id="${id}" > X </a>
                  </td>

            `;



            //Agregar el HTML del carrito en el tbody
            contenedorCarrito.appendChild(row);


      });
}

//Elimina los cursos del tbody
function limpiarHTML() {
      //forma lenta
      // contenedorCarrito.innerHTML = '';

      //forma aconsejada
      while (contenedorCarrito.firstChild) {
            contenedorCarrito.removeChild(contenedorCarrito.firstChild);
      }
}

