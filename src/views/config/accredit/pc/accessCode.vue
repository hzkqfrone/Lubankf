<template>
    <div class="accreditWrap">
        <div class="titleTop">
            <div class="configTitle">
                <router-link to="/config/website">
                    <Icon type="md-arrow-round-back" />
                    <h2>接入代码</h2>
                </router-link>
            </div>
        </div>
        <div class="configTop"></div>
        <div class="binding">
           <p>将此代码嵌入到你网站页面&lt;/body&gt;标签之前即可启用鲁班客服</p>
           <div class="code" @click="clipboard" :data-clipboard-text="access">
               {{access}}
           </div>
        </div>
    </div>
</template>

<script>
import Clipboard from 'clipboard';   //拷贝
export default {
    data(){
        return {
           access:`<script type="text/javascript" src="https://cdn.lubankf.com/IM/js/lb_service.js?accessId=${this.$route.params.id}"><\/script>`
        }
    },
    methods: {
        clipboard(){
            var clipboard = new Clipboard('.code')
            clipboard.on('success', e => {
                this.$Message.success('复制成功');
                // 释放内存
                clipboard.destroy()
            })
        }
    },
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
            margin-top:20px;
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
