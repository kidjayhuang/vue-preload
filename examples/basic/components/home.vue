<template>
  <div>
      <router-link to="/foo">foo</router-link>
      <router-link to="/bar">bar</router-link>
      <router-link to="/large">large</router-link>
  </div>
</template>

<script>

export default {
  data () {
    return {
    }
  },
  mounted() {
    // setTimeout(() => {
    //     this.$preload('large')
    // }, 3000);
    let startTag = 'navigate start'
    let endTag = 'navigate end'
    window.performance.mark(startTag)
    window.performance.mark(endTag)

    window.performance.measure('navigate consume', startTag, endTag)
  
  },
  components: {

  },
  methods: {
  },
}
</script>
