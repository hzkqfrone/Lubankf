<template>
    <div>
        <div class="demo-upload-list" v-if="(imgSrc!='' || imgUrl!='')">
            <template>
                <img :src="imgSrc || imgUrl">
                <div class="demo-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleRemove"></Icon>
                </div>
            </template>
        </div>
        
        <Upload
            v-show="imgSrc==''&&imgUrl==''"
            ref="upload"
            :show-upload-list="false"
            :on-success="handleSuccess"
            :format="['jpg','jpeg','png','gif']"
            :max-size="2048"
            :on-format-error="handleFormatError"
            :on-exceeded-size="exceededSize"
            :data="upLoadData"
            multiple
            type="drag"
            :action="action"
            name="image"
            style="display: inline-block;width:58px;">
            <div style="width: 58px;height:58px;line-height: 58px;">
                <Icon type="ios-camera" size="20"></Icon>
            </div>
        </Upload>
        <Modal :footer-hide="true" v-model="visible">
            <img :src="imgName" v-if="visible" style="width: 100%">
        </Modal>
    </div>
</template>
<script>
    import { url, beyondSize } from '@/mixins/mixin';
    export default {
        mixins:[url, beyondSize],
        props:['imgUrl'],
        data () {
            return {
                action:'', //上传图片接口路径
                upLoadData:{},
                imgName: '',
                visible: false,
                uploadList: [],
                imgSrc:'',
            }
        },
        methods: {
            handleView (name) {
                this.imgName = this.imgUrl || this.imgSrc;
                this.visible = true;
            },
            handleRemove(){
                this.imgSrc = "";
                this.$emit('uploadpcImg',{status:false});
            },
            handleSuccess (res, file) {
                this.imgSrc = res.data.url;
                this.imgUploadSuccess();
            },

            imgUploadSuccess(){
                this.$emit('uploadpcImg',{url: this.imgSrc,status:true});
            },
            handleFormatError (file) {
                this.$Notice.warning({
                    title: '文件格式有误',
                });
            },

            //更新图片
            updatedImg(img){
                this.imgName = img;
                this.imgSrc = img;
            }
        },
        mounted () {
            this.action = `${url}api/upload/image.htm`;
            this.upLoadData = {
                'Access-Token': this.$store.state.app.access_token
            }  
        },
    }
</script>
<style>
    .demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>