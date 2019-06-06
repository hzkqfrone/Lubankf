<template>
    <div class="config">
        <Card class="chatContent">
            <div v-if="$route.path=='/config'">
                <div class="configTitle">
                    <h2 class="setting">设置</h2>
                </div>
                <div class="configTop">
                    <div class="configContent" v-if="access.wechat || access.program || access.website || access.weibo">
                        <h3>
                            <span class="iconfont">&#xe61f;</span>
                            <span>接入</span>
                        </h3>
                        <ul class="accredit">
                            <li @click="accredit('wechat')" v-if="access.wechat"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-weixin1"></use></svg><span>微信公众号</span></li>
                            <li @click="accredit('program')" v-if="access.program"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-xiaochengxu"></use></svg><span>微信小程序</span></li>
                            <li @click="accredit('website')" v-if="access.website"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-diannao-"></use></svg><span>网站插件</span></li>
                            <li @click="accredit('weibo')" v-if="access.weibo"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-weibo"></use></svg><span>微博</span></li>
                            <li @click="accredit('workWechat')"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-qiyeweixinlogo1"></use></svg><span>企业微信</span></li>
                            <li @click="accredit('toutiao')"><svg class="icon" fill="#000" aria-hidden="true"><use xlink:href="#icon-jinritoutiao1"></use></svg><span>今日头条</span></li>
                        </ul>
                    </div>
                    <div class="configContent" v-if="access.wechatInform || access.programAuthor || access.pcAuthor">
                        <h3>
                            <span class="iconfont">&#xe6db;</span>
                            <span>授权绑定</span>
                        </h3>
                        <ul class="accredit">
                            <li @click="accredit('wechatInform')" v-if="access.wechatInform"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-tongzhi"></use></svg><span>微信消息通知</span></li>
                            <li @click="accredit('programAuthor')" v-if="access.programAuthor"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-shoujihao"></use></svg><span>小程序授权登录</span></li> 
                            <li @click="accredit('pcAuthor')" v-if="access.pcAuthor"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-pcduan"></use></svg><span>PC授权登录</span></li>
                        </ul>
                    </div>
                    <div class="configContent" v-if="access.me || access.fastReply || access.service || access.roles || access.tag || access.blacklist || access.ticketclassify || 
                                                access.evaluation ||access.invite || access.rule">
                        <h3>
                            <span class="iconfont">&#xe61c;</span>
                            <span>客服</span>
                        </h3>
                        <ul class="accredit">
                            <li @click="accredit('me')" v-if="access.me"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-gerenxinxisvg"></use></svg><span>个人信息</span></li>
                            <li @click="accredit('fastReply')" v-if="access.fastReply"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-huifu"></use></svg><span>快捷回复</span></li>
                            <li @click="accredit('service')" v-if="access.service"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-kefu"></use></svg><span>客服管理</span></li>
                            <li @click="accredit('roles')" v-if="access.roles"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-jiaoseguanli"></use></svg><span>角色列表</span></li>
                            <li @click="accredit('tag')" v-if="access.tag"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-biaoqian"></use></svg><span>标签</span></li>
                            <li @click="accredit('blacklist')" v-if="access.blacklist"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-naruheimingdanqiye"></use></svg><span>黑名单</span></li>
                            <li @click="accredit('ticketclassify')" v-if="access.ticketclassify"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-fenlei"></use></svg><span>工单分类</span></li>
                            <li @click="accredit('evaluation')" v-if="access.evaluation"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-pingjia"></use></svg><span>客服评价</span></li>
                            <li @click="accredit('invite')" v-if="access.invite"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-fuwu-yaoqing"></use></svg><span>会话邀请</span></li>
                            <li @click="accredit('rule')" v-if="access.rule"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-dongzuokongzhi"></use></svg><span>会话规则</span></li>
                            <li @click="accredit('sensitiveWord')" v-if="access.sensitiveWord"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-iconchunzhong-"></use></svg><span>敏感词</span></li>
                        </ul>
                    </div>
                    <div class="configContent" v-if="access.robotSetup || access.repository ">
                        <h3>
                            <span class="iconfont">&#xe6ae;</span>
                            <span>机器人</span>
                        </h3>
                        <ul class="accredit">
                            <li @click="accredit('robotSetup')" v-if="access.robotSetup"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-shezhi"></use></svg><span>机器人设置</span></li>
                            <li @click="accredit('repository')" v-if="access.repository"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-zhishiku"></use></svg><span>知识库</span></li>
                            <li @click="accredit('template')" v-if="access.template"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-tikumoban"></use></svg><span>知识模板库</span></li>
                        </ul>
                    </div>
                </div>
            </div>

            <router-view v-if="$route.path!='/config'"></router-view>
        </Card>

    </div>
</template>
<script>
import '../../static/font/iconfont.js';
export default {
    data(){
        return{
            access:{},  //接入
            auth:{},    //授权绑定
            service:{}, //客服
        }
    },
    created() {
        if(this.$store.state.app.LUBAN_auth){
            var c = this.$store.state.app.LUBAN_auth;
            c.forEach(e => {
                this.access[e] = true;
            });
        }
    },
    methods:{
        //接入跳转
        accredit(name){
            this.$router.push({
                path:`/config/${name}`,
            })
        },
        
    }
}
</script>
<style lang="less">
.single-page,.config,.chatContent,.ivu-card-body{
    height: 100%;
}
.config{
    padding:10px;
    .titleTop{
        position: relative;
    }
    .configTitle{
        padding:0 20px;
        height:50px;
        line-height: 49px;
        position: absolute;
        background: #fff;
        z-index: 99999;
        width: 100%;
        border-bottom: 1px solid #e7e7e7;
        i{
            font-size:20px;
            vertical-align: text-bottom;
            margin-right:5px;
        }
        h2{
            font-size:14px;
            font-weight: 500;
            display:inline-block;
        }
        h2.setting{
            color:#17233d;
        }
    }
    .ivu-card-body{
        padding:0;
    }
    .configTop{
        padding-top:50px;
        .accredit h3{
            font-size:16px;
            text-align: left;
            color: tomato;
        }
    }
    .configContent{
        padding:20px 20px 20px 36px;
        background:#fff;
        h3{
            font-weight: 500;
        }
        ul{
            display:flex;
            flex-wrap: wrap;
            justify-content:flex-start;
        }
        li{
            width:100px;
            margin:10px;
            text-align: center;
            display: inline-block;
            cursor: pointer;
            svg{
                display:block;
                width:50px;
                height:50px;
                margin:10px auto;
            }
        }
    }
    .configContent:nth-of-type(even){
        background:#fbfbfc;
    }
}
</style>

