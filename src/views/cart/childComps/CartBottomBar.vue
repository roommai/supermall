<template>
    <div class="bottom-bar">
        <div class="check-content">
            <check-button :is-checked="isSelectAll" class="check-button" @click.native="checkClick"/>
            <span>全选</span>
        </div>
        <div class="price">
            合计:{{totalPrice}}
        </div>

        <div class="calculate" @click="calcClick">
            去计算({{checkLength}})
        </div>
    </div>
</template>
<script>
import CheckButton from 'components/content/checkButton/CheckButton'

import {mapGetters} from 'vuex'
export default {
    components:{
        CheckButton
    },
    computed: {
        ...mapGetters(['cartList']),
        totalPrice(){
            return '￥' +this.$store.state.cartList.filter(item=>{
                return item.checked
            }).reduce((preVaule,item) =>{
                return preVaule + item.price * item.count
            },0).toFixed(2)
        },
        checkLength() {
            return this.$store.state.cartList.filter(item=> item.checked).length
        },
        isSelectAll(){
            // 1.先找下里面东西有没有不被选中的,有的话返回数组有长度,那么取反就为false
            // return !(this.cartList.filter(item=> !item.checked).length)
            // 2.查找有没有不被选中的,有的话去反为false
            if(this.cartList.length === 0){
                return false
            }else{
                 return !this.cartList.find(item=>!item.checked)
            }
        }
    },
    methods:{
        checkClick(){
            if(this.isSelectAll){
                //全部选中
                this.cartList.forEach(item=>item.checked =false)
            }else{
                this.cartList.forEach(item=>item.checked =true)
            }
            
        },
        calcClick() {
            if(!this.isSelectAll){
                this.$toast.show('请选择购买的商品',2000)
            }
        }
    }
}
</script>

<style scoped>
    .bottom-bar{
        position:relative;
        display:flex;
        height:40px;
        line-height: 40px;
        background-color: #eee;
               
    }

    .check-content{
        display:flex;
        align-items: center;
        margin-left:10px;
        width:60px;
    }
    .check-button{
        width: 20px;
        height:20px;
        line-height: 20px;
        margin-right:5px;
    }
    .price{
        margin-left:20px;
        flex:1
    }
    .calculate{
        background-color: orangered;
        width:90px;
        color: #fff;
        text-align:center;
    }
</style>

