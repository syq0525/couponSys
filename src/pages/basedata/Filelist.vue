<template>
  <section>
    <el-row class="breadcrumb">文件管理</el-row>
    <!--工具条-->
    <el-row  class="toolbar">
      
      <el-col class="search-item">
        <div class="search-box">
          <span class="search-title">券方案名称</span>
          <el-input v-model="search.name" placeholder="请输入券方案" style="width:200px" :clearable="true"></el-input>
        </div>
        <div class="search-box">
            <el-button  type="primary" @click="searchItem" class="el-icon-search" > 搜索</el-button>
          </div>
      </el-col>
      
    </el-row>
      <!--列表-->
    <el-table :data="listItems" stripe   highlight-current-row v-loading="listLoading"  style="width: 100%">
      <!-- <el-table-column type="selection" ></el-table-column> -->
      <el-table-column prop="fkSchemeName" label="券方案名称"  ></el-table-column>
      <el-table-column  label="创建日期" >
        <template scope="scope">
            {{$format(scope.row.createTime)}}
        </template>
      </el-table-column>
      <el-table-column prop="originalName" label="原名称" ></el-table-column>
      <el-table-column prop="newName" label="新名称" ></el-table-column>
      <el-table-column label="操作" width="120" align="center">
        <template scope="scope">
          
          <el-tooltip content="删除" placement="top">
            <el-button class="el-icon-delete" type="primary" size="mini" @click="removeItem(scope.row.id,scope.row.newName)" :disabled="showDelete ? false:true"></el-button>
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
        layout="sizes, prev, pager, next"
        :total="totalNum"
        style="float:right;"> 
      </el-pagination>
    </el-col>

  </section>
</template>
<script>
  export default {
    name:'ex-filelist',
    data(){
      return{

        showDelete:false,
        pageNo:1,
        totalNum:0,  
        pageSize:20,
        listItems:[],
        search:{
          name:''
        },
        listLoading: false,
        childValue:'',
      } 
    },

    mounted(){
      this.getData()
    },
    methods:{
      
      async getData(){
        this.listLoading=true
        let d={
            page:this.pageNo,
            pageSize:this.pageSize,
            search_LIKE_name: this.search.name,
        };
        let res = await this.$get('/couponSys/mongodbFile/page.json',d);
        
        if(res.errcode==0){
          this.listLoading=false
          this.listItems=res.page.content;
          this.totalNum=res.page.totalNum;
          if(res.page.functions&&res.page.functions.delete){
            this.showDelete=true
          }
        }else if(res.errcode==2){
          this.listLoading=false
          this.listItems=[];
          this.totalNum=0;
        }
      },
      //点击搜索
      async searchItem(){
        this.pageNo=1;
        this.getData()
      },
      //点击删除
      removeItem(id,newName){
        this.$confirm('确认删除吗?', '提示', {
            //type: 'warning'
        }).then(async () => {
            let d={
                id:id,
                newName:newName
            };
            let res = await this.$get('/couponSys/mongodbFile/delete.json',d);
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
      
      
      
    }

  }
</script>
<style lang="scss">

</style>
