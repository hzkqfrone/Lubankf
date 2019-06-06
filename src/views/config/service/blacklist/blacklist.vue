<template>
    <div class="accreditWrap">
        <div class="titleTop">
            <div class="configTitle">
                <router-link to="/config">
                    <Icon type="md-arrow-round-back" />
                    <h2>黑名单</h2>
                </router-link>
            </div>
        </div>
        <div class="configTop"></div>
        <div class="blacklist">
            <Tabs :value="tabValue" @on-click="selectTabs">
                <TabPane label="访客黑名单" name="0"></TabPane>
                <TabPane label="IP黑名单" name="1"></TabPane>
                <TabPane label="已失效IP黑名单" name="2"></TabPane>
            </Tabs>
            <Table v-if="tabValue=='0'" stripe :loading="showLoading" :columns="columnsData" :data="resData"></Table>
            <div v-if="tabValue=='1' || tabValue=='2'">
                <Button v-if="tabValue=='1'" type="primary" @click="addBlack" class="addIpBlack">添加 I P 范围</Button>
                <Table stripe :loading="showLoading" :columns="columnsIpData" :data="resData"></Table>
            </div>
        </div>
        <!-- 添加ip黑名单 -->
        <Modal
            v-model="addBlackModal"
            :title="ipTitle">
            <Form :label-width="80">
                <FormItem label="模式">
                    <Select style="width:370px" v-model="ipPattern" @on-change="changePattern">
                        <Option value="0">IP输入模式</Option>
                        <Option value="1">IP区间输入模式</Option>
                    </Select>
                </FormItem>
                <FormItem label="">
                    <div class="ipWrap">
                        <input type="number" v-model="ipStart.ipS_1" @keyup="changeIp(ipStart.ipS_1,1),ipStart.ipS_1=replaceIp(ipStart.ipS_1)">
                        <i>.</i>
                        <input type="number" ref="ipInput2" v-model="ipStart.ipS_2" @keyup="changeIp(ipStart.ipS_2,2),ipStart.ipS_2=replaceIp(ipStart.ipS_2)">
                        <i>.</i>
                        <input type="number" ref="ipInput3" v-model="ipStart.ipS_3" @keyup="changeIp(ipStart.ipS_3,3),ipStart.ipS_3=replaceIp(ipStart.ipS_3)">
                        <i>.</i>
                        <input type="number" ref="ipInput4" v-model="ipStart.ipS_4" @keyup="changeIp(ipStart.ipS_4,4),ipStart.ipS_4=replaceIp(ipStart.ipS_4)">
                    </div>
                    <span style="margin:0 10px;" v-show="ipPattern=='1'">-</span>
                    <div class="ipWrap" v-show="ipPattern=='1'">
                        <input type="number" v-model="ipEnd.ipS_1" @keyup="changeEndIp(ipEnd.ipS_1,1),ipEnd.ipS_1=replaceIp(ipEnd.ipS_1)">
                        <i>.</i>
                        <input type="number" ref="ipEndInput2" v-model="ipEnd.ipS_2" @keyup="changeEndIp(ipEnd.ipS_2,2),ipEnd.ipS_2=replaceIp(ipEnd.ipS_2)">
                        <i>.</i>
                        <input type="number" ref="ipEndInput3" v-model="ipEnd.ipS_3" @keyup="changeEndIp(ipEnd.ipS_3,3),ipEnd.ipS_3=replaceIp(ipEnd.ipS_3)">
                        <i>.</i>
                        <input type="number" ref="ipEndInput4" v-model="ipEnd.ipS_4" @keyup="changeEndIp(ipEnd.ipS_4,4),ipEnd.ipS_4=replaceIp(ipEnd.ipS_4)">
                    </div>
                </FormItem>
                <FormItem label="屏蔽时间">
                    <Select style="width:370px" v-model="addIpparams.expire_time">
                        <Option :value="0">长期屏蔽</Option>
                        <Option :value="0.5">屏蔽半小时</Option>
                        <Option :value="1">屏蔽1小时</Option>
                        <Option :value="2">屏蔽2小时</Option>
                        <Option :value="6">屏蔽6小时</Option>
                        <Option :value="24">屏蔽24小时</Option>
                        <Option :value="7*24">屏蔽7天</Option>
                    </Select>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="cancel">取消</Button>
                <Button type="primary" @click="sureAddIPBlack" :loading="btnLoading">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import {getBlacklist, addIpBlack, delBlacklist} from '@/libs/api';
