<template>
    <ul class="replyGroup searchResult" v-if="data.length > 0">
        <li v-for="(sub,subindex) in data" :key="subindex">
            <span @click="sendMsgPush(sub.content)" :title="sub.content">{{sub.content}}</span>
            <Tooltip content="发送" placement="top">
                <Icon type="md-paper-plane" @click="sendReply(sub.content)"/>
            </Tooltip>
        </li>
    </ul>
</template>

<script>
export default {
    props:['data'],
    methods:{
        sendReply(content){
            this.$emit('replyItem', content);
        },
        sendMsgPush(content){
            this.$emit('selectReply', content);
        }
    }
}
</script>

