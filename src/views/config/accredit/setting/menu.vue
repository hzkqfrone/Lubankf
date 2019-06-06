<template>
    <div class="settingWrap">
        <div class="setting">
            <Card>
                <div class="configTitle">
                    <router-link to="/config/wechat">
                        <Icon type="md-arrow-round-back" />
                        <h2>微信自定义菜单</h2>
                    </router-link>
                </div>
                <div class="wechatAuthEdit">
                    <div class="container">
                    <!-- 自定义菜单 -->
                    <div class="custom-menu-edit-con">
                        <div class="hbox">
                        <div class="inner-left">
                            <div class="custom-menu-view-con">
                            <div class="custom-menu-view">
                                <div class="custom-menu-view__title">公众号名称</div>
                                <div class="custom-menu-view__body">
                                <div class="weixin-msg-list"><ul class="msg-con"></ul></div>
                                </div>
                                <div id="menuMain" class="custom-menu-view__footer">
                                <div class="custom-menu-view__footer__left"></div>
                                <div id="customBtns" class="custom-menu-view__footer__right" >
                                    <div class="custom-menu-view__menu"  v-if="menuObj.button.length>0"
                                        v-for="(item,index) in menuObj.button"
                                        :class="{subbutton__actived:menuIndex[index].isActive}"
                                        :style="{width:buttonWidth}">
                                        <div class="text-ellipsis" @click="menuTab(index)">{{item.name}}</div>
                                        <ul class="custom-menu-view__menu__sub" v-if="menuIndex[index].isActive">
                                            <li v-for="(subItem,subIndex) in item.sub_button"
                                                v-if="subItem.name"
                                                class="custom-menu-view__menu__sub__add"
                                                :class="{subbutton__actived:subIndex==subBtnIndex[index].num}"
                                                @click="liTab(index,subIndex)">
                                                {{subItem.name}}
                                            </li>
                                            <li v-if="item.sub_button.length<5" @click="subAddBtn(index)">
                                                <Icon type="md-add" />
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="custom-menu-view__menu" v-if="menuObj.button.length==0" @click="addBtn(0)" style="width: 100%;">
                                    <div class="text-ellipsis">
                                        <Icon type="md-add" />
                                    </div>
                                    </div>
                                    <div class="custom-menu-view__menu" v-if="menuObj.button.length==1" @click="addBtn(1)" style="width: 50%;">
                                    <div class="text-ellipsis">
                                        <Icon type="md-add" />
                                    </div>
                                    </div>
                                    <div class="custom-menu-view__menu" v-if="menuObj.button.length==2" @click="addBtn(2)" style="width: 33.33%;">
                                    <div class="text-ellipsis">
                                        <Icon type="md-add" />
                                    </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        <div class="inner-right">
                            <Spin size="large" fix v-if="showSpin"></Spin>
                            <div class="cm-edit-after">
                                <div class="cm-edit-right-header b-b">
                                    <h3>{{params.name}}</h3>
                                    <Poptip
                                        v-if="params.sub_button && params.sub_button.length>0"
                                        confirm
                                        placement="left"
                                        style="float:right;"
                                        :title="`确定要删除${params.name}及其子菜单吗?`"
                                        @on-ok="del">
                                        <a class="javascript:;">删除菜单</a>
                                    </Poptip>
                                    <a v-else class="javascript:;" @click="del">删除菜单</a>
                                </div>
                                <Form :label-width="100">
                                    <FormItem label="菜单名称">
                                        <Input v-model="params.name" @on-blur="updateValue" class="form-control"/>
                                        <div class="help-block">
                                            <div v-show="params.name.length==0">请输入菜单名称</div>
                                        </div>
                                        <p>字数不超过{{clickChildMenu ? "8" : "4"}}个汉字或{{clickChildMenu ? "16" : "8"}}个字母</p>
                                    </FormItem>
                                    <FormItem label="菜单内容" style="margin:0" v-if="urlShow">
                                        <div class="menuContent">
                                            <RadioGroup v-model="radioType" @on-change="selectMenuContent">
                                                <Radio label="imgText">发送消息</Radio>
                                                <Radio label="url">跳转页面</Radio>
                                            </RadioGroup>
                                        </div>
                                    </FormItem>
                                </Form>
                                    <div class="cm-edit-content-con" id="editPage" v-if="urlShow">
                                        <div class="cm-edit-page">
                                            <div v-if="radioType=='imgText'">
                                                <div class="sendMsgContent">
                                                    <a href="javascript:;" :class="{imageText:true,selectMsgType:imgTxtType==0}" @click="editImgTxt(0,'imgText')"><Icon type="md-images" />图文信息</a>
                                                    <a href="javascript:;" :class="{text:true,selectMsgType:imgTxtType==1}" @click="editImgTxt(1,'text')"><Icon type="ios-create" />文字</a>
                                                </div>
                                                <div class="textImgContent" v-if="imgTxtType==0 && !imgText" @click="imgTetxtMoadl=true">
                                                    <div style="padding: 20px 0">
                                                        <Icon type="md-add"  size="52"/>
                                                        <p>新建图文</p>
                                                    </div>

                                                </div>

                                                <!-- 有图文消息内容时 -->
                                                <div class="textImgWrap" v-if="imgTxtType==0 && imgText">
                                                    <h3>{{imgText.title}}</h3>
                                                    <p>{{imgText.author}}</p>
                                                    <img :src="imgText.thumb_url">
                                                    <div class="content" v-html="imgText.content"></div>
                                                    <p>
                                                        <a :href="imgText.content_source_url">阅读原文</a>
                                                        <span class="edit">
                                                            <Tooltip content="编辑" placement="top">
                                                                <Icon class="edit" type="md-create" @click="editImgText"/>
                                                            </Tooltip>
                                                        </span>
                                                    </p>
                                                </div>

                                                <div class="textContent" v-if="imgTxtType==1">
                                                    <Input type="textarea" :rows="8" :maxlength="20" v-model="params.content" @on-blur="updateUrl('text')"></Input>
                                                    <div class="textBotttom">
                                                        <emoji-show :isShowIcon="isShowIcon" @selectEmoji="selectEmoji"></emoji-show>
                                                        <div class="wordCount">最多可输入600字</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div v-if="radioType=='url'" class="targetLink">
                                                <div class="row">
                                                    <label class="control-label" style="text-align: left;">订阅者点击该子菜单会跳到以下链接</label>
                                                </div>
                                                <div class="row">
                                                    <label class=" control-label" style="text-align: left;">页面地址</label>
                                                </div>
                                                <div>
                                                    <Input type="text" name="url" class="form-control" v-model="params.url" v-on:input="updateUrl()"></Input>
                                                    <span class="help-block" v-if="isUrl">必须是正确的URL格式</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="cm-edit-before" v-if="menuObj.button.length==0 || operationShow"><h5>点击左侧菜单进行操作</h5></div>
                            </div>
                        </div>
                        <div class="operation">
                            <Button @click="save" :loading="saveLoading" type="primary">保存并发布</Button>
                        </div>
                    </div>
                    </div>
                </div>
            </Card>

            <!-- 新建图文 -->
            <Modal
                v-model="imgTetxtMoadl"
                width="800"
                :mask-closable="false"
                title="图文信息">
                <Form label-position="top" ref="addImgText" :model="addImgText" :rules="ruleValidate">
                    <FormItem label="标题" prop="title">
                        <Input type="text" v-model="addImgText.title"></Input>
                    </FormItem>
                    <FormItem label="作者" prop="author">
                        <Input type="text" v-model="addImgText.author"></Input>
                    </FormItem>
                    <FormItem label="内容" prop="title">
                        <editor
                            class="editor"
                            :value="content"
                            @input="editors"
                            :url              = "Url"
                            :max-size         = "MaxSize"
                            :accept           = "Accept"
                            :with-credentials = "withCredentials"
                            @on-upload-fail   = "onEditorReady"
                            @on-upload-success= "onEditorUploadComplete">
                        </editor>
                    </FormItem>
                    <FormItem label="原文链接" prop="content_source_url">
                        <Input type="text" v-model="addImgText.content_source_url"></Input>
                    </FormItem>
                    <div class="pubStyle">
                        <p class="title">发布样式编辑</p>
                        <FormItem label="封面" prop="thumb_media_id">
                            <div class="demo-upload-list" v-for="item in uploadList">
                                <template v-if="item.status === 'finished'">
                                    <img :src="item.url">
                                    <div class="demo-upload-list-cover">
                                        <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                                    </div>
                                </template>
                                <template v-else>
                                    <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                                </template>
                            </div>
                            <div  v-show="uploadList.length == 0">
                                <Upload
                                    ref="upload"
                                    :show-upload-list="false"
                                    :on-success="handleSuccess"
                                    :format="['jpg','jpeg','png']"
                                    :max-size="2048"
                                    :on-format-error="handleFormatError"
                                    :on-exceeded-size="exceededSize"
                                    type="drag"
                                    name="image"
                                    :data="uploadImgData"
                                    :with-credentials="true"
                                    :action="action"
                                    style="display: inline-block;width:58px;">
                                    <div style="width: 58px;height:58px;line-height: 58px;">
                                        <Icon type="ios-camera" size="20"></Icon>
                                    </div>
                                </Upload>
                            </div>
                            <Checkbox v-if="addImgText.thumb_media_id" v-model="addImgText.show_cover_pic" true-value="1" false-value="0">封面图片显示正文中</Checkbox>
                        </FormItem>
                        <FormItem label="摘要">
                            <Input type="textarea" v-model="addImgText.digest" :rows="4" :maxlength="120" placeholder="选填,如果不填写会默认抓取正文前54个字"></Input>
                        </FormItem>
                    </div>
                </Form>
                <div slot="footer">
                    <Button @click="imgTetxtMoadl=false">取消</Button>
                    <Button :loading="addImgTextLoading" @click="newImgText" type="primary">保存</Button>
                </div>
            </Modal>
        </div>

    </div>
