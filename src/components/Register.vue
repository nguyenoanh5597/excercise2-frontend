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
              <v-text-field
                label="Display name"
                shaped
                filled
                v-model="displayName"
                v-on:keydown.enter.prevent="handleSubmit"
              />
              <v-text-field
                label="Username"
                shaped
                filled
                required
                autofocus
                v-model="name"
                v-on:keydown.enter.prevent="handleSubmit"
              />
              <v-text-field
                label="Password"
                shaped
                filled
                required
                type="password"
                v-model="password"
                v-on:keydown.enter.prevent="handleSubmit"
              />
            </v-form>
            <span
              >Click
              <router-link to="/">login</router-link>
              to sign in.
            </span>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn text @click="clear">Clear</v-btn>
            <v-btn
              color="blue darken-2"
              v-on:click="handleSubmit"
              :disabled="validateForm()"
            >
              Submit
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from "../axios";

export default {
  data() {
    return {
      name: "",
      password: "",
      displayName: "",
      msg: "",
    };
  },
  methods: {
    async handleSubmit() {
      const registerReq = {
        username: this.name,
        password: this.password,
        displayName: this.displayName,
      };
      const response = await axios.post("auth/register", registerReq);
      console.log(response);
      this.$router.push({ path: "/" });
    },
    validateForm() {
      return !this.name || !this.password;
    },
    clear() {
      this.$refs.form.reset();
    },
  },
};
</script>


