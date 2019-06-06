<style lang="less">
    @import '../styles/menu.less';
</style>

<template>
    <Menu ref="sideMenu" :active-name="$route.path.indexOf('config')>-1 ? '/config' : $route.path" :open-names="openNames" :theme="menuTheme" width="auto"z @on-select="changeMenu" class="sidebarMenu">
        <template v-for="item in menuList" v-if="item != undefined">
            <MenuItem v-if="item.children.length<=1" :name="item.children[0].path" :key="'menuitem' + item.name">
                <span class="iconfont" :size="iconSize" :key="'menuicon' + item.name" v-html="item.children[0].icon || item.icon"></span>
                <span class="layout-text" :key="'title' + item.name">{{ itemTitle(item.children[0]) }}</span>
                <Badge v-if="item.name=='chat' || item.name=='index'" :count="msgCount" overflow-count="99" style="float:right;"></Badge>
                <Badge v-if="item.name=='access'" :count="waitMsgNum" overflow-count="99" style="float:right;"></Badge>
            </MenuItem>

            <Submenu v-if="item.children.length > 1" :name="item.path" :key="item.name">
                <template slot="title">
                    <span class="iconfont" :size="iconSize" v-html="item.icon"></span>
                    <span class="layout-text">{{ itemTitle(item) }}</span>
                </template>
                <template v-for="child in item.children">
                    <MenuItem :name="child.path" :key="'menuitem' + child.name">
                        <span class="iconfont" :size="iconSize" :key="'icon' + child.name" v-html="child.icon"></span>
                        <span class="layout-text" :key="'title' + child.name">{{ itemTitle(child) }}</span>
                    </MenuItem>
                </template>
            </Submenu>
        </template>
    </Menu>
</template>

<script>
import { mapState } from 'vuex';
export default {
    name: 'sidebarMenu',
    props: {
        menuList: Array,
        iconSize: Number,
        menuTheme: {
            type: String,
            default: 'dark'
        },
        openNames: {
            type: Array
        }
    },
    computed:{
        ...mapState({
            msgCount: state => state.app.unreadMsg,   //未读消息数
            waitMsgNum: state => state.app.waitMsgNum   //待接入数
        })
    },
    methods: {
        changeMenu (active) {
            this.$emit('on-change', active);
        },
        itemTitle (item) {
            if (typeof item.title === 'object') {
                return this.$t(item.title.i18n);
            } else {
                return item.title;
            }
        }
    },
    updated () {
        this.$nextTick(() => {
            if (this.$refs.sideMenu) {
                this.$refs.sideMenu.updateOpened();
            }
        });
    },
    watch:{
        '$route'(n,o){

        }
    }

};
</script>
<style lang="less">
    .sidebarMenu{
        .ivu-badge-count{
            border:none;
            box-shadow:none;
            height: 18px;
            min-width: 18px;
        }
    }
</style>
