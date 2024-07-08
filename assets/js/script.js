

const monedaChilena = document.querySelector('#ingreso') //INPUT
const convertir= document.querySelector('#buscar') //BUTTON
const selectMoneda= document.querySelector('#monedas')
const valorFinal= document.querySelector('.resultado')
const apiURL = "https://mindicador.cl/api"

let myChart = null



convertir.addEventListener('click',async() => {
    const cantidad = parseFloat(monedaChilena.value)
    const moneda = selectMoneda.value 

    if (isNaN(cantidad) || cantidad <= 0) {
        alert('Ingrese un monto valido')
        valorFinal.innerHTML= `<p>Valor no valido</p>`
        //return
    }

    try {
        const respuesta = await fetch(apiURL);
        const data = await respuesta.json();
        const divisa = moneda


        let tasaCambio
            if (moneda === 'dolar') {
                tasaCambio = data.dolar.valor
            } else if (moneda === 'euro') {
                tasaCambio = data.euro.valor
            }
       const resultado = cantidad / tasaCambio 
        valorFinal.innerHTML= `<h5> Resultado: ${resultado.toFixed(2)}</h5>`

        async function getMonedas() {   
            const res = await fetch(`https://mindicador.cl/api/${divisa}`);
            
           
            const moneda = await res.json();
            const ultimosDiezDias = moneda.serie.slice(20, 30).reverse()
        
            const labels = ultimosDiezDias.map((dia) => { 
            return dia.fecha.split('T')[0]});
        
            const data = ultimosDiezDias.map((dia)=> {
                const valor = dia.valor;
                return Number(valor)});
        
             
            const datasets = [
                {
                 label:"variacion",
                 borderColor: "red", 
                 data: data, 
                }
                ];
                return {labels, datasets} ; 
            }
        
        async function renderGrafica() {

            if(!monedaChilena.value) {
                mensajeError.textContent = "Ingrese un valor antes de continuar"     
                return;          
            }
            const data = await getMonedas();
            const config = {
                type: "line",
                data: data, 
                };
            const chartContainer = document.getElementById("myChart"); 
            chartContainer.style.backgroundColor = "white";  
            
            if (myChart instanceof Chart) {
                myChart.destroy();
            }

            myChart = new Chart(chartContainer, config);

           
        }

        renderGrafica();

       
    } catch(e) {
         const errorSpan = document.getElementById("errorSpan")
        errorSpan.innerHTML = `"Algo salió mal :(!!" Error:${e.message}`
    }
})









