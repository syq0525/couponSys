<template>
  <el-dialog :title="showType==1 ? '新增':'编辑'" :visible.sync="addFormVisible" :close-on-click-modal="false" >
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item class="item-two">
        <el-col :span="12">
          <el-form-item label="名称" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="权限字符串" prop="code">
            <el-input v-model="ruleForm.code"></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item class="item-two">
        <el-col :span="12">
          <el-form-item label="URL路径" prop="url">
            <el-input v-model="ruleForm.url"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="类别" prop="state">
            <el-select v-model="ruleForm.state">
              <template v-for="(item,index) in cateList">
                <el-option  :label="item.name" :value="item.id" :key="item.id"></el-option>
              </template>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item label="按钮明细" prop="subButtonList">
        <el-table :data="subButtonList" border style="width: 100%">
          <el-table-column label="按钮名称" align="center">
            <template scope="scope">
              <el-input v-model="subButtonList[scope.$index].name" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="权限字符串" align="center">
            <template scope="scope">
              <el-input v-model="subButtonList[scope.$index].code" size="small"></el-input>
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center">
            <template scope="scope">
              <el-button class="el-icon-delete" type="primary" size="small" @click="delCell(scope.$index)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 10px">
          <el-button class="el-icon-plus" @click="addCell" size="small"> 新增按钮</el-button>
        </div>
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
          url:'',
          state: ''
        },
        rules: {
          name: [
            {required: true,message: '请输入名称',trigger: 'blur'},
          ],
          state: [
            { required: true, message: '请选择类别', trigger: 'change' }
          ],
          code: [
            { required: true, message: '请选择权限字符串', trigger: 'blur' }
          ],
          url: [
            { required: true, message: '请选择URL路径串', trigger: 'blur' }
          ],

        },

        subButtonList: [],// 按钮明细
        cateList:[], //类别列表
      }
    },
    activated(){
      this.getcateList()
    },
    methods: {
      async getcateList(){
        let res = await this.$get('/couponSys/mgrParentFunction/cateList.json');
        this.cateList=res;
      },
      addCell() {
        var item = {
          name: '',
          code: '',
        }
        this.subButtonList.push(item)
      },
      delCell(index) {
        this.subButtonList.splice(index, 1)
      },
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
            fkParentFunctionId:this.ruleForm.state,
            code:this.ruleForm.code,
            name:this.ruleForm.name,
            url:this.ruleForm.url,
            subButtonList:this.subButtonList
          };
          let res = await this.$post('/couponSys/mgrFunction/add.json',d);
          if(res.errcode==0){
            this.$emit('childMethods',1)
            eventBus.$emit('resetMenu')
            
            this.$message.success('添加成功');
            this.addFormVisible=false;
          }else{
            this.$message.error(res.msg);
          }
      },
      async modifyForm(){
        let d={
            id:this.childValue.id,
            dr:this.childValue.dr,
            vstatus:this.childValue.vstatus,
            createTime:this.childValue.createTime,
            ts:this.childValue.ts,
            parentName:this.childValue.parentName,
            funcType:this.childValue.funcType,
            fkParentFunctionId:this.ruleForm.state,
            code:this.ruleForm.code,
            name:this.ruleForm.name,
            url:this.ruleForm.url,
            subButtonList:this.subButtonList
          };
          let res = await this.$post('/couponSys/mgrFunction/update.json',d);
          if(res.errcode==0){
            this.$emit('childMethods',2)
            eventBus.$emit('resetMenu')
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

<style lang="scss" scoped>
  

</style>
