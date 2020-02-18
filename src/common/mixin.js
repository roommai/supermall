import {debounce} from "common/utils"
import BackTop from 'components/content/backTop/BackTop'
import {BACK_POSITION} from 'common/const';
import {POP, SELL, NEW} from "@/common/const";
export const itemListenerMixin = {
    data() {
        return {
            itemImgListener:null,
            refresh:null
        }
    },
    mounted() {
        // 1.图片加载完成的事件监听
        this.refresh =debounce(this.$refs.scroll.refresh,50)

        this.itemImgListener= () =>{
            this.refresh()
        }

        this.$bus.$on('itemImageLoad',this.itemImgListener)
        console.log('我是混入中的内容')
    }
}

export const backTopMixin = {
    components:{
        BackTop
    },
    data() {
        return {
            isshowBackTop:false,
        }
    },
    methods:{
        backClick(){
            this.$refs.scroll.scrollTo(0,0,500)
        }
    }
}

export const tabControlMixin = {
    data() {
      return {
        currentType: POP
      }
    },
    methods: {
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = POP
            break
          case 1:
            this.currentType = NEW
            break
          case 2:
            this.currentType = SELL
            break
        }
        console.log(this.currentType);
      }
    }
  }