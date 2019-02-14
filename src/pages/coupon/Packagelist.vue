<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-row >
        <el-col class="search-box" v-if="packageadd">
          <el-button class="el-icon-plus button-primary-hover" @click="handleAdd"  > 新增券包方案</el-button>
        </el-col>
        <el-col class="search-item">
          <div class="search-box">
            <span class="search-title">券包编号</span>
            <el-input v-model="search.code" placeholder="请输入劵方案编号" style="width:200px" :clearable="true"></el-input>
          </div>
          <div class="search-box">
            <span class="search-title">券包名称</span>
            <el-input v-model="search.name" placeholder="请输入劵方案名称" style="width:200px" :clearable="true"></el-input>
          </div>
          <div class="search-box">
            <span class="search-title">创建时间</span>
            <el-date-picker
                :editable="false"
                v-model="search.time"
                type="daterange"
                :default-time="['00:00:00', '23:59:59']"
                placeholder="选择日期时间"
                style="width:240px">
              </el-date-picker>
          </div>
        </el-col> 
        <el-col class="search-item">
          <div class="search-box">
            <span class="search-span">券包状态：</span>
            <el-radio v-model="search.vstatus" label="">全部</el-radio>
            <el-radio v-model="search.vstatus" label="1">已启用</el-radio>
            <el-radio v-model="search.vstatus" label="2">已停用</el-radio>
            <el-radio v-model="search.vstatus" label="3">已领完</el-radio>
            <el-radio v-model="search.vstatus" label="5">已完结</el-radio>
          </div>
          <div class="search-box">
            <el-button  type="primary" @click="searchItem" class="el-icon-search" > 搜索</el-button>
          </div>
        </el-col>
          
      </el-row>
      
    </el-col>
      <!--列表-->
    <el-table :data="listItems" stripe   highlight-current-row v-loading="listLoading"  ref="table">
      <!-- <el-table-column type="selection" ></el-table-column> -->
      <el-table-column  label="券包编码"  >
        <template scope="scope">
          <span class="see-details" @click="modifyItem(scope.row.id,-1)">{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="券包名称"  ></el-table-column>
    
      <el-table-column prop="issuanceQty" label="创建数量" ></el-table-column>
      <el-table-column prop="code" label="领取数量" >
        <template scope="scope">
          {{scope.row.issuanceQty-scope.row.remainQty}}
        </template>
      </el-table-column>
      
      <el-table-column  label="创建日期" >
        <template scope="scope">
            {{$format(scope.row.createTime)}}
        </template>
      </el-table-column>
      <el-table-column prop="createrName" label="创建人" ></el-table-column>
      <el-table-column prop="code" label="券包状态" >
        <template scope="scope">
          {{scope.row.vstatus==1 ? '已启用' : scope.row.vstatus==2 ? '已停用': scope.row.vstatus==3 ? '已领完' : '已完结'}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="210" align="center">
        <template scope="scope">
          <el-tooltip content="停用" placement="top" v-if="scope.row.vstatus==1">
            <el-button class="fa fa-stop-circle-o " aria-hidden="true" type="primary" size="mini"   @click="stopVstatus(scope.row.id,scope.$index)" :disabled="packagestop ? false:true" ></el-button>
          </el-tooltip>
          <el-tooltip content="开启" placement="top" v-else>
            <el-button class="fa fa-play-circle-o" type="primary" size="mini"  @click="startVstatus(scope.row.id,scope.$index)" :disabled="packagestart&&scope.row.vstatus==2 ? false:true" ></el-button>
          </el-tooltip>
          
          <el-tooltip :content="scope.row.vstatus==2?'编辑':'查看'" placement="top">
            <el-button :class="scope.row.vstatus==2?'el-icon-edit':'el-icon-view'" type="primary"  size="mini" @click="modifyItem(scope.row.id,scope.row.vstatus)" :disabled="packageupdate ? false:true"></el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button class="el-icon-delete" type="primary" size="mini" @click="removeItem(scope.row.id)" :disabled="packagedelete&&scope.row.vstatus==2 ? false:true"></el-button>
          </el-tooltip>
          <el-tooltip content="复制链接" placement="top">
            <el-button class="el-icon-share" type="primary" size="mini" :disabled="packagecopy ? false:true" @click="showUrl(scope.row.id,scope.row.isShared)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30, 40,50]"
        :page-size="pageSize"
        layout="total,sizes, prev, pager, next"
        :total="totalNum"
        style="float:right;">
      </el-pagination>
    </el-col>
    <input type="text" id="copy-package"  class="copy-input" v-model="copyvalue" ref="copy">
  </section>
</template>
<script>

  export default {
    name:'in-packagelist',
    props:['packageadd','packagestart','packagestop','packageupdate','packagedelete','packagecopy'],
    data(){
      return{
        showAdd:false,
        pageNo:1,
        totalNum:0,
        pageSize:20,
        listItems:[],
        search:{
          code:'',
          name:'',
          vstatus:'',
          time:[],
        },
        listLoading: false,
        copyvalue:''
      } 
    },
    components:{
      
    },
    mounted(){
      
      this.getData()
      // eventBus.$on('resetPlatformlist',(msg)=> {
      //     this.getData();
          
      // })
    },
    activated(){

      this.getData()
    },
    methods:{
      async getData(){
        this.listLoading=true
        let d={

            page:this.pageNo,
            pageSize:this.pageSize,
            search_LIKE_name: this.search.name,
            search_LIKE_code:this.search.code,
            search_EQ_vstatus:this.search.vstatus,
            search_GTE_createTime:this.search.time?this.$format(this.search.time[0]):'',
            search_LTE_createTime:this.search.time?this.$format(this.search.time[1]):'',
        };
        let res = await this.$get('/couponSys/couponPackage/page.json',d);
        this.listLoading=false
        this.listItems=res.page.content;
        this.totalNum=res.page.totalNum;

      },
      //点击搜索
      async searchItem(){
        this.pageNo=1;
        this.getData()
      },
      //点击编辑操作
      modifyItem(id,status){ 
        this.$router.push({path:'/home/coupon/addpackage',query:{id:id,status:status}})
      },
      //点击停用
      async stopVstatus(id,index){
        let d={
            id:id
        };
        let res = await this.$get('/couponSys/couponPackage/stop.json',d);
        if(res.errcode==0){
          this.listItems[index].vstatus=2
        }else{
          this.$message.error(res.msg);
        }
      },
      //点击开启
      async startVstatus(id,index){
        let d={
            id:id
        };
        let res = await this.$get('/couponSys/couponPackage/start.json',d);
        if(res.errcode==0){
          this.listItems[index].vstatus=1
        }else{
          this.$message.error(res.msg);
        }
      },
      //点击删除
      removeItem(id){
        this.$confirm('确认删除吗?', '提示', {
            //type: 'warning'
        }).then(async () => {
            let d={
                id:id
            };
            let res = await this.$get('/couponSys/couponPackage/delete.json',d);
            if(res.errcode==0){
              this.getData();
              this.$message.success('删除成功');
            }else{
              this.$message.error(res.msg);
            }
        })
        
      },
      //pageSize 改变时会触发
      handleSizeChange(val){
        this.pageNo=1;
        this.pageSize=val;
        this.getData()
      },
      //currentPage 改变时会触发
      handleCurrentChange(val){
        this.pageNo=val;
        this.getData()
      },
      
      //点击新增
      handleAdd(){ 
        this.$router.push('/home/coupon/addpackage')
        
      },
      //点击复制链接弹窗显示地址
      showUrl(id,share){
        let origin=''
        if(process.env.NODE_ENV==='development'){
          origin='http://localhost:8080/'
        }else{
           if(location.host.includes('ceshi.lechengclub.com')||location.host.includes('192.168.11.81')){
            origin='https://ceshi.lechengclub.com/'
          }else{
            origin='https://www.lechengclub.com/'
          }
        }
        
        let myurl=origin+'wxwap?#/coupon/welfare/'+id+'?type=3&isShared='+share
        this.copyvalue=myurl
        this.$confirm(myurl, '链接地址', {
          confirmButtonText: '复制',
          cancelButtonText: '取消',
          
        }).then(() => {
            var Url=document.getElementById('copy-package')
            Url.select();
            document.execCommand("Copy");
            this.$message.success('复制成功');
        }).catch(() => {
                   
        });
      },

    }

  }
</script>
<style lang="scss">

</style>