</template>
<script>
import { getCustomMenu, createCustomMenu, material, getMaterial } from '@/libs/api';
import emojiShow from '@/views/my-components/emoji/emojiComponents.vue';
import editor from '@/views/my-components/text-editor/text-editor';
import { beyondSize, url } from '@/mixins/mixin';
import Cookies from 'js-cookie';
export default {
    props:['token'],
    mixins:[beyondSize, url],
    data(){
        const validateUrl = (rule, value, callback) => {
            let match = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;//验证url
            if (!match.test(value)) {
                callback(new Error('请输入正确的地址'));
            } else {
                callback();
            }
        };
        return{
            showSpin:true,
            saveLoading:false,
            action:'',   //上传图片路径
            uploadImgData:{},  //上传图片参数
            imgTetxtMoadl:false, //新建图文弹框
            addImgTextLoading:false, //保存图文信息按钮
            uploadList: [],   //封面图
            params:{
                name:'',  //菜单名称
                url:'',     //跳转链接
                content:'',   //文字
                type:'imgText'  //选择菜单内容
            },
            clickChildMenu:false,  //是否点击子菜单
            dataIndex:[0,0,null],
            operationShow: true,
            urlShow: true,
            isUrl: false,
            menuIndex:[
                {isActive:true},
                {isActive:false},
                {isActive:false}
            ],
            subBtnIndex: [
                {num:-1},
                {num:-1},
                {num:-1}
            ],
            menuObj:{
                "button": [],
                events:[]
            },
            buttonObj:{
                "name": "新建菜单",
                "url": "",
                "sub_button": [],
                "text":'',
                "contentType":'imgText',  //选择菜单内容
                "type":'click'
            },
            subObj:{
                "name": "新建菜单",
                "url": "",
                "text":'',
                "contentType":'imgText',  //选择菜单内容
                "type":'click'
            },
            imgText: "",    //图文信息
            radioType:"imgText",  //选择发布类型 - 0消息 1链接
            imgTxtType:"0",  //图文信息 0 图文 1文字
            isShowIcon:false,  //显示emoji
            Url: 'http://localhost:9528/api/PublicTransaction-SYS-Web/upload/singleUpload', // 图片对应的上传地址
            MaxSize: 75765, // 文件大小
            Accept: 'image/jpeg, image/png', // 文件格式
            withCredentials: true,
            content: '', // 富文本编辑器双向绑定的内容
            addImgText:{show_cover_pic:'0'},  //新建图文参数
            ruleValidate: {    
                title: [
                    {required: true, message: '请填写标题', trigger: 'blur'},
                ],
                author: [
                    {required: true, message: '请填写作者', trigger: 'blur'},
                ],
                content: [
                    {required: true, message: '请填写内容', trigger: 'blur'},
                ],
                content_source_url: [
                    {required: true, message: '请填写原文链接', trigger: 'blur'},
                    {validator: validateUrl, trigger: 'blur'}
                ],
                thumb_media_id: [
                    {required: true, message: '请上传封面', trigger: 'blur'},
                ]
            }
        }
    },
    computed:{
        buttonWidth(){
            return this.menuObj.button.length==3?'33.33%':100/(this.menuObj.button.length+1)+'%';
        }
    },
    mounted() {
        this.customMenu();     //查询自定义菜单
        this.uploadList = this.$refs.upload.fileList;
        this.action = `${url}api/settings/menu/upload-image.htm`;   //上传图片路径
        this.uploadImgData = {
            access_token: this.$store.state.app.access_token,
            appToken: this.$route.params.token 
        }
    },
    methods:{
        //查询当前自定义菜单
        customMenu(){
            getCustomMenu({appToken: this.$route.params.token}).then(res =>{
                this.showSpin = false;
                if(res.code == 0){
                    this.menuObj.button = res.data.data.menu.button;
                    if(res.data.data.menu.button.length > 0) this.menuTab(0);
                }else{
                    this.$Notice.error({title:res.msg}); 
                }
            })
        },

        del(){//删除菜单
            let x=this.dataIndex[0];
            let y=this.dataIndex[1];
            let z=this.dataIndex[2];
            z==0?this.menuObj.button.splice(x,1):this.menuObj.button[x].sub_button.splice(y,1);//判断删除一级菜单还是二级菜单
            for(let i=0;i<this.menuObj.button.length;i++){
                this.subBtnIndex[i].num=-1;//重置所有子菜单选中状态
                this.menuIndex[i].isActive=false;//重置一级菜单
            }
            this.operationShow=true;//右侧隐藏操作框
        },
        addBtn(index){//添加一级菜单
            this.radioType = "imgText";
            this.imgTxtType = "0";
            this.imgText = "";
            var button=this.menuObj.button;
            button.splice(button.length,0,JSON.parse(JSON.stringify(this.buttonObj)));//添加菜单按钮
            for(let i=0;i<this.menuObj.button.length;i++){
                this.subBtnIndex[i].num=-1;//重置所有子菜单选中状态
                this.menuIndex[i].isActive=false;//重置一级菜单
            }
            this.menuIndex[index].isActive=true;
            this.params = this.menuObj.button[index];
            this.urlWindow(index);

            this.dataIndex.splice(0,1,index);
            this.dataIndex.splice(2,1,0);
            this.operationShow=false;
        },
        subAddBtn(index){//添加子菜单
            this.radioType = "imgText";
            this.imgTxtType = "0";
            this.imgText = "";
            for(let i=0;i<this.menuObj.button.length;i++){
                this.subBtnIndex[i].num=-1;//重置所有子菜单选中状态
                this.menuIndex[i].isActive=false;//重置一级菜单
                if(i ==index){
                    var sub_button=this.menuObj.button[i].sub_button;
                    sub_button.splice(this.menuObj.button[i].sub_button.length,0,JSON.parse(JSON.stringify(this.subObj)));//添加子菜单按钮
                    if(sub_button.length>0){
                    this.subBtnIndex[index].num=sub_button.length-2;
                    this.menuObj.button[i].url='';//增加子菜单，清空一级菜单url
                    }
                    this.subBtnIndex[index].num++;//子菜单选中状态
                }
            }
            this.menuIndex[index].isActive=true;
            this.params = this.menuObj.button[index].sub_button[this.subBtnIndex[index].num];
            this.urlWindow(index,true);

            this.dataIndex.splice(0,1,index);
            this.dataIndex.splice(1,1,this.subBtnIndex[index].num);
            this.dataIndex.splice(2,1,1);
            this.operationShow=false;
        },
        menuTab(index){//点击一级菜单
            this.clickChildMenu = false;
            this.imgText = "";
            for(let i=0;i<this.menuObj.button.length;i++){
                this.subBtnIndex[i].num=-1;//重置所有子菜单选中状态
                this.menuIndex[i].isActive=false;//重置一级菜单
            }
            this.menuIndex[index].isActive=true;
            this.params = this.menuObj.button[index];
            this.showMenuContent();
            this.urlWindow(index);

            //获取图文详情
            if(this.params.type == "media_id" && this.params.media_id){
                this.getMaterialInfo(this.params.media_id);
            }

            this.dataIndex.splice(0,1,index);
            this.dataIndex.splice(2,1,0);
            this.operationShow=false;
        },
        liTab(index,subIndex){//点击子菜单
            this.clickChildMenu = true;
            this.imgText = "";
            for(let i=0;i<this.menuObj.button.length;i++){
                this.subBtnIndex[i].num=-1;//重置所有子菜单选中状态
                this.menuIndex[i].isActive=false;//重置一级菜单
            }
            this.subBtnIndex[index].num=subIndex;
            this.menuIndex[index].isActive=true;
            this.params = this.menuObj.button[index].sub_button[subIndex];
            this.showMenuContent();
            this.urlWindow(index,true);

            //获取图文详情
            if(this.params.type == "media_id" && this.params.media_id){
                this.getMaterialInfo(this.params.media_id);
            }

            this.dataIndex.splice(0,1,index);
            this.dataIndex.splice(1,1,subIndex);
            this.dataIndex.splice(2,1,1);
            this.operationShow=false;
        },

        //点击菜单 显示对应的菜单内容
        showMenuContent(){
            if(this.params.type){
                var t = this.params.type;
                if(t == "media_id"){
                    this.radioType = "imgText";
                    this.imgTxtType = "0";
                }else if(t == "click"){
                    this.radioType = "imgText";
                    this.imgTxtType = "1";
                }else if(t == "view"){
                    this.radioType = "url";
                }
            }else{
                this.radioType = "imgText";
                this.imgTxtType = "0";
            }
        },

        updateValue(type){//更新按钮name
            //一级菜单名称 4   二级菜单 8
            var char_length = 0,len = this.clickChildMenu ? 8 : 4;
            var str = this.params.name;
            for (var i = 0; i < str.length; i++){
                var son_str = str.charAt(i);
                encodeURI(son_str).length > 2 ? char_length += 1 : char_length += 0.5;
                if (char_length >= len){
                    var sub_len = char_length == len ? i+1 : i;
                    this.params.name = str.substr(0, sub_len);
                    break;
                }
            }


            let x=this.dataIndex[0];
            let y=this.dataIndex[1];
            let z=this.dataIndex[2];
            z==0?this.setmenu(x):this.setSubmenu(x,y);
        },
        updateUrl(){//更新按钮url
            let match = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;//验证url
            let isUrl = match.test(this.params.url);
            let x=this.dataIndex[0];
            let y=this.dataIndex[1];
            let z=this.dataIndex[2];
            isUrl?this.isUrl=false:this.isUrl=true;
            z==0?this.setmenu(x):this.setSubmenu(x,y);
        },
        getInfo(name,url){//显示name，url
            this.rightTitle=name;
            this.url=url;
        },
        setmenu(x){
            this.menuObj.button[x] = this.params;
        },
        setSubmenu(x,y){
            this.menuObj.button[x].sub_button[y] = this.params;
        },
        urlWindow(index,subIndex){//显示右侧url窗口
            if(!subIndex && this.menuObj.button[index].sub_button.length>0){
                this.urlShow = false;
            }else{
                this.urlShow = true;
            }
        },  


        //保存
        save(){
            let button=this.menuObj.button;
            this.menuObj.events = [];
            var matchs = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;//验证url
            for(let i=0;i<button.length;i++){//验证url是否为空
                if(button[i].sub_button.length==0){
                    if(!button[i].contentType && !button[i].type){
                        button[i].contentType = "imgText";
                    }
                    button[i].type = this.replaceType(button[i].contentType,'type') || button[i].type;
                    if(button[i].name==''){
                        this.$Notice.error({title: '一级菜单名称不能为空'});
                        this.menuTab(i);
                        return;
                    }else if((button[i].contentType == "imgText" && !button[i].media_id) || (button[i].contentType == "text" && button[i].text =='') || (button[i].contentType == "url" && button[i].url =='')){
                        this.$Notice.error({title: `${button[i].name}菜单${this.replaceType(button[i].contentType,'contentType')}不能为空`});
                        this.menuTab(i);
                        return;
                    }else if(button[i].type == "click"){    //文字
                        button[i].key = this.getRanNum();
                        // delete button[i].text;
                        delete button[i].media_id;
                        delete button[i].url;
                        this.eventsPush(button[i]);
                    }else if(button[i].type == "view"){                                     //跳转地址
                        delete button[i].key;
                        if(!matchs.test(button[i].url) || !button[i].url){
                            this.$Notice.error({title: `${button[i].name}url地址格式错误`});
                            return false;
                        }
                    }else if(button[i].type == "media_id"){                        //图文信息
                        delete button[i].key;
                    }
                }else{
                    for(let j=0;j<button[i].sub_button.length;j++){
                        button[i].sub_button[j].type = this.replaceType(button[i].sub_button[j].contentType,'type') || button[i].sub_button[j].type;
                        var msg = button[i].sub_button[j];
                        if(button[i].sub_button[j].name==''){
                            this.$Notice.error({title: '二级菜单名称不能为空'});
                            this.liTab(i,j);
                            return;
                        }else if((button[i].sub_button[j].contentType == "imgText" && !button[i].sub_button[j].imgText) || (button[i].sub_button[j].contentType == "text" && button[i].sub_button[j].text =='') || (button[i].sub_button[j].contentType == "url" && button[i].sub_button[j].url =='')){
                            this.$Notice.error({title: `${button[i].sub_button[j].name}菜单${this.replaceType(button[i].sub_button[j].contentType,'contentType')}不能为空`});
                            this.liTab(i,j);
                            return;
                        }else if(button[i].sub_button[j].type == "click"){   //文字
                            button[i].sub_button[j].key = this.getRanNum();
                            this.eventsPush(button[i].sub_button[j]);
                            delete msg.url;
                            delete button[i].type;
                            delete button[i].media_id;
                            delete button[i].url;
                        }else if(button[i].sub_button[j].type == "view"){   //跳转页面
                            delete msg.text;
                            delete msg.contentType;
                            delete msg.key;
                            if(!matchs.test(button[i].sub_button[j].url)){
                                this.$Notice.error({title: `${button[i].sub_button[j].name}url地址格式错误`});
                                return false;
                            }
                        }else if(button[i].sub_button[j].type == "media_id"){  //图文信息
                            delete msg.key;
                            delete msg.text;
                        }
                    }
                }
            }
            this.saveLoading = true;
            this.createMenu(button);
        },

        //保存提交自定义菜单
        createMenu(button){
            var data = {
                appToken: this.$route.params.token,
                menu: JSON.stringify(button),
                events: JSON.stringify(this.menuObj.events)
            }
            createCustomMenu(data).then(res => {
                this.saveLoading = false;
                if(res.code == 0){
                    this.$Notice.success({title:'发布成功'});
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //替换类型
        replaceType(type,s){
            var content = "";
            var t = "";
            switch (type) {
                case "imgText":
                    content = "图文信息";
                    t = "media_id";
                    break;
                case "text":
                    content = "文字";
                    t = "click";
                    break;
                case "url":
                    content = "跳转页面地址";
                    t = "view";
                    break;
                default:
                    break;
            }
            if(s == "contentType"){
                return content;
            }else{
                return t;
            }
        },

        eventsPush(button){
            let events = this.menuObj.events;
            events.push({
                eventKey: button.key,
                content: button.content,
                contentType: button.contentType,
            })
        },


        //选择图文信息 和 文字
        editImgTxt(index,type){
            this.imgTxtType = index;
            this.params.contentType = type;
        },
        //选择菜单内容
        selectMenuContent(type){
            this.params.contentType = type;
            if(type == "imgText"){
                this.params.type = "click";
            }else{
                this.params.type = "view";
            }
        },

         //选中emoji
        selectEmoji(data){
            this.params.text = this.params.text + data;
        },

        editors(content) { // editor组件传过来的值赋给content
            console.log(content)
            this.content = content.innerHTML
        },
        onEditorReady(ins, ina) { // 上传失败的函数
            console.log('ins')
            console.log(ins)
            console.log(ina)
        },
        onEditorUploadComplete(json) { // 处理上传图片后返回数据，添加img标签到编辑框内
            console.log('json')
            console.log(json)
            console.log(json[0].data.filePath)
            this.content = this.content + '<img src=' + json[0].data.filePath + '>'
        },
        
        //封面图上传成功
        handleSuccess (res, file) {
            this.uploadList = [{url: res.data.pic,status: 'finished'}];
            this.addImgText.thumb_url = res.data.pic;
            this.addImgText.thumb_media_id = res.data.media_id;
        },

        //删除封面图 
        handleRemove (file) {
            const fileList = this.$refs.upload.fileList;
            this.uploadList = [];
            this.addImgText.thumb_media_id = "";
            this.addImgText.show_cover_pic = "0";
        },

        //新建图文
        newImgText(){
            this.addImgText.content = this.content;
            this.addImgText.appToken = this.$route.params.token;
            this.addImgTextLoading = true;
            this.$refs.addImgText.validate((valid) => {
                if (valid) {
                    material(this.addImgText).then(res => {
                        this.addImgTextLoading = false;
                        if(res.code == 0){
                            this.$Notice.success({title: res.msg});
                            this.params.media_id = res.data.data.media_id;
                            this.imgText = this.addImgText;
                            this.imgText.media_id = res.data.data.media_id;
                            this.updateValue();
                            this.imgTetxtMoadl = false;
                        }else{
                            this.$Notice.error({title: res.msg});
                        }
                    })
                }
            })
        },

        //编辑图文信息
        editImgText(){
            this.imgTetxtMoadl = true;
            this.addImgText = this.imgText;
            this.content = this.addImgText.content;
            this.uploadList = [{url:this.addImgText.thumb_url,status:'finished'}];
        },

        //获取图文详情信息
        getMaterialInfo(id){
            var data = {
                appToken: this.$route.params.token,
                media_id: id
            }
            this.showSpin = true;
            getMaterial(data).then(res => {
                this.showSpin = false;
                if(res.code == 0){
                    this.imgText = res.data.news_item[0];
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },


        //随机key
        getRanNum(){ 
            var result = [];        
            for(var i=0;i<6;i++){           
                var ranNum = Math.ceil(Math.random() * 25);       
                result.push(String.fromCharCode(65+ranNum));        
            }     
            return result.join('') + '-' + Math.round(new Date().getTime());    
        }

    },
    components:{
        emojiShow,
        editor
    }

}
</script>
<style lang="less">
    @import '../css/customMenu.less';
    .demo-upload-list{
        display: block;
    }
</style>