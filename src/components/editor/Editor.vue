<template>
  <v-container>
    <navbar />
    <overlay :loading="loading" />
    <v-breadcrumbs :items="dirs" class="mb-3" style="background-color: #f5f5f5">
      <template v-slot:item="{ item }">
        <v-breadcrumbs-item :to="item.link" large>
          {{ item.text }}
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>
    <div v-if="editor.id">
      <div>
        <v-btn small class="mr-2" color="primary" @click="getEditorById"
          >Refresh
          <v-icon small right>mdi-refresh</v-icon>
        </v-btn>
        <v-btn small class="mr-2" color="success" @click="updateEditor"
          >Save</v-btn
        >
        <br /><br />
        <!-- <v-textarea
          outlined
          label="Content"
          v-model="editor.content"
        ></v-textarea> -->
        <quill-editor ref="myQuillEditor" v-model="editor.content" />
      </div>
    </div>

    <div v-if="!loading && !editor.id">
      <h1>Editor not found!</h1>
    </div>
  </v-container>
</template>

<script>
import axios from "../../axios";
import Navbar from "../common/Navbar.vue";
import Overlay from "../common/Overlay.vue";

export default {
  components: {
    Navbar,
    Overlay,
  },
  data: () => ({
    editor: {},
    dirs: [{ text: "EDITORS", link: "/home" }],
    loading: false,
    intervalId: null,
    pollingCancel: null,
  }),
  computed: {},

  watch: {
    // "$route.params.id": function (val, oldVal) {
    //   if (val != oldVal) {
    //     console.log(val);
    //   }
    // },
  },
  mounted() {
    this.getEditorById();
    this.autoRefresh();
  },
  methods: {
    async getEditorById() {
      try {
        this.loading = true;
        this.editor = await axios.get(`editor/${this.$route.params.id}`);
        if (this.dirs.length < 2) {
          this.dirs.push({ text: this.editor.displayName, disable: true });
        }
      } catch (e) {
        this.$toasted.show("editor not found!", { type: "error" });
      } finally {
        this.loading = false;
      }
    },
    async updateEditor() {
      try {
        await axios.put(`editor/${this.editor.id}`, this.editor);
        this.$toasted.show("update success");
      } catch (error) {
        this.$toasted.show("update fail!", { type: "error" });
      }
    },
    autoRefresh() {
      const CancelToken = axios.CancelToken;
      this.pollingCancel = CancelToken.source();

      const longPolling = async () => {
        try {
          const event = await axios.get(
            `event/editor/${this.$route.params.id}`,
            {
              cancelToken: this.pollingCancel.token,
            }
          );
          this.processEvent(event);
          await longPolling();
        } catch (e) {
          if (e.message === "STOP_LONG_POLLING") {
            // expected
          } else {
            throw e;
          }
        }
      };
      longPolling();
    },
    processEvent(event) {
      const { editorId, eventId, eventType, data } = event;
      if (editorId !== this.editor.id || !eventType) {
        console.log("discard invalid event", event);
        // wtf?
        return;
      }
      console.log("eventId", eventId, "eventType", eventType, "data", data);
      switch (eventType) {
        case "EDITOR_CONTENT_UPDATE": {
          console.log("update editor content!");
          this.editor.content = data.content;
          break;
        }
      }
    },
  },
  beforeDestroy() {
    // clearInterval(this.intervalId)
    if (this.pollingCancel) {
      this.pollingCancel.cancel("STOP_LONG_POLLING");
    }
  },
};
</script>
<style>
.ql-editor {
  box-sizing: border-box;
  line-height: 1.42;
  height: 100%;
  outline: none;
  overflow-y: auto;
  padding: 12px 15px;
  -o-tab-size: 4;
  tab-size: 4;
  -moz-tab-size: 4;
  text-align: left;
  white-space: pre-wrap;
  word-wrap: break-word;
  min-height: 250px;
}
</style>


