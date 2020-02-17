<template>
    <div id="detail">
        <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
        <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
            <detail-swiper :top-images="topImages"/>
            <detail-base-info :goods="goods"/>
            <detail-shop-info :shop="shop"/>
            <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
            <detail-param-info :paramInfo="paramInfo" ref="params"/>
            <detail-comment-info :commentInfo="commentInfo" ref="comment"/>
            <goods-list :goods="recommends" ref="recommend"/>
        </scroll>
        <detail-bottom-bar @addCart="addToCart"/>
        <back-top @click.native="backClick" v-show="isshowBackTop"/>
    </div>
</template>
<script>
import DetailNavBar from './childComps/DetailNavBar'
import DetailSwiper from './childComps/DetailSwiper'
import DetailBaseInfo from './childComps/DetailBaseInfo'
import DetailShopInfo from './childComps/DetailShopInfo'
import DetailGoodsInfo from './childComps/DetailGoodsInfo'
import DetailParamInfo from './childComps/DetailParamInfo'
import DetailCommentInfo from './childComps/DetailCommentInfo'
import DetailBottomBar from './childComps/DetailBottomBar'

import Scroll from 'components/common/scroll/Scroll'
import GoodsList from 'components/content/goods/GoodsList'

import {getDetail,Goods,Shop,GoodsParam,getRecommend} from 'network/detail'
import {debounce} from "common/utils"
import {itemListenerMixin,backTopMixin} from 'common/mixin'
import {BACK_POSITION} from 'common/const'

import { mapActions } from  'vuex';
export default {
    name:"Detail",
    components: {
        DetailNavBar,
        DetailSwiper,
        DetailBaseInfo,
        DetailShopInfo,
        DetailGoodsInfo,
        DetailParamInfo,
        DetailCommentInfo,
        DetailBottomBar,
        Scroll,
        GoodsList,
    },
    mixins: [itemListenerMixin,backTopMixin],
    data() {
        return {
                iid:null,
                topImages: [],
                goods: {},
                shop:{},
                detailInfo:{},
                paramInfo:{},
                commentInfo:{},
                recommends:[], 
                themeTopYs: [],
                getThemeTopY: null,
                currentIndex:0,
                message:'',
                show:false
            }
    },
    created() {
        // 1.保存传入的iid
        // this.iid = this.$route.params.iid
        this.iid = this.$route.query.iid

        
        // 2.根据iid请求数据
        getDetail(this.iid).then(res=>{
            // console.log(res)
            const data = res.result;
            // 1.获取顶部的图片轮播数据
            this.topImages = res.result.itemInfo.topImages
            // 2.获取商品信息
            this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)
            // 3.创建店铺信息
            this.shop = new Shop(data.shopInfo)

            // 4.保存商品的详情数据
            this.detailInfo = data.detailInfo;

            // 5.获取参数信息
            this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)

            // 6.取出评论信息
            if(data.rate.cRate !== 0){
                this.commentInfo = data.rate.list[0]
            }

            // this.$nextTick(()=>{
            //     // 根据最新的数据，对应的DOM是已经被渲染出来
            //     // 但是图片依然是没有加载完(目前获取到offsetTop不包含其中的)
            //     this.themeTopYs.push(0);
            //     this.themeTopYs.push(this.$refs.params.$el.offsetTop);
            //     this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
            //     this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
            // })
        })

        // 3.请求推荐数据
        getRecommend().then(res=>{
            console.log(res)
            this.recommends = res.data.list
        })
        // 4.给getThemeTopY赋值
        this.getThemeTopY = debounce(()=>{
            this.themeTopYs = []
            this.themeTopYs.push(0);
            this.themeTopYs.push(this.$refs.params.$el.offsetTop);
            this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
            this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
            this.themeTopYs.push(Number.MAX_VALUE);
        },100)



    },
    methods: {
        ...mapActions(['addCart']),
        imageLoad() {
            this.refresh()
            this.getThemeTopY()

        },
        titleClick(index){
            // console.log(index)
            this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],200)
        },
        contentScroll(position){
            // 1.获取y值
            const positionY = -position.y
            // 2.positionY和主题中值进行对比
            // [0,7938,9120,9452]
            // positionY 在0-7938之间 index=0
            let length =this.themeTopYs.length;
            for(let i=0;i <length-1;i++){
                // if(positionY > this.themeTopYs[i] && positionY <this.themeTopYs[i+1]){
                    // 有bug到i=3时i+1=4取不到
                // }
                // if (this.currentIndex !== i &&(i < length - 1 && positionY >= this.themeTopYs[i] && positionY <this.themeTopYs[i+1]) || (i === length -1 && positionY >= this.themeTopYs[i])) {
                //     this.currentIndex = i;
                //     this.$refs.nav.currentIndex = this.currentIndex
                // }
                //性能提高方法
                if(this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY <this.themeTopYs[i+1])){
                    this.currentIndex = i;
                    this.$refs.nav.currentIndex = this.currentIndex
                }
            }
            this.isshowBackTop = (-position.y) > BACK_POSITION
        },
        addToCart() {
            // 1.获取购物车需要展示的信息
            const product = {}
            product.image = this.topImages[0]
            product.title = this.goods.title
            product.desc = this.goods.desc
            product.price = this.goods.realPrice
            product.iid = this.iid

            // // 2.将商品添加到购物车
            // this.$store.commit("addCart",product)
            this.addCart(product).then(res=>{
                // this.show = true;
                // this.message = res;

                // setTimeout(() => {
                //     this.show=false;
                //     this.message =''
                // }, 1500);
                this.$toast.show(res,2000)

            })
            // this.$store.dispatch("addCart",product).then(res=>{
            //     console.log(res)
            // })
        }
    },
    mounted() {
     
    },
    destroyed() {
        this.$bus.$off('itemImageLoad',this.itemImgListener)
    }
}
</script>

<style scoped>
    #detail {
        position: relative;
        z-index: 10;
        background-color:#fff;
        height: 100vh;
    }
    .detail-nav {
        position:relative;
        z-index : 9;
        background-color:#fff;
    }
    /* .content {
        height: calc(100% - 44px);
    } */
    .content{
        overflow: hidden;
        position: absolute;
        top: 44px;
        bottom: 49px;
        left: 0;
        right: 0;
    } 
</style>


