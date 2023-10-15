<template>
    <div class="app-container">
        <el-form :inline="true" class="demo-form-inline">
            <el-form-item>
                <el-input v-model="search" placeholder="文档名称"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="pageQuery">查询</el-button>
                <!-- <el-button type="success" @click="showAddDoc">新建</el-button> -->
                <el-button @click="handleRemoveSelect">删除</el-button>
            </el-form-item>
        </el-form>

        <el-table border style="width: 100%" :data="records" @selection-change="handleSelectionChange"
            v-loading="dataLoading">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column fixed prop="name" label="模板名称" width="150">
            </el-table-column>
            <el-table-column prop="title" label="网页标题" width="120">
            </el-table-column>
            <el-table-column prop="contentTitle" label="内容标题" width="120">
            </el-table-column>
            <el-table-column label="操作" width="240">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="handleView(scope.$index, scope.row)">查看</el-button>
                    <el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="text" size="small" @click="handleQRCode(scope.$index, scope.row)">二维码</el-button>
                    <el-button type="text" size="small" @click="handleCopyLink(scope.$index, scope.row)">复制链接</el-button>
                    <el-button type="text" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background layout="prev, pager, next" :total="total" class="page">
        </el-pagination>
        <!-- <div id="textarea" :key="myKey"></div> -->


        <el-dialog :title="formTitle" :visible.sync="formVisible" width="60%" @opened="dialogOpen"
            :before-close="closeDialog" :destroy-on-close="true" center>
            <el-form :model="docData" label-width="80px" :rules="rules" ref="docForm" style="margin: 0 20px;">
                <el-form-item label="文档名称" prop="name">
                    <el-input v-model="docData.name" name="name" autocomplete="off"
                        :readonly="formTitle === '查看'"></el-input>
                </el-form-item>
                <el-form-item label="文档标题" prop="title">
                    <el-input v-model="docData.title" name="title" autocomplete="off"
                        :readonly="formTitle === '查看'"></el-input>
                </el-form-item>
                <el-form-item label="文档标题" prop="contentTitle">
                    <el-input v-model="docData.contentTitle" name="contentTitle" autocomplete="off"
                        :readonly="formTitle === '查看'"></el-input>
                </el-form-item>
                <el-form-item label="文档内容" prop="content">
                    <!-- <el-input v-model="modelData.content" name="content" autocomplete="off"></el-input> -->
                    <!-- <editor v-model="modelData.content" ></editor> -->
                    <!-- <div id="textarea"></div> -->
                    <Editor :id="myKey" :init="init" v-model="docData.content"
                        api-key="8esc6a7z09w0eqwfbd2xbxigkdq3bqhr2kizisfb3qmoa9xt" v-if="formTitle !== '查看'"></Editor>
                    <div v-else v-html="docData.content"></div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel" v-show="formTitle !== '查看'">取 消</el-button>
                <el-button type="primary" @click="saveDoc" v-show="formTitle !== '查看'">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="二维码" :visible.sync="qrCodeVisible" width="30%" @opened="openQRCode" :destroy-on-close="true">
            <div ref="qrcode" class="qrcode" v-loading="qrcodeLoading"></div>
        </el-dialog>
    </div>
</template>

<script>
import '@/components/TinyEditor/tinyEditor'
import QRCode from 'qrcodejs2'
import { getPage, addDoc, udpateDoc, removeDoc } from '@/api/doc'
import Editor from '@tinymce/tinymce-vue'
import Const from '@/consts/global'

