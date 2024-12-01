<template>
  <div class="min-h-full w-full mt-2">
    <nav class="bg-blue-900">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center">
            <div class="shrink-0">
              <img class="h-8 w-auto" src="../assets/logo-uls.png" alt="ULS Logo" />
            </div>
            <div class="hidden md:block">
              <div class="ml-10 flex items-baseline space-x-4">
                <RouterLink
                  :to="{ name: 'home' }"
                  :class="getLinkClass('home')"
                  aria-current="page"
                >
                  Home
                </RouterLink>
                <RouterLink :to="{ name: 'months' }" :class="getLinkClass('months')">
                  Meses
                </RouterLink>
                <RouterLink :to="{ name: 'profile' }" :class="getLinkClass('profile')">
                  Perfil
                </RouterLink>
              </div>
            </div>
          </div>

          <div @click="signOut" class="bg-red-700 rounded-md p-2 hover:bg-cyan-700 cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="h-6 w-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
              />
            </svg>
          </div>

          <div class="-mr-2 flex md:hidden">
            <!-- Botón del menú móvil -->
            <button
              @click="toggleMenu"
              type="button"
              class="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <span class="sr-only">Open main menu</span>
              <svg
                class="block h-6 w-6"
                v-if="!isMenuOpen"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
              <svg
                class="hidden h-6 w-6"
                v-if="isMenuOpen"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Menú móvil -->
      <div class="md:hidden" v-show="isMenuOpen" id="mobile-menu">
        <div class="space-y-1 px-2 pb-3 pt-2 sm:px-3">
          <RouterLink :to="{ name: 'home' }" :class="getLinkClass('home')"> Home </RouterLink>
          <RouterLink :to="{ name: 'months' }" :class="getLinkClass('months')"> Meses </RouterLink>
          <RouterLink :to="{ name: 'profile' }" :class="getLinkClass('profile')">
            Perfil
          </RouterLink>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { Firebase } from '@/utilities/firebase.service'

const isMenuOpen = ref(false)
const route = useRoute()
const firebase = new Firebase()

const signOut = (): void => {
  firebase.signOut()
}

const toggleMenu = (): void => {
  isMenuOpen.value = !isMenuOpen.value
}

const getLinkClass = (routeName: string): string => {
  return route.name === routeName
    ? 'rounded-md px-3 py-2 text-sm font-medium text-white bg-gray-900'
    : 'rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white'
}
</script>
