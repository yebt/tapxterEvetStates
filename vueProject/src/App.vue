<script setup>
import { onMounted, ref } from 'vue'
// import HelloWorld from './components/HelloWorld.vue'

// fetch data from http://tapxter.test/report/users-evet/2
// const URL = 'http://tapxter.test/report/users-evet/2'
const URL = 'https://tapxter-api-df689ec6366f4275d888.tapxter.com/report/users-evet/2'
const BEARER = 'q1l439iHRlSv3HaokMblMFhEVUbSN8zcQZrNX36cRe4=.eyJpZGVoYXNoX3VzciI6MywidmlydGFnX2hhc2giOiI3MThmNWM4Zjk4ZjgzIiwicGVyZmlsIjoidXNlciIsImVtYWlsIjoieWlsbWFyLmkuYW1AZ21haWwuY29tIiwibG9naW5fdXNyIjoieWlsbWFyLmkuYW0iLCJkYXRhX3VzciI6IntcIm5vbWJyZVwiOlwiWWlsbWFyIEFsemF0ZSBSb2RyaWd1ZXpcIiwgXCJhcGVsbGlkb3NcIjpcIlwiLCBcInRlbGVmb25vXCI6XCIzMTM3MDYwODgyXCJ9In0=.q1l439iHRlSv3HaokMblMPZs9UhKICK1+UT+sn00YB2iTH74IvEbpjfUVLAAoF0am+202msuoF5tPS43AnlmrIcxrzwxE+Do6qMNAWkIM1lVDES6pVzPd4b4eJiESBHa/RLCGg6j2jvwv1zNdh6fuxTmuHUniosn4S6POgrltcceh5+mG5tnliX7hOlutrXI0pUPCUk1/ONdY/Ym+8+NzZzBHthdztDOM+++eBD4rdHKC4ZdCvid7pcmslb/xKXlWOvNFsJQ0TZ1n7WIc0X0vBS83BvzAFTkZwBvxfNOLpDMWL7Gh87rKTDleYp/zINtaiqqYxdXNRLiVlce8mxfQg=='

const lastUpdate = ref('')
const userData = []
const infoData = {}
//
const arrayReport = ref([])
const totalPersons = ref(0)
const totalVerified = ref(0)
const firstLoad = ref(false)
//

const getData = async () => {
  const response = await fetch(URL, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + BEARER
    }
  })
  const data = await response.json()
  return data
}

const saveDataInLocalStorage = () => {
  localStorage.setItem('lastUpdate', lastUpdate.value)
  localStorage.setItem('userData', JSON.stringify(userData.value))
  localStorage.setItem('infoData', JSON.stringify(infoData.value))
}

const loadDataFromLocalStorage = () => {
  lastUpdate.value = localStorage.getItem('lastUpdate')
  userData.value = JSON.parse(localStorage.getItem('userData'))
  infoData.value = JSON.parse(localStorage.getItem('infoData'))
}

function procesarDatos (data) {
  // Inicializar contadores
  const total = data.length
  let verified = 0

  // Objeto para almacenar datos agrupados
  const groupeds = {}

  // Iterar sobre cada objeto en el array
  data.forEach(obj => {
    // Verificar si timest_aceptacion es distinto de 0 y null
    if (obj.timest_aceptacion !== '0' && obj.timest_aceptacion !== 0 && obj.timest_aceptacion !== null) {
      verified++

      // Obtener la sede del objeto actual
      const sede = obj.hash_info_usuario_json.sede

      // Inicializar la sede en groupeds si aún no existe
      if (!groupeds[sede]) {
        groupeds[sede] = {
          total: 0,
          deportes: {}
        }
      }

      // Incrementar el total de la sede
      groupeds[sede].total++

      // Obtener el deporte del objeto actual
      const deporte = obj.hash_info_usuario_json.deporte

      // Inicializar el deporte en la sede si aún no existe
      if (!groupeds[sede].deportes[deporte]) {
        groupeds[sede].deportes[deporte] = 0
      }

      // Incrementar el contador del deporte en la sede
      groupeds[sede].deportes[deporte]++
    }
  })

  // Construir el objeto de resultado
  const resultado = {
    total,
    verified,
    groupeds
  }

  return resultado
}

const trateData = async () => {
  lastUpdate.value = new Date().toLocaleString()
  const data = await getData()
  userData.value = data
  const infData = await procesarDatos(data.data)
  infoData.value = infData
  arrayReport.value = Object.keys(infData.groupeds)
  totalPersons.value = infData.total
  totalVerified.value = infData.verified
  // console.log(infData)
}

