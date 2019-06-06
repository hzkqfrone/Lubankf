<template>
    <div class="profileWrap">
        <div class="titleTop">
            <div class="configTitle">
                <router-link to="/config">
                    <Icon type="md-arrow-round-back" />
                    <h2>个人设置</h2>
                </router-link>
            </div>
        </div>
        <div class="configTop"></div>
        <div class="profile">
            <Divider orientation="left">个人信息</Divider>
            <Form :label-width="80" label-position="right" style="width:600px">
                <FormItem label="头像">
                    <upload-img @uploadpcImg="uploadLogo" :imgUrl="infoData.headImg"></upload-img>
                </FormItem>
                <FormItem label="姓名">
                    <Input v-model="infoData.username"></Input>
                </FormItem>
                <FormItem label="电话">
                    <Input v-model="infoData.mobile"></Input>
                </FormItem>
                <FormItem label="邮箱">
                    <Input v-model="infoData.email" disabled></Input>
                </FormItem>
                <FormItem label="到期时间">
                    <span style="color:red">{{infoData.expire_time}}</span>
                </FormItem>
                <div class="sureBtn">
                    <Button type="primary" :loading="infoLoading" @click="submitUserInfo">提交</Button>
                </div>
            </Form>
            <Divider orientation="left">修改密码</Divider>
            <Form :label-width="80" label-position="right" style="width:600px" ref="password" :model="pw" :rules="rules">
                <FormItem label="旧密码" prop="OriginalPassword">
                    <Input type="password" v-model="pw.OriginalPassword"></Input>
                </FormItem>
                <FormItem label="密码" prop="Password">
                    <Input type="password" v-model="pw.Password"></Input>
                </FormItem>
                <FormItem label="确定密码" prop="RePassword">
                    <Input type="password" v-model="pw.RePassword"></Input>
                </FormItem>
                <div class="sureBtn">
                    <Button type="primary" :loading="pwLoading" @click="submitPassword">提交</Button>
                </div>
            </Form>
        </div>
        
        <Modal
            v-model="addTagModal"
            title="添加标签">
            <Form :label-width="100" label-position="left">
                <FormItem label="标签名称">
                    
                </FormItem>
            </Form>
            </Form>
            <div slot="footer">
                <Button>取消</Button>
                <Button type="primary">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import uploadImg from '@/views/my-components/uploadImg/uploadImg';
import {getUserInfo, edittUserInfo, alterPassword} from '@/libs/api';
export default {
    data(){
        return {
            showSpin:false,
            addTagModal:false,
            infoData:{},  //个人信息
            infoLoading:false,  //个人信息提交
            pwLoading:false,  //提交密码
            pw:{},   //修改密码
            rules: {
                OriginalPassword: [
                    { required: true, message: '请填写旧密码', trigger: 'blur' },
                ],
                Password: [
                    { required: true, message: '请填写新密码', trigger: 'blur' }
                ],
                RePassword: [
                    { required: true, message: '请再次填写新密码', trigger: 'blur' }
                ]
            },
        }
    },
    mounted() {
        this.initUserInfo();
    },
    methods:{    
        //加载个人信息
        initUserInfo(){
            getUserInfo().then(res => {
                if(res.code == 0){
                    this.infoData = res.data;
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        // 修改个人信息
        submitUserInfo(){
            this.infoLoading = true;
            if(!this.infoData.username){
                this.$Notice.error({title: "请填写姓名"}); 
                return false;
            }
            edittUserInfo(this.infoData).then(res => {
                this.infoLoading = false;
                if(res.code == 0){
                    this.$Notice.success({title: res.msg});
                    this.$store.commit('updateUsername',this.infoData.username);
                    this.$store.commit('updateHeadimg',this.infoData.headImg);
                    var info = sessionStorage.login_data ? JSON.parse(sessionStorage.login_data) : {};
                    info.username = this.infoData.username;
                    info.headImg = this.infoData.headImg;
                    sessionStorage.login_data = JSON.stringify(info);
                }else{
                   this.$Notice.error({title: res.msg}); 
                }
            })
        },

        //修改密码
        submitPassword(){
            this.$refs.password.validate((valid) => {
                if (valid) {
                    if(this.pw.Password != this.pw.RePassword){
                        this.$Notice.error({title: "填写两次新密码不一致"});
                        return false; 
                    }
                    this.pwLoading = true;
                    alterPassword(this.pw).then(res => {
                        this.pwLoading = false;
                        if(res.code == 0){
                            this.pw = {};
                            this.$Notice.success({title: res.msg}); 
                        }else{
                            this.$Notice.error({title: res.msg}); 
                        }
                    })
                }
            })
        },

        //上传头像
        uploadLogo(data){
            if(data.status){
                this.infoData.headImg = data.url;
            }else{
                this.infoData.headImg = "";
            }
        }
    },
    components:{
        uploadImg
    }
}
</script>


<style lang="less" scoped>
    .profileWrap{
        background:#fff;
        padding:20px;
        .sureBtn{
            width:100%;
            text-align: center;
            padding-bottom:20px;
        }
        .profile{
            height: 100%;
            overflow-y: auto;
        }
    }
</style>
