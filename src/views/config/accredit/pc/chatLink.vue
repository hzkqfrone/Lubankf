<template>
    <div class="accreditWrap">
        <div class="titleTop">
            <div class="configTitle">
                <router-link to="/config/website">
                    <Icon type="md-arrow-round-back" />
                    <h2>聊天链接</h2>
                </router-link>
            </div>
        </div>
        <div class="configTop"></div>
        <div class="binding">
            <p>顾客打开这个界面即能与你的企业进行聊天</p>
            <div class="code" @click="clipboard" :data-clipboard-text="access">
                {{access}}
            </div>
            <Form :label-width="100" class="repForm" style="padding:0 10px;">
                <FormItem label="是否指定客服">
                    <i-switch size="large" :true-value="1" :false-value="0" v-model="params.is_design" @on-change="changeSwitch">
                        <span slot="open">ON</span>
                        <span slot="close">OFF</span>
                    </i-switch>
                </FormItem>
                <FormItem>
                    <Dropdown @on-click="changeService" placement="bottom-start">
                        <Button>
                            {{selectAgent}}
                            <Icon type="ios-arrow-down"></Icon>
                        </Button>
                        <DropdownMenu slot="list">
                            <Dropdown placement="right-start" v-for="(item,index) in kfList" :key="index" v-if="item.list.length>0">
                                <DropdownItem :name="'group' + item.id">
                                    {{item.name}}
                                    <Icon type="ios-arrow-forward"></Icon>
                                </DropdownItem>
                                <DropdownMenu slot="list">
                                    <DropdownItem v-for="(list, lIndex) in item.list" :key="lIndex" :name="list.id">{{list.username}}</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </DropdownMenu>
                    </Dropdown>
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<script>
import {getService, setAssgin, getAssgin} from '@/libs/api';
import Clipboard from 'clipboard';   //拷贝
export default {
    data(){
        return {
            access:`https://cdn.lubankf.com/chat_link/standalone.html?accessId=${this.$route.params.id}`,
            params:{
                is_design:0,
            },
            kfList:[],
            selectAgent:'请选择',
        }
    },
    mounted() {
        this.getServiceList();
    },
    methods:{
        //	获取客服列表
        getServiceList(){
            getService().then(res => {
                if(res.code == 0){
                    this.kfList = res.data;
                    this.getAssginService();
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //选择客服
        changeService(id, type, s){
            this.params.group_id = '';
            this.params.agent_id = '';
            var tag = false;
            this.kfList.forEach(e=>{
                try {
                    if(id.indexOf('group')>-1){
                        id = id.split('group')[1];
                        tag = true;
                    }
                } catch (error) {
                    
                }
                if(tag || type == "group"){
                    if(e.id == id){
                        this.selectAgent = e.name;
                        this.params.group_id = id;
                        return;
                    }
                }else{                
                    e.list.forEach(v=>{
                        if(v.id == id){
                            this.selectAgent = v.username;
                            this.params.agent_id = id;
                            return;
                        }
                    })
                }
            })
            if(!s) this.setAssginService();
        },

        changeSwitch(s){
            this.setAssginService();
            if(s){
                this.service();
            }
        },

        //设置指定客服
        setAssginService(){
            this.params.appToken = this.$route.params.id;
            setAssgin(this.params).then(res => {
                if(res.code == 0){
                    this.$Notice.success({title: res.msg});
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        service(){
            if(this.params.agent_id){
                this.changeService(this.params.agent_id, null , 'init');
            }else{
                this.changeService(this.params.group_id, 'group', 'init');
            }
        },

        //获取指定客服
        getAssginService(){
            getAssgin({appToken: this.$route.params.id}).then(res => {
                if(res.code == 0){
                    this.params = res.data;
                    if(this.params.is_design){
                        this.service();
                    }
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        clipboard(){
            var clipboard = new Clipboard('.code')
            clipboard.on('success', e => {
                this.$Message.success('复制成功');
                // 释放内存
                clipboard.destroy()
            })
        }
    }
}
</script>


<style lang="less" scoped>
    .accreditWrap{
        background:#fff;
        padding:20px;
        .accreditList{
            margin-top:20px;
        }
    }
    .binding{
        padding:20px;
        .code{
            margin:20px 0;
            width: 600px;
            padding: 10px 15px;
            resize: none;
            background-color: #edf5fc;
            border: 0;
            border-radius: 5px;
            color: #555;
            font-family: Menlo,Monaco,Consolas,Courier New,monospace;
            font-size: 14px;
            line-height: 1.5;
        }
    }
</style>
