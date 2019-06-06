<template>
    <div>
        <template v-for="(item, index) in menuList">
            <div style="text-align: center;" :key="index" v-if="item !== undefined" class="sidebarMenu">
                <!-- <Dropdown transfer v-if="item.children.length !== 1" placement="right-start" :key="index" @on-click="changeMenu">
                    <Button style="width: 70px;margin-left: -5px;padding:10px 0;" type="text">
                        <Icon :size="20" :color="iconColor" :type="item.icon"></Icon>
                    </Button>
                    <DropdownMenu style="width: 200px;" slot="list">
                        <template v-for="(child, i) in item.children">
                            <DropdownItem :name="child.name" :key="i"><Icon :type="child.icon"></Icon><span style="padding-left:10px;">{{ itemTitle(child) }}</span></DropdownItem>
                        </template>
                    </DropdownMenu>
                </Dropdown> -->
                <Tooltip :content="itemTitle(item.children[0])" placement="right" class="funcHint" transfer>
                    <Dropdown transfer placement="right-start" :key="index" @on-click="changeMenu">
                        <Button @click="changeMenu(item.children[0].path)" style="width: 70px;margin-left: -5px;padding:10px 0;" type="text">
                            <Badge :count="msgCount" overflow-count="99" v-if="item.name=='chat' || item.name=='index'">
                                <span class="iconfont" :style="{'color':iconColor}" v-html="item.children[0].icon || item.icon"></span>
                            </Badge>
                            <Badge :count="waitCount" overflow-count="99" v-else-if="item.name=='access'">
                                <span class="iconfont" :style="{'color':iconColor}" v-html="item.children[0].icon || item.icon"></span>
                            </Badge>
                            <span v-else class="iconfont" :style="{'color':iconColor}" v-html="item.children[0].icon || item.icon"></span>
                        </Button>
                        <!-- <Tooltip style="min-width:40px;" slot="list" class="leftMenu"> -->
                        <!-- <Tooltip :content="itemTitle(item.children[0])" placement="top" class="funcHint">
                            <DropdownItem :name="item.children[0].path" :key="'d' + index"><div class="arrow"></div><span>{{ itemTitle(item.children[0]) }}</span></DropdownItem> -->
                    </Dropdown>
                </Tooltip>
            </div>
        </template>
    </div>
</template>

<script>
export default {
    name: 'sidebarMenuShrink',
    props: {
        menuList: {
            type: Array
        },
        iconColor: {
            type: String,
            default: 'white'
        },
        menuTheme: {
            type: String,
            default: 'darck'
        }
    },
    computed:{
        msgCount () {
            return this.$store.state.app.unreadMsg;
        },
        waitCount () {
            return this.$store.state.app.waitMsgNum;
        }
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
    }
};
</script>
<style lang="less">
.sidebarMenu{
    color:red;
    .ivu-badge-count{
        border:none;
        box-shadow:none;
    }
}
.ivu-dropdown-transfer{
    padding:0;
    overflow: visible;
}
    .leftMenu{
            .ivu-dropdown-item{
                background:rgb(0, 21, 41);
                color: #fff;
                position: relative;
                border-radius:3px;
                .arrow{
                    position: absolute;
                    width: 0;
                    height: 0;
                    border-color: transparent;
                    border-style: solid;
                    border-radius:3px;
                    left: -6px;
                    border-width: 8px 8px 8px 0;
                    border-right-color:rgb(0, 21, 41);
                    top: 50%;
                    margin-top: -7px;
                }
            }
            .ivu-dropdown-item:hover{
                background:rgb(0, 21, 41);
                border-radius:3px;
            }
    }
</style>