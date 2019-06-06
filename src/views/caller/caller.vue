<template>
    <div class="caller">
        <Card class="callerContent">
            <p slot="title">
                实时访客
            </p>
            <Table :loading="showLoading" stripe :columns="columnsData" :data="resData"></Table>
        </Card>
        <Modal
            v-model="trackModal"
            width="600"
            title="访问轨迹">
            <ul class="trackList">
                <li v-for="(item,index) in trackData" :key="index">
                    <span>{{item.createTime}}</span>
                    <a :href="item.address" target="_blank">{{item.address}}</a>
                </li>
            </ul>
        </Modal>
    </div>
</template>
<script>
import {getCallerList, getTraceList, serviceJoinUp, invitedSession} from '@/libs/api';
export default {
    data(){
        return{
            icon:'&#xe799;',
            showLoading:false,
            resData:[],
            trackData:[],   //访客轨迹
            trackModal:false,
            countdown:0,
            timer:0,
            columnsData:[
                {
                    key: 'username',
                    title: '访客',
                    render: (h, params) => {
                        return h('p',{
                            attrs:{
                                title: params.row.username
                            },
                            style:{
                                'text-overflow': 'ellipsis',
                                'white-space': 'nowrap',
                                overflow: 'hidden'
                            }
                        }, params.row.username)
                    }
                },
                {
                    key: 'ip',
                    title: 'IP地址'
                },
                {
                    key: 'os',
                    title: '操作系统'
                },
                {
                    key: 'browser',
                    title: '浏览器'
                },
                {
                    key: 'source',
                    title: '来源'
                },
                {
                    key: 'fromUrl',
                    title: '会话来源',
                    minWidth: 300,
                    render:(h, params) => {
                        return h('div',[
                            h('a',{
                                attrs:{
                                    target:'_blank',
                                    href:params.row.fromUrl
                                },
                                style:{
                                    'max-width': '80%',
                                    'display': 'inline-block',
                                    'float': 'left'
                                }
                            },params.row.fromUrl),
                            h('a',{
                                style:{
                                    color:'#2d8cf0',
                                    marginLeft:'10px',
                                    fontWeight: 'bold'
                                },
                                on: {
                                    click: () => {
                                        this.callerTrack(params.row.userToken);
                                    }
                                }
                            },[
                                h('Icon',{
                                    props:{
                                        type:'ios-paper-plane-outline'
                                    },
                                    style:{
                                        fontSize:'16px'
                                    }
                                }),
                                h('span','轨迹')
                            ])
                        ])
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    width:200,
                    align:'center',
                    render: (h, params) => {
                        var active = params.row.active || 2;
                        var text = [{label:"接入",type:"#2d8cf0"},{label:"正在会话",type:"#19be6b"},{label:"邀请会话",type:"#2d8cf0"},{label:"邀请中",type:"#767d85"},{label:"已拒绝",type:"#999999"},{label:"邀请会话",type:"#2d8cf0"}];
                        // 状态 0=》接入  1=》正在会话  2=》邀请会话  3=》正在邀请  4=》已拒绝  5=》不可邀请（未设置）
                        return h('a',{
                            attrs:{
                                href:'javascript:;',
                            },
                            style:{
                                color:text[Number(active)].type
                            },
                            on:{
                                click: () => {
                                    if(active == 1 || active == 3 || active == 4){
                                        return false;
                                    }else{
                                        if(active == 0){
                                            this.access(params.index);
                                        }else if(active == 2){
                                            this.callerChat(params.index);
                                        }else if(active == 5){
                                            this.$Notice.warning({title: '暂未设置会话邀请'}); 
                                        }
                                    }
                                }
                            }
                        },text[Number(active)].label)
                    }
                }  
            ]
        }
    },
    computed:{
        callerList () {
            return this.$store.state.app.callerData;
        }
    },
    created() {
        this.init();
    },
    methods:{
        //加载实时访客列表
        init(){
            getCallerList().then(res => {
                if(res.code == 0){
                    this.resData = res.data.list;
                    this.countdown = res.data.config.countdown;
                }else{
                    this.$Notice.error({title: res.msg}); 
                }
            })
        },

        //实时访客轨迹
        callerTrack(token){
            this.trackModal = true;
            this.trackData = [];
            getTraceList({userToken: token}).then(res => {
                if(res.code == 0){
                    this.trackData = res.data;
                }else{
                    this.$Notice.error({title: res.msg}); 
                }
            })
        },

        //接入
        access(index){
            serviceJoinUp({taskToken: this.resData[index].taskToken}).then(res => {
                if(res.code == 0){
                    this.$router.push({
                        path:`/chat?u=${taskToken}`,
                    })
                }else{
                    this.$Notice.error({title: res.msg}); 
                }
            })
        },

        //邀请会话
        callerChat(index){
            invitedSession({userToken: this.resData[index].userToken}).then(res => {
                if(res.code == 0){
                    this.$Notice.success({title: "成功发送邀请会话"}); 
                    this.updatedActive(index, 3);
                }else{
                    this.$Notice.error({title: res.msg}); 
                }
            })
        },
        
        //拒绝后，间隔几秒可再次邀请
        inviteChat(){
            clearInterval(timer);
            var timer = setInterval(() => {
                this.resData.forEach((e,index) => {
                    if(e.jg >= 1){
                        e.jg -= 1;
                    }
                    if(e.jg <= 1){
                        e.active = 2;
                        this.$set(this.resData,index,e)
                    }
                });
            }, 1000);
        },

        //更新访客状态
        updatedActive(index, status) {
            var active = this.resData[index];
            active.active = status;
            if(active.active == 4){
                active.jg = Number(this.countdown);
                this.$set(this.resData,index,active)
                this.inviteChat()
            }else {
                this.$set(this.resData,index,active)
            }
        },
    },
    watch:{
        callerList(n,o){
            //temp_user_sign_in 用户进入页面
            //temp_user_leave   用户离开页面
            //refuse_invite     拒绝邀请会话
            var handle = true;
            if(n.type == "temp_user_sign_in"){
                this.resData.forEach((v,index) => {
                    if(n.user && v.userToken == n.user.userToken){
                        handle = false;
                        this.updatedActive(index, n.user.active);
                    }
                })
                if(handle && n.user){
                    this.resData.push(n.user);
                }
            }else if(n.type == "temp_user_leave"){
                this.resData.forEach((e, index) => {
                    if(e.userToken == n.userToken){
                        this.resData.splice(index,1);
                    }
                })
            }else if(n.type == "refuse_invite"){
                this.resData.forEach((e, index) => {
                    if(e.userToken == n.userToken){
                        this.updatedActive(index, 4);
                    }
                })
            }
        }
    }
}
</script>
<style lang="less">
.single-page,.config,.chatContent,.ivu-card-body{
    height: 100%;
}
.caller{
    padding:10px;
}
.trackList{
    li{
        margin:5px 0;
        span{
            width:110px;
            float: left;
        }
        a{
            display: block;
            margin-left:110px;
            word-wrap: break-word;
        }
    }
}
</style>

