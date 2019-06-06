<style lang="less">
    @import './login.less';
</style>
<template>
    <div class="login">
        <div class="logo">
            <div class="logoWrap">
                <img src="../images/logo_dl.png"/>
                <h2>账户注册</h2>
            </div>
        </div>
        <div class="registerWrap">
            <Steps :current="current">
                <Step title="手机验证"></Step>
                <Step title="填写信息"></Step>
            </Steps>
            <Form ref="register" :model="register" :rules="reginster_rules" :label-width="0">
                <div v-if="current==0">
                    <FormItem prop="mobile" label="">
                        <Input type="text" v-model="register.mobile" @on-keyup="changeMobile" placeholder="手机号码"></Input>
                    </FormItem>
                    <FormItem prop="mobile" label="">
                        <div id="your-dom-id" class="nc-container"></div>
                    </FormItem>
                    <FormItem prop="sms_code" label="" class="code">
                        <Input v-model="register.sms_code" @on-change="changeCode" placeholder="动态码"></Input>
                        <Button class="getCode" type="primary" @click="getCode" :disabled="canGetIdentifyCode">{{code}}</Button>
                    </FormItem>
                    <FormItem v-if="referrer" label="">
                        <p class="is_referrer">推荐人 <span>{{referrer}}</span></p>
                    </FormItem>
                    <div class="agreement">
                        <Checkbox v-model="check">
                            注册即代表您同意我们的
                            <a href="javascript:;" @click="agreementModal=true">服务协议</a>
                        </Checkbox>
                    </div>
                </div>
                <div v-if="current==1">
                    <FormItem prop="company" label="">
                        <Input v-model="register.company" placeholder="企业名称"></Input>
                    </FormItem>
                    <FormItem prop="email" label="">
                        <Input v-model="register.email" placeholder="邮箱地址(做为登录账号)"></Input>
                    </FormItem>
                    <FormItem prop="password" label="">
                        <Input type="password" v-model="register.password" placeholder="密码"></Input>
                    </FormItem>
                </div>
            </Form>
            <Button type="primary" long size="large" @click="nextStep('register')" v-if="current==0">下一步</Button>
            <Button type="primary" long size="large" @click="reginsterModal('register')" v-if="current==1">注册</Button>
            <p class="goLogin">已有账号?<a href="javascript:;" @click="registerHide">去登录</a></p>
        </div>
        <div class="copyright">©2013-2018 北京合众康桥科技发展有限公司  京ICP备17074563号-4</div>

        <Modal v-model="agreementModal" class="imgModal" width="980">
            <h2>鲁班客服服务条款</h2>
            <h3>关于</h3>
            <p>本服务条款是您与北京合众康桥科技发展有限公司（下称合众）之间的协议。lubankf.com（下称本服务） 是由合众提供的互联网软件服务。在本服务创建账户并使用之前，您必须首先同意此条款。</p>
            <p>此条款在必要时将进行修订，且毋须另行通知。修订后的条款一旦在网页上公布即有效代替原来的服务条款。</p>
            <h3>账户</h3>
            <p>您同意并理解您有责任将您与用于获得服务的任何帐户相关的密码保密。您负责对您账户下发生的所有的行为和内容负责。</p>
            <h3>付款</h3>
            <p>您注册本服务或其中某服务，即表示您同意支付其中的所有费用。</p>
            <p合众可能要求您提供经我们认可的发卡机构发行的信用卡卡号来激活您的服务，和/或支付服务的任何相关费用。合众将从您提供的帐户或信用卡帐户中收取使用费及其他费用。如果授权合众通过信用卡收取您的账户相关费用，即表示您授权合众自动从该卡持续扣除账户相关的所有费用。</p>
            <p>除非因为合众方面的问题导致本服务无法正常提供，您支付的有关本服务的所有费用均不能退款。</p>
            <h3>内容和版权</h3>
            <p>合众对您在本服务提交的内容没有所有权，这些内容的所有权仍然归您所有。但是，如果您将页面设置为公开，就意味着您允许其他人查看</p>
            <p>您明白合众对他人提供的任何内容不在任何方面负责或负有责任，合众没有义务预先审查此类内容。但是，合众有权随时决定内容是否合适和与本条款相符；如果发现此类内容违反本条款或在其他方面令人反感，合众可随时并有绝对酌情权预先审查、转移、拒绝、修改和/或删除内容，而不需事先通知。</p>
            <p>本服务的外观设计与专利归合众所有。未经合众书面许可，您不能复制、拷贝，或者重用任何部分代码和外观设计。</p>
            <h3>隐私政策</h3>
            <p>使用本服务，即表示您同意合众合法收集和使用有关您及您所使用本服务的技术性或诊断性信息。收集到的些信息将用于改进网页的内容，提升我们的服务品质。</p>
            <p>合众不会将您的信息和内容分享或出售给其他的组织。但以下情况除外：</p>
            <ul>
                <li>▪ 您同意让第三方共享资料;</li>
                <li>▪ 合众需要听从法庭传票、法律命令或遵循法律程序;</li>
                <li>▪ 您违反了本条款。</li>
            </ul>
            <h3>终止</h3>
            <p>您可随时终止您的帐户和/或停用本服务。您在服务终止前支付的任何费用均不能退还（除本服务条款另有明文允许者除外）。</p>
            <p>合众可在特定情况下，不需事先通知，可终止或暂停你所使用的账户和服务。此情况的原因包括但不限于：</p>
            <ul>  
                <li>▪ 违反本服务条款；</li>
                <li>▪ 您要求取消或终止您的帐户；</li>
                <li>▪ 需要听从法庭传票、法律命令或遵循法律程序；</li>
                <li>▪ 突发的自然灾害导致的问题；</li>
                <li>▪ 战争、军事行动、暴动或武装叛乱；</li>
                <li>▪ 您没有支付与本服务相关的费用；</li>
                <li>▪ 一旦您的帐户被终止，阁下将无法正常使用本服务。此外，您可以选择删除您账户下的所有信息和内容。</li>
            </ul>
            <p>©北京合众康桥科技发展有限公司 保留一切权利。</p>
        </Modal>
    </div>
