<template>
    <div class="full-wrap">
        <div class="recommend" v-if="showRecommend">
            <router-link to="/pro">
                <img src="../../images/pro.png">
            </router-link>
        </div>
        <div class="full-screen-btn-con" v-if="onlineTime">
             <Tag type="border">在线时长:{{onlineTime}}</Tag>
        </div>
        <div class="networkWrap full-screen-btn-con">
            <Tooltip :content="networkNum" placement="bottom">
                <i :style="networkStyle"></i>
            </Tooltip>
        </div>
        <div @click="handleChange" v-if="showFullScreenBtn" class="full-screen-btn-con">
            <Tooltip :content="value ? '退出全屏' : '全屏'" placement="bottom">
                <Icon :type="value ? 'md-contract' : 'md-expand'" :size="23"></Icon>
            </Tooltip>
        </div>
    </div>
</template>

<script>
export default {
    name: 'fullScreen',
    props: {
        value: {
            type: Boolean,
            default: false,
            showRecommend: false,
        }
    },
    data(){
        return{
            networkStyle: 'background-position:0 0',
        }
    },
    computed: {
        showFullScreenBtn () {
            return window.navigator.userAgent.indexOf('MSIE') < 0;
        },
        onlineTime () {
            return this.$store.state.app.onlineTime;
        },
        networkNum(){
            var n = this.$store.state.app.networkMS;
            var s = "";
            if(n == 0){
                s = "0 -100px";
            }else if(n < 200){
                s = "0 0";
            }else if(n > 200 && n <= 500){
                s = "0 -25px";
            }else if(n > 500 && n <= 1000){
                s = "0 -50px";
            }else if(n>1000){
                s = "0 -75px";
            }
            this.networkStyle = `background-position:${s}`;
            return n + 'ms';
        }
    },
    methods: {
        handleFullscreen () {
            let main = document.body;
            if (this.value) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                if (main.requestFullscreen) {
                    main.requestFullscreen();
                } else if (main.mozRequestFullScreen) {
                    main.mozRequestFullScreen();
                } else if (main.webkitRequestFullScreen) {
                    main.webkitRequestFullScreen();
                } else if (main.msRequestFullscreen) {
                    main.msRequestFullscreen();
                }
            }
        },
        handleChange () {
            this.handleFullscreen();
        }
    },
    created () {
        let isFullscreen = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
        isFullscreen = !!isFullscreen;
        document.addEventListener('fullscreenchange', () => {
            this.$emit('input', !this.value);
            this.$emit('on-change', !this.value);
        });
        document.addEventListener('mozfullscreenchange', () => {
            this.$emit('input', !this.value);
            this.$emit('on-change', !this.value);
        });
        document.addEventListener('webkitfullscreenchange', () => {
            this.$emit('input', !this.value);
            this.$emit('on-change', !this.value);
        });
        document.addEventListener('msfullscreenchange', () => {
            this.$emit('input', !this.value);
            this.$emit('on-change', !this.value);
        });
        this.$emit('input', isFullscreen);
        this.showRecommend = sessionStorage.recommendActive;
    }
};
</script>
<style lang="less" scoped>
    .full-wrap{
        display: inline-block;
        margin-right:10px;
        float:left;
    }
    .networkWrap i{
        display: inline-block;
        width: 25px;
        height: 25px;
        background-image: url(../../images/network.png);
        background-repeat: no-repeat;
        background-size: cover;
        background-position: 0 0;
    }
    .recommend{
        display: inline-block;
        margin-right:10px;
        height: 100%;
        img{
            vertical-align: middle;
        }
    }
</style>
