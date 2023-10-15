<template>
    <tiny-editor v-model="myValue" :id="tinymceId" :init="init" :disabled="disabled"></tiny-editor>
</template>

<script>
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/mobile/theme'
import 'tinymce/themes/silver/theme'
import 'tinymce/icons/default/icons' ////解决了icons.js 报错Unexpected token '<'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/link'
import 'tinymce/plugins/image'
import 'tinymce/plugins/charmap'
import 'tinymce/plugins/print'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/code'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/code'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/media'
import 'tinymce/plugins/table'
import 'tinymce/plugins/paste'
import 'tinymce/plugins/help'
import 'tinymce/plugins/wordcount'

export default {
    name: 'TinyEditor',
    props: {
        id: {
            type: String,
            default: function () {
                return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
            }
        },
        value: {
            type: String,
            default: ''
        },
        height: {
            type: [Number, String],
            required: false,
            default: 200
        },
        width: {
            type: [Number, String],
            required: false,
            default: 'auto'
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            tinymceId: this.id,
            myValue: this.value,
            oldValue: '',
            apiKey: '8esc6a7z09w0eqwfbd2xbxigkdq3bqhr2kizisfb3qmoa9xt',
            content: this.value,
            init: { // 配置信息
                selector: '#textarea',
                height: 550,
                language_url: '/tinymce/langs/zh-CN.js', // 中文包的存放路径
                language: 'zh-CN',
                height: this.height,
                body_class: 'panel-body ',
                object_resizing: true,//是否允许调整图像大小.
                branding: false, //隐藏右下角由TINY驱动
                contextmenu_never_use_native: true, //防止浏览器上下文菜单出现在编辑器中
                elementpath: false, //隐藏底栏的元素路径（隐藏右下角元素显示）
                toolbar: 'code | undo redo | lineheight| fontselect fontsizeselect formatselect | bold italic forecolor backcolor | \
               alignleft aligncenter alignright alignjustify | \
               bullist numlist outdent indent | removeformat | imageUpload | help',
                menubar: false,
                plugins: ['advlist autolink lists link image charmap print preview anchor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table paste help wordcount'],
                paste_retain_style_properties: 'all', //从Word中复制，保留所有样式
                //paste_word_valid_elements: '*[*]', // 该设置在自word粘贴时，允许指定元素和属性保存在过滤结果中，要使用此功能，paste_enable_default_filters 要设置为true
                paste_data_images: true, // 粘贴的同时能把内容里的图片自动上传，非常强力的功能
                paste_convert_word_fake_lists: false, // 设为false可禁用复制word中的列表内容时，转换为html的UL或OL格式。
                paste_webkit_styles: 'all',
                paste_merge_formats: true, //启用PowerPaste插件的合并格式功能，例如：<b>abc <b>bold</b> 123</b>成为<b>abc bold 123</b>
                end_container_on_empty_block: true, //如果在空的内部块元素中按下Enter键，则可以使用此选项拆分当前容器块元素。
                powerpaste_word_import: 'clean', //保留标题，表格和列表等内容的结构，但删除内联样式和类。这样就产生了使用站点CSS样式表的简单内容，同时保留了原始文档的语义结构。
                advlist_bullet_styles: 'default,circle,disc,square',
                advlist_number_styles: 'default,lower-alpha,lower-greek,lower-roman,upper-alpha,upper-roman',
                default_link_target: '_blank', //默认链接是当前窗口打开，你也可以通过此参数将其变为_blank新窗口打开。
                link_title: false,
                nonbreaking_force_tab: true, // 按tab键插入三个&nbsp;。一直按一直插。
                images_upload_handler: this.images_upload_handler, //该images_upload_handler选项允许你指定被用来替代TinyMCE的默认的JavaScript和定制逻辑上传处理函数的函数。
                // setup: this.setup, //，您可以指定在渲染TinyMCE编辑器实例之前将执行的回调。
                convert_urls: false
            },
        };
    },
    components: {
        'tiny-editor': Editor,
    },
    watch: {
        value(newValue) {
            this.content = newValue;
        },
        myValue(newValue) {
            this.$emit("input", newValue);
        },
    },
    mounted() {
        // tinymce.init({});
    }
}
</script>

<style scoped></style>