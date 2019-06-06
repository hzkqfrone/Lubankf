<template>
    <div class="accreditWrap">
        <div class="titleTop">
            <div class="configTitle">
                <router-link to="/config/website">
                    <Icon type="md-arrow-round-back" />
                    <h2>修改网站插件接入</h2>
                </router-link>
            </div>
        </div>
        <div class="configTop websiteWrap clearfix">
            <div class="websiteLeft">
                <div class="websiteLeftWrap elementScroll">
                    <div class="websitStyle">
                        <Form :label-width="160" label-position="left">
                            <Divider orientation="left">网站接入基本设置</Divider>
                            <FormItem label="网站名称">
                                <Input v-model="website.nickname"></Input>
                            </FormItem>
                            <FormItem label="网站域名">
                                <Input v-model="website.webDomain"></Input>
                            </FormItem>
                            <FormItem label="网站标题">
                                <Input v-model="website.pageTitle"></Input>
                            </FormItem>
                            <Divider orientation="left">会话模式设置</Divider>
                            <FormItem label="是否直接启用直接会话">
                                <RadioGroup v-model="website.autoInvite">
                                    <Radio :label="1">启用</Radio>
                                    <Radio :label="0">不启用</Radio>
                                </RadioGroup>
                            </FormItem>
                            <FormItem label="是否直接启用自动弹出">
                                <RadioGroup v-model="website.autoShowInviteType">
                                    <Radio :label="1">启用</Radio>
                                    <Radio :label="0">不启用</Radio>
                                </RadioGroup>
                                <div v-if="website.autoShowInviteType == 1">
                                    <p>访客打开网页后，停留
                                        <InputNumber :min="0" v-model="website.openStayTime" style="width:50px"></InputNumber>
                                        秒弹出聊天框（0表示网页打开后聊天框会立即弹出</p>
                                    <p>访客关闭或缩小聊天框则重新计时，
                                        <InputNumber :min="0" v-model="website.closeStayTime" style="width:50px"></InputNumber>
                                        秒弹出聊天框（0表示不再重复弹出）</p>
                                </div>
                            </FormItem>
                            <Divider orientation="left">对话窗口样式</Divider>
                            <FormItem label="窗口样式选择">
                                <div :class="{windStyle:true,s1:item==1?true:false, active:website.advConfig.advType == index}" @click="selectWin(item)" v-for="(item,index) in 4">
                                    <img :src="winStyleImg(item)">
                                    <Icon type="md-checkmark-circle" v-if="website.advConfig.advType == index" />
                                </div>
                            </FormItem>
                            <FormItem label="企业简称">
                                <Input v-model="website.companyName"></Input>
                            </FormItem>
                            <FormItem label="企业Logo或头像">
                                <upload-img @uploadpcImg="companyLogo" :imgUrl="website.companyLogo"></upload-img>
                            </FormItem>
                            <FormItem label="是否显示坐席名字">
                                <RadioGroup v-model="website.showAgentName">
                                    <Radio :label="1">是</Radio>
                                    <Radio :label="0">否</Radio>
                                </RadioGroup>
                            </FormItem>
                            <FormItem label="对话框皮肤" class="chatBoxColor">
                                <div>
                                    <span v-for="(item,index) in chatskin" @click="selcetSkin(index)" :style="{background: item}"><Icon type="md-checkmark" v-if="website.cssStyle.styleColor == item" /></span>
                                </div>
                                <ColorPicker v-model="website.cssStyle.styleColor" @on-change="selcetColorPicker"/>
                            </FormItem>
                            <FormItem label="是否显示关闭按钮">
                                <RadioGroup v-model="website.showCloseButton">
                                    <Radio :label="1">显示</Radio>
                                    <Radio :label="0">隐藏</Radio>
                                </RadioGroup>
                            </FormItem>
                            <!-- 左侧广告 -->
                            <div v-if="website.advConfig.advType=='3' || website.advConfig.advType=='2'">
                                <Divider orientation="left">左侧广告栏设置</Divider>
                                <FormItem label="选择图片">
                                    <upload-img @uploadpcImg="advLeftLogo" :imgUrl="website.advConfig.uploadLeftAdvtImg"></upload-img>
                                </FormItem>
                                <FormItem label="链接地址">
                                    <Input v-model="website.advConfig.uploadLeftAdvtUrl"></Input>
                                </FormItem>
                            </div>
                            <!-- 右侧广告 -->
                            <div v-if="website.advConfig.advType=='1' || website.advConfig.advType=='2'">
                                <Divider orientation="left">右侧广告栏设置</Divider>
                                <FormItem label="选择图片">
                                    <upload-img @uploadpcImg="advRightLogo" :imgUrl="website.advConfig.uploadRightAdvtImg"></upload-img>
                                </FormItem>
                                <FormItem label="链接地址">
                                    <Input v-model="website.advConfig.uploadRightAdvtUrl"></Input>
                                </FormItem>
                            </div>
                            <div v-if="website.advConfig.advType==0">
                                <Divider orientation="left">对话框位置及大小</Divider>
                                <FormItem label="水平方向">
                                    <Select v-model="website.cssStyle.chatboxLocation" @on-change="chatboxLocationAndSize" class="chatBoxSize">
                                        <Option value="right">向右对齐</Option>
                                        <Option value="center">居中对齐</Option>
                                        <Option value="left">向左对齐</Option>
                                    </Select>
                                    <ButtonGroup>
                                        <InputNumber :disabled="this.website.cssStyle.chatboxLocation=='center'" :max="200" :min="0" v-model="website.cssStyle.chatboxSideMargin" @on-change="chatboxLocationAndSize" class="chatBoxSize chatBoxPx"></InputNumber>
                                        <Button class="fontSize">像素</Button>
                                    </ButtonGroup>
                                </FormItem>
                                <FormItem label="垂直方向">
                                    <Select v-model="website.chatboxLocationY" @on-change="chatboxLocationAndSize" class="chatBoxSize">
                                        <Option value="top">向上对齐</Option>
                                        <Option value="center">居中对齐</Option>
                                        <Option value="bottom">向下对齐</Option>
                                    </Select>
                                    <ButtonGroup>
                                        <InputNumber :disabled="this.website.chatboxLocationY=='center'" :max="200" :min="0" v-model="website.chatboxSideMarginY" @on-change="chatboxLocationAndSize" class="chatBoxSize chatBoxPx"></InputNumber>
                                        <Button class="fontSize">像素</Button>
                                    </ButtonGroup>
                                </FormItem>
                                <FormItem label="宽度">
                                    <ButtonGroup>
                                        <InputNumber :max="600" v-model="website.chatboxWidth" @on-blur="chatWidthChange" class="chatBoxSize"></InputNumber>
                                        <Button class="fontSize">像素</Button>
                                    </ButtonGroup>
                                    <span class="chatBoxPx wordCl">建议范围: 300 ~ 600像素</span>
                                </FormItem>
                                <FormItem label="高度">
                                    <ButtonGroup>
                                        <InputNumber :max="600" v-model="website.chatboxHeight" @on-blur="chatHeightChange"  class="chatBoxSize"></InputNumber>
                                        <Button class="fontSize">像素</Button>
                                    </ButtonGroup>
                                    <span class="chatBoxPx wordCl">建议范围: 450 ~ 600像素</span>
                                </FormItem>
                            </div>
                            <Divider orientation="left">在线咨询按钮样式</Divider>
                            <FormItem label="在线咨询按钮文案">
                                <Input v-model="website.cssStyle.onlineText"></Input>
                            </FormItem>
                            <FormItem label="图标选择">
                                <div class="chatBtnIcon btnIcon_top">
                                    <span :class="{iconfont:true,span_back:item==website.cssStyle.chatboxIconType}" v-for="(item,index) in btnIcon" v-if="index<5" @click="selectIcon(index)" :key="index" v-html="item"></span>
                                </div>
                                <div class="chatBtnIcon">
                                    <span :class="{iconfont:true,span_back:item==website.cssStyle.chatboxIconType}"  v-for="(item,index) in btnIcon" v-if="index>=5" @click="selectIcon(index)" :key="index" v-html="item"></span>
                                </div>
                            </FormItem>
                            <FormItem label="按钮位置">
                                <Select v-model="website.cssStyle.chatButtonLocation" @on-change="btnLocation" class="chatBoxSize_1">
                                    <Option value="bottom-right">底边右侧按钮</Option>
                                    <Option value="bottom-left">底边左侧按钮</Option>
                                    <Option value="side-right">侧边右侧按钮</Option>
                                    <Option value="side-left">侧边左侧按钮</Option>
                                    <Option value="circle-right">圆形右侧按钮</Option>
                                    <Option value="circle-left">圆形左侧按钮</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="侧边距" v-if="website.cssStyle.chatButtonLocation!='side-right' && website.cssStyle.chatButtonLocation!='side-left'">
                                <ButtonGroup>
                                    <InputNumber :max="990" :min="0" @on-change="btnLocation" v-model="website.cssStyle.chatButtonSideMargin" class="chatBoxSize_2"></InputNumber>
                                    <Button class="fontSize">像素</Button>
                                </ButtonGroup>
                            </FormItem>
                            <FormItem label="底边距" v-if="website.cssStyle.chatButtonLocation!='bottom-right' && website.cssStyle.chatButtonLocation!='bottom-left'">
                                <ButtonGroup>
                                    <InputNumber :max="500" :min="0" @on-change="btnLocation" v-model="website.cssStyle.chatButtonBottomMargin" class="chatBoxSize_2"></InputNumber>
                                    <Button class="fontSize">像素</Button>
                                </ButtonGroup>
                            </FormItem>
                            <!-- 浮动广告 -->
                            <div v-if="website.advConfig.advType>0">
                                <Divider orientation="left">浮动广告语设置</Divider>
                                <Input type="textarea" v-model="website.advConfig.floatAdv" :rows="2"></Input>
                            </div>
                            <p class="wordCl">访客进入聊天窗口时自动推送且会一直展示在页面顶部，提醒访客时刻关注</p>
                            <Divider orientation="left">底部广告设置</Divider>
                            <FormItem label="广告滚动方向">
                                <RadioGroup v-model="website.advConfig.advScroll">
                                    <Radio label="scrollX">水平方向</Radio>
                                    <Radio label="scrollY">垂直方向</Radio>
                                </RadioGroup>
                            </FormItem>
                            <FormItem label="滚动间隔时间">
                                <ButtonGroup>
                                    <InputNumber :max="10" :min="0" v-model="website.advConfig.advScrollTime" class="chatBoxSize_2"></InputNumber>
                                    <Button class="fontSize">秒</Button>
                                </ButtonGroup>
                                <p class="wordCl">"0" 表示不展示广告，建议设置10秒内</p>
                            </FormItem>
                            <FormItem label="广告内容"></FormItem>
                            <div class="advertising">
                                <div class="num advLeft">已添加{{website.advConfig.advContent.length}}条广告</div>
                                <div class="adverRight">
                                    <a href="javascript:;" @click="addAdv" class="addAdver">添加</a>
                                    <a href="javascript:;" @click="removeAllAdv" class="removeAllAdver">删除所有</a>
                                </div>
                            </div>
                            <div class="advertising" v-for="(item,index) in website.advConfig.advContent" :key="index">
                                <div class="advLeft">{{item.advTitle}}</div>
                                <div class="adverRight">
                                    <i-switch v-model="item.enable"/>
                                    <a href="javascript:;" class="addAdver" @click="editAdv(index)">编辑</a>
                                    <a href="javascript:;" class="removeAllAdver" @click="removeAdv(index)">删除</a>
                                </div>
                            </div>
                            <div class="addAdvertising" v-if="showAddadv">
                                <FormItem label="广告内容">
                                    <Input v-model="addadvContent.advTitle" class="chatBoxSize_1"></Input>
                                </FormItem>
                                <FormItem label="广告链接">
                                    <Input v-model="addadvContent.advUrl" class="chatBoxSize_1"></Input>
                                </FormItem>
                                <!-- <FormItem label="广告地区">
                                    <div class="advList" v-for="(item,index) in cityArr" :key="index">
                                        <Cascader :data="area" change-on-select v-model="cityArr[index]" class="chatBoxSize_1"></Cascader>
                                        <Icon v-if="index == 0" type="md-add" @click="cascaderAddRow"/>
                                        <Icon v-if="index != 0" type="md-remove" @click="removeCascader(index)"/>
                                    </div>
                                </FormItem> -->
                                <div class="advHint">
                                    <Button @click="showAddadv=false">取消</Button>
                                    <Button @click="saveAddadv" type="primary">确定</Button>
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
                
                <!-- 保存设置 -->
                <div class="saveSetting">
                    <Button @click="cancelSetting">取消</Button>
                    <Button type="success" @click="saveSetting" :loading="saveLoading">保存设置</Button>
                </div>
            </div>
            <div class="websiteRight elementScroll">
                <div class="previewWrap">
                    <Divider orientation="left">预览效果</Divider>
                    <div class="previewBox" v-show="showChat">
                        <!-- 圆形按钮 -->
                        <div class="chatCircle" 
                            v-if="website.cssStyle.chatButtonLocation=='circle-left' || website.cssStyle.chatButtonLocation=='circle-right'" 
                            :style="btnStyle">
                            <span class="iconfont" v-html="website.cssStyle.chatboxIconType"></span>
                        </div>
                        <!-- 底边按钮 -->
                        <div class="chatBtn" v-else-if="website.cssStyle.chatButtonLocation=='bottom-left' || website.cssStyle.chatButtonLocation=='bottom-right'"
                            :style="btnStyle">
                            <span class="iconfont" v-html="website.cssStyle.chatboxIconType"></span>
                            <span>{{website.cssStyle.onlineText || '咨询客服'}}</span>
                        </div>
                        <!-- 侧边按钮 -->
                        <div class="sideBtn" v-else :style="btnStyle">
                            <span class="iconfont" v-html="website.cssStyle.chatboxIconType"></span>
                            <span>{{website.cssStyle.onlineText || '咨询客服'}}</span>
                        </div>
                        <div class="chatBox" 
                            :style="[chatWidth,chatLocation]">
                            <div class="header" :style="{background: website.cssStyle.styleColor}">
                                <div class="fll">
                                    <div class="logo_box" v-if="website.companyLogo">
                                        <img :src="website.companyLogo" >
                                    </div>
                                    <p>{{website.companyName}}</p>
                                </div>
                                <div class="fr">
                                    <Icon type="md-volume-up" />
                                    <Icon type="md-remove" />
                                    <Icon type="md-close" v-if="website.showCloseButton==1" />
                                </div>
                            </div>
                            <!-- 左侧广告 -->
                            <div class="davLeft" v-if="website.advConfig.advType==3 || website.advConfig.advType==2">
                                <a :href="website.advConfig.uploadLeftAdvtUrl" target="_blank" v-if="website.advConfig.uploadLeftAdvtImg">
                                    <img :src="website.advConfig.uploadLeftAdvtImg">
                                </a>
                            </div>
                            <div class="contentBox">
                                <div class="content clearfix" :style="{'width':website.advConfig.advType!=0?'264px':'250px'}">
                                    <!-- 浮动广告 -->
                                    <div class="float_adv" :style="{borderColor: website.cssStyle.styleColor}" v-if="(website.advConfig.floatAdv!='' && website.advConfig.advType>0)">
                                        <span class="iconfont float_adv_top" :style="{color: website.cssStyle.styleColor}">&#xe60d;</span>
                                        <span class="iconfont float_adv_bottom" :style="{color: website.cssStyle.styleColor}">&#xe621;</span>
                                        <div class="float_adv_content">{{website.advConfig.floatAdv}}</div>
                                    </div>
                                    <p>××公司</p>
                                    <div>
                                        <p class="fl">您好, 请问有什么可以帮您</p>
                                    </div>
                                    <span class="fr" :style="{backgroundColor: website.cssStyle.styleColor}">
                                        <span :style="{borderLeftColor: website.cssStyle.styleColor}"></span>
                                        我想了解下鲁班客服系统！
                                    </span>
                                </div>
                                <div class="footer">
                                    <span class="emoji">
                                        <i class="iconfont">&#xe635;</i>
                                        <i class="iconfont">&#xe61d;</i>
                                    </span>
                                    
                                    <div v-if="website.advConfig.advContent[0]">
                                        <a href="javascript:;" class="scrollAdv">{{website.advConfig.advContent[0].advTitle}}</a>
                                    </div>
                                    <a class="save" :style="{backgroundColor: website.cssStyle.styleColor}">提交</a>
                                </div>
                            </div>
                            <!-- 右侧广告 -->
                            <div class="davRight" v-if="website.advConfig.advType==1 || website.advConfig.advType==2">
                                <a :href="website.advConfig.uploadRightAdvtUrl" target="_blank" v-if="website.advConfig.uploadRightAdvtImg">
                                    <img :src="website.advConfig.uploadRightAdvtImg">
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import area from '@/static/area.js';
import uploadImg from '@/views/my-components/uploadImg/uploadImg';
import { addWebApp, getWebApp } from '@/libs/api.js';
export default {
    data(){
        return {
            cityArr:[[]],  //广告 - 那些城市可见
            website:{                         
                nickname:'',                          //网站名称
                webDomain:'',                         //网站域名
                pageTitle:'',                         //网站标题
                chatboxWidth: 355,                    //对话框宽度
                chatboxHeight: 500,                   //对话框高度
                chatboxLocationY: "bottom",           //对话框垂直方向
                chatboxSideMarginY: 0,                //垂直方向像素
                companyName: "",                      //企业简称
                companyLogo: '',                       //企业logo 或 头像
                showAgentName: '1',                    //是否显示坐席名字
                showCloseButton: '1',                  //是否显示关闭按钮
                welcome:'',                            //客服欢迎词
                autoInvite:'0',                        //是否直接会话
                autoShowInviteType:'0',                //是否启用自动弹出
                openStayTime:5,                        //访客打开网页 几秒后弹出聊天框 - 0不弹
                closeStayTime:20,                      //关闭聊天框  几秒后再次弹出    - 0不弹
                cssStyle:{
                    chatButtonBottomMargin: 18,         //底边距
                    chatButtonLocation: "bottom-right",  //按钮位置
                    chatButtonSideMargin: 18,           //侧边距
                    chatboxIconType: '&#xe622;',        //btn图标
                    chatboxLocation: "right",           //水平方向
                    chatboxSideMargin: 18,              //水平方向像素
                    onlineText: '咨询客服',              //在线咨询按钮文案
                    styleColor: 'rgb(87, 163, 243)',     //对话框皮肤
                },
                advConfig:{
                    advScroll: "scrollY",                //广告滚动方向  scrollX  scrollY
                    advScrollTime: 6,                    //滚动间隔时间
                    advContent: [                        //底部广告内容
                        // {
                            // advArea:[
                            //     {
                            //         city:'',                 //市
                            //         province:''              //省
                            //     }
                            // ],
                            // advTitle:'广告标题',                  //广告标题
                            // advUrl:'广告链接',                    //广告链接
                            // enable:true                   //是否启用
                        // }
                    ],                        
                    floatAdv:"",                         //浮动广告内容
                    uploadLeftAdvtImg: "",               //左侧广告 - 图片
                    uploadLeftAdvtUrl: "",               //左侧广告 - 链接地址
                    uploadRightAdvtImg: "",              //右侧广告 - 图片
                    uploadRightAdvtUrl: "",              //右侧广告 - 链接地址
                    advType:'0',                         //广告类型   1-右边广告   2-左右都有广告   3-左边广告
                    windowType:'common'                  //对话窗口样式  common- 有广告  pure-没有广告
                }
            },
            chatskin: ['rgb(87, 163, 243)','rgb(25, 202, 166)','rgb(181, 14, 3)','rgb(244, 147, 0)','rgb(158, 193, 0)','rgb(0, 204, 205)','rgb(91, 121, 154)','rgb(135, 31, 120)'], //对话框皮肤
            btnIcon: ['&#xe622;','&#xe615;','&#xe6b7;','&#xe625;','&#xe631;','&#xe629;','&#xe604;','&#xe633;','&#xe653;','&#xe600;'],
            winIndex: 1,      //窗口样式
            chatWidth:{},     //窗口宽度
            btnStyle:{},      //按钮样式
            _btnLocation:{},  //按钮位置
            chatLocation:{},  //对话框位置及大小
            showAddadv:false, //显示添加广告内容
            addadvContent:{   //添加广告内容
                advArea:[]
            }, 
            area:area,        //地区
            iseditadv:-1,     //编辑广告 index
            showChat:false,   //显示预览效果
            saveLoading:false, //保存设置
        }
    },
    computed:{
        replaceJson(){
            var obj={};
            obj=JSON.parse(JSON.stringify(this.website));
            obj.cssStyle = JSON.stringify(obj.cssStyle);
            obj.advConfig = JSON.stringify(obj.advConfig);
            return obj;
        },
    },
    mounted() {
        if(this.$route.query.t){
            this.getWebsiteInfo();
        }else{
            this.showChat = true;
        }
    },
    methods:{
        //加载窗口样式
        winStyleImg(index){
            return require(`../../../../images/windStyle_${index}.png`);
        },

        //选择窗口样式
        selectWin(item){
            this.winIndex = item;
            if(item == 1){
                //无广告
                this.website.advConfig.windowType = "pure";
                this.website.advConfig.advType = 0;
            }else {
                //有广告
                this.website.advConfig.windowType = "common";
                this.website.advConfig.advType = Number(item) - 1;  //广告类型
                this.chatLocation = {};
            }
            this.chatType();
        },

        //聊天框类型 有无广告
        chatType(){
            var t = this.website.advConfig.advType;
            var w = this.website.advConfig.windowType;
            var wh = "";
            if(w == "pure"){
                wh = "";
            }else if(t == 1 || t == 3){
                wh = '364px';
                this.chatLocation = {};
            }else if(t == 2){
                wh = '464px';
                this.chatLocation = {};
            }
            this.chatWidth = {width:wh};
        },

        //对话框位置及大小
        chatboxLocationAndSize(){
            this.chatLocation = {};
            var location = this.website.cssStyle.chatboxLocation;     //水平方向
            var sideMargin = this.website.cssStyle.chatboxSideMargin; //水平方向像素
            var locationY = this.website.chatboxLocationY;            //垂直方向
            var sideMarginY = this.website.chatboxSideMarginY;                //垂直方向像素 
            switch (location) {
                case 'right':
                    this.chatLocation.right = sideMargin + 'px';    
                    break;
                case 'center':
                    this.chatLocation.left = "50%";
                    this.chatLocation.transform = "translateX(-50%)";   
                    break;
                case 'left':
                    this.chatLocation.left = sideMargin + 'px';    
                    break;
                default:
                    break;
            }
            if(locationY == "top"){
                this.chatLocation.top = sideMarginY + 'px';  
            }else if(locationY == "center"){
                this.chatLocation.bottom = "50%";    
                this.chatLocation.transform = "translateY(50%)" 
            }else if(locationY == "bottom"){
                this.chatLocation.bottom = sideMarginY + 'px';    
            }
            if(locationY == "center" && location == 'center'){
                this.chatLocation.transform = "translate(-50%,50%)" 
            }
        },


        //图标选择
        selectIcon(index){
            this.website.cssStyle.chatboxIconType = this.btnIcon[index];
        },

        //按钮位置
        btnLocation(value){
            var v = (typeof value !== 'number' && value != null) ? value : this._btnLocation;
            this._btnLocation = v;
            var w = this.website.cssStyle;
            if(v == "circle-right"){
                this.btnStyle = {
                    right: w.chatButtonSideMargin + 'px',
                    bottom: w.chatButtonBottomMargin + 'px'
                }
            }else if(v == "circle-left"){
                this.btnStyle = {
                    left: w.chatButtonSideMargin + 'px',
                    bottom: w.chatButtonBottomMargin + 'px'
                }
            }else if(v == "bottom-right"){
                this.btnStyle = {
                    right: w.chatButtonSideMargin + 'px',
                }
            }else if(v == "bottom-left"){
                this.btnStyle = {
                    left: w.chatButtonSideMargin + 'px',
                }
            }else if(v == "side-right"){
                this.btnStyle = {
                    bottom: w.chatButtonBottomMargin + 'px',
                    right: 0,
                    borderRadius: '3px 0px 0px 3px'
                }
            }else if(v == "side-left"){
                this.btnStyle = {
                    bottom: w.chatButtonBottomMargin + 'px',
                    left:0,
                    borderRadius: '0px 3px 3px 0px'
                }
            }
            this.btnStyle.background = this.website.cssStyle.styleColor;
        },

        //选择对话框皮肤
        selcetSkin(index){
            this.website.cssStyle.styleColor = this.chatskin[index];
            this.btnLocation();
        },
        selcetColorPicker(color){
            this.website.cssStyle.styleColor = color;
            this.btnLocation();
        },

        //显示添加广告内容
        addAdv(){
            this.iseditadv = -1;
            this.cityArr = [[]];
            this.addadvContent = {
                advArea:[]
            };
            this.showAddadv = true;
        },

        //添加一行广告地区
        cascaderAddRow(){
            this.cityArr.push([]);
            this.iseditadv = '';
        },

        //删除一行广告地区
        removeCascader(index){
            this.cityArr.splice(index,1);
        },

        //编辑广告
        editAdv(index){
            this.cityArr = [];
            this.addadvContent = [];
            this.addadvContent = this.website.advConfig.advContent[index];
            if(this.addadvContent.advArea.length>0){
                this.addadvContent.advArea.forEach((e,index) => {
                    this.cityArr.push([e.province,e.city]);
                })
            }
            this.showAddadv = true;
            this.iseditadv = index;
        },

        //删除广告
        removeAdv(index){
            this.website.advConfig.advContent.splice(index,1);
            if(index = this.iseditadv){
                this.showAddadv = false;
            }
        },

        //删除所有广告
        removeAllAdv(){
            this.website.advConfig.advContent = [];
            this.showAddadv = false;
        },

        //保存添加广告内容
        saveAddadv(){
            if(!this.addadvContent.advTitle){
                this.$Notice.warning({title: '请填写广告标题'});
                return false;
            }else if(!this.addadvContent.advUrl){
                this.$Notice.warning({title: '请填写广告链接'});
                return false;
            }
            this.addadvContent.advArea = [];
            this.cityArr.forEach((e,index) => {
                this.addadvContent.advArea.push({city:e[1],province:e[0]});
            })
            this.addadvContent.enable = true; 

            if(this.iseditadv>=0){
                this.website.advConfig.advContent[this.iseditadv] = this.addadvContent;
            }else{
                this.website.advConfig.advContent.push(this.addadvContent);
            }
            this.showAddadv = false;
        },

        //企业logo 或头像
        companyLogo(data){
            if(data.status){
                this.website.companyLogo = data.url;
            }else{
                this.website.companyLogo = "";
            }
        },

        //左侧广告图片
        advLeftLogo(data){
            if(data.status){
                this.website.advConfig.uploadLeftAdvtImg = data.url;
            }else{
                this.website.advConfig.uploadLeftAdvtImg = "";
            }
        },  

        //右侧广告图片
        advRightLogo(data){
            if(data.status){
                this.website.advConfig.uploadRightAdvtImg = data.url;
            }else{
                this.website.advConfig.uploadRightAdvtImg = "";
            }
        },  

        //聊天框最小宽度
        chatWidthChange(){
            if(this.website.chatboxWidth< 300){
                this.$Notice.warning({title: '最小宽度不能低于300'});
                this.$nextTick(()=>{
                    this.website.chatboxWidth = 300;
                })
            }
        },

        //聊天框最小高度
        chatHeightChange(h){
            if(this.website.chatboxHeight < 450){
                this.$Notice.warning({title: '最小高度不能低于450'});
                this.$nextTick(()=>{
                    this.website.chatboxHeight = 450;
                })
            }
        },

        //保存设置
        saveSetting(){
            if(!this.replaceJson.nickname){
                this.$Notice.warning({title: '请填写网站名称'});
                return false;
            }else if(!this.replaceJson.companyName){
                this.$Notice.warning({title: '请填写企业简称'});
                return false;
            }
            this.saveLoading = true;
            addWebApp(this.replaceJson).then(res => {
                if(res.code == 0){
                    this.$Notice.success({
                        title: res.msg,
                        duration: 1,
                        onClose: ()=> {
                            this.$router.push({
                                path: '/config/website'
                            })
                            this.saveLoading = false;
                        }
                    });
                }else{
                    this.$Notice.warning({title: res.msg});
                }
            })
        },

        //取消设置
        cancelSetting(){
            this.$router.push({
                path: '/config/website'
            })
        },

        //获取网站详情
        getWebsiteInfo(){
            getWebApp({appToken: this.$route.query.t}).then(res => {
                if(res.code == 0){
                    this.website = res.data;
                    this.btnLocation(this.website.cssStyle.chatButtonLocation);    //按钮位置
                    this.chatboxLocationAndSize();                                 //对话框样式
                    this.chatType();  //聊天框类型
                    this.showChat = true;
                }else{
                    this.$Notice.warning({title: res.msg});
                }
            })
        }
        
    },
    components:{
        uploadImg
    }
}
</script>


<style lang="less" scoped>
    @import '../../../../static/font/iconfont.css';
    @import './pcStyle.less';
</style>
