import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import colors from 'vuetify/lib/util/colors';

Vue.use(Vuetify);

const opts = {
  theme: {
    dark: false,
    themes: {
      dark: {
        primary: colors.blue.darken2 /** this will change the UI (user dashboard) colour */,
        accent: colors.red.accent2,
        secondary: colors.grey.lighten1,
        info: colors.blue.lighten1,
        warning: colors.amber.darken2,
        error: colors.red.accent4,
        success: colors.green.lighten2,
      },
    },
  },
  icons: {
    iconfont: 'mdiSvg', // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
  },
};

export default new Vuetify(opts);
