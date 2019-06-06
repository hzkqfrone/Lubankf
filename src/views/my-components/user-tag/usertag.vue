<template>
    <div  class="tagWrap ct elementScroll">
        <!-- right -->
        <div class="head" v-if="!type">
            <h3>标签</h3>
            <div class="tagRight">
                <Poptip placement="bottom-end" width="300"  v-model="tagDrawer">
                    <a href="javascript:;" @click="addUserTag">添加</a>
                    <div class="api selctTag" slot="content">
                        <div v-if="replaceTag.length > 0">
                            <Tag v-for="(item,index) in replaceTag" :key="index" @click.native="selectTagSure(item.id)" :color="item.color" :name="index">{{item.name}}</Tag>
                        </div>
                        <span v-else>暂无标签~</span>
                    </div>
                </Poptip>
            </div>
        </div>
        <div class="tagList" v-if="!type">
            <span class="empty" v-if="!comUserinfo.myTag || comUserinfo.myTag.length==0">暂无标签</span>   
            <span class="user-tag" v-else  v-for="(item,index) in comUserinfo.myTag" :key="index">
                <span :style="{backgroundColor:item.color}" title="删除标签">{{item.name}}<Icon @click="deleteTag(index, item.id)" type="md-trash" /></span>   
            </span>
        </div>
        <div class="userInfo">
            <h3 @click="showUserInfo=!showUserInfo">用户信息<Icon type="ios-arrow-down" /></h3>
            <ul class="infoList" v-show="showUserInfo">
                <li><span>姓名</span><Input @on-blur="updatedUserInfo" v-model="comUserinfo.name || comUserinfo.username" class="input" size="small"></Input></li>
                <li><span>年龄</span><Input @on-blur="updatedUserInfo" v-model="comUserinfo.age" class="input" size="small"></Input></li>
                <li><span>性别</span>
                    <RadioGroup v-model="comUserinfo.sex" class="input" @on-change="updatedUserInfo">
                        <Radio :label="1">男</Radio>
                        <Radio :label="0">女</Radio>
                    </RadioGroup>
                </li>
                <li><span>电话</span><Input @on-blur="updatedUserInfo" v-model="comUserinfo.tel" class="input" size="small"></Input></li>
                <li><span>微信</span><Input @on-blur="updatedUserInfo" v-model="comUserinfo.wechat" class="input" size="small"></Input></li>
                <li><span>地址</span><Input @on-blur="updatedUserInfo" v-model="comUserinfo.address" class="input" size="small"></Input></li>
                <li><span>邮箱</span><Input @on-blur="updatedUserInfo" v-model="comUserinfo.email" class="input" size="small"></Input></li>
                <li><span>备注</span><Input @on-blur="updatedUserInfo" v-model="comUserinfo.notes" type="textarea" class="input" size="small"></Input></li>
            </ul>
        </div>
        <div class="userInfo" v-if="comUserinfo.website && comUserinfo.website!=''">
            <h3 @click="showWebsite = !showWebsite">访问信息<Icon type="ios-arrow-down" /></h3>
            <ul class="websiteInfo" v-show="showWebsite">
                <li><span>网站名称</span><div class="wsright">{{comUserinfo.website.nickname}}</div></li>
                <li><span>地域</span><div class="wsright">{{comUserinfo.website.area}}</div></li>
                <li><span>IP地址</span><div class="wsright">{{comUserinfo.website.ip}}</div></li>
                <li><span>操作系统</span><div class="wsright">{{comUserinfo.website.os}}</div></li>
                <li><span>浏览器</span><div class="wsright">{{comUserinfo.website.browser}}</div></li>
                <li><span>来源</span><div class="wsright">{{comUserinfo.website.source}}</div></li>
                <li><span>来源关键字</span><div class="wsright">{{comUserinfo.website.seoKeyword}}</div></li>
                <li>
                    <span>上级来源</span>
                    <div class="wsright">
                        <span v-if="comUserinfo.website.parentUrl.indexOf('http')==-1">{{comUserinfo.website.parentUrl}}</span>
                        <a v-else :href="comUserinfo.website.parentUrl" target="_blank">{{comUserinfo.website.parentUrl}}</a>
                    </div>
                </li>
                <li>
                    <span>会话来源</span>
                    <div class="wsright">
                        <span v-if="comUserinfo.website.fromUrl.indexOf('http')==-1">{{comUserinfo.website.fromUrl}}</span>
                        <a v-else :href="comUserinfo.website.fromUrl" target="_blank">{{comUserinfo.website.fromUrl}}</a>
                    </div>
                </li>
            </ul>
        </div>
        <div class="blacklist" v-if="!type">
            <i class="iconfont">&#xe73d;</i>
            <span v-if="comUserinfo.status==0" @click="blackModal=true">加入黑名单</span>
            <Poptip
                style="width:100%;"
                v-if="comUserinfo.status==-1"
                confirm
                title="确定要移除吗?"
                @on-ok="delBlacklist">
                <span type="error" long>移除黑名单</span>
            </Poptip>
            <router-link to="/config/blacklist">管理</router-link>
        </div>   
        <!-- 加入黑名单原因 -->
        <Modal
            v-model="blackModal"
            width="450"
            class="addBlack"
            title="加入黑名单原因">
            <p class="blackTitle">加入黑名单你将不再收到对方的消息,且该会话将自动关闭。</p>
            <Input type="textarea" v-model="blackNotes" :rows="5" placeholder="非必填"></Input>
            <div slot="footer">
                <Button @click="cancelAddBlack">取消</Button>
                <Button type="primary" :loading="blackLoading" @click="sureAddBlack">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import {getUserNoteInfo, getTagInfo, updatedUserInfo, editUserTag, deleteUserTag, pullBlack} from '@/libs/api.js';
