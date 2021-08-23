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
      :items="editors"
      disable-sort
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>My Editors</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-btn x-small class="mr-2" color="primary" @click="onClickRefresh">Refresh<v-icon x-small right>mdi-refresh</v-icon></v-btn>
          <v-btn x-small class="mr-2" color="success" @click="onClickCreate">Create<v-icon x-small right>mdi-plus</v-icon></v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item, index }">
        <v-icon small color="primary" class="mr-2" @click="onClickEdit(item)">mdi-pencil</v-icon>
        <v-icon small color="error" class="mr-2" @click="onClickDelete(item, index)">mdi-delete</v-icon>
      </template>
      <template v-slot:item.userId="{ item }">
        <router-link :to="`/editor/${item.userId}`">{{item.userId}}</router-link>
      </template>
      <template v-slot:item.isPublic="{ item }">
        <v-checkbox v-model="item.isPublic" @click="updateEditor(item)"></v-checkbox>
      </template>
      <template v-slot:no-data>No Data</template>
    </v-data-table>

    <v-dialog v-model="createEditDialog" max-width="500px" persistent>
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form v-model="valid" ref="form" lazy-validation>
              <v-row>
                <v-col cols="12" sm="6" md="8">
                  <v-text-field v-model="editedItem.displayName" label="Display Name" required></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-checkbox v-model="editedItem.isPublic" label="Public"></v-checkbox>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="createEditDialog = false">Cancel</v-btn>
          <v-btn color="primary" text @click="onSaveEditor(editedItem)" :disabled="!valid">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "../axios";
import * as localstorageUtil from "../utils/localstorage";

export default {
  data: () => ({
    currentUser: {},
    editedItem: {},
    editors: [],
    headers: [
      { text: 'Actions', value: 'actions', width: '150px' },
      { text: 'Display Name', value: 'displayName', width: '300px' },
      { text: 'Public', value: 'isPublic' },
    ],
    valid: false,
    createEditDialog: false,
    formTitle: '',
  }),
  computed: {
  },
  mounted() {
    this.getCurrentUser();
    // this.getEditors();
  },
  methods: {
    getCurrentUser() {
      this.currentUser = JSON.parse(localstorageUtil.getItem("currentUser"));
      this.getEditorsByUserId(this.currentUser.userId);
    },
    async getEditors() {
      this.editors = await axios.get('editor/all');
    },
    async getEditorsByUserId(userId) {
      this.editors = await axios.get(`editor/editors/${userId}`);
    },
    onClickLogout() {
      localstorageUtil.clear();
      this.$router.push({ path: "/" });
    },
    onClickRefresh() {
      this.getEditorsByUserId(this.currentUser.userId);
    },
    onClickCreate() {
      this.createEditDialog = true;
      this.editedItem = {
        userId: '',
        displayName: '',
        isPublic: false,
      };
      this.formTitle = 'Create';
    },
    onClickEdit(editor) {
      this.createEditDialog = true;
      this.editedItem = editor;
      this.formTitle = 'Edit';
    },
    async onClickDelete(editor, index) {
      const r = await axios.delete(`editor/delete/${editor.id}`);
      if(r){
        this.editors.splice(index, 1);
        alert(r);
      }else{
        alert("delete fail");
      }
    },
    async onSaveEditor(editor) {
      if(editor.id){
        this.updateEditor(editor);
      }else{
        this.createEditor(editor)
      }
      this.createEditDialog = false;
    },
    async updateEditor(editor){
      editor.userId = this.currentUser.userId;
      const r = await axios.patch(`editor/update/${editor.id}`, editor);
      if(r){
        const index = this.editors.findIndex(e=> e.id == editor.id);
        this.editors[index] = r;
      }else{
        alert("update fail");
      }
    },
    async createEditor(editor){
      editor.userId = this.currentUser.userId;
      const r = await axios.post('editor/create', editor);
      if(r){
        this.editors.push(r);
      }else{
        alert("create fail");
      }
    }
  },
};
</script>

