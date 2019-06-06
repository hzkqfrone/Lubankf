<template>
    <span class="del" @click="delFilItem"><Icon type="ios-remove-circle-outline" />移除</span>
</template>
<script>
export default {
    props:['index'],
    methods:{
        delFilItem(){
            console.log(this.index);
        }
    }
}
</script>