export default {
    props:['chatUserInfo','type'],
    data(){
        return {
            tagDrawer:false,
            showCheck:false,  //显示checkbox
            showUserInfo:true,  //用户信息
            showWebsite:true,   //访问信息
            blackModal:false, //拉黑弹窗
            blackNotes:'',   //拉黑原因
            tagArr:[],  //标签
            from:{},
            blackLoading:false,  //拉黑确定btn
        }
    },
    computed:{
        comUserinfo(){
            var obj={};
            obj=JSON.parse(JSON.stringify(this.from));
            return obj;
        },
        replaceTag(){
            var userTagArr = [];
            var obj = {};
            obj = JSON.parse(JSON.stringify(this.tagArr));
            obj.forEach((e,index) => {
                if(e.isSelect){
                    userTagArr.push(e);
                }
            })
            return userTagArr;
        }
    },
    methods:{
        //获取用户备注信息
        getNoteInfo(){
            getUserNoteInfo({userToken:this.chatUserInfo.userToken}).then(res =>{
                if(res.code == 0){
                    this.from = res.data;
                    this.getTagList();  //获取用户标签信息
                    this.$store.commit('setWebUserInfo', this.from.website);
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })

        },

        //获取标签信息
        getTagList(){
            getTagInfo().then(res => {
                if(res.code == 0){
                    var t = this.comUserinfo.myTag;
                    res.data.forEach(v => {
                        v.isSelect = true;
                        if(t.length > 0){
                            t.forEach((e,index) =>{
                                if(v.id == e.id){
                                    v.isSelect = false;
                                }
                            })
                        }
                    });
                    this.tagArr = res.data;
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //修改用户信息
        updatedUserInfo(){
            this.from.userToken = this.chatUserInfo.userToken;
            var that = this;
            var handle = true;
            Object.keys(this.from).forEach(function(key){
                if(that.from[key] != that.comUserinfo[key] && key != 'website' && key != 'myTag' && key != 'SexConfig'){
                    handle = false;
                }
            });
            //数据有改变才保存
            if(!handle){
                if(!this.comUserinfo.username){
                    this.$Notice.warning({title: '姓名不能为空'});
                }
                updatedUserInfo(this.comUserinfo).then(res => {
                    if(res.code == 0){
                        this.$Notice.success({title: res.msg});
                        this.tagDrawer = false;
                        this.from = this.comUserinfo;
                        this.$emit('updateUsername',this.comUserinfo.username);
                        this.getNoteInfo();
                    }else{
                        this.$Notice.error({title: res.msg});
                    }
                })
            }
        },

        //选择标签 确定
        selectTagSure(id){
            var data = {
                tid:id,
                userToken: this.chatUserInfo.userToken
            }
            editUserTag(data).then(res => {
                this.tagDrawer = false;
                if(res.code == 0){
                    this.tagArr.forEach((e, index) => {
                        if(e.id == id){
                            this.tagArr[index].isSelect = false;
                            this.comUserinfo.myTag.push(e);
                        }
                    })
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //添加标签
        addUserTag(){
            this.tagDrawer = !this.tagDrawer;
        },

        //删除标签
        deleteTag(index,id){
            var data = {
                tid: id,
                userToken: this.chatUserInfo.userToken
            }
            deleteUserTag(data).then(res => {
                if(res.code == 0){
                    this.comUserinfo.myTag.splice(index,1);
                    this.tagArr.forEach(e => {
                        if(e.id == id){
                            e.isSelect = true;
                        }
                    })
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //取消加入黑名单
        cancelAddBlack(){
            this.blackModal = false;
        },

        //确定加入黑名单
        sureAddBlack(){
            //-1=>拉黑，0=>不拉黑
            this.hintBlack(-1, this.blackNotes);  
        },

        //解除黑名单
        delBlacklist(){
            this.hintBlack(0, null);  
        },

        //拉黑用户 || 解除拉黑
        hintBlack(s, n){
             var data = {
                userToken: this.chatUserInfo.userToken,
                status: s,
                notes: n
            }
            this.blackLoading = true;
            pullBlack(data).then(res => {
                this.blackLoading = false;
                this.blackNotes = "";
                this.blackModal = false;
                if(res.code == 0){
                    this.$Notice.success({title: res.msg});
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        }
    },
    watch:{
        chatUserInfo(n,o){
            if(n){
                if(n.ts == 1 || !n.userToken) return false;
                this.getNoteInfo();
            }
        }
    }
}
</script>
<style lang="less">
    .blacklist{
        .ivu-poptip-rel{
            width:100%;
        }
    }
    @chatHeight:100%;
    @colorE7:#e7e7e7;
    @height300:300px;
    // right
    .tagWrap{
        min-height: @height300;
        float: left;
        margin-left:-270px;
        background: #f5f5f5;
        height:@chatHeight;
        border-left:1px solid @colorE7;
        width:270px;
        padding:0 25px;
        overflow-x: auto;
        .head{
            height:61px;
            line-height: 61px;
            border-bottom:1px solid @colorE7;
            h3{
                display: inline-block;
                font-size:17px;
                font-weight:400;
                color:#666;
            }
            a{
                display: inline-block;
                float: right;
                color:#09bb07;
                padding-left:17px;
                background:url(../../../images/tag.png) no-repeat left center;
            }
            .tagRight{
                float: right;
                .ivu-poptip-inner{
                    white-space: normal;
                }
                .selctTag{
                    max-height:300px;
                    min-height:50px;
                    overflow:auto;
                    span{
                        text-align: center;
                        display:block;
                    }
                }
            }
        }
        .tagList{
            padding-top:10px;
            .user-tag{
                margin-right:5px;
                span{
                    position: relative;
                    display: inline-block;
                    height: 22px;
                    line-height: 22px;
                    margin: 2px 4px 2px 0;
                    padding: 0 8px;
                    border-radius: 3px;
                    background: #f7f7f7;
                    font-size: 12px;
                    vertical-align: middle;
                    opacity: 1;
                    overflow: hidden;
                    color:#fff;
                    cursor: pointer;
                    i{  
                        position: absolute;
                        left:0;
                        top: 0;
                        width:100%;
                        height:22px;
                        background:rgba(0,0,0,0.8);
                        color:#fff;
                        text-align: center;
                        line-height: 22px;
                        font-size:16px;
                        border-radius: 3px;
                        display: none;
                        cursor: pointer;
                    }
                    &:hover i{
                        display: block;
                    }
                }
            }
            .empty{
                color:#b2b2b2;
            }
            .ivu-card-body{
                padding:0 16px;
            }
        }
        .userInfo{
            h3{
                padding:17px 0 17px 0;
                font-size:17px;
                font-weight:400;
                color:#666;
                border-bottom:1px solid @colorE7;
                cursor: pointer;
            }
            .infoList{
                border-bottom:1px solid @colorE7;
                padding-bottom:20px;
                li{
                    margin-top:15px;
                    font-size:12px;
                    span{
                        display:inline-block;
                        float:left;
                    }
                    .input{
                        color:#666666;
                        display:inline-block;
                        margin-left:18px;
                        width:160px;
                    }
                    input,textarea{
                        border:none;
                    }
                }
            }
            .websiteInfo{
                li{
                    margin-top:15px;
                    font-size:12px;
                    min-height:18px;
                    &>span{
                        display:inline-block;
                        float:left;
                        width:72px;
                    }
                    .wsright{
                        width:130px;
                        float: left;
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                    }
                }
            }
        }
        .blacklist{
            margin:20px 0;
            span{
                cursor: pointer;
            }
            a{
                float: right;
                color:#666;
            }
            .ivu-poptip {
                width:auto !important;
            }
        }
    }
    .blackTitle{
        padding-bottom:10px;
    }
    .addBlack{
        .ivu-modal-wrap,.ivu-modal-mask{
            z-index: 999999 !important;
        }
    }
</style>

