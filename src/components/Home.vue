<template>
  <v-container>
    <navbar/>

    <overlay :loading="loading" />

    <v-data-table
        :headers="headers"
        :items="editors"
        disable-sort
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>My Editors</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-btn small class="mr-2" color="primary" @click="onClickRefresh">Refresh
            <v-icon small right>mdi-refresh</v-icon>
          </v-btn>
          <v-btn small class="mr-2" color="success" @click="onClickCreate">Create
            <v-icon small right>mdi-plus</v-icon>
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item, index }">
        <v-icon small color="primary" class="mr-2" @click="onClickEdit(item)">mdi-pencil</v-icon>
        <v-icon small color="error" class="mr-2" @click="onClickDelete(item, index)">mdi-delete</v-icon>
      </template>
      <template v-slot:item.id="{ item }">
        <router-link :to="`/editor/${item.id}`">{{item.id}}</router-link>
      </template>
      <template v-slot:item.public="{ item }">
        <v-checkbox v-model="item.public" @click="updateEditor(item)"></v-checkbox>
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
                  <v-checkbox v-model="editedItem.public" label="Public"></v-checkbox>
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
import Navbar from './common/Navbar.vue';
import Overlay from './common/Overlay.vue';
import eventManager from '@/eventManager';

export default {
  components: {
    Navbar, Overlay
  },
  data: () => ({
    editedItem: {},
    editors: [],
    headers: [
      { text: 'Actions', value: 'actions', width: '150px' },
      { text: 'Id', value: 'id', width: '300px' },
      { text: 'Display Name', value: 'displayName', width: '300px' },
      { text: 'Public', value: 'public' },
    ],
    valid: false,
    createEditDialog: false,
    loading: false,
    formTitle: '',
  }),
  computed: {},
  mounted() {
    this.getEditors();
    eventManager.onEditorsUpdate((event)=>{
      let ed = this.editors.find((e)=>e.id === event.editorId);
      Object.assign(ed, {
        displayName: event.data.displayName,
        public: event.data.public === 'true',
        version: parseInt(event.data.version),
      })
    })

    eventManager.onEditorCreated((event)=>{
      this.editors.push(event.data.newEditor);
    })

    eventManager.onEditorRemoved((event)=>{
      const index = this.editors.findIndex((e)=>e.id === event.editorId);
      if (index >= 0) {
        this.editors.splice(index, 1);
      }
    })
  },
  methods: {
    async getEditors() {
      try {
        this.loading = true;
        this.editors = await axios.get('editors');
      } catch (e) {
        console.log(e)
      }finally{
        this.loading = false;
      }
    },
    onClickRefresh() {
      this.getEditors();
    },
    onClickCreate() {
      this.createEditDialog = true;
      this.editedItem = {
        displayName: '',
        public: false,
      };
      this.formTitle = 'Create';
    },
    onClickEdit(editor) {
      this.createEditDialog = true;
      this.editedItem = Object.assign({}, editor);
      this.formTitle = 'Edit';
    },
    async onClickDelete(editor, index) {
      const r = await axios.delete(`editor/${editor.id}`);
      if (r) {
        this.editors.splice(index, 1);
        this.$toasted.show(r);
      } else {
        this.$toasted.show("delete fail!", {type:"error"});
      }
    },
    async onSaveEditor(editor) {
      if (editor.id) {
        this.updateEditor(editor);
      } else {
        this.createEditor(editor)
      }
      this.createEditDialog = false;
    },
    async updateEditor(editor) {
      const r = await axios.put(`editor/${editor.id}`, editor);
      if (r) {
        const index = this.editors.findIndex(e => e.id === editor.id);
        Object.assign(this.editors[index], r);
        this.$toasted.show('update success');
      } else {
        this.$toasted.show('update fail!', {type:"error"});
      }
    },
    async createEditor(editor) {
      const r = await axios.post('editors', editor);
      if (r) {
        this.editors.push(r);
        this.$toasted.show('create success');
      } else {
        this.$toasted.show('create fail!');
      }
    }
  },
};
</script>

