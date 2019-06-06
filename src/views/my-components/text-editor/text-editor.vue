<style lang="less">
    @import '../../../styles/loading.less';
</style>

<template>
    <div>
        <textarea class='tinymce-textarea' id="tinymceEditer"></textarea>
        <Spin fix v-if="spinShow">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>加载组件中...</div>
        </Spin>
    </div>
</template>

<script>
import tinymce from 'tinymce';
export default {
    name: 'text-editor',
    props:['value'],
    data () {
        return {
            spinShow: true
        };
    },
    methods: {
        init () {
            var that = this;
            this.$nextTick(() => {
                let vm = this;
                let height = document.body.offsetHeight - 500;
                tinymce.init({
                    selector: '#tinymceEditer',
                    branding: false,
                    elementpath: false,
                    height: height,
                    language: 'zh_CN.GB2312',
                    menubar: 'edit insert view format table tools',
                    plugins: [
                        'advlist autolink lists link image charmap print preview hr anchor pagebreak imagetools',
                        'searchreplace visualblocks visualchars code fullpage',
                        'insertdatetime media nonbreaking save table contextmenu directionality',
                        'emoticons paste textcolor colorpicker textpattern imagetools codesample'
                    ],
                    // toolbar1: ' newnote print preview | undo redo | insert | styleselect | forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image emoticons media codesample',
                    autosave_interval: '20s',
                    image_advtab: true,
                    table_default_styles: {
                        width: '100%',
                        borderCollapse: 'collapse'
                    },
                    setup: function (editor) {
                        editor.on('init', function (e) {
                            vm.spinShow = false;
                            if (that.value) {
                                tinymce.get('tinymceEditer').setContent(that.value);
                            }
                        });
                        editor.on('keyup', function (e) {
                            // localStorage.editorContent = tinymce.get('tinymceEditer').getContent();
                            that.$emit("input",tinymce.get('tinymceEditer').getBody())
                        });
                    }
                });
            });
        }
    },
    mounted () {
        this.init();
    },
    destroyed () {
        tinymce.get('tinymceEditer').destroy();
    },
    watch:{
        value(n,o){
            tinymce.get('tinymceEditer').setContent(this.value);
        }
    }
};
</script>

<style>

</style>
