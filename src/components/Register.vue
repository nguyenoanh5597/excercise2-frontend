<template>
  <div style="height: 100vh" class="d-flex">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12 below-toolbar">
          <v-card-title>
            <span class="title font-weight-light"> Register </span>
            <v-spacer />
          </v-card-title>
          <v-card-text>
            <v-form ref="form" lazy-validation @submit.prevent="handleSubmit">
              <v-text-field label="Display name" shaped filled v-model="displayName" v-on:keydown.enter.prevent='handleSubmit'/>
              <v-text-field label="Username" shaped filled required autofocus v-model="name" v-on:keydown.enter.prevent='handleSubmit'/>
              <v-text-field label="Password" shaped filled required type="password" v-model="password" v-on:keydown.enter.prevent='handleSubmit'/>
            </v-form>
<!--            <span v-show="!validateForm()">Should provide username, password and display name</span>-->
<!--            {{ msg }}-->
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn text @click="clear">Clear</v-btn>
            <v-btn color="blue darken-2" v-on:click="handleSubmit" v-bind:disabled="validateForm()">
              Submit
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
// import axios from '../axios';

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
      const loginRequest = {name: this.name, password: this.password, displayName: this.displayName};
      // const response = await axios.post('http://localhost:8080/login', loginRequest);
      const response = await this.$http.post('http://localhost:8080/api/auth/regsiter', loginRequest);
      console.log(response)
      //e.preventDefault()
      // const data = await axios.post('auth/login', { name: this.name, password: this.password }).then(data => {
      //   localstorageUtil.setItem('user', data.user);
      //   localstorageUtil.setItem('token', data.token);
      //   if (localstorageUtil.getItem('token') != null) {
      //     this.$emit('loggedIn');
      //     if (this.$route.params.nextUrl != null) {
      //       this.$router.push(this.$route.params.nextUrl);
      //     } else {
      //       this.$router.push({ path: 'services' });
      //     }
      //   }
      //   this.msg = 'login succeeded';
      // });
    },
    validateForm() {
      return !this.name || !this.password || !this.displayName;
    },
    clear() {
      this.$refs.form.reset();
    },
  },
};
</script>


