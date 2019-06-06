<template>
    <div class="robotSetup">
        <div class="repBox">
            <div class="titleTop replyT">
                <div class="configTitle">
                    <router-link to="/config">
                        <Icon type="md-arrow-round-back" />
                        <h2>机器人设置</h2>
                    </router-link>
                </div>
            </div>
            <div class="robotSetupContent elementScroll clearfix configTop">
                <Form :label-width="140" class="repForm" style="padding:0 10px;">
                    <Divider orientation="left">机器人信息</Divider>
                    <FormItem label="启用状态">
                        <i-switch size="large" :true-value="1" :false-value="0" v-model="params.active">
                            <span slot="open">ON</span>
                            <span slot="close">OFF</span>
                        </i-switch>
                    </FormItem>
                    <FormItem label="机器人名称">
                        <Input placeholder="机器人名称" class="reInput" v-model="params.name" :maxlength="10"/>
                    </FormItem>
                    <FormItem label="机器人头像">
                        <upload-img @uploadpcImg="uploadRobotImg" :imgUrl="params.head_img" class="robotImg" ref="uploadImg"></upload-img>
                        <Button type="primary" size="small" @click="defaultRobotImg" class="defaultRobotImg">恢复默认</Button>
                    </FormItem>
                    <FormItem label="机器人模式">
                        <RadioGroup v-model="params.mode">
                            <Radio :label="0" style="display:block">所有顾客优先由机器人接待
                                <p class="patternInfo">所有对话都将由机器人优先接待，需要机器人分担人工客服的接待压力的时候，一般选择此模式</p>
                            </Radio>
                            <Radio :label="1">仅在客服离线或坐席全部占满时接待
                                <p class="patternInfo">当人工客服在线，并且接待上限没有占满时，就会优先分配给人工客服</p>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="欢迎语">
                        <ul class="welcomeMsg">
                            <li v-for="(item, index) in params.welcome_msg">
                                <Input type="textarea" :rows="2" class="reInput" v-model="params.welcome_msg[index]" :maxlength="200"></Input>
                                <a href="javascript:;" @click="addWelcomeMsg" v-if='index<4 && params.welcome_msg.length-1 == index'><Icon type="md-add-circle" /></a>
                                <a href="javascript:;" class="delWelcomeMsg" @click="delWelcomeMsg(index)" v-if='params.welcome_msg.length!=1'><Icon type="md-remove-circle" /></a>
                            </li>
                        </ul>
                    </FormItem>
                    <Divider orientation="left">机器人未识别消息设置</Divider>
                    <FormItem label="">
                        <div>
                            连续
                            <Select style="width:80px" v-model="params.transfer_sec" @on-change="changeTransfer">
                                <Option v-for="(item,index) in 5" :key="index" :value="item">{{ item }}</Option>
                            </Select>
                            个问题未识别后
                            <Select style="width:80px" v-model="params.is_auto_transfer">
                                <Option :value="0">自动</Option>
                                <Option :value="1">手动</Option>
                            </Select>
                            转人工
                        </div>
                        <ul class="notQustions">
                            <li v-for="(item, index) in notQs" :key="index">
                                <p>第 {{index+1}} 次未识别问题回复</p>
                                <Input type="textarea" :rows="2" class="reInput" v-model="notQs[index]" :maxlength="200" ref="notQsInput"></Input>
                            </li>
                        </ul>
                        <div class="transfer">
                            <ul class="notQustions">
                                <li>
                                    <p>自动转人工文本自定义</p>
                                    <Input type="textarea" :rows="2" class="reInput" :maxlength="200" v-model="params.auto_transfer_msg"></Input>
                                </li>
                                <li>
                                    <p>手动转人工文本自定义</p>
                                    <Input type="textarea" :rows="2" class="reInput" :maxlength="200" v-model="params.transfer_msg"></Input>
                                </li>
                                <li>
                                    <p>客服不在线时转留言自定义</p>
                                    <Input type="textarea" :rows="2" class="reInput" :maxlength="200" v-model="params.leave_msg"></Input>
                                </li>
                            </ul>
                        </div>
                    </FormItem>
                    <Divider orientation="left">常见问题和关联问题</Divider>
                    <FormItem label="常见问题引导">
                        <i-switch size="large" :true-value="1" :false-value="0" v-model="params.is_common">
                            <span slot="open">ON</span>
                            <span slot="close">OFF</span>
                        </i-switch>
                        <p class="patternInfo">开启常见问题引导后，客户将在接入机器人后收到常见问题引导消息，常见问题列表最多可以设置5条</p>
                        <div class="qsList">
                            <ul>
                                <li v-for="(qs, index) in params.common_questions" :key="qs.title" v-dragging="{ item: qs, list: params.common_questions, group: 'qs' }">
                                    <span :title="qs.title">{{qs.title}}</span>
                                    <a href="javascript:;" class="close" @click="delQs(index)">删除</a>
                                </li>
                            </ul>
                        </div>
                        <Button type="primary" icon="md-add" class="addQs" @click="showAddQs">添加问题</Button>
                    </FormItem>
                    <FormItem label="自动推荐相关问题">
                        <i-switch size="large" :true-value="1" :false-value="0" v-model="params.auto_send_correlation">
                            <span slot="open">ON</span>
                            <span slot="close">OFF</span>
                        </i-switch>
                    </FormItem>
                    <FormItem label="关联问题引导语">
                        <Input type="textarea" :rows="2" class="reInput" v-model="params.correlation_msg" :maxlength="200"></Input>
                    </FormItem>
                    <FormItem label="未解决高频问题规则">
                        未知问题出现
                        <Select size="small" style="width:80px"  v-model="params.mark_times">
                            <Option v-for="(item,index) in 10" :key="index" :value="item">{{ item }}</Option>
                        </Select>
                        次后添加为未解决高频问题
                    </FormItem>
                    <FormItem label="输入匹配仅匹配主问题">
                        <i-switch size="large" :true-value="1" :false-value="0" v-model="params.match_title">
                            <span slot="open">ON</span>
                            <span slot="close">OFF</span>
                        </i-switch>
                    </FormItem>
                </Form>
                <div class="saveSetting">
                    <Button type="success" @click="robotSaveSetting" :loading="btnLoading">保存设置</Button>
                </div>
            </div>
        </div>
        <add-question :selectInData="params.common_questions" @addQs="addQs" ref="showAddQuestion"></add-question>
    </div>