onMounted(async () => {
  firstLoad.value = true
  await trateData()
  firstLoad.value = false
  setInterval(trateData, 30000)
  // console.log(procesarDatos(trstData))
})
</script>

<template>
  <main class="main-container overflow-hidden">
    <div class="edges">
      <p class="baddger">
        Última actualización:&nbsp;<code class="font-mono font-bold">{{ lastUpdate }}</code>
      </p>
      <div class="logo-container items-center lg:relative lg:p-2">
        <div
          class="max-lg:hidden absolute  inset-0 bg-gradient-to-l from-martinique-500/20  from-1%  to-transparent to-90%  w-[200%]">
        </div>
        <img alt="Uni Logo" fetchpriority="high" width="180" height="24" decoding="async" data-nimg="1" class="mx-4 "
          style="" src="./assets/images/logo-uni.svg" />
        <a class="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
          href="https://app.tapxter.com" target="_blank" rel="noopener noreferrer">
          By
          <img alt="Tapxter Logo" fetchpriority="high" width="90" height="24" decoding="async" data-nimg="1" class=""
            style="" src="./assets/images/logo-tapxter.svg" />
        </a>
      </div>
    </div>
    <div class="backgrower before:bg-gradient-radial flex-1 w-full justify-center">
      <section class="flex max-lg:flex-col justify-around items-center w-full max-lg:gap-8 md:mx-10">
        <!-- Counters -->
        <article class="">
          <a href="#"
            class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-martinique-100 dark:bg-gray-800/50 dark:border-gray-700 dark:hover:bg-gray-700">

            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-violet-300 uppercase">
              asistencia al evento
            </h5>
            <p class="font-normal text-gray-700 dark:text-gray-400 flex text-xl">
              Persosnas validadas
            </p>
            <div role="status" class="flex items-center justify-center m-2">
              <svg aria-hidden="true" v-if="firstLoad"
                class="inline w-20 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
                viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor" />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill" />
              </svg>
              <span class="sr-only">Loading...</span>
            </div>
            <h2 v-if="!firstLoad" class="mb-2 text-8xl font-bold tracking-tight text-gray-900 dark:text-white">
              {{ totalVerified }}<span>-></span></h2>
            <p class="font-normal text-gray-700 dark:text-gray-400 flex text-xl">
              <span class="flex-1"> Persosnas invitadas </span> <code class="font-mono">{{ totalPersons }}</code>
            </p>
          </a>
        </article>
        <!-- Logo -->
        <article>
          <section>
            <img class="relative dark:drop-shadow-[0_0_0.2rem_#ffffff60] dark:inverse"
              src="./assets/images/logos-deportes.svg" alt="" />
          </section>
          <section>
            <img class="relative dark:drop-shadow-[0_0_0.2rem_#ffffff60] dark:inverse"
              src="./assets/images/logo-evento.svg" alt="" />
          </section>
        </article>

      </section>
    </div>

    <!-- <div class="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left"> -->
    <div class="mb-32 flex text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left mt-3">
      <div
        class="flex gap-4 max-lg:flex-col lg:w-max lg:animate-marquee [--duration:50s] lg:hover:[animation-play-state:paused] max-lg:mt-3">
        <template v-for="(item, index) in arrayReport" :key="index">
          <template v-if="item !== 'undefined'">
            <a href="#" @click.prevent="" class="simple-card-border w-auto max-w-[600px] lg:min-w-[800px]" target="_blank"
              rel="noopener noreferrer">
              <h2 class="mb-3 text-2xl font-semibold flex">
                <span class="flex-1">{{ item }}</span>
                <span class="inline-block transition-transform  ">
                  <code class="font-mono">{{ infoData.value.groupeds[item].total }}</code>
                </span>
              </h2>
              <p class="m-0 -max-w-[30ch] text-sm opacity-50">
                <template v-for="(subitem, index) in Object.keys(infoData.value.groupeds[item].deportes)" :key="index">
                  <template v-if="subitem != 'undefined'">
                    <span>{{ subitem }}: <code
                        class="font-mono">{{ infoData.value.groupeds[item].deportes[subitem] }}</code></span><span
                      class="px-1">/</span>
                  </template>
                </template>
              </p>
            </a>
          </template>

        </template>

      </div>
    </div>
  </main>
</template>

<style scoped></style>
