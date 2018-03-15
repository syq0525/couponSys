<template>
  <el-card class="box-card">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item class="item-two">

        <el-col>
          <el-form-item label="核销门店" prop="store">
            <el-cascader
                :options="fourshops"
                @active-item-change="getSection"
                :props="props"
                v-model="ruleForm.store">
            </el-cascader>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item class="item-two">

        <!-- <el-col :span="8">
          <el-form-item label="券类型" prop="type">
            <el-select v-model="ruleForm.type" placeholder="请选择">
              <el-option label="乐橙券" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col> -->
        <el-col >
          <el-form-item label="劵码" prop="code">
            <el-input v-model="ruleForm.code" placeholder="请输入劵码,多个券码核销时，可用“,”进行分隔" style="width:50%"></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
    </el-form>
    <el-row class="btn-group">
      <el-button type="primary" size="large" @click="handleCheck">确定</el-button>
    </el-row>
    <el-dialog title="确定核销信息" :visible.sync="addFormVisible" :close-on-click-modal="false" width="500px">
      <el-card v-for="(item,index) in checkEntity" style="margin-bottom:10px">
        <el-tag type="primary">&nbsp;{{index+1}}&nbsp;</el-tag>
        <div class="card-box">
          <span class="search-span">会员名：</span>
          <span>{{item.memberName}}</span>
        </div>
        <div class="card-box">
          <span class="search-span">手机号：</span>
          <span>{{item.mobilephone}}</span>
        </div>
        <div class="card-box">
          <span class="search-span">券码：</span>
          <span>{{item.verificationCode}}</span>
        </div>
        <div class="card-box">
          <span class="search-span">使用门店：</span>
          <span>{{fourshopsName}}</span>
        </div>

      </el-card>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
  export default {
    name: 'verifypage',
    // props:['activeName'],
    data() {
      return {
        fourshops: [], //4s店
        props:{
            label:'name',
            value: 'id',
            children: 'children'
        },
        addFormVisible: false,
        ruleForm: {
          time:'',
          name:'',
          store: [],
          type: '',
          code: ''
        },
        rules: {
          code: [{
            required: true,
            message: '请输入劵码',
            trigger: 'blur'
          }, ],
          store: [{
            required: true,
            message: '请选择核销门店',
            trigger: 'change'
          }, ],
          type: [{
            required: true,
            message: '请选择券类型',
            trigger: 'change'
          }, ]
        },
        id: '',
        checkEntity: [],
        list:[],
        fourshopsName: ''
      }
    },
    mounted() {
      
      let userinfo = unescape(sessionStorage.getItem('userinfo'));
      if (userinfo) {
        userinfo = JSON.parse(userinfo);
        this.ruleForm.name = userinfo.name
      }
      this.getData()
    },
    
    methods: {
      async getSection(val){      
          let index=0
          for(var i=0;i<this.fourshops.length;i++){
              if(this.fourshops[i].id==val[0]){
                  index=i
                  break;
              }
              
          }
          if(this.fourshops[index].children==0){
              let d={
                  fourshop:val[0]
              }
              let res = await this.$get('/couponSys/common/getDeptByFourshop.json',d);
              if(Object.keys(res).length!=0){
                  this.fourshops[index].children = res
              }
              
          }
      },
      async getData() {
        let res = await this.$get('/couponSys/couponVerification/create.json');
        if (res.errcode == 0) {
          this.fourshops = res.fourslist
          for(var i in this.fourshops){
              this.$set(this.fourshops[i],'children',[])
          }
          this.ruleForm.time = this.$format(res.verificationEntity.operateTime)
        }
      },
      async handleCheck() {
        this.$refs.ruleForm.validate(async(valid) => {
          if (valid) {
            let d = {
              code: this.ruleForm.code,
              type: 2,
              fkFourshopId:this.ruleForm.store[0],
              fkDeptId:this.ruleForm.store[1]
            };
            let res = await this.$get('/couponSys/couponVerification/check.json', d);
            if (res.errcode == 0) {
              let farr=this.fourshops.filter((item)=>{
                  return this.ruleForm.store[0]==item.id;
              })
              let darr=farr[0].children.filter((item)=>{
                  return this.ruleForm.store[1]==item.id;
              })
              this.fourshopsName=farr[0].name+darr[0].name
              this.checkEntity = res.checkEntity
              this.addFormVisible = true;

            } else {
              this.$message.error(res.msg);
            }

          } else {
            return false;
          }
        });


      },
      async handleSubmit() {
        this.list=[];
        for(let i=0;i<this.checkEntity.length;i++){
          let item={
            fkCouponSchemeId: this.checkEntity[i].fkCouponSchemeId,
            fkCouponId: this.checkEntity[i].id,
            fkMbeId: this.checkEntity[i].fkMbeId,
            operater: this.ruleForm.name,
            operateTime: this.ruleForm.time,
            fkFourshopId:this.ruleForm.store[0],
            fkDeptId:this.ruleForm.store[1]
          }
          this.list.push(item)
        }
        
        let d = {
          content:{
            bCouponVerificationList:this.list,
            type:2
          }
          
        };
        let res = await this.$post('/couponSys/couponVerification/verification.json', d);
        if (res.errcode == 0) {
          this.$message.success('核销成功');
          this.addFormVisible = false;
          this.$parent.$parent.$data.currentName='second'
          eventBus.$emit('resetVerifylist')
        }else{
          this.$message.error(res.msg);
        }
      }
    }

  }

</script>

<style lang="scss" scoped>
  .btn-group {
    margin-top: 40px;
    text-align: center
  }

  .search-span {
    display: inline-block;
    width: 140px;
    text-align: right;
  }

  .card-box {
    font-size: 16px;
    line-height: 30px
  }
  
</style>
