<template>
    <div class="forget-container">
        <el-form ref="forgetForm" :model="forgetForm" label-width="100px" :rules="formRules" class="forget-form"
            auto-complete="on">

            <div class="title-container">
                <h3 class="title">忘记密码</h3>
            </div>

            <el-form-item label="用户名" prop="username">
                <el-input v-model="forgetForm.username"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="forgetForm.email"></el-input>
            </el-form-item>
            <el-form-item label="获取验证码" prop="picCode">
                <el-input v-model="forgetForm.picCode" @focus="refreshCode" class="code-input" name="picCode"></el-input>
                <img :src="picCodeUrl" @click="refreshCode" class="pic-code" />
                <el-button type="text" class="code-btn" @click="getEmailValidCode" :disabled="sendDisabled"
                    v-text="sendText"></el-button>
            </el-form-item>
            <el-form-item label="邮箱验证码" prop="validCode">
                <el-input v-model="forgetForm.validCode"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="forgetForm.password"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
                <el-input type="password" v-model="forgetForm.confirmPassword"></el-input>
            </el-form-item>
            <el-form-item class="action-row">
                <el-button type="primary" @click="updatePassword">提交</el-button>
                <el-button @click="returnLogin">返回</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { getCodeUrl, sendEmailCode, resetPassword } from '@/api/user'
import { EMAIL_REGX } from '@/const';

export default {
    name: 'forgetPwd',
    data() {
        let validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.forgetForm.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };

        let valdiateEmail = (rule, value, callback) => {
            if (value.trim() === '') {
                callback(new Error('请输入邮箱'));
            } else if (!EMAIL_REGX.test(value)) {
                callback(new Error('邮箱格式不正确'))
            } else {
                callback();
            }
        }

        return {
            forgetForm: {
                username: '',
                email: '',
                validCode: '',
                password: '',
                confirmPassword: '',
                picCode: '',
            },
            formRules: {
                username: [{ required: true, trigger: 'blur', message: '用户名不能为空' }],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ],
                confirmPassword: [
                    { required: true, trigger: 'blur', validator: validatePass2 }
                ],
                email: [
                    { required: true, trigger: 'blur', validator: valdiateEmail }
                ],
                validCode: [
                    { required: true, trigger: 'blur', message: '验证码不能为空' }
                ],
                picCode: [
                    { required: true, trigger: 'blur', message: '验证码不能为空' }
                ]
            },
            timestamp: new Date().getTime(),
            interval: 60,
            sendDisabled: false,
            sendText: '发送验证码',
            picCodeUrl: getCodeUrl('', new Date().getTime()),
        }
    },
    computed: {
        validCodeUrl() {
            return getCodeUrl(this.forgetForm.username, this.timestamp);
        }
    },
    methods: {
        resetForm() {
            this.$refs.forgetForm.resetFields();
        },
        returnLogin() {
            this.$router.push({ path: '/login' });
        },
        refreshCode() {
            // this.timestamp = new Date().getTime();
            // console.log(this.timestamp);
            this.picCodeUrl = getCodeUrl(this.forgetForm.username, new Date().getTime());
        },
        //获取邮箱验证码
        getEmailValidCode() {
            let valid = true;
            this.$refs.forgetForm.validateField(['username', 'email', 'picCode'], (err, obj) => {
                if (valid && err != '') {
                    valid = false;
                }
            });

            if (valid) {
                this.sendDisabled = true;
                let that = this;
                //发送短信验证码
                sendEmailCode(this.forgetForm.username, this.forgetForm.email, this.forgetForm.picCode)
                    .then(() => {
                        that.sendText = `${that.interval}秒后重试`;
                        let id = setInterval(() => {
                            if (that.interval <= 0) {
                                that.interval = 60;
                                that.sendDisabled = false;
                                that.sendText = '发送短信验证码';
                                clearInterval(id);
                            } else {
                                that.interval = that.interval - 1;
                                that.sendText = `${that.interval}秒后重试`;
                            }
                        }, 1000);
                    }).catch(e => {
                        console.log(e);
                        this.sendDisabled = false;
                    }).finally(() => {
                        this.sendDisabled = false;
                        this.refreshCode();
                    });
            }

        },
        //修改密码
        updatePassword() {
            this.$refs.forgetForm.validate(valid => {
                if (valid) {
                    resetPassword(this.forgetForm)
                        .then(() => {
                            //重置密码成功
                            this.$confirm('修改密码成功，是否返回登录?', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'success'
                            }).then(() => {
                                this.$router.push({path: "/login"});
                            }).catch(() => {
                                
                            });
                        })
                        .catch(e => {
                            console.log(e);
                        });
                }
            });

        }
    }
}
</script>

<style lang="scss">
$bg: #283443;
$light_gray: #eee;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .forget-container .el-input input {
        color: $cursor;
    }
}

/* reset element-ui css */
.forget-container {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;

    .el-input {
        display: inline-block;
        height: 47px;
        // width: 85%;

        input {
            -webkit-appearance: none;
            border-radius: 0px;
            padding: 12px 5px 12px 15px;
            color: $light_gray;
            height: 47px;
            caret-color: $cursor;
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(0, 0, 0, 0.1);
            border-radius: 5px;

            &:-webkit-autofill {
                box-shadow: 0 0 0px 1000px $bg inset !important;
                -webkit-text-fill-color: $cursor !important;
            }
        }
    }

    .el-form-item {
        // border: 1px solid rgba(255, 255, 255, 0.1);
        // background: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        color: #454545;
    }


}
</style>

<style scoped lang="scss">
$light_gray: #eee;
$cursor: #fff;

.forget-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;

    .action-row {
        text-align: center;
    }

    .code-input,
    .pic-code,
    .code-btn {
        float: left;
        margin-left: 20px;
    }

    .pic-code {
        // width: 100px;
        height: 47px;
        line-height: 47px;
    }

    .pic-code:hover {
        cursor: pointer;
    }

    .code-input {
        width: 100px;
        margin-left: 0;
    }
}

.title-container {
    position: relative;

    .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
        margin-left: 100px;
    }
}
</style>