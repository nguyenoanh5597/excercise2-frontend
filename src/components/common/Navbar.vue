<template>
  <v-app-bar app color="primary" dark>
    <div class="d-flex align-center">Welcome {{ currentUser.displayName }}</div>
    <v-spacer></v-spacer>
    <v-btn @click="onClickLogout">
      Logout
      <v-icon right>mdi-logout</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
import * as localstorageUtil from "../../utils/localstorage";

export default {
  data: () => ({
    currentUser: {},
  }),
  mounted() {
    this.getCurrentUser();
  },
  methods: {
    getCurrentUser() {
      this.currentUser = JSON.parse(localstorageUtil.getItem("currentUser"));
      if (!this.currentUser) {
        this.$router.push({ path: "/" });
      }
    },
    onClickLogout() {
      localstorageUtil.clear();
      this.$router.push({ path: "/" });
    },
  },
};
</script>


