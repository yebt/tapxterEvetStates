<script setup>
import { onMounted, ref } from 'vue'
// import HelloWorld from './components/HelloWorld.vue'

import VLogoUni from './components/logos/VLogoUni.vue'
import VLogoTapxter from './components/logos/VLogoTapxter.vue'
import VLogoDeportes from './components/logos/VLogoDeportes.vue'
import VLogoEvento from './components/logos/VLogoEvento.vue'
import VIconLight from './components/icons/VIconLight.vue'
import VIconMoon from './components/icons/VIconMoon.vue'
import VLoadingSpinner from './components/VLoadingSpinner.vue'

// fetch data from http://tapxter.test/report/users-evet/2
// const URL = 'http://tapxter.test/report/users-evet/2'

const lastUpdate = ref('')
const userData = []
const infoData = {}
const appTheme = ref('light')
//
const arrayReport = ref([])
const totalPersons = ref(0)
const totalVerified = ref(0)
const firstLoad = ref(false)
//

const getData = async () => {
  const PROTOCOL = 'http' + 's://'
  const BASE_URL = 'tapxter-api-df689ec6366f4275d888.tapxter.com'
  const END_POINT = '/report/users-evet/2'
  // const URL = 'https://tapxter-api-df689ec6366f4275d888.tapxter.com/report/users-evet/2'
  const URL = PROTOCOL + BASE_URL + END_POINT
  const BEARER =
    'q1l439iHRlSv3HaokMblMFhEVUbSN8zcQZrNX36cRe4=.eyJpZGVoYXNoX3VzciI6MywidmlydGFnX2hhc2giOiI3MThmNWM4Zjk4ZjgzIiwicGVyZmlsIjoidXNlciIsImVtYWlsIjoieWlsbWFyLmkuYW1AZ21haWwuY29tIiwibG9naW5fdXNyIjoieWlsbWFyLmkuYW0iLCJkYXRhX3VzciI6IntcIm5vbWJyZVwiOlwiWWlsbWFyIEFsemF0ZSBSb2RyaWd1ZXpcIiwgXCJhcGVsbGlkb3NcIjpcIlwiLCBcInRlbGVmb25vXCI6XCIzMTM3MDYwODgyXCJ9In0=.q1l439iHRlSv3HaokMblMPZs9UhKICK1+UT+sn00YB2iTH74IvEbpjfUVLAAoF0am+202msuoF5tPS43AnlmrIcxrzwxE+Do6qMNAWkIM1lVDES6pVzPd4b4eJiESBHa/RLCGg6j2jvwv1zNdh6fuxTmuHUniosn4S6POgrltcceh5+mG5tnliX7hOlutrXI0pUPCUk1/ONdY/Ym+8+NzZzBHthdztDOM+++eBD4rdHKC4ZdCvid7pcmslb/xKXlWOvNFsJQ0TZ1n7WIc0X0vBS83BvzAFTkZwBvxfNOLpDMWL7Gh87rKTDleYp/zINtaiqqYxdXNRLiVlce8mxfQg=='

  const response = await fetch(URL, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + BEARER
    }
  })
  const data = await response.json()
  return data
}