export default {
    name: 'doc',
    components: {
        Editor
    },
    computed: {
        myKey() {
            return `tinymce-${Date.now()}`;
        }
    },
    data() {
        return {
            search: '',
            current: 1,
            size: 10,
            total: 0,
            pages: 0,
            dataLoading: false,
            records: [],
            formVisible: false,
            selectIds: [],
            formTitle: '新增',
            qrCodeVisible: false,
            qrCodeUrl: '',
            docData: {
                id: null,
                name: '',
                title: '',
                contentTitle: '',
                content: '',
                url: ''
            },
            rules: {
                name: [
                    { required: true, message: '请输入文档名称', trigger: 'blur' }
                ],
                title: [
                    { required: true, message: '请输入文档标题', trigger: 'blur' }
                ],
                contentTitle: [
                    { required: true, message: '请输入文档标题', trigger: 'blur' }
                ],
                content: [
                    { required: true, message: '请输入内容', trigger: 'blur' }
                ]
            },
            tinymceCreated: true,
            init: {
                // selector: '#textarea',
                apiKey: '8esc6a7z09w0eqwfbd2xbxigkdq3bqhr2kizisfb3qmoa9xt',
                theme: 'silver',
                height: 400,
                plugins: 'table',
                language: 'zh-Hans',
                language_url: '../../../../tinymce/langs/zh-Hans.js',
                memubar: 'table',
                branding: false,
                toolbar: 'undo redo | styleselect formatselect fontselect fontsizeselect | styles | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media | forecolor backcolor emoticons | table',
                fontsize_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
                font_formats: '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;',
            },
            docBaseUrl: process.env.VUE_APP_DOC_BASE_URL,
            qrcodeLoading: false,
        }
    },
    created() {
        this.pageQuery();
    },
    mounted() {

    },
    watch: {

    },
    methods: {
        //分页查询
        pageQuery() {
            let that = this;
            this.dataLoading = true;
            const param = {
                name: this.search,
                current: this.current,
                size: this.size
            };
            getPage(param).then(res => {
                // console.log(that);
                // console.log(this);
                // debugger
                that.records = res.data.records;
                that.total = res.data.total;
                that.pages = res.data.pages;
                this.dataLoading = false;
            })
                .catch(e => {
                    console.error(e);
                    this.dataLoading = false;
                });
        },
        showAddDoc() {
            this.formTitle = '新增';
            this.formVisible = true;
        },
        saveDoc() {
            let that = this;
            this.$refs.docForm.validate(valid => {
                if (valid) {
                    console.log("保存模板数据");
                    if (this.formTitle === '新增') {
                        addDoc(this.docData)
                            .then(res => {
                                if (res.code == Const.ResultCode.Success) {
                                    //保存数据后，重新刷新页面
                                    this.pageQuery();
                                    this.formVisible = false;
                                    this.resetFormData();
                                }
                            });
                    } else {
                        udpateDoc(this.docData)
                            .then(res => {
                                if (res.code == Const.ResultCode.Success) {
                                    //保存数据后，重新刷新页面
                                    this.pageQuery();
                                    this.formVisible = false;
                                    this.resetFormData();
                                }
                            });
                    }
                }

            });
        },
        cancel() {
            this.$refs.docForm.resetFields();
            this.formVisible = false;
            this.resetFormData();
        },
        dialogOpen() {

        },
        handleView(index, row) {
            this.formTitle = '查看';
            this.docData = {
                ...row
            },
                this.formVisible = true;
        },
        handleEdit(index, row) {
            this.formTitle = '编辑';
            this.docData = {
                ...row
            },
                this.formVisible = true;
        },
        handleDel(index, row) {
            console.log(row);
            this.$confirm('是否删除模板？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                removeDoc({
                    ids: [row.id]
                })
                    .then(res => {
                        if (res.code == Const.ResultCode.Success) {
                            this.pageQuery();
                        }
                    });
            });
        },
        handleSelectionChange(val) {
            this.selectIds = val.map(item => item.id);
        },
        handleRemoveSelect() {
            if (this.selectIds && this.selectIds.length > 0) {
                this.$confirm('是否删除选中的模板？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    removeDoc({
                        ids: this.selectIds
                    })
                        .then(res => {
                            if (res.code == Const.ResultCode.Success) {
                                this.pageQuery();
                            }
                        });
                });
            } else {
                this.$message({
                    type: 'info',
                    message: '请选择要删除的模板'
                });
            }
        },
        closeDialog(done) {
            this.resetFormData();
            done();
        },
        resetFormData() {
            this.docData = {
                id: null,
                name: '',
                title: '',
                contentTitle: '',
                content: '',
                url: ''
            };
        },
        handleQRCode(index, row) {
            // debugger
            this.qrCodeVisible = true;
            this.qrcodeLoading = true;
            let url = process.env.VUE_APP_DOC_BASE_URL + row.url + "?timestamp=" + Date.now();
            this.qrCodeUrl = url;
        },
        handleCopyLink(index, row) {
            let url = process.env.VUE_APP_DOC_BASE_URL + row.url + "?timestamp=" + Date.now();
            this.$copyText(url);
        },
        openQRCode(){
            if (this.qrcode != null) {
                this.qrcode.clear();
            }
            // console.log(this.$refs.qrcode);
            this.qrcode = new QRCode(this.$refs.qrcode,{
                with: 256,
                height: 256,
                text: this.qrCodeUrl
            });
            this.qrcodeLoading = false;
        }
    },
    beforeDestroy() {
    }
}
</script>

<style>
.tox-tinymce-aux {
    z-index: 99999 !important;
}

.tinymce.ui.FloatPanel {
    z-Index: 99;
}
</style>

<style lang="scss" scoped>
.page {
    margin-top: 20px;
}
.qrcode{
    margin: 0 auto;
    width: 256px;
    height: 256px;
    margin-bottom: 25px;
}
</style>