export default {
    data(){
        return {
            showLoading:true,
            addBlackModal:false,  //添加ip modal
            resData:[],
            tabValue:'0',
            ipPattern:'0',  //模式
            ipTitle:'添加 IP 黑名单',
            btnLoading:false,
            ipStart:{
                ipS_1:'',
                ipS_2:'',
                ipS_3:'',
                ipS_4:'',
            },
            ipEnd:{
                ipS_1:'',
                ipS_2:'',
                ipS_3:'',
                ipS_4:'',
            },
            ipParams:{    
                type: 0,
                label: 1
            },
            addIpparams:{},  //添加ip黑名单参数
            delParams:{},    //删除黑名单参数
            columnsData:[
                {
                    key: 'username',
                    title: '昵称'
                },
                {
                    key: 'createTime',
                    title: '拉黑时间'
                },
                {
                    key: 'createUser',
                    title: '操作人'
                },
                {
                    key: 'notes',
                    title: '操作原因'
                },
                {
                    title: '操作',
                    key: 'action',
                    render: (h, params) => {
                        return h('Poptip', {
                            props: {
                                confirm: true,
                                title: '您确定要删除吗?',
                                transfer: true
                            },
                            on: {
                                'on-ok': () => {
                                    this.delParams = {
                                        id: params.row.id,
                                        type: 1  
                                    }
                                    this.delete();
                                }
                            }
                        }, [
                            h('Button', {
                                style: {
                                    margin: '5px'
                                },
                                props: {
                                    type: 'error',
                                    size: 'small'
                                }
                            }, '移除')
                        ])
                    }
                }
            ],
            columnsIpData:[
                {
                    key: 'createTime',
                    title: '拉黑ip',
                    render:(h, params) => {
                        var s = params.row.start_ip;
                        var e = params.row.end_ip;
                        var ip = "";
                        if(s == e){
                            ip = s;
                        }else{
                            ip = s + '至' + e
                        }
                        return h('div',ip);
                    }
                },
                {
                    key: 'expire_time',
                    title: '有效期'
                },
                {
                    key: 'createUser',
                    title: '操作人'
                },
                {
                    title: '操作',
                    key: 'action',
                    render: (h, params) => {
                        var btn = [];
                        btn.push(h('Button', {
                                style: {
                                    margin: '5px'
                                },
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                },
                                on:{
                                    click: () => {
                                        this.editIp(params.index);
                                    }
                                }
                            }, '编辑'),);

                        if(this.ipParams.label = 1){
                            btn.push(
                                h('Poptip', {
                                    props: {
                                        confirm: true,
                                        title: '您确定要移除吗?',
                                        transfer: true
                                    },
                                    on: {
                                        'on-ok': () => {
                                            this.delParams = {
                                                id: params.row.id,
                                                type: 0   
                                            }
                                            this.delete();
                                        }
                                    }
                                }, [
                                    h('Button', {
                                        style: {
                                            margin: '5px'
                                        },
                                        props: {
                                            type: 'error',
                                            size: 'small'
                                        }
                                    }, '移除')
                                ])
                            )
                        }
                        return h('div',btn);
                    }
                }
            ],
        }
    },
    computed: {
        comResData(){
            var obj={};
            obj=JSON.parse(JSON.stringify(this.resData));
            return obj;
        }
    },
    mounted() {
        this.initBlacklist();
    },
    methods:{    
        //加载黑名单列表
        initBlacklist(){
            this.showLoading = true;
            getBlacklist(this.ipParams).then(res => {
                this.showLoading = false;
                if(res.code == 0){
                    this.resData = res.data;
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //切换黑名单 tab
        selectTabs(name){
            this.tabValue = name;
            if(name == 0){
                this.ipParams.type = 0;
                this.ipParams.label = 1;
            }else if(name == 1){
                this.ipParams.type = 1;
                this.ipParams.label = 1;
            }else if(name == 2){
                this.ipParams.type = 1;
                this.ipParams.label = 0;
            }
            this.initBlacklist();
        },

        //选择模式
        changePattern(name){
            if(name == "0"){
                this.ipEnd = {ipS_1:'',ipS_2:'',ipS_3:'', ipS_4:'',};
            }
        },

        //输入起止IP
        changeIp(value,num){
            if(value.length >= 3){
                switch (num) {
                    case 1:
                    this.replaceInputValue(this.$refs.ipInput2)
                        break;
                    case 2:
                    this.replaceInputValue(this.$refs.ipInput3)
                        break;
                    case 3:
                    this.replaceInputValue(this.$refs.ipInput4)
                        break;
                    case 4:
                    this.$refs.ipInput4.blur();  
                        break;
                    default:
                        break;
                }    
            }
        },

        //输入终止IP
        changeEndIp(value,num){
            if(value.length >= 3){
                switch (num) {
                    case 1:
                    this.replaceInputValue(this.$refs.ipEndInput2)
                        break;
                    case 2:
                    this.replaceInputValue(this.$refs.ipEndInput3)
                        break;
                    case 3:
                    this.replaceInputValue(this.$refs.ipEndInput4)
                        break;
                    case 4:
                    this.$refs.ipEndInput4.blur();  
                        break;
                    default:
                        break;
                }    
            }
        },
        
        replaceInputValue(input){
            input.focus();
        },

        //最大255 最小0
        replaceIp(ip){
            if(ip>255){
                return 255;
            }else if(ip<0){
                return 1;
            }else{
                return ip;
            }
        },

        //添加黑名单 btn
        addBlack(){
            this.addBlackModal = true;
            this.ipTitle = '添加 IP 黑名单';
            this.ipStart = {ipS_1:'',ipS_2:'',ipS_3:'', ipS_4:'',};
            this.ipEnd = {ipS_1:'',ipS_2:'',ipS_3:'', ipS_4:'',};
            this.addIpparams = {}
        },

        //确定添加ip黑名单
        sureAddIPBlack(){
            var s = "";
            var e = "";
            if(this.ipPattern == "0"){
                for(var key in this.ipStart){
                    if(!this.ipStart[key]){
                        this.$Notice.error({title: "请输入正确的IP地址"});
                        return;
                    }
                    if(key=="ipS_4"){
                        s += this.ipStart[key] + '';
                        e += this.ipStart[key] + '';
                    }else{
                        s += this.ipStart[key] + '.';
                        e += this.ipStart[key] + '.';
                    }
                }
            }else{
                for(var key in this.ipStart){
                    if(!this.ipStart[key]){
                        this.$Notice.error({title: "请输入正确的IP地址"});
                        return;
                    }
                    if(key=="ipS_4"){
                        s += this.ipStart[key] + '';
                        e += this.ipEnd[key] + '';
                    }else{
                        s += this.ipStart[key] + '.';
                        e += this.ipEnd[key] + '.';
                    }
                    for(var key2 in this.ipEnd){
                        this.$Notice.destroy()
                        if(!this.ipEnd[key2]){
                            this.$Notice.error({title: "请输入正确的IP地址"});
                            return;
                        }
                        if(this.ipStart[key] != this.ipEnd[key] && key != "ipS_4"){
                            this.$Notice.error({title: "IP不合法或不属于同一C类网段"});
                            return;
                        }
                        if(this.ipStart[key] > this.ipEnd[key] && key2 == "ipS_4"){
                            this.$Notice.error({title: "IP 范围起始地址不能大于结束地址"});
                            return;
                        }
                    }
                }
            }
            this.addIpparams.start_ip = s;
            this.addIpparams.end_ip = e;
            this.addBlackList();
        },

        //添加ip黑名单
        addBlackList(){
            this.btnLoading = true;
            addIpBlack(this.addIpparams).then(res => {
                this.btnLoading = false;
                if(res.code == 0){
                    this.addBlackModal = false;
                    this.$Notice.success({title: res.msg});
                    this.initBlacklist();
                    this.ipStart = {ipS_1:'',ipS_2:'',ipS_3:'', ipS_4:'',};
                    this.ipEnd = {ipS_1:'',ipS_2:'',ipS_3:'', ipS_4:'',};
                }else{
                    this.$Notice.error({title: res.msg});
                }
            }).catch(res => {
                this.btnLoading = false;
                this.$Notice.error({title: res.msg});
            })
        },

        //取消添加
        cancel(){
            this.addBlackModal = false;
            this.ipStart = {ipS_1:'',ipS_2:'',ipS_3:'', ipS_4:'',};
            this.ipEnd = {ipS_1:'',ipS_2:'',ipS_3:'', ipS_4:'',};
        },

        //编辑ip黑名单
        editIp(index){
            this.addIpparams = this.comResData[index];
            this.addBlackModal = true;
            this.ipTitle = "编辑 IP 黑名单";
             var start_ip=this.addIpparams.start_ip.split(".");
            for(var i=0;i<start_ip.length;i++){
                if(i==0){
                    this.ipStart.ipS_1 = start_ip[i];
                }else if(i == 1){
                    this.ipStart.ipS_2 = start_ip[i];
                }else if(i == 2){
                    this.ipStart.ipS_3 = start_ip[i];
                }else if(i == 3){
                    this.ipStart.ipS_4 = start_ip[i];
                }
            }
            if(this.addIpparams.start_ip == this.addIpparams.end_ip){
                this.ipPattern = "0";
            }else{
                this.ipPattern = "1";
                var end_ip = this.addIpparams.end_ip.split(".");
                for(var i=0;i<end_ip.length;i++){
                    if(i==0){
                        this.ipEnd.ipS_1 = end_ip[i];
                    }else if(i == 1){
                        this.ipEnd.ipS_2 = end_ip[i];
                    }else if(i == 2){
                        this.ipEnd.ipS_3 = end_ip[i];
                    }else if(i == 3){
                        this.ipEnd.ipS_4 = end_ip[i];
                    }
                }
            }
        },


        //移除ip黑名单
        delete(){
            delBlacklist(this.delParams).then(res => {
                if(res.code == 0){
                    this.$Notice.success({title: res.msg});
                    this.initBlacklist();
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        }
    }
}
</script>


<style lang="less" scoped>
    .accreditWrap{
        background:#fff;
        padding:20px;
    }
    .blacklist{
        margin-top:20px;
    }
    .ipWrap{
        display: inline-block;
        border: 1px solid #c5c8ce;
        border-radius: 4px;
        padding: 0px 8px;
        &:hover{
          border-color:#57a3f3;  
        }
        input{
            width: 30px;
            font-size: 12px;
            border: none;
            outline: none;
            text-align: center;
            font-weight: 400;
            line-height: 20px;
        }
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
            -webkit-appearance: none;
        }
        input[type="number"]{
            -moz-appearance: textfield;
        }
    }
    .addIpBlack{
        margin-bottom:20px;
    }
</style>
