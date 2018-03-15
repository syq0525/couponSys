<template>
  <el-dialog :title="showType==1 ? '新增':showType==2 ?'编辑':'查看'"  :visible.sync="addFormVisible" :close-on-click-modal="false">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

      <el-form-item class="item-two">
        <el-col :span="12">
          <el-form-item label="键名称" prop="name">
            <el-input v-model="ruleForm.name" :disabled="showType==-1?true:false"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="键" prop="key">
            <el-input v-model="ruleForm.key" :disabled="showType==-1?true:false"></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item class="item-two">
        <el-col :span="12">
          <el-form-item label="值" prop="value">
            <el-input v-model="ruleForm.value" :disabled="showType==-1?true:false"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="vstatus">
            <el-select style="width:100%" v-model="ruleForm.vstatus"  placeholder="请选择" :disabled="true">
              <el-option  label="未启用" :value="0"></el-option>
              <el-option  label="已启用" :value="1"></el-option>
              <el-option  label="已停用" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        
      </el-form-item>
      <el-form-item class="item-two">
        <el-col :span="12">
          <el-form-item label="类型" prop="type">
            <el-select style="width:100%" v-model="ruleForm.type"  placeholder="请选择" :disabled="showType==-1?true:false">
              <el-option  label="回调地址" value="1"></el-option>
              <el-option  label="接口开关" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        
      </el-form-item>
      <el-form-item class="item-two">
        <el-col >
          <el-form-item label="描述" prop="description">
            <el-input type="textarea" v-model="ruleForm.description" :disabled="showType==-1?true:false" :rows="4"></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>

    </el-form>


    <div slot="footer" class="dialog-footer">
      <el-button @click="addFormVisible = false">取消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')" :disabled="showType==-1?true:false">保存</el-button>
    </div>
  </el-dialog>
</template>
<script>
  export default {
    props:['showType','showUpdate','childValue'],
    data() {
      return {
        addFormVisible: false,
        ruleForm: {
          name: '',
          key:'',
          value:'',
          vstatus:'',
          type:'',
          description:''
        },
        rules: {
          key: [
            {required: true,message: '请输入键',trigger: 'blur'},
          ],
          name: [
            {required: true,message: '请输入键名称',trigger: 'blur'},
          ],
          value: [
            {required: true,message: '请输入值',trigger: 'blur'},
          ],
          description: [
            {required: true,message: '请输入描述',trigger: 'blur'},
          ],
          type: [
            {required: true,message: '请选择类型',trigger: 'change'},
          ],
        },

      }

    },
    activated(){
      
    },
    methods: {
   
      submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            
            if(this.showType==1){
              this.addForm()
            }else{
              this.modifyForm()
            }
          } 
        });
      },
      async addForm(){

        let d={
            content:{
                bConfigInfo:{
                    id:'',
                    name: this.ruleForm.name,
                    key:this.ruleForm.key,
                    value:this.ruleForm.value,
                    type:this.ruleForm.type,
                    description:this.ruleForm.description,
                    vstatus:this.ruleForm.vstatus,
                    dr:'1'
                }
            }
            
          };
          let res = await this.$post('/couponSys/bConfigInfo/add.json',d);
          if(res.errcode==0){
            this.$emit('childMethods',1)
            this.$message.success('添加成功');
            this.addFormVisible=false;
          }else{
            this.$message.error(res.msg);
          }
      },
      async modifyForm(){
        

        let d={
            content:{
                bConfigInfo:{
                    id:this.childValue.id,
                    name: this.ruleForm.name,
                    key:this.ruleForm.key,
                    value:this.ruleForm.value,
                    type:this.ruleForm.type,
                    description:this.ruleForm.description,
                    vstatus:this.ruleForm.vstatus,
                    dr:'1'
                }
            }
        };
        let res = await this.$post('/couponSys/bConfigInfo/update.json',d);
        if(res.errcode==0){
        this.$emit('childMethods',2)
        this.$message.success('修改成功');
        this.addFormVisible=false;
        }else{
        this.$message.error(res.msg);
        }
      },
      resetForm() {
        this.$refs.ruleForm.resetFields();
      },
    }
  }

</script>

<style lang="scss" scoped>
  

</style>