</template>
<script>
    import {register, sendCode, ncpc, referrer} from '@/libs/api';
    import {url} from '@/mixins/mixin';
    export default {
        mixins:[url],
        data(){
            return{
                agreementModal:false,
                check:false,
                register: {},
                canGetIdentifyCode: true, // 是否可点获取验证码
                code:'获取验证码',
                current:0,
                reginster_rules:{
                    mobile: [
                        { required: true, message: '请填写手机号', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请填写密码', trigger: 'blur' }
                    ],
                    sms_code: [
                        { required: true, message: '请填写验证码', trigger: 'blur' }
                    ],
                    company: [
                        { required: true, message: '请填写企业名称', trigger: 'blur' }
                    ],
                    email: [
                        { required: true, message: '请填写邮箱', trigger: 'blur' },
                        { type: 'email', message: '邮箱格式错误!', trigger: 'blur' }
                    ],
                },
                nc_token:null,
                NC_Opt:null,
                appkey:'FFFF0N00000000006BFB',//'CF_APP_1',
                status:"",
                referrer: ''
            }
        },
        mounted() {
            this.init();
            if(this.$route.query.id){
                this.getReferrer();
            }
        },
        methods:{
            //第一步
            nextStep(name){
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if(!this.check){
                            this.$Notice.warning({ title: "请勾选同意注册服务协议" });
                            return false;
                        }
                        var data = {
                            mobile:this.register.mobile,
                            sms_code:this.register.sms_code,
                            step:1
                        }
                        this.lbRegister(data);
                    }
                })
            },

             //第二步
            reginsterModal(name){
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        var data = {
                            mobile:this.register.mobile,
                            email:this.register.email,
                            password:this.register.password,
                            company:this.register.company,
                            step:2
                        }
                        if(this.$route.query.id) data.invite_code = this.$route.query.id;
                        this.lbRegister(data);
                    }   
                })
            },
            
            //注册
            lbRegister(data){
                register(data).then(res => {
                    if(res.code == 0){
                        this.registerShow = false;
                        this.$Notice.success({ title: res.msg });
                        this.current = 1;
                        if(data.step == 2){
                            this.$router.push({
                                name:'login'
                            })
                        }
                    }else{
                        this.$Notice.error({ title: res.msg });
                    }
                })
            },


            //动态码
            changeCode(){
                if(this.register.mobile && this.status){
                    this.canGetIdentifyCode = false
                }else{
                    this.canGetIdentifyCode = true
                }
            },


            //发送验证码
            getCode(type){
                var data = {
                    mobile:this.register.mobile,
                    type:'zhuce'
                };
                this.canGetIdentifyCode = true;
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
                sendCode(data).then(res => {
                    if(res.code == 0){
                        
                    }else{
                        clearInterval(str);
                        this.code = '获取验证码';
                        this.canGetIdentifyCode = false;
                        this.$Notice.error({ title: res.msg });
                    }
                })
            },

            //取消
            registerHide(){
                this.$router.push({
                    path:'/login'
                })
            },
            
            //填写手机号
            changeMobile(){
                if(this.register.mobile && this.register.mobile.length >= 11){
                    __nc.reset();
                }
            },

            init(){
                var that = this;
                this.nc_token = [this.appkey, (new Date()).getTime(), Math.random()].join(':');
                this.NC_Opt = 
                {
                    renderTo: "#your-dom-id",
                    appkey: this.appkey,
                    scene: "nc_register",
                    token: this.nc_token,
                    customWidth: 444,
                    // trans:{"key1":"code0"},
                    elementID: ["usernameID"],
                    is_Opt: 0,
                    language: "cn",
                    isEnabled: true,
                    timeout: 3000,
                    times:5,
                    apimap: {},   
                    callback: function (data) { 
                        that.status = data.csessionid;
                        if(that.register.mobile) that.validateNc(data);
                    }
                }
                that.generarte();
            },

            validateNc(data){
                data.mobile = this.register.mobile;
                data.nc_token = this.nc_token;
                data.scene = "nc_register";
                ncpc(data).then(res => {
                    if(res.Code == 100){
                        if(this.register.mobile){
                            this.canGetIdentifyCode = false
                        }else{
                            this.canGetIdentifyCode = true
                        }
                    }else{
                        console.log(res)
                    }
                })
            },

            generarte(){
                var nc = new noCaptcha(this.NC_Opt)
                nc.upLang('cn', {
                    _startTEXT: "请按住滑块，拖动到最右边",
                    _yesTEXT: "验证通过",
                    _error300: "哎呀，出错了，点击<a href=\"javascript:__nc.reset()\">刷新</a>再来一次",
                    _errorNetwork: "网络不给力，请<a href=\"javascript:__nc.reset()\">点击刷新</a>",
                });
            },

            //获取邀请人信息
            getReferrer(){
                referrer({invite_code: this.$route.query.id}).then(res =>{
                    if(res.code == 0){
                        this.referrer = res.data.invite_username;
                    }else{
                        this.$Notice.warning({title: res.msg});
                    }
                })
            }

        }
    }