</template>

<script>
import uploadImg from '@/views/my-components/uploadImg/uploadImg';
import addQuestion from "../components/add-question";
import { settingRobot, getRobotSetting } from '@/libs/api';
export default {
    data(){
        return {
            btnLoading:false,
            notQs: ['抱歉，能否再描述一下您的问题，没太听懂呢~'],
            params:{
                active:0,                //启用状态
                mode:0,                  //机器人模式 0优先由机器人接待 1仅在客服离线或坐席全部占满时接待
                welcome_msg:['机器人小鲁正在为您服务,以下是你想问的吗?'],       //欢迎语
                is_common:1,             //常见问题引导
                common_questions:[],     //常见问题
                name:'',                 //机器人名称
                head_img:'https://cdn.lubankf.com/statics/images/robot_im.png',              //机器人头像
                service_btn:0,           //转人工开关 0关闭 1打开
                match_title:0,           //	输入匹配仅匹配主问题
                auto_send_correlation:1, //自动推荐相关问题 0关闭 1打开
                correlation_msg:'您可能还关心以下问题:', //关联问题引导语
                mark_times:3,            //未知问题出现多少次为高频词
                is_auto_transfer:0,      //启用自动转人工
                transfer_sec:2,          //未识别消息次数
                not_match_msg:[],        //未识别消息引导语
                auto_transfer_msg: '不太懂你说什么，正在为您转接人工，请稍后~',    //自动转人工文案
                transfer_msg: '不太懂你说什么，是否需要转接人工？',               //手动转人工文案
                leave_msg: '不太懂你说什么，要不给我们留言？'                     //转留言文案
            },
        }
    },
    mounted(){
        this.$dragging.$on('dragged', ({ value }) => {})
        this.getRobotInfo();   //加载机器人设置
    },
    comText(){
        var obj={};
        obj=JSON.parse(JSON.stringify(this.params.name));
        return;
    },
    methods:{
        //获取机器人设置
        getRobotInfo(){
            getRobotSetting().then(res => {
                if(res.code == 0){
                    if(res.data){
                        this.params = res.data;
                        if(typeof(this.params.welcome_msg) == 'string'){
                            this.params.welcome_msg = [this.params.welcome_msg];
                        }
                        this.notQs = this.params.not_match_msg;
                    }
                }else{
                    this.$Notice.error({title:res.msg});
                }
            })
        },

        //上传机器人头像
        uploadRobotImg(data){
            if(data.status){
                this.params.head_img = data.url;
            }else{
                this.params.head_img = "";
            }
        },

        //保存机器人设置
        robotSaveSetting(){
            if(!this.params.name){
                this.$Notice.warning({title: '机器人名称不能为空'});
                return;
            }
            if(!this.params.welcome_msg){
                this.$Notice.warning({title: '机器人欢迎语不能为空'});
                return;
            }
            if(!this.params.auto_transfer_msg){
                this.$Notice.warning({title: '自动转人工文案不能为空'});
                return;
            }
            if(!this.params.transfer_msg){
                this.$Notice.warning({title: '手动转人工文案不能为空'});
                return;
            }
            if(!this.params.leave_msg){
                this.$Notice.warning({title: '留言文案不能为空'});
                return;
            }
            for(var i = 0;i < this.notQs.length; i++ ){
                this.$refs.notQsInput[i].$refs.textarea.style.borderColor = '#dcdee2';
                if(!this.notQs[i]){
                    this.$refs.notQsInput[i].$refs.textarea.style.borderColor = 'red';
                    this.$nextTick(() => {
                        this.$refs.notQsInput[i].$refs.textarea.focus(); 
                    })
                    this.$Notice.warning({title: `第${i+1}次未识别问题回复不能为空`});
                    return;
                }
            }
            this.params.not_match_msg = this.notQs;
            this.btnLoading = true;
            settingRobot(this.params).then(res => {
                this.btnLoading = false;
                if(res.code == 0){
                    this.$Notice.success({
                        title:res.msg,
                        duration:1,
                        onClose:()=>{
                            this.$router.push({
                                path: '/config'
                            })
                        }
                    });
                }else{
                    this.$Notice.error({title:res.msg});
                }
            })
        },

        //添加常见问题
        addQs(data){
            this.params.common_questions = [];
            data.forEach((e,index) => {
                if(index <= 4){
                    this.params.common_questions.push({title: e.title, id: e.id});
                }
            })
        },

        //删除常见问题
        delQs(index){
            this.params.common_questions.splice(index,1);
        },

        //添加关联问题
        showAddQs(){
            this.$refs.showAddQuestion.showAddQs();
        },

        //连续未识别几次消息
        changeTransfer(){
            var msg = '抱歉，能否再描述一下您的问题，没太听懂呢~';
            var num = Number(this.params.transfer_sec) - 1;
            var notqsNum = this.notQs.length;
            if(notqsNum < num){
                for(var i = 0; i < num - notqsNum;i++){
                    this.notQs.push(msg);
                }
            }else if(notqsNum > num){
                for(var i = 0; i < notqsNum - num;i++){
                    this.notQs.splice(notqsNum - 1,1);
                }
            }
        },

        //恢复机器人默认头像
        defaultRobotImg(){
            this.params.head_img = 'https://cdn.lubankf.com/statics/images/robot_im.png';
            this.$refs.uploadImg.updatedImg(this.params.head_img);
        },

        //增加一条欢迎语
        addWelcomeMsg(){
            this.params.welcome_msg.push('');
        },

        //删除一条欢迎语
        delWelcomeMsg(index){
            this.params.welcome_msg.splice(index, 1);
        },
    },
    components:{
        uploadImg,
        addQuestion
    }
}
</script>


