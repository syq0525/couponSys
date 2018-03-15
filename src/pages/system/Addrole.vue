<template>
  <el-dialog  :title="showType==1 ? '新增':'编辑'" :visible.sync="addFormVisible" :close-on-click-modal="false">
    <el-form  :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item class="item-two">
        <el-col :span="12">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入角色名称" ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="角色编码" prop="code" > 
            <el-input v-model="ruleForm.code" placeholder="请输入角色编码" :disabled="showType==1 ? false:true"></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item class="item-two">
        <el-col :span="12">
          <el-form-item label="角色状态" prop="vstatus">
            <el-select v-model="ruleForm.vstatus" >
              <el-option label="启用" value="2" ></el-option>
              <el-option label="停用" value="3" ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item class="item-two">
        <el-col>
          <el-form-item label="权限列表">
            <el-tree :data="permList" :props="defaultProps" ref="tree" show-checkbox node-key="id">
            </el-tree>
          </el-form-item>
        </el-col>
      </el-form-item>
    </el-form>


    <div slot="footer" class="dialog-footer">
      <el-button @click="addFormVisible = false">取消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
    </div>
  </el-dialog>
</template>
<script>
  export default {
    props:['showType','childValue'],
    data() {
      return {
        addFormVisible: false,
        ruleForm: {
          name: '',
          code: '',
          vstatus: '',
        },
        rules: {
          name: [
            { required: true,message: '请输入角色名称',trigger: 'blur'},
          ],
          code: [
            { required: true,message: '请输入角色编码',trigger: 'blur'},
          ],
          vstatus: [
            { required: true,message: '请选择角色状态',trigger: 'change'},
          ],

        },
        allpermList:[],
        permList:[],  //初始化权限列表
        defaultProps:{
          children: 'children',  
          label: 'name'
        },
        functions:[],  //勾选权限列表的数组
      }
    },
    activated(){
      this.getpermList()
    },

    methods: {
      async getpermList(){
        let res = await this.$get('/couponSys/mgrRole/permList.json');
        this.allpermList=res;
        this.permList=[];
        for(let i=0;i<res.length;i++){
          if(res[i].funcType=='function'){
            res[i].children=[];
            this.permList.push(res[i]);
          }
        }
        for(let i=0;i<this.permList.length;i++){
          for(let j=0;j<res.length;j++){
            if(res[j].funcType=='action'&&res[j].fkParentFunctionId==this.permList[i].id){
              this.permList[i].children.push(res[j]);
            }
          }
        }

      },
      submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            this.functions=[];      
            let arr=this.$refs.tree.getCheckedNodes();
            for(let i=0;i<arr.length;i++){
              let item={
                id:arr[i].id,
                code:arr[i].code,
                funcType:arr[i].funcType
              }
              this.functions.push(item)
            }
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
            id:'',
            code:this.ruleForm.code,
            name:this.ruleForm.name,
            functions:this.functions,
            vstatus:this.ruleForm.vstatus
          };

          let res = await this.$post('/couponSys/mgrRole/add.json',d);
          if(res.errcode==0){
            this.$emit('childMethods')
            this.$message.success('添加成功');
            this.addFormVisible=false;
          }else{
            this.$message.error(res.msg);
          }
      },
      async modifyForm(){
        let d={
            id:this.childValue.id,
            code:this.ruleForm.code,
            name:this.ruleForm.name,
            functions:this.functions,
            vstatus:this.ruleForm.vstatus
          };
          let res = await this.$post('/couponSys/mgrRole/update.json',d);
          if(res.errcode==0){
            this.$emit('childMethods')
            this.$message.success('修改成功');
            this.addFormVisible=false;
          }else{
            this.$message.error(res.msg);
          }
      },
      resetForm() {
        this.$refs.ruleForm.resetFields();
      }
    }
  }

</script>

<style lang="scss">
  // .demo-ruleForm {
  //   max-width: 600px;
  // }

</style>
