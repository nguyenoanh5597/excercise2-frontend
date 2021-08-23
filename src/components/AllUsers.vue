<template>
  <v-container>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        Welcome {{ currentUser.displayName }}
      </div>
      <v-spacer></v-spacer>
      <v-btn @click="onClickLogout">
        Logout
        <v-icon right>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>
    <v-data-table
      :headers="headers"
      :items="users"
      disable-sort
    >
      <template v-slot:top>
        <v-toolbar flat  >
          <v-toolbar-title>All Users</v-toolbar-title>
        </v-toolbar>
      </template>
      <template v-slot:item.userId="{ item }">
        <router-link :to="`/editor/${item.userId}`">{{item.userId}}</router-link>
      </template>
      <template v-slot:item.public="{ item, index }">
        <v-checkbox v-model="item.public" @click="onClickPublic(index)"></v-checkbox>
      </template>
      <template v-slot:no-data>No Data</template>
    </v-data-table>
  </v-container>
</template>

<script>
import axios from "../axios";
import * as localstorageUtil from "../utils/localstorage";

export default {
  data: () => ({
    currentUser: {},
    users: [],
    headers: [
      { text: 'User Id', value: 'userId', width: '300px' },
      { text: 'Username', value: 'username', width: '200px' },
      { text: 'Name', value: 'displayName', width: '200px' },
      // { text: 'Roles', value: 'roles', width: '300px' },
      { text: 'Public', value: 'public' },
    ],
  }),
  computed: {},
  mounted() {
    this.getCurrentUser();
    this.getAllUser();
  },
  methods: {
    getCurrentUser() {
      this.currentUser = JSON.parse(localstorageUtil.getItem("currentUser"));
    },
    async getAllUser() {
      this.users = await axios.get('user/all');
      // this.users = [
      //   {
      //     userId: "611f47e02983cf19a99a7527",
      //     username: "phu123",
      //     roles: ["user", "editor"],
      //     displayName: "phu",
      //   },
      //   {
      //     userId: "611f4d3506bb550a9ce797ac",
      //     username: "oanh",
      //     roles: ["user", "editor"],
      //     displayName: "Yoanh",
      //   },
      //   {
      //     userId: "611f9fe52879613c39a5d2de",
      //     username: "oanhoanh",
      //     roles: ["user", "editor"],
      //     displayName: "Yoanh",
      //   },
      //   {
      //     userId: "611fa19318182c44f19a11f0",
      //     username: "test",
      //     roles: ["user", "editor"],
      //     displayName: "test",
      //   },
      //   {
      //     userId: "611fa1b818182c44f19a11f1",
      //     username: "adminn",
      //     roles: ["user", "editor"],
      //     displayName: "Admin",
      //   },
      // ];
      this.users.forEach(user=>user.public = true);
    },
    onClickLogout() {
      localstorageUtil.clear();
      this.$router.push({ path: "/" });
    },
    onClickPublic(index){
      this.users[index].public = !this.users[index].public;
    }
  },
};
</script>