<style lang="less">
    .robotSetup{
        height: 100%;
        .repBox{
            height:100%;
            padding:20px;
            .robotSetupContent{
                height:100%;
                margin-top:20px;
                overflow-y: auto;
                textarea.ivu-input{
                    color:#999;
                }
                .reInput{
                    width:400px;
                }
                .patternInfo{
                    text-indent:15px;
                    color:#999;
                }
                .editor{
                    width:850px;
                }
                .addQs{
                    margin-top:10px;
                }
                .qsList{
                    width:540px;
                    li{
                        height:32px;
                        line-height: 32px;
                        background: #f5f5f5;
                        border-bottom:1px solid #e7e7e7;
                        span{
                            max-width:500px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            display: inline-block;
                            text-indent: 10px;
                        }
                        a.close{
                            float:right;
                            margin-right:10px;
                            color:red;
                            display: none;
                        }
                        &:hover{
                            background:#ebf8ff;
                            cursor: move;
                        }
                        &:hover a{
                            display: block;
                            cursor: pointer;
                        }
                    }
                }
                .notQustions{
                    padding-top:20px;
                    li{
                        padding-bottom:10px;
                        p{
                            color:#333;
                        }
                    }
                }
                .robotImg{
                    display: inline-block;
                    vertical-align: middle;
                    margin-right:10px;
                }
                .welcomeMsg{
                    li{
                        margin-bottom:10px;
                        a{
                            font-size:24px;
                            color:#2d8cf0;
                        }
                        a.delWelcomeMsg{
                            color:#fb0000;
                        }
                    }
                }
            }
            .saveSetting{
                position: fixed;
                bottom:30px;
                right:50px;
            }
        }
    }
    .addRepository{
        .reInput{
            width:300px;
            display: block;
        }
        .similarity{
            margin-top:10px;
            display:inline-block;
        }
        .delRes{
            color:#f1025f;
            font-size:18px;
            cursor: pointer;
        }
    }
</style>
