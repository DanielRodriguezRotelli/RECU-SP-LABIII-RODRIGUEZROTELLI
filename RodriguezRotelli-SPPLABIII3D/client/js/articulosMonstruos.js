fetch('http://localhost:3000/monstruos')
 .then(response => response.json())
 .then(data => {
   // Aquí puedes usar los datos obtenidos del servidor
   const monstruos = data;
   const $articulos = document.getElementById("articulos");
   const $spinner = document.getElementById("spinner2");
   $spinner.classList.add("ocultar");

   if(monstruos.length)
   {
       monstruos.forEach(monstruo => 
       {
           $articulos.insertAdjacentHTML("beforeend",
           `<article>
               <p>Nombre: ${monstruo.nombre}</p>
               <p><i class="fa-solid fa-mask text-white"></i> Alias: ${monstruo.alias}</p>
               <p><i class="fa-solid fa-dumbbell text-white"></i> Miedo: ${monstruo.miedo}</p>
               <p><i class="fa-solid fa-book text-white"></i> Defensa: ${monstruo.defensa}</p>
               <p><i class="fa-solid fa-shield text-white"></i> Tipo: ${monstruo.tipo}</p>
           </article>`);
       });
   }
 })
 .catch(error => console.error('Error:', error));