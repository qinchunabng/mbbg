<template>
    <div class="form-panel">
        <el-form label-width="80px" :model="userInfo" :rules="rules" ref="userForm">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="userInfo.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="userInfo.password"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
                <el-input type="password" v-model="userInfo.confirmPassword"></el-input>
            </el-form-item>
            <el-form-item class="action-row">
                <el-button type="primary" @click="updateUser">提交</el-button>
                <el-button @click="resetForm">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'


export default {
    name: 'userInfo',
    data() {
        let that = this;
        let validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== that.userInfo.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            userInfo: {
                id: null,
                username: '',
                password: '',
                confirmPassword: ''
            },
            rules: {
                username: [
                    { required: true, message: '用户名不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ],
                confirmPassword: [
                    { required: true, trigger: 'blur', validator: validatePass2 }
                ]
            }
        }
    },
    computed: {
        ...mapGetters([
            'userId',
            'name'
        ])
    },
    created() {
        this.userInfo.id = this.userId;
        this.userInfo.username = this.name;
    },
    methods: {
        resetForm() {
            this.$refs.userForm.resetFields();
        },
        updateUser() {
            this.$refs.userForm.validate(valid => {
                if (valid) {
                    this.$store.dispatch('user/updateUser', this.userInfo).then(() => {
                        this.$message({
                            type: 'info',
                            message: '更新成功'
                        });
                    }).catch(() => {
                    })
                }
            });
        }
    }
}
</script>

<style scoped>
.form-panel {
    width: 40%;
    margin: 25px auto;
}

.action-row {
    text-align: center;
}
</style>