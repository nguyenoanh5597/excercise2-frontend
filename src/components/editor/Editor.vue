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
    <v-textarea v-textarea outlined label="Content" v-model="editor.content"></v-textarea>
    <v-btn color="primary" class="mb-2 float-right" @click="updateEditor"> Save </v-btn>
  </v-container>
</template>

<script>
import axios from "../../axios";
// import * as localstorageUtil from "../utils/localstorage";

export default {
  data: () => ({
    editor: {},
    dirs: [{ text: "EDITORS", link: "/home" }],
  }),
  computed: {},

  watch: {
    "$route.params.id": function (val, oldVal) {
      if (val != oldVal) {
        console.log(val);
      }
    },
  },
  mounted() {
    this.getEditorById(this.$route.params.id);
  },
  methods: {
    async getEditorById(id) {
      this.editor = await axios.get(`editor/${id}`);
      this.dirs.push({ text: this.editor.displayName, disable: true });
    },
    async updateEditor(){
      const r = await axios.put(`editor/${this.editor.id}`, this.editor);
      if(r){
        alert("update success");
      }else{
        alert("update fail");
      }
    },
  },
};
</script>

