<template>
    <div class="accreditWrap">
        <div class="titleTop">
            <div class="configTitle">
                <router-link to="/config/roles">
                    <Icon type="md-arrow-round-back" />
                    <h2>{{title}}</h2>
                </router-link>
            </div>
        </div>
        <div class="configTop"></div>
        <div class="addRolesWrap">
            <Form :label-width="80" label-position="left">
                <FormItem label="角色名称" style="width:500px">
                    <Input v-model="groupName"></Input>
                </FormItem>
                <FormItem label="描述" style="width:500px">
                    <Input v-model="remarks" type="textarea"></Input>
                </FormItem>
                <FormItem v-for="(item,index) in resData" :key="index" :label="item.name">
                    <Checkbox v-for="(checkName,index) in item.auth_item.title" v-model="checkName.is_check" :label="checkName.label" :key="index">{{checkName.name}}</Checkbox>
                </FormItem>
            </Form>
            <div class="hint">
                <Button @click="cancel">取消</Button>
                <Button type="primary" @click="sureAdd">确定</Button>
            </div>
        </div>
        <Spin fix size="large" v-if="showSpin"></Spin>
    </div>
</template>

<script>
import { getAuthList ,getRoleInfo ,addEditRole } from '@/libs/api.js';
export default {
    data(){
        return {
            title:'添加角色',
            showSpin: true,
            single: true,
            resData:[],
            api:getAuthList,
            remarks:'',
            groupName:'',
        }
    },
    mounted() {
        this.getRolesAuthList();
    },
    methods:{   
        //加载权限列表
        getRolesAuthList(){
            var data = "";
            if(this.$route.query.id){
                this.api = getRoleInfo;
                this.title = '编辑角色';
                data = {
                    rid: this.$route.query.id
                }
            }
            this.api(data).then(res => {
                if(res.code == 0){
                    this.showSpin = false;
                    if(data){
                        this.resData = res.data.permission;
                        this.groupName = res.data.groupName;
                        this.remarks = res.data.remarks;
                    }else{
                        this.resData = res.data;
                    }
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },
        
        //确定添加
        sureAdd(){
            var data = {
                groupName: this.groupName,
                rid: this.$route.query.id,
                remarks: this.remarks,
                permission: this.authList()
            }
            addEditRole(data).then(res => {
                if(res.code == 0){
                    this.$Notice.success({
                        title: res.msg,
                        duration: 1,
                        onClose: ()=> {
                            this.$router.push({
                                path: '/config/roles'
                            })
                            this.saveLoading = false;
                        }
                    });
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //选中的权限
        authList(){
            var authArr = [];
            this.resData.forEach(e => {
                e.auth_item.title.forEach(c => {
                    if(c.is_check){
                        authArr.push(c.label);
                    }
                })
            });
            return authArr;
        },
        
        //取消
        cancel(){
            this.$router.push({
                path: '/config/roles'
            })
        }
    },
}
</script>


<style lang="less" scoped>
    .accreditWrap{
        background:#fff;
        padding:20px;
    }
    .binding{
        padding:20px;
        p{
            line-height: 50px;
        }
    }
    .addRolesWrap{
        padding:20px 50px;
        .ivu-checkbox-wrapper{
            width:200px;
        }
    }
    .hint{
        margin-left:80px;
        button{
            margin-right:20px;
        }
    } 
</style>