</script>
<style lang="less">
    .nc-container .nc_scale span{
        height:56px;
        line-height:56px;
    }
    .nc-container .nc_scale .btn_ok{
        line-height:56px;
        color: #2d8cf0;
    }
    .nc_scale {
        background: #e8e8e8; /* 默认背景色 */
        height:56px;
    }
    ￼.nc_scale .scale_text {
        color: #9c9c9c; /* 默认字体颜色 */
    }
    .nc-container .nc_scale .nc_ok, .nc-container .nc_scale .nc_bg {
        background: #2d8cf0; /* 滑过时的背景色 */
    }
    .nc_scale .scale_text2 {
        color: #fff; /* 滑过时的字体颜色 */
    }
    .agreement{
        margin-bottom:20px;
    }
    .imgModal{
        color:#666;
        h2{
            font-size:20px;
            text-align:center;
            margin:30px 0 45px 0;
        }
        h3{
            font-size:16px;
        }
        p{
            line-height:34px;
            margin:8px 0;
            text-indent:2em;
        }
        li{
            line-height:34px;
            text-indent:2em;
            list-style: none
        }
        .ivu-modal-body{
            padding:30px;
        }
    }
    .is_referrer{
        font-size:16px;
        span{
            color:#2d8cf0;
            margin-left:10px;
        }
    }
</style>

