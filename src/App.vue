<template>
  <v-app>
    <!-- <v-app-bar app color="primary" dark >
      <div class="d-flex align-center">Excercise2</div>
    </v-app-bar> -->

    <v-main>
      <login/>
    </v-main>
  </v-app>
</template>

<script>
import Login from './components/Login';

export default {
  name: 'App',

  components: {
    Login,
  },

  data: () => ({
  }),
};
</script>


