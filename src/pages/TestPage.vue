<template>
  <q-btn @click="testRouteLogin">
    Test Login

  </q-btn>
  <q-btn>
    Test SignUp
  </q-btn>
</template>
<script setup>
import { useRouter } from 'vue-router';

const router = useRouter()

function testRouteLogin() {
  console.log(router)
  router.push('/login')
}
</script>

