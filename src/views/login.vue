<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="logo">
            <div class="logoWrap">
                <img src="../images/logo_dl.png"/>
                <h2>欢迎登录</h2>
            </div>
        </div>
        <div class="login-wrap clearfix">
            <div class="login-con">
                <Card :bordered="false">
                    <div>
                        <Tabs @on-click="selectLogin" :tabValue="tabValue">
                            <TabPane label="账号密码登录" name="zh"></TabPane>
                            <TabPane label="短信密码登录" name="code"></TabPane>
                        </Tabs>
                    </div>
                    <div class="form-con">
                        <Form ref="loginForm" :model="form" :rules="rules" v-if="tabValue == 'zh'">
                            <FormItem prop="username">
                                <div class="ivu-input-wrapper ivu-input-type ivu-input-group ivu-input-group-with-prepend">
                                    <div class="ivu-input-group-prepend" style="">
                                        <Icon :size="16" type="ios-mail"></Icon>
                                    </div> 
                                    <i class="ivu-icon ivu-icon-load-c ivu-load-loop ivu-input-icon ivu-input-icon-validate"></i>
                                    <input autocomplete="off" spellcheck="false" type="text" v-model="form.username" placeholder="请输入邮箱地址" class="ivu-input" ref="username">
                                </div>
                            </FormItem>
                            <FormItem prop="password">
                                <div class="ivu-input-wrapper ivu-input-type ivu-input-group ivu-input-group-with-prepend">
                                    <div class="ivu-input-group-prepend" style="">
                                        
                                        <Icon :size="16" type="ios-unlock" />
                                    </div> 
                                    <i class="ivu-icon ivu-icon-load-c ivu-load-loop ivu-input-icon ivu-input-icon-validate"></i>
                                    <input autocomplete="off" spellcheck="false" type="password" v-model="form.password" placeholder="请输入密码" class="ivu-input" ref="password">
                                </div>
                            </FormItem>
                            <div class="forgetPassword">
                                <a href="javascript:;" @click="forgetP">忘记密码</a>
                            </div>
                            <FormItem>
                                <Button :loading="loading" @click="handleSubmit" type="primary" long>
                                    <span v-if="!loading">账号登录</span>
                                    <span v-else>登录中...</span>
                                </Button>
                            </FormItem>
                        </Form>
                        <Form ref="loginCode" :model="loginCode" :rules="rulesCode"  v-if="tabValue == 'code'">
                            <FormItem prop="telphone" style="margin-bottom:5px;">
                                <Input v-model="loginCode.telphone" placeholder="请输入邮箱账号">
                                    <span slot="prepend">
                                        <Icon :size="16" type="ios-mail"></Icon>
                                    </span>
                                </Input>
                                <p class="hint">向该账号绑定的手机号码发送动态密码</p>
                            </FormItem>
                            <FormItem prop="code">
                                <Input v-model="loginCode.code" placeholder="请输入验证码" class="login-code">
                                    <span slot="prepend">
                                        <Icon :size="16" type="ios-unlock"></Icon>
                                    </span>
                                </Input>
                                <Button @click="getCode('loginCode')" type="primary" :disabled="canGetIdentifyCode" :loading="sendCodeLoading" class="textLoginCode">{{code}}</Button>
                            </FormItem>
                            <FormItem>
                                <Button :loading="loadingDX" @click="textSubmit" type="primary" long>
                                    <span v-if="!loadingDX">短信登录</span>
                                    <span v-else>登录中...</span>
                                </Button>
                            </FormItem>
                        </Form>
                        <p class="login-tip clearfix">
                            <span class="wxLogin" @click="wechatLogin">微信登录</span>
                            <span class="register">没有账号?<a href="javascript:;" @click="loginBtn">去注册</a></span>
                            <div>
                                <a href="https://service.weibo.com/share/share.php?url=https://www.lubankf.com/admin/#/login&appkey=4094741482&title=鲁班客服&language=zh_cn" target="_blank" style="height:32px;line-height:32px;color:#c3c3c3;font-size:12px;">
                                    <img src="../images/weibo.png" title="分享微博" style="vertical-align: middle;">
                                    <span>微博分享</span>
                                </a>
                            </div>
                        </p>
                    </div>
                </Card>
                <div class="copyright">©2013-2018 北京合众康桥科技发展有限公司  京ICP备17074563号-4</div>
            </div>

        </div>
        
        <!-- 重置密码 -->
        <Modal
                v-model="resetModal"
                title="重置密码"
                width="500">
            <Form ref="resetPassword" :model="resetPassword" :rules="resetPassword_rules" :label-width="80">
                <FormItem prop="telphone" label="邮箱地址">
                    <Input type="text" v-model="resetPassword.telphone" placeholder="请填写邮箱地址"></Input>
                </FormItem>
                <FormItem prop="code" label="验证码">
                    <Input v-model="resetPassword.code" placeholder="请填写验证码" style="width:280px"></Input>
                    <Button @click="getCode('reset')" type="primary" :disabled="canGetIdentifyCode">{{code}}</Button>
                </FormItem>
                <FormItem prop="password" label="密码">
                    <Input type="password" v-model="resetPassword.password" placeholder="请填写密码"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="resetModal=false">取消</Button>
                <Button type="primary" @click="resetPasswordBtn('resetPassword')">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import Cookies from 'js-cookie';
    import {getUserLogin, sendCode, getToken, forgetPassword, textLogin} from '@/libs/api';
    import util from '@/libs/util';
    export default {
        data () {
            const validateMobile = (rule, value, callback) => {
                var reg=/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
                if (!reg.test(value)) {
                    callback(new Error('邮箱格式有误'));
                } else {
                    callback();
                }
            };
            return {
                form: {
                    password: ''
                },
                loading:false,
                loadingDX:false,
                loginCode:{},  //短信登录
                resetModal:false,  //重置密码
                resetPassword:{},
                canGetIdentifyCode: false, // 是否可点获取验证码
                sendCodeLoading:false,
                code:'获取验证码',
                tabValue:'zh',
                rules: {
                    username: [
                        { required: true, message: '账号不能为空', trigger: 'blur' },
                        {validator: validateMobile, trigger: 'blur'}
                    ],
                    password: [
                        { required: true, message: '密码不能为空', trigger: 'blur' }
                    ]
                },
                rulesCode:{
                    telphone: [
                        { required: true, message: '请填写邮箱地址', trigger: 'blur' },
                        {validator: validateMobile, trigger: 'blur'}
                    ],
                    code: [
                        { required: true, message: '请填写验证码', trigger: 'blur' }
                    ]
                },
                resetPassword_rules:{
                    telphone: [
                        { required: true, message: '请填写邮箱地址', trigger: 'blur' },
                        {validator: validateMobile, trigger: 'blur'}
                    ],
                    password: [
                        { required: true, message: '请填写密码', trigger: 'blur' }
                    ],
                    code: [
                        { required: true, message: '请填写验证码', trigger: 'blur' }
                    ]
                },
                tuiUsername:'',  //推荐人username
                nickName:''
            };
        },
        mounted(){
            setTimeout(() => {
                    document.querySelectorAll('object')[0].style.zIndex="0";
            }, 20);
            var t = this.$route.query.wxtoken;
            if(t){
                this.form.wxtoken = t;
                this.loginCode.wxtoken = t;
            }
        },
        methods: {
            //账号密码登录
            handleSubmit() {
                if(this.tabValue != 'zh') return false;
                this.$refs.loginForm.validate((valid) => {
                    if(this.$refs.username.value!='' && this.$refs.password.value!=''){
                        valid = true;
                        this.form.email = this.$refs.username.value;
                        this.form.password = this.$refs.password.value;
                    }
                    if (valid) {
                        this.loading = true;
                        getUserLogin(this.form).then(res => {
                            this.loading = false;
                            if(res.code == 0){
                                this.loginSuccess(res.data);
                            }else{
                                this.$Notice.warning({title:res.msg});
                            }
                        }).catch(error => {
                            this.$Notice.error({title:error});
                        })
                    }
                })
            },


            //短信登录
            textSubmit(){
                this.$refs.loginCode.validate((valid) => {
                    if (valid) {
                        this.loadingDX = true;
                        this.loginCode.email = this.loginCode.telphone;
                        this.loginCode.sms_code = this.loginCode.code;
                        textLogin(this.loginCode).then(res => {
                            this.loadingDX = false;
                            if(res.code == 0){
                                this.loginSuccess(res.data);
                            }else{
                                this.$Notice.warning({ title: res.msg });
                            }
                        }).catch(error => {
                                this.$Notice.error({title:error});
                        })
                    }
                })
            },


            //登录成功
            loginSuccess(msg){
                sessionStorage.login_data = JSON.stringify(msg.member);
                localStorage.nowtime = msg.nowtime;
                sessionStorage.setItem('access_token',msg.access_token); 
                sessionStorage.setItem('recommendActive',msg.RecommendActive); 
                this.$store.commit('updatemax_service_num',msg.member.max_service_num);
                this.$store.commit("setAccessToken",msg.access_token);
                this.$store.commit("updateUsername",msg.member.username)
                this.$store.commit("updateHeadimg",msg.member.headImg)
                this.$store.commit("updateUserInfo",msg.member)
                this.$store.commit('updateResponse', false);
                let t = Math.round(new Date() / 1000);
                let y = Number(msg.nowtime);
                let o = t - y;  
                localStorage.differ = o;

                this.$router.push({
                    name: 'home_index'
                });
                // 调用方法，动态生成路由
                util.initRouter(this);
            },


            //选择登录方式
            selectLogin(name){
                this.tabValue = name;
                try {
                    this.$refs.loginCode.resetFields();
                } catch (error) {
                    
                }
                try {
                    this.$refs.loginForm.resetFields();
                } catch (error) {
                    
                }
                    
            },

            
            //发送验证码
            getCode(type){
                var data = {};
                let _telphone = "";
                if(type == "reset"){  //重置密码
                    _telphone = this.resetPassword.telphone;
                    data.type = "forgetPassword";
                }else if(type == 'loginCode'){ //短信登录
                    _telphone = this.loginCode.telphone;
                    data.type = 'smsLogin';
                }
                data.email = _telphone;
                if(_telphone == '' || _telphone == undefined){
                    this.$Notice.warning({ title: '请输入邮箱地址' });
                    return false;
                }
                this.sendCodeLoading = true;
                sendCode(data).then(res => {
                    if(res.code == 0){
                        this.canGetIdentifyCode = true;
                        this.$Notice.success({ title: '发送成功' });
                        this.sendCodeLoading = false;
                        let num = 60;
                        var str = setInterval(() => {
                            num-=1;
                            this.code = num + '秒后重试';
                            if(num == 0){
                                clearInterval(str);
                                this.code = '获取验证码';
                                this.canGetIdentifyCode = false;
                            }
                        }, 1000);
                    }else{
                        this.$Notice.error({ title: res.msg });
                    }
                })
            },
           
            //注册
            loginBtn(){
                this.$router.push({
                    path: '/register'
                });
            },
            //忘记密码
            forgetP(){
                this.resetModal = true;
            },
            resetPasswordBtn(name){
                this.$refs[name].validate((valid) => {
                    if (valid) {
                    	this.resetPassword.email = this.resetPassword.telphone;
                        forgetPassword(this.resetPassword).then(res => {
                            if(res.code == 0){
                            this.$Notice.success({ title: res.msg });
                            this.resetModal = false;
                            this.resetPassword = {};
                        }else{
                            this.$Notice.error({ title: res.msg });
                        }
                    })
                    }
                })
            },

            //微信登录
            wechatLogin(){
                window.location.href = `${this.$store.state.app.LUBAN_URL}site/wechat-login.htm`;
            }
        },



    };
</script>
<style lang="less" scoped>
    .login-code{
        width:234px;
        float:left;
    }
    .textLoginCode{
        margin-left:10px;
    }
    .recommend{
        text-align:right;
        line-height:24px;
        color:darkorange;
    }
    .hint{
        color:#999;
    }
</style>

