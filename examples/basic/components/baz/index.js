
import Large from '../large.vue';

export default {
    data () {
        return {
            count: 0
        }
    },
    mounted() {
        const _this = this
        function incCount() {
            window.requestAnimationFrame(()=>{
              console.log(_this.count++)
              incCount()
            })
        }
        incCount()
    },
    components: {
        Large: ()=>import('../large.vue')
    },
    methods: {
    },
}