<template>
    <div class="check-button" :class="{check:isChecked}">
        <img src="~assets/img/cart/tick.svg" alt="">
    </div>
</template>
<script>
export default {
    props: {
        isChecked: {
            type: Boolean,
            default:false
        }
    }
}
</script>
<style scoped>
    .check-button {
        border: 2px solid #ccc;
        border-radius: 50%;
    }
    .check {
        border-color:#ff8198;
        background-color: #ff8198;
    }
</style>
