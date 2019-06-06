<template>
    <div>
        <div class="loginStatus">
            <Dropdown @on-click="cutStatus">
                <a href="javascript:void(0)">
                    <Badge :status="cutS.s" :text="cutS.label" />
                </a>
                <DropdownMenu slot="list">
                    <DropdownItem v-for="(item,index) in sArr" :name="item.value" :key="index"><Badge :status="item.s" :text="item.label" /></DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
        <div class="audio">
            <Tooltip :content="status!=0 ? '关闭提示音' : '开启提示音'" placement="top">
                <Icon :type="status!=0 ? 'md-volume-up' : 'md-volume-off'"  @click="offOrOnAudio"/>
            </Tooltip>
        </div>
    </div>
</template>

<script>
import {mapState} from 'vuex';
import {setActive} from '@/libs/api.js';
export default {
    name: 'breadcrumbNav',
    props:['serviceStatus'],
    data(){
        return{
            data:sessionStorage.login_data,
            cutS:{s:'success',label:'空闲',value:'1'},
            sArr:[
                {s:'success',label:'空闲',value:'1'},
                {s:'error',label:'忙碌',value:'2'},
                {s:'warning',label:'隐身',value:'3'},
                {s:'processing',label:'离开',value:'4'}
            ]
        }
    },
    computed: {
        ...mapState({
            status : state => state.app.audio
        })
    },
    created() {
        if(this.data){
            var d = JSON.parse(this.data)
            if(d.serviceStatus){
                this.cutS = this.sArr[Number(d.serviceStatus)-1];
            }
        }
    },
    methods: {
        offOrOnAudio(){
            var s = this.status==1 ? 0 : 1;
            this.$store.commit('updatedAudio',s);
            localStorage.audioS = s;
        },

        //切换客服状态
        cutStatus(name){
            this.cutS = this.sArr[Number(name)-1];
            var d = JSON.parse(this.data)
            d.serviceStatus = name;
            sessionStorage.login_data =JSON.stringify(d);
            setActive({status:name}).then(res => {
                if(res.code == 0){
                    // this.$Notice.success({title: res.msg});
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        }
    },
    watch:{
        serviceStatus(n,o){
            this.cutS = this.sArr[Number(n)-1];
        }
    }
};
</script>
<style lang="less">
    .audio{
        cursor: pointer;
        margin-left:30px;
        display: inline-block;
        i{
            font-size:20px;
        }
    }
    .loginStatus{
        display: inline-block;
        vertical-align: bottom;
        .ivu-badge-status-dot{
            width:8px;
            height:8px;
        }
    }
</style>