const themer = () => {
  // On page load or when changing themes, best to add inline in `head` to avoid FOUC
  if (
    localStorage.theme === 'dark' ||
    (!('theme' in localStorage) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.classList.add('dark')
    localStorage.theme = 'dark'
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.theme = 'light'
  }
  appTheme.value = localStorage.theme
  document.documentElement.setAttribute('data-theme', localStorage.theme)
}

const toggleDarkMode = () => {
  localStorage.theme =
    localStorage.theme === 'dark' ||
    (!('theme' in localStorage) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
      ? 'light'
      : 'dark'
  themer()
  appTheme.value = localStorage.theme
  document.documentElement.setAttribute('data-theme', localStorage.theme)
}

function procesarDatos (data) {
  // Inicializar contadores
  const total = data.length
  let verified = 0

  // Objeto para almacenar datos agrupados
  const groupeds = {}

  // Iterar sobre cada objeto en el array
  data.forEach((obj) => {
    // Verificar si timest_aceptacion es distinto de 0 y null
    if (
      obj.timest_aceptacion !== '0' &&
      obj.timest_aceptacion !== 0 &&
      obj.timest_aceptacion !== null
    ) {
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
  themer()

  firstLoad.value = true
  await trateData()
  firstLoad.value = false
  setInterval(trateData, 30000)
  // console.log(procesarDatos(trstData))
})
</script>

<template>
  <main class="main-container overflow-hidden max-md:px-10">
    <div class="edges">
      <div class="baddger max-md:py-4 items-center">
        <p
          class="flex max-md:flex-col max-md:items-center max-md:text-center 2xl:text-2xl"
        >
          Última actualización:&nbsp;<code class="font-mono font-bold"
            >{{ lastUpdate }}
          </code>
        </p>
        <a
          href="#"
          @click.prevent="toggleDarkMode"
          class="button-card mx-2 px-3 py-2"
        >
          <VIconLight v-if="appTheme === 'light'" />
          <VIconMoon v-else />
        </a>
      </div>

      <div class="logo-container items-center lg:relative lg:p-2">
        <div
          class="max-lg:hidden absolute inset-0 bg-gradient-to-l from-martinique-500/20 from-1% to-transparent to-90% w-[200%]"
        ></div>
        <!-- <img alt="Uni Logo" fetchpriority="high" width="180" height="24" decoding="async" data-nimg="1" class="mx-4 "
          style="" src="./assets/images/logo-uni.svg" /> -->
        <VLogoUni />
        <a
          class="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
          href="https://app.tapxter.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          By
          <VLogoTapxter />
          <!-- <img alt="Tapxter Logo" fetchpriority="high" width="90" height="24" decoding="async" data-nimg="1" class=""
            style="" src="./assets/images/logo-tapxter.svg" /> -->
        </a>
      </div>
    </div>
    <div
      class="backgrower z-0 before:bg-gradient-radial flex-1 w-full justify-center"
    >
      <section
        class="flex max-lg:flex-col justify-around items-center w-full max-lg:gap-8 md:mx-10"
      >
        <!-- Counters -->
        <article class="">
          <a
            href="#"
            class="block max-w-sm 2xl:max-w-lg p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-martinique-100 dark:bg-gray-800/50 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <h5
              class="mb-2 text-2xl 2xl:text-4xl font-bold tracking-tight text-gray-900 dark:text-violet-300 uppercase"
            >
              asistencia al evento
            </h5>
            <p
              class="font-normal text-gray-700 dark:text-gray-400 flex text-xl 2xl:text-3xl"
            >
              Personas validadas
            </p>
            <VLoadingSpinner v-if="firstLoad" />
            <h2
              v-if="!firstLoad"
              class="mb-2 text-8xl 2xl:text-9xl font-bold tracking-tight text-gray-900 dark:text-white flex flex-wrap text-center"
            >
              <span>{{ totalVerified }}</span>
              <span class="">-></span>
            </h2>
            <p
              class="font-normal text-gray-700 dark:text-gray-400 flex text-xl 2xl:text-3xl"
            >
              <span class="flex-1"> Personas invitadas </span>
              <code class="font-mono">{{ totalPersons }}</code>
            </p>
          </a>
        </article>
        <!-- Logo -->
        <article>
          <section>
            <!-- <img class="relative dark:drop-shadow-[0_0_0.2rem_#ffffff60] dark:inverse"
              src="./assets/images/logos-deportes.svg" alt="" /> -->
            <VLogoDeportes />
          </section>
          <section>
            <!-- <img class="relative dark:drop-shadow-[0_0_0.2rem_#ffffff60] dark:inverse"
              src="./assets/images/logo-evento.svg" alt="" /> -->
            <VLogoEvento />
          </section>
        </article>
      </section>
    </div>

    <!-- <div class="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left"> -->
    <div
      class="mb-32 flex text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left mt-3"
    >
      <div
        class="flex gap-4 max-lg:flex-col lg:w-max lg:animate-marquee [--duration:50s] lg:hover:[animation-play-state:paused] max-lg:mt-3"
      >
        <template v-for="(item, index) in arrayReport" :key="index">
          <template v-if="item !== 'undefined'">
            <a
              href="#"
              @click.prevent=""
              class="simple-card-border w-auto max-w-[600px] lg:min-w-[800px]"
              target="_blank"
              rel="noopener noreferrer"
            >
              <h2 class="mb-3 text-2xl font-semibold flex">
                <span class="flex-1">{{ item }}</span>
                <span class="inline-block transition-transform">
                  <code class="font-mono">{{
                    infoData.value.groupeds[item].total
                  }}</code>
                </span>
              </h2>
              <p class="m-0 -max-w-[30ch] text-sm opacity-50">
                <template
                  v-for="(subitem, index) in Object.keys(
                    infoData.value.groupeds[item].deportes
                  )"
                  :key="index"
                >
                  <template v-if="subitem != 'undefined'">
                    <span
                      >{{ subitem }}:
                      <code class="font-mono">{{
                        infoData.value.groupeds[item].deportes[subitem]
                      }}</code></span
                    ><span class="px-1">/</span>
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
