<template>
  <div style="height: 100vh" class="d-flex">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12 below-toolbar">
          <v-card-title>
            <span class="title font-weight-light"> Login </span>
            <v-spacer/>
          </v-card-title>
          <v-card-text>
            <v-form ref="form" lazy-validation @submit.prevent="handleSubmit">
              <v-text-field label="Username" shaped filled required autofocus v-model="name"
                            v-on:keydown.enter.prevent='handleSubmit'/>
              <v-text-field label="Password" shaped filled required type="password" v-model="password"
                            v-on:keydown.enter.prevent='handleSubmit'/>
            </v-form>
            <span>Click 
              <router-link to="/register">register</router-link>
              to sign up.
            </span>
            {{ msg }}
          </v-card-text>
          <v-card-actions>
            <v-spacer/>
            <v-btn text @click="clear">Clear</v-btn>
            <v-btn color="blue darken-2" v-on:click="handleSubmit" v-bind:disabled="!this.name || !this.password">
              Login
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from '../axios';
import * as localstorageUtil from '../utils/localstorage';

export default {
  data() {
    return {
      name: '',
      password: '',
      displayName: '',
      msg: '',
    };
  },
  methods: {
    async handleSubmit() {
      const loginRequest = {username: this.name, password: this.password};
      const response = await axios.post('auth/login', loginRequest);
      localstorageUtil.setItem("token", response.token);
      localstorageUtil.setItem("currentUser", JSON.stringify(response.userInfo));
      console.log(response)
      this.$router.push({ path: 'home' });
    },
    clear() {
      this.$refs.form.reset();
    },
  },
};
</script>


