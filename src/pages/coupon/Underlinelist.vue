<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-row>
        <el-col class="search-box" v-if="underlineadd"> 
          <el-button class="el-icon-plus button-primary-hover" @click="handleAdd"> 新增线下制券</el-button>
        </el-col>
        <el-col class="search-item">
          <div class="search-box">
            <span class="search-title">线下制券编码</span>
            <el-input v-model="search.code" placeholder="输入线下制券编码" style="width:200px" :clearable="true"></el-input>
          </div>
          <div class="search-box">
            <span class="search-title">线下制券名称</span>
            <el-input v-model="search.name" placeholder="输入线下制券名称" style="width:200px" :clearable="true"></el-input>
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
          <div class="search-box">
            <el-button type="primary" @click="searchItem" class="el-icon-search" > 搜索</el-button>
          </div>
        </el-col>

      </el-row>
    </el-col>

    <!--列表-->
    <el-table :data="listItems" stripe highlight-current-row v-loading="listLoading" style="width: 100%">
      <!-- <el-table-column type="selection" ></el-table-column> -->
      <el-table-column  label="线下制券编号">
        <template scope="scope">
          <span class="see-details" @click="modifyItem(scope.row.id,-1)">{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="线下制券名称"></el-table-column>
      <el-table-column label="活动类型">
        <template scope="scope">
          {{scope.row.type=='1'?'线下制券':''}}
        </template>
      </el-table-column>
      <el-table-column prop="couponSchemeName" label="制券奖品" :show-overflow-tooltip='true'></el-table-column>
      <el-table-column  label="创建日期">
        <template scope="scope">
          {{$format(scope.row.createTime)}}
        </template>
      </el-table-column>
      <el-table-column prop="fkCreatorUserName" label="创建人"></el-table-column>
      <el-table-column prop="makeNumber" label="制券数量"></el-table-column>
      <el-table-column label="操作" width="210" align="center">
        <template scope="scope">
          <el-tooltip content="制券" placement="top">
            <el-button class="fa fa-file-excel-o" type="primary" size="mini" @click="pushItem(scope.row.id)" :disabled="underlinemake&&scope.row.status==0 ? false:true"></el-button>
          </el-tooltip>
          <el-tooltip :content="scope.row.status==0?'编辑':'查看'" placement="top">
            <el-button :class="scope.row.status==0?'el-icon-edit':'el-icon-view'" type="primary" size="mini" @click="modifyItem(scope.row.id,scope.row.status)" :disabled="underlineupdate ? false:true"></el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button class="el-icon-delete" type="primary" size="mini" @click="removeItem(scope.row.id)" :disabled="underlinedelete&&scope.row.status==0 ? false:true"></el-button>
          </el-tooltip>
          <el-tooltip content="下载文件" placement="top">
            <el-button class="fa fa-download" type="primary" size="mini" @click="downloadItem(scope.row.id)" :disabled="underlinedownload&&(scope.row.status==1||scope.row.status==2) ? false:true"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40,50]" :page-size="pageSize"
        layout="sizes, prev, pager, next" :total="totalNum" style="float:right;">
      </el-pagination>
    </el-col>

  </section>
</template>
<script>

  export default {
    name: 'in-underlinelist',
    props: ['underlineadd', 'underlineupdate', 'underlinedelete', 'underlinedownload', 'underlinemake'],
    data() {
      return {

        pageNo: 1,
        totalNum: 0,
        pageSize: 20,
        listItems: [],
        search: {
          code: '',
          name: '',
          time: [],
        },
        listLoading: false,
        showType: 1, //显示弹窗类型  1：添加  2：修改
        childValue: '',
        linkUrl:'',
      }
    },
    components: {

    },
    mounted() {

      this.getData()
      // eventBus.$on('resetUnderlinelist', (msg) => {
      //   this.getData();
      // })
    },
    activated(){
      this.getData()
    },
    methods: {

      async getData() {
        this.listLoading = true
        let d = {
          page: this.pageNo,
          pageSize: this.pageSize,
          search_LIKE_code: this.search.code,
          search_LIKE_name: this.search.name,
          search_GTE_createTime:this.search.time?this.$format(this.search.time[0]):'',
          search_LTE_createTime:this.search.time?this.$format(this.search.time[1]):'',

        };
        let res = await this.$get('/couponSys/couponOfflineMake/page.json', d);
        this.listLoading = false
        this.listItems = res.content;
        this.totalNum = res.totalNum;

      },
      //点击搜索
      async searchItem() {
        this.pageNo = 1;
        this.getData()
      },
      //点击制券
      pushItem(id) {
        this.$confirm('确认制券吗?', '提示', {
          //type: 'warning'
        }).then(async() => {
          let d = {
            id: id
          };
          let res = await this.$get('/couponSys/couponOfflineMake/make.json', d);
          if (res.errcode == 0) {
            this.getData();
            this.$message.success('正在制券中');
          } else {
            this.$message.error(res.msg);
          }
        })

      },
      //点击修改操作
      async modifyItem(id,status) {
        this.$router.push({
          path: '/home/coupon/addunderline',
          query: {
            id: id,
            status:status
          }
        })
      },
      //点击删除
      removeItem(id) {
        this.$confirm('确认删除吗?', '提示', {
          //type: 'warning'
        }).then(async() => {
          let d = {
            id: id
          };
          let res = await this.$get('/couponSys/couponOfflineMake/delete.json', d);
          if (res.errcode == 0) {
            this.getData();
            this.$message.success('删除成功');
          } else {
            this.$message.error(res.msg);
          }
        })

      },
      async downloadItem(id) {
        let d = {
          id: id
        };
        let res = await this.$get('/couponSys/couponOfflineMake/judgeDoneOrNot.json', d);
        if (res.errcode == 0) {
          this.listLoading = true
          let d1 = {
            fkMakeId: id
          };
          let res1 = await this.$get('/couponSys/couponOffline/codeList.json', d1);
          this.listLoading = false
          if (res1.errcode == 0) {

            let option={};
            option.fileName = res1.codeList[0].name
            option.datas=[
              {
                sheetData:res1.codeList,
                sheetName:'sheet',
                sheetFilter:['name','code'],
                sheetHeader:['券名称','券编码'],
              }
            ];
            let toExcel=new ExportJsonExcel(option);
            toExcel.saveExcel();
          } else {
            this.$message.error(res1.msg);
          }
        }else{
          this.$message.error(res.msg);
        }
        
        
      },
      //pageSize 改变时会触发
      handleSizeChange(val) {
        this.pageNo = 1;
        this.pageSize = val;
        this.getData()
      },
      //currentPage 改变时会触发
      handleCurrentChange(val) {
        this.pageNo = val;
        this.getData()
      },

      //点击新增
      handleAdd() {
        this.$router.push('/home/coupon/addunderline')

      },

    }

  }

</script>
<style lang="scss" scoped>
  .el-table__row .fa {
    padding: 6px 8px;
  }

</style>
