<template>
    <div class="repository">
        <div class="repBox">
            <div class="titleTop replyT">
                <div class="configTitle">
                    <router-link to="/config/template">
                        <Icon type="md-arrow-round-back" />
                        <h2>知识模板详情</h2>
                    </router-link>
                </div>
            </div>
            <div class="repositoryContent clearfix configTop">
                <Form :label-width="120">
                    <Form-item label="问题:">
                        <p>取出跟当时做的时候手段一样么</p>
                    </Form-item>
                    <Form-item label="分类:">
                        <p>隆胸</p>
                    </Form-item>
                    <Form-item label="答案:">
                        <p>胸假体取出和植入胸假体，手术切口和流程是相似的，我们会在原切口切开，剥离开假体所在的层次，将假体取出</p>
                    </Form-item>
                </Form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
       return{

       }
    },
    mounted(){

    },
    methods:{
        
    }
}
</script>


<style lang="less">
    .repository{
        height: 100%;
        .repBox{
            height:100%;
            padding:20px;
            .repositoryContent{
                height:100%;
                margin-top:20px;
            }
        }
    }
</style>
