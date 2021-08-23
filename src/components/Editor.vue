<template>
  <v-container>
    <v-app-bar app color="default">
      <v-breadcrumbs :items="dirs">
        <template v-slot:item="{ item }">
          <v-breadcrumbs-item
            class="breadcrumbs-item-text"
            :to="item.link"
            large
          >
            {{ item.text }}
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
    </v-app-bar>
  </v-container>
</template>

<script>
import axios from "../axios";
// import * as localstorageUtil from "../utils/localstorage";

export default {
  data: () => ({
    user: {},
    dirs: [
      { text: "EDITORS", link: "/home" },
      { text: "VIEW", disabled: true },
    ],
  }),
  computed: {},

  watch: {
    "$route.params.userId": function (val, oldVal) {
      if (val != oldVal) {
        console.log(val);
      }
    },
  },
  mounted() {
    this.getUserById(this.$route.params.userId);
  },
  methods: {
    async getUserById(userId) {
      this.user = await axios.get(`user/${userId}`);
    },
  },
};
</script>

