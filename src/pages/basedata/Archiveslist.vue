<template>
  <section>
    <el-row class="breadcrumb">自定义档案</el-row>
    <!--工具条-->
    <el-row class="toolbar">
      <el-col class="search-box" v-if="showCreate">
        <el-button class="el-icon-plus button-primary-hover" @click="handleAdd"  > 新增自定义档案</el-button>
      </el-col>
      <el-col class="search-item">
        <div class="search-box">
          <span class="search-title">名称</span>
          <el-input v-model="search.name" placeholder="请输入名称" style="width:200px" :clearable="true"></el-input>
        </div>
        <div class="search-box">
            <el-button  type="primary" @click="searchItem" class="el-icon-search" > 搜索</el-button>
          </div>
      </el-col>
      
    </el-row>
      <!--列表-->
    <el-table :data="listItems" stripe  highlight-current-row v-loading="listLoading"  style="width: 100%">
      <!-- <el-table-column type="selection" ></el-table-column> -->

      <el-table-column prop="code" label="编码" ></el-table-column>
      <el-table-column  label="名称" >
        <template scope="scope">
          <span class="see-details" @click="modifyItem(scope.row.id,-1)" v-if="showRead">{{scope.row.name}}</span>
          <span v-else>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述"  ></el-table-column>
      <el-table-column label="操作" align="center" width="120">
        <template scope="scope">
          <el-tooltip content="编辑" placement="top">
            <el-button class="el-icon-edit" type="primary"  size="mini" @click="modifyItem(scope.row.id,2)" :disabled="scope.row.vstatus!=1&&showUpdate ? false:true"></el-button>
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

    <!-- 新增弹窗页面 -->
    <addarchives  ref="add"  :showType="showType" :showUpdate="showUpdate" @childMethods="childMethods"></addarchives>
  </section>
</template>
<script>
  import addarchives from './Addarchives.vue'
  export default {
    name:'in-archiveslist',
    data(){
      return{
        showCreate:false,
        showDelete:false,
        showUpdate:false,
        showRead:false,
        pageNo:1,
        totalNum:0,
        pageSize:20,
        listItems:[],
        search:{
          name:'',
        },
        listLoading: false,
        showType:1,  //显示弹窗类型  1：添加  2：修改

      } 
    },
    components:{
      addarchives
    },
    mounted(){
      this.getData()
    },
    methods:{
      childMethods(msg){
        if(msg==1){
          this.search.name=''
        }
        this.getData();
      },
      async getData(){
        this.listLoading=true
        let d={
            page:this.pageNo,
            pageSize:this.pageSize,
            search_LIKE_name: this.search.name,
        };
        let res = await this.$get('/couponSys/bDefdoc/page.json',d);
        this.listLoading=false
        this.listItems=res.content;
        this.totalNum=res.totalNum;
        if(res.functions&&res.functions.create){
          this.showCreate=true
        } 
        if(res.functions&&res.functions.delete){
          this.showDelete=true
        }

        if(res.functions&&res.functions.update){
          this.showUpdate=true
        } 
        if(res.functions&&res.functions.read){
          this.showRead=true
        } 
      },
      //点击搜索
      async searchItem(){
        this.pageNo=1;
        this.getData()
      },
      //点击修改操作
      async modifyItem(id,status){
        let d={
            id:id
        };
        let res = await this.$get('/couponSys/bDefdoc/toUpdate.json',d);
        if(res.errcode==0){
          this.$refs.add.addFormVisible=true;
          this.$refs.add.$nextTick(()=>{
            this.$refs.add.resetForm()
            this.showType=status;
            
            let item={
                id:id,
                name: res.bDefdoc.name,
                code: res.bDefdoc.code,
                description:res.bDefdoc.description
            }
            this.$refs.add.ruleForm=item;
            this.$refs.add.subButtonList=res.bDefdocSublist||[];
            })
          
        }
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
        this.$refs.add.addFormVisible=true
        this.$refs.add.$nextTick(()=>{
          this.$refs.add.resetForm()
          this.showType=1;
          let item={
            name: '',
            code: '',
            description:''
          }
          this.$refs.add.ruleForm=item;
          this.$refs.add.subButtonList=[]
        })

      },
    }

  }
</script>
<style lang="scss" >

</style>